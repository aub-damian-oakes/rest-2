var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");
const cors = require("cors")
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const MiniSearch = require("minisearch");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "*"
}))

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});
const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true
});

app.get('/', (req, res) => {
  const form = req.query.form;
  let returnForm = "";
  let xmlData = fs.readFileSync(path.join(__dirname, "/database/form-data.xml"));
  let formData = parser.parse(String(xmlData)).forms.form;
  for (let x of formData) {
    if (encodeURI(x.title.toLowerCase()) === encodeURI(form.toLowerCase())) {
      returnForm = fs.readFileSync(path.join(__dirname, `/forms/${x.file}.md`));
      break;
    }
  }
  if ((form !== "" && form !== "null") && (returnForm === "")) {
    returnForm = fs.readFileSync(path.join(__dirname, `/forms/FormNotFound.md`));
  } else if ((form === "null" || form === "") && returnForm === "") {
    returnForm = fs.readFileSync(path.join(__dirname, `/forms/LandingPage.md`));
  }

  res.send({
    form: String(returnForm)
  }).status(200);
});


function grabSummaryOfDocument(document) {
  const data = fs.readFileSync(path.join(__dirname, `/forms/${document}.md`));
  return String(data).substring(0, 300);
}


app.get("/search", (req, res) => {
  const search = decodeURI(req.query.term);
  const xmlData = fs.readFileSync(path.join(__dirname, "/database/form-data.xml"));
  let formData = parser.parse(String(xmlData)).forms.form;
  formData = formData.map((x, i) => {
    return {
      id: i,
      title: x.title,
      keywords: [...x.keywords.word],
      summary: grabSummaryOfDocument(x.file),
      locations: x.locations,
      popularity: x.meta.popularity
    }
  })


  let minisearch = new MiniSearch({
    fields: ["title", "summary", "keywords"],
    searchOptions: {
      boost: {
        keywords: 2
      },
      fuzzy: 0.3
    },
    storeFields: ["title", "popularity", "locations"]
  })

  minisearch.addAll(formData)
  let results = minisearch.search(search);

  let searchTitle = results.map(x => {
    return {
      title: x.title,
      confidence: Math.floor(x.score * 10 * (1 + (x.popularity * 0.1))),
      locations: x.locations
    };
  })


  res.status(200).send({
    results: [...searchTitle]
  });
})

app.get("/forms", (req, res) => {
  const xmlData = fs.readFileSync(path.join(__dirname, "/database/form-data.xml"));
  let formData = parser.parse(String(xmlData)).forms.form;
  let content = "";
  if (req.query.contentOf) {
    for (let form of formData) {
      if (decodeURI(form.title) === decodeURI(req.query.contentOf)) {
        content = fs.readFileSync(path.join(__dirname, `/forms/${form.file}.md`));
        break;
      }
      content = "";
    }
  } else {
    content = formData
  }
  res.status(200).send(content)
})

app.post("/forms", (req, res) => {
  const newForm = JSON.parse(req.body.form);
  var formData = parser.parse(fs.readFileSync(path.join(__dirname, "/database/form-data.xml")));
  var handle = fs.openSync(path.join(__dirname, `/forms/${newForm.file}.md`), "w");
  fs.writeFileSync(path.join(__dirname, `/forms/${newForm.file}.md`), newForm.content);
  fs.closeSync(handle);
  const savedForm = {
    title: newForm.title,
    file: newForm.file,
    keywords: { word: [...newForm.keywords.word] },
    locations: newForm.locations,
    meta: { ...newForm.meta }
  }

  var foundForm = false;
  for (let i in formData.forms.form) {
    console.log(formData.forms.form[i].title, savedForm.title)
    if (formData.forms.form[i].title === savedForm.title) {
      formData.forms.form[i] = savedForm;
      foundForm = true;
      break;
    }
  }

  if (!foundForm) {
    formData.forms = {
      form: [...formData.forms.form, { ...savedForm }]
    }
  }

  console.log(formData);
  const XMLData = builder.build(formData);
  handle = fs.openSync(path.join(__dirname, `/database/form-data.xml`), "w");
  fs.writeFileSync(path.join(__dirname, `/database/form-data.xml`), XMLData);
  fs.closeSync(handle);
  res.status(200).send()
})


/**
 * Datacenter endpoints
 * 
 * "Datacenter" is the API that handles management of the data contained within
 * REST 2.0, including but not limited to "location" (category) data, 
 * image data, and dictionary data.
 */

app.get("/datacenter/locations", (req, res) => {
  var locations = parser.parse(fs.readFileSync(path.join(__dirname, "/database/locations.xml")));
  res.status(200).send(locations.locations);
})

app.listen(8080);
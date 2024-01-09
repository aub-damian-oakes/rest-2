/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import markdownit from "markdown-it";
import { BeatLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import $ from "jquery"
const md = markdownit();

function CreationScreen({ form, setForm, serverForms, setStep }) {
  var titleEntry = useRef(null);
  const [titleExists, showTitleExists] = useState(null);

  const handleLoadForm = (form) => {
    $.ajax({
      method: "GET",
      url: `http://localhost:8080/forms?contentOf=${encodeURI(form.title)}`,
      success: (content) => {
        var loadedForm = {
          ...form,
          content: content
        }
        setForm(loadedForm);
        setStep(2);
      }
    })
  }

  const handleCheckFormExistence = (title) => {
    $.ajax({
      method: "GET",
      url: `http://localhost:8080/forms?contentOf=${encodeURI(title)}`,
      success: (content) => {
        if (content === "") {
          var newForm = {
            title: title,
            file: title.replace(
              /\w\S*/g,
              function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              }
            ).split(" ").join(""),
            keywords: {
              word: []
            },
            locations: {
              location: []
            },
            meta: {
              popularity: 0,
              author: "new",
              date: new Date()
            },
            content: ""
          }
          setForm(newForm);
          setStep(2);
        } else {
          showTitleExists(true);
        }
      }
    })
  }

  return (
    <div className="m-auto bg-finch-300 dark:bg-finch-950 flex justify-between border border-finch-500">
      <div className="flex flex-col grow w-max h-full p-12 border-finch-700">
        <div className="flex flex-col flex-shrink">
          <h1 className="text-xl">Create a New Form</h1>
          <p className="text-xs italic">Write a new form response, make a title, and publish it to REST.</p>
        </div>
        <div className="flex m-auto p-4 py-6">
          <input className="p-2 rounded-l-md text-finch-950" placeholder="Title will be validated." ref={titleEntry} type="text" />
          <button className="p-2 bg-finch-200 rounded-r-md dark:bg-finch-900 border border-finch-700 dark:border-finch-200
           hover:bg-finch-400 dark:hover:bg-finch-950 transition duration-200 ease-out"
            onClick={() => { handleCheckFormExistence(titleEntry.current.value) }}>Create Form</button>
        </div>
        {titleExists ? <h1 className="italic text-md text-red-800 dark:text-red-300">Title Already Exists!</h1> : null}
      </div>
      <div className="flex flex-col grow w-max h-full p-12 border-l border-finch-500">
        <div>
          <h1 className="text-xl">Edit a Current Form</h1>
          <p className="text-xs italic">Pick a form from the list below and edit the details (including meta tags, content, titles, etc.)</p>
        </div>
        <ul className="max-h-[20vh] min-h-[5vh] overflow-y-scroll">
          {serverForms ? serverForms.map((form, i) => {
            return <li key={i} className="bg-finch-200 dark:bg-finch-900 p-3 select-none cursor-pointer border border-finch-700 dark:border-finch-200
            hover:bg-finch-400 dark:hover:bg-finch-950 transition duration-200 ease-out" onClick={() => handleLoadForm(form)}>{form.title}</li>
          }) : <BeatLoader className="m-auto" size={8} color="white" />}
        </ul>
      </div>
    </div>
  )
}

function Editor({ form, setForm, setStep }) {
  var textarea = useRef(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    textarea.current.value = form.content || `# ${form.title}` || textarea.current.value || "";
    setPreview(textarea.current.value);
  }, [])


  useEffect(() => {
    const handlePreview = () => {
      const newText = textarea.current.value;
      setPreview((state) => {
        state = newText;
        return state;
      });
    }

    textarea.current.addEventListener("keyup", handlePreview, true);
  }, [setPreview])



  return (
    <div className="max-h-[100vh] w-full flex grow">
      <div className="h-[100vh] w-full flex grow overflow-y-scroll">
        <textarea ref={textarea} className="h-full w-full text-finch-900 resize-none" type="text" />
      </div>
      <div className="h-[80vh] w-full flex grow flex-col overflow-y-scroll">
        <div id="submission" className="flex justify-between dark:bg-finch-700 bg-finch-400 border-b border-finch-950">
          <h1 className="italic text-sm p-4 dark:bg-finch-800 bg-finch-500flex grow">preview</h1>
          <button className={`p-4 transition duration-200 ease-out 
          ${preview.length < 8 ? "hover:bg-red-600 cursor-not-allowed" : "hover:dark:bg-finch-900 hover:bg-finch-600"}`}
            disabled={preview.length < 8} onClick={() => {
              var newForm = {
                ...form,
                content: textarea.current.value
              };
              setForm(newForm);
              setStep(3)
            }}>Next</button>
        </div>
        {preview ? <div className="w-full h-[100vh]"
          dangerouslySetInnerHTML={{ __html: md.render(`${preview}`) }} id="markdownContent"></div> : null}
      </div>
    </div>
  )
}



// List of 250 useless words provided by ChatGPT 3.5
const uselessWords = [
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t',
  'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t',
  'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than',
  'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
  'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom',
  'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve',
  'your', 'yours', 'yourself', 'yourselves', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'first', 'second', 'third', 'last', 'somebody', 'something', 'somewhere',
  'anybody', 'anything', 'anywhere', 'everybody', 'everything', 'everywhere', 'nobody', 'nothing', 'nowhere',
  'somewhat', 'anyhow', 'anyway', 'anywise', 'everyway', 'nohow', 'noway', 'nowise', 'someway', 'somewise',
  'sooth', 'thine', 'thou', 'thy', 'thus', 'hither', 'thither', 'whither', 'yon', 'yonder', "use", "can", "us",
  "rest", "made", "now"
];



function KeywordCard({ keyword, className, onClick }) {
  return (
    <AnimatePresence>
      <motion.div className={className} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <p className="text-sm">{keyword}</p>
        <button onClick={onClick} className="p-1 -m-1 bg-finch-400 dark:bg-finch-700 hover:bg-red-500 dark:hover:bg-red-700 transition duration-200 ease-out">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

function Dropdown({ location, options }) {

}


function LocationCard({ location, allLocations, reportLocation, totalIndex }) {
  const [currentBranch, setCurrentBranch] = useState(null);


  function createBranchTreeArray(tree, name) {
    let result = null;

    function findBranchRecursive(branch, targetName, path = []) {
      if (branch["@_name"] === targetName) {
        path.push(branch);
        result = path;
        return true;
      }

      if (Array.isArray(branch.branch)) {
        path.push(branch);
        for (const subBranch of branch.branch) {
          const found = findBranchRecursive(subBranch, targetName, path.slice());
          if (found) return true;
        }
      } else if (branch.branch && branch.branch["@_name"] === targetName) {
        path.push(branch);
        result = [...path, branch.branch];
        return true;
      }

      return false;
    }

    for (const branch of tree) {
      const found = findBranchRecursive(branch, name);
      if (found) break;
    }

    return result;
  }

  function findBranchByName(tree, name, result = []) {
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        const branch = tree[i];
        if (branch["@_name"] === name) {
          result.push(branch);
        }
        if (branch["branch"]) {
          const subBranches = branch["branch"];
          var children = [];
          for (let b in subBranches) {
            children.push(subBranches[b]);
          }
          console.log(subBranches)
          result.push({ "@_name": branch["@_name"], "branch": children });
        }
      }
    } else if (tree["@_name"] === name) {
      result.push(tree);
    }
    return result;
  }




  function getTopLevelFormName(branchObj) {
    if (Array.isArray(branchObj)) {
      if (branchObj.length === 0) {
        return null;
      }
      return getTopLevelFormName(branchObj[branchObj.length - 1]);
    } else if (branchObj.branch) {
      return getTopLevelFormName(branchObj.branch);
    } else if (branchObj["@_name"]) {
      return branchObj["@_name"];
    }
    return null;
  }


  const handleSubBranches = (branch, cur, index) => {
    // if (branch.branch) {
    //   if (Array.isArray(branch.branch)) {
    //     return branch.branch.map((sb) => {
    //       return handleSubBranches(sb);
    //     })
    //   } else {
    //     var result = handleSubBranches(branch.branch["@_name"]);
    //     if(result) return result;
    //     return <li>{branch["@_name"]}</li>
    //   }
    // } else {
    //   return <li>{branch["@_name"]}</li>
    // }
    if (branch.branch) {
      if (Array.isArray(branch.branch)) {
        return branch.branch.map((sb, i) => {
          return <li onClick={() => handleBranchChange(cur, index, sb)}
            className="bg-finch-300 hover:bg-finch-400 dark:bg-finch-700 dark:hover:bg-finch-900 p-2">{sb["@_name"]}</li>
        })
      } else {
        return <li onClick={() => handleBranchChange(cur, index, branch.branch)}
          className="bg-finch-300 hover:bg-finch-400 dark:bg-finch-700 dark:hover:bg-finch-900 p-2">{branch.branch["@_name"]}</li>
      }
    }
  }

  const handleBranchChange = (loc, index, newBranch) => {
    console.log(loc, index, newBranch)
    // const topLevelFormName = getTopLevelFormName(nloc);
    // const br = createBranchTreeArray(allLocations, topLevelFormName);
    // setCurrentBranch(br);
    var curBranch = currentBranch;
    curBranch = curBranch.slice(0, index);
    curBranch.push(newBranch);
    if(newBranch.branch) curBranch.push(newBranch.branch);
    reportLocation(curBranch, totalIndex);
    setCurrentBranch(curBranch);
  }
  
  useEffect(() => {
    console.log(currentBranch)
  }, [currentBranch])

  useEffect(() => {
    const topLevelFormName = getTopLevelFormName(location);
    console.log(location);
    const br = createBranchTreeArray(allLocations, topLevelFormName);
    console.log(br)
    setCurrentBranch(br);
  }, [])

  return (
    <div className="grid grid-cols-5 p-4 my-[2vh] bg-finch-400 dark:bg-finch-800 border dark:border-finch-500 gap-2 py-8">
      {/* Recursively display branch dropdowns and reassess on location change. */}
      {currentBranch ? currentBranch.map((branch, i) => {
        return (
          <div className="col-span-1 p-2 flex justify-between grow relative group 
          bg-finch-200 hover:bg-finch-300 dark:bg-finch-900 dark:hover:bg-finch-700">
            <h1 className="my-auto">{branch["@_name"]}</h1>
            {(branch.branch || Object.values(currentBranch[i - 1].branch).length > 1) ? (
              <>
                {/* If the current branch contains branches, list them */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down my-auto" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                </svg>
                <ul className="absolute top-full left-0 select-none w-full hidden group-hover:block border-b z-50 shadow-lg">
                  {i === 0 ? allLocations.map((loc, i) => {
                    return <li className="bg-finch-400 hover:bg-finch-400 dark:bg-finch-700 dark:hover:bg-finch-900 p-2" onClick={() => {
                      handleBranchChange(loc, 0, loc)
                      }}>{loc["@_name"]}</li>
                  }) : handleSubBranches(currentBranch[i - 1], currentBranch[i], i, branch)}
                </ul>
              </>
            ) : (
              <>
                {/* If the current branch contains no branches, block the selection */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi my-auto" viewBox="0 0 16 16">
                  <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
                </svg>
                <p className="p-2 absolute top-0 left-0 w-full hover:bg-red-400 dark:hover:bg-red-950 hidden group-hover:block cursor-not-allowed">No other sublocations.</p>
              </>)}
          </div>
        )
      }) : null}
    </div>
  )
}


// Handles the keywords, author, and locations.
function ExtraFunctions({ form, setForm, locations }) {
  const [generatedKeywords, setGeneratedKeywords] = useState(null);
  const [currentLocations, setCurrentLocations] = useState(null);
  var textarea = useRef(null);

  const handleSubmission = () => {
    $.ajax({
      method: "POST",
      url: "http://localhost:8080/forms",
      data: {
        form: JSON.stringify({
          ...form
        })
      },
      success: () => {
        window.location.reload();
      }
    })
  }

  const handleAutoGenKeywords = () => {
    const substringAtLastSpace = (() => {
      var sub = form.content.substr(0, 300);
      for (let i = sub.length; i > 0; i--) {
        if (sub[i] === " ") {
          sub = sub.substr(0, i);
          break;
        }
      }
      return sub;
    })()


    var keywordsFound = [];
    const filteredContentArray = (substringAtLastSpace + " " + form.title)
      .replace(/[^a-zA-Z0-9' ]/g, '')
      .split(" ")
      .filter((x) => {
        if (!keywordsFound.includes(x.toLowerCase())) {
          keywordsFound.push(x.toLowerCase());
          return (x !== "") && !(uselessWords.includes(x.toLowerCase()))
        }
        return false;
      });

    return filteredContentArray;
  }

  const handleKeywordAddition = (keyword) => {
    if (generatedKeywords.includes(keyword.toLowerCase())) {
      return false;
    } else if (keyword === "") {
      return false;
    }
    const currentKeywords = [...generatedKeywords, keyword.toLowerCase()];
    form.keywords.word = [...currentKeywords];
    textarea.current.value = "";
    setGeneratedKeywords([...currentKeywords]);
  }

  const handleRemoveKeyword = (keyword) => {
    const keywordIndex = generatedKeywords.indexOf(keyword);
    const newKeywords = generatedKeywords.filter((x, i) => i !== keywordIndex);
    form.keywords.word = [...newKeywords];
    setGeneratedKeywords([...newKeywords]);
  }

  const initializeLocations = () => {
    if (typeof form.locations.location === "object" && form.locations.location !== null && !Array.isArray(form.locations.location)) {
      setCurrentLocations([{ ...form.locations.location }])
    } else {
      setCurrentLocations([...form.locations.location])
    }
    console.log(form.locations.location)
  }

  const handleAddLocation = () => {
    var list = [...currentLocations];
    list.push(locations.location[0]);
    setCurrentLocations(list);
  }

  const reportLocation = (newLocation, index) => {
    console.log(currentLocations[index], newLocation);
    var currentLocationsTemp = [...currentLocations];
    var newLocationPath = null;
    for (let i = newLocation.length - 1 ; i >= 0 ; i--) {
      if(newLocationPath === null) {
        newLocationPath = {"@_name": newLocation[i]["@_name"]}
        continue;
      }
      newLocationPath = {"@_name": newLocation[i]["@_name"], branch: newLocationPath}
    }
    currentLocationsTemp[index] = newLocationPath;
    form.locations.location = currentLocationsTemp;
    console.log(form)
    setCurrentLocations(currentLocationsTemp);
  }

  useEffect(() => {
    if (form.keywords.word.length === 0) {
      const autoGeneratedKeywords = handleAutoGenKeywords();
      form.keywords.word = [...autoGeneratedKeywords];
    }
    setGeneratedKeywords([...form.keywords.word]);
    initializeLocations();
  }, [])


  return (
    <div id="ExtraFunctions" className="m-auto flex-col bg-finch-300 
    dark:bg-finch-950 p-6 border border-finch-500 w-[80vw] h-[75vh] overflow-y-scroll">
      <div className="flex-col flex-shrink border-b m-2">
        <h1 className="text-3xl font-semibold">Extraneous Data</h1>
        <p className="italic text-sm">Here&apos;s where we include our extra information.</p>
      </div>

      {/* Keywords section */}
      <div id="keywords" className="m-auto flex grow flex-col p-2 mt-6">
        {/* Title subsection */}
        <div className="flex grow justify-between">
          <h1 className="text-2xl font-medium">Keywords</h1>
          <p className="text-xs italic my-auto">The following keywords have been auto-generated.
            You can remove any that don't make sense or add any that were missed by the algorithm.</p>
        </div>
        {/* Keyword addition subsection */}
        <div className="flex grow m-1">
          <input className="p-2 w-[25vw] text-finch-950 rounded-l-md"
            placeholder="Enter a keyword here, then click +." type="text" ref={textarea} />
          <button className="p-2 bg-finch-200 dark:bg-finch-900 border-finch-500 hover:bg-finch-500 
            border w-12 h-12 transition duration-200 ease-out rounded-r-md"
            onClick={() => handleKeywordAddition(textarea.current.value)}>+</button>
          <p className="m-auto text-xs italic">All keywords will be automatically converted to lowercase.</p>
        </div>
        {/* Current keywords subsection */}
        <div className="grid grid-cols-5 grid-flow-row">
          {generatedKeywords ? generatedKeywords.map((keyword, i) => {
            return <KeywordCard className="col-span-1 p-1.5 m-1 text-ellipsis 
              bg-finch-200 dark:bg-finch-900 hover:bg-finch-400 dark:hover:bg-finch-500 
              transition duration-200 ease-out flex justify-between" key={i} keyword={keyword}
              onClick={() => handleRemoveKeyword(keyword)} />
          }) : null}
        </div>
      </div>
      <div className="border border-finch-500/30 my-8" />
      {/* Locations section */}
      <div className="m-auto flex grow flex-col p-2">
        {/* Title subsection */}
        <div className="flex grow justify-between relative">
          <div className="flex flex-shrink relative">
            <h1 className="my-auto text-2xl font-medium">Locations</h1>
            <button onClick={handleAddLocation} className="my-auto mx-2 p-2 bg-finch-200 dark:bg-finch-900 border-finch-500 hover:bg-finch-500 
          transition duration-200 ease-out">Add location +</button>
          </div>
          <p className="text-xs italic my-auto">Select from a predefined list of locations to help group your form
            in with others.</p>
        </div>
        {/* Location selection subsection  */}
        <div className="flex flex-col grow">
          {currentLocations ? currentLocations.map((location, i) => {
            return <LocationCard key={i} location={location} allLocations={locations.location} reportLocation={reportLocation} totalIndex={i} />
          }) : null}
        </div>
        <button className="bg-green-600 m-auto p-4 w-full flex grow hover:bg-green-800 transition duration-200 ease-out
        " onClick={handleSubmission}><h1 className="m-auto text-xl font-semibold text-white" >Submit</h1></button>
      </div>
    </div>
  )
}



export default function Formbuilder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(null);
  const [serverForms, setServerForms] = useState(null);
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/forms",
      success: (data) => {
        setServerForms(data);
      }
    })

    $.ajax({
      method: "GET",
      url: "http://localhost:8080/datacenter/locations",
      success: (data) => {
        setLocations(data);
      }
    })
  }, [])



  return (
    <main className="flex flex-col items-center overflow-y-hidden z-10 min-h-[80vh]">
      {(step === 1) ? (<CreationScreen form={form} setForm={setForm} serverForms={serverForms} setStep={setStep} />) : null}
      {(step === 2) ? (<Editor form={form} setForm={setForm} setStep={setStep} />) : null}
      {(step === 3) ? (<ExtraFunctions form={form} setForm={setForm} locations={locations} />) : null}
    </main>
  )
}

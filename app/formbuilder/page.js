"use client";

import { useEffect, useRef, useState } from "react";
import markdownit from "markdown-it";
import { BeatLoader } from "react-spinners";
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
        {titleExists ? <h1 className="italic text-md text-red-300">Title Already Exists!</h1> : null}
      </div>
      <div className="flex flex-col grow w-max h-full p-12 border-l border-finch-500">
        <div>
          <h1 className="text-xl">Edit a Current Form</h1>
          <p className="text-xs italic">Pick a form from the list below and edit the details (including meta tags, content, titles, etc.)</p>
        </div>
        <ul className="max-h-[20vh] min-h-[5vh] overflow-y-scroll">
          {serverForms ? serverForms.map(form => {
            return <li className="bg-finch-200 dark:bg-finch-900 p-3 select-none cursor-pointer border border-finch-700 dark:border-finch-200
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

function ExtraFunctions({ form, setForm }) {

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

  

  return (
    <div>Hello</div>
  )
}



export default function Formbuilder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(null);
  const [serverForms, setServerForms] = useState(null);

  useEffect(() => {
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/forms",
      success: (data) => {
        console.log(data)
        setServerForms(data);
      }
    })
  }, [])



  return (
    <main className="flex flex-col items-center overflow-y-hidden z-10 min-h-[80vh]">
      {(step === 1) ? (<CreationScreen form={form} setForm={setForm} serverForms={serverForms} setStep={setStep} />) : null}
      {(step === 2) ? (<Editor form={form} setForm={setForm} setStep={setStep} />) : null}
      {(step === 3) ? (<ExtraFunctions form={form} setForm={setForm} />) : null}
    </main>
  )
}

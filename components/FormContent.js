"use client"

import markdownit from "markdown-it"
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import $ from "jquery";
import hljs from 'highlight.js' // https://highlightjs.org

// Actual default values
const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});

export default function FormContent() {
    const [content, setContent] = useState(null);
    const searchParams = useSearchParams();
    const query = searchParams.get("form")

    useEffect(() => {
        $.ajax({
            method: "GET",
            url: `http://localhost:8080?form=${encodeURI(query) || ""}`,
            success: (form) => {
                console.log(form.form)
                setContent(form.form);
            }
        })
    }, [query])

    return (
        content ? <div className="mx-auto my-6 max-w-[70vw] 2xl:max-w-[67vw] 2xl:max-h-[86vh] overflow-y-scroll max-h-[80vh]" 
        dangerouslySetInnerHTML={ {__html: md.render(content)} }  id="markdownContent"></div> : null

    )
}
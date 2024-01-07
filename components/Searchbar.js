"use client";

import { useRef, useState } from "react";
import $ from "jquery"
import SearchResults from "./SearchResults";

export default function Searchbar({ className }) {
    var searchData = useRef();
    const [searchResults, setSearchResults] = useState(null);
    const [showResults, setShowResults] = useState(true);

    const handleSearch = () => {
        var searchString = searchData.current.value;
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/search?term=${encodeURI(searchString)}`,
            // "data" is an array of titles. Pass this array to a SearchResults
            // component to get a list of links that point to /?form=data[i].title
            success: (data) => {
                if (data.results.length > 0) {
                    console.log(data.results)
                    setSearchResults(data.results)
                } else {
                    setSearchResults([])
                }
            }
        })
    }

    const handleEnterKey = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    return (
        <div className={`${className}`} id="search" onFocus={() => setShowResults(true)} onBlur={() => setShowResults(false)}>
            <div className="relative flex grow">
                <input className="rounded-l-md w-full p-2 text-finch-950"
                    placeholder="Enter your search terms here, then click Search."
                    ref={searchData} onKeyDown={handleEnterKey}></input>
                { searchData.current && searchData.current.value.length > 0 ?
                (<button className="bg-white" onClick={() => searchData.current.value = ""}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-x-circle m-auto mr-2 fill-finch-800" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </button>) : null  }
                <button className="rounded-r-md p-2 
                bg-finch-700 dark:bg-finch-300 hover:bg-finch-950 dark:hover:bg-finch-500 
                text-finch-300 dark:text-finch-800 transition-colors duration-200 ease-out 
                border-l border-finch-950 dark:border-finch-600 relative" onClick={handleSearch}>Search</button>
            </div>
            {searchResults ? <SearchResults className="absolute top-full"
                results={searchResults} showResults={showResults} setShowResults={setShowResults} /> : null}
        </div>
    )
}
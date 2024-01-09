"use client";

import Link from "next/link";
import $ from "jquery"
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"

export default function SearchResults({ results, className, showResults, setShowResults }) {
    var resultsPanel = useRef(null);

    useEffect(() => {
        $("#results").fadeIn("fast")
    }, [showResults])

    const handleResults = () => {
        let cards;
        if (results.length === 0) {
            return (
                <div className="flex grow justify-between p-4 text-md searchResults" disabled>No results found.</div>
            )
        } else {
            cards = results.map((result, i) => {
                return (
                    <Link key={i} href={`/?form=${encodeURI(result.title)}`}
                        className="cursor-pointer flex grow justify-between p-4 searchResults"
                        onClick={() => setShowResults(false)}>
                        <h1 className="text-md">{result.title}</h1>
                        <p className="text-xs italic">Confidence: {result.confidence}</p>
                    </Link>
                )
            })
        }
        return cards;
    }

    return (
        <AnimatePresence>
            {showResults && <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, duration: 200 }}
            exit={{ opacity: 0 }}
            id="results"
            className={`${className} max-h-[20vh] w-full transition-opacity duration-200 ease-out`}>
                {handleResults()}
            </motion.div>}
        </AnimatePresence>
    )
}
"use client";

import { useState } from "react";

export default function CodeReviewer() {
  const [code, setCode] = useState(`function bubbleSort(arr) {
    // Your implementation here
  }`);

  const [review, setReview] = useState("Your review will appear here.");
  const [output, setOutput] = useState("");

  // Function to Review Code (Now using AI)
  const reviewCode = async () => {
    try {
      const response = await fetch("http://localhost:3000/ai/get-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const aiReview = await response.text();
      setReview(aiReview); // Display AI-generated review
    } catch (error) {
      setReview(`❌ Error fetching review: ${error.message}`);
    }
  };

  // Function to Execute Code
  const runCode = () => {
    try {
      const userFunction = new Function("arr", `"use strict"; ${code} return bubbleSort(arr);`);
      const result = userFunction([5, 3, 8, 1, 2]); // Example input array
      setOutput(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Code Reviewer</h1>

      {/* Code Input */}
      <textarea
        className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        rows={4}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={reviewCode}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-semibold"
        >
          Review Code
        </button>
        <button
          onClick={runCode}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold"
        >
          Run Code
        </button>
      </div>

      {/* Review Output */}
      <div className="mt-3 p-2 bg-gray-800 rounded-lg border border-gray-700">
        <strong>Review:</strong>
        <pre className="whitespace-pre-wrap">{review}</pre>
      </div>

      {/* Code Execution Output */}
      <div className="mt-3 p-2 bg-gray-800 rounded-lg border border-gray-700">
        <strong>Output:</strong> {output}
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";


const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false
});


const App: React.FC = () => {
  const [code, setCode] = useState<string>("console.log('Hello, World!');");
  const [output, setOutput] = useState<string>("");
  const [mentorFeedback, setMentorFeedback] = useState<string>("");
  const [mentorLoading, setMentorLoading] = useState<boolean>(false);


  const handleRunCode = () => {
    try {
      const originalConsoleLog = console.log;
      const logs: string[] = [];


      console.log = (...args) => {
        logs.push(args.join(" "));
        originalConsoleLog(...args);
      };


      // Running the user code (sandboxed eval)
      // eslint-disable-next-line no-eval
      eval(code);


      const outputText = logs.join("\n");
      setOutput(outputText);
      fetchMentorFeedback(code, outputText);
    } catch (err: any) {
      const errorText = err.toString();
      setOutput(errorText);
      fetchMentorFeedback(code, errorText);
    } finally {
      console.log = originalConsoleLog;
    }
  };


  const fetchMentorFeedback = async (codeText: string, outputText: string) => {
    setMentorLoading(true);
    setMentorFeedback("");


    try {
      const response = await fetch("/api/mentor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeText, output: outputText })
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mentor API Error: ${response.status}: ${errorText}`);
      }


      const data = await response.json();
      setMentorFeedback(data.feedback);
    } catch (error: any) {
      setMentorFeedback(
        "Mentor had trouble analyzing your code. Please try again."
      );
    } finally {
      setMentorLoading(false);
    }
  };


  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto"
      }}
    >
      <h1
        style={{
          marginBottom: "1rem",
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center"
        }}
        className="text-teal-400"
      >
        Student Code Runner & Mentor
      </h1>


      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "1rem"
        }}
      >
        <MonacoEditor
          height="300px"
          defaultLanguage="javascript"
          value={code}
          onChange={(newValue) => setCode(newValue || "")}
          theme="vs-dark"
        />
      </div>


      <button
        onClick={handleRunCode}
        style={{
          display: "block",
          margin: "1rem auto",
          padding: "0.75rem 1.5rem",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
        className="bg-teal-400"
      >
        Run Code
      </button>


      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem"
          }}
          className="text-teal-400"
        >
          Output
        </h2>
        <pre
          style={{
            padding: "1rem",
            borderRadius: "4px",
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            whiteSpace: "pre-wrap",
            fontSize: "1rem",
            minHeight: "100px"
          }}
        >
          {output || "Output will appear here..."}
        </pre>
      </div>


      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff8dc"
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "#333"
          }}
        >
          Mentor Feedback
        </h2>


        {mentorLoading && (
          <p style={{ fontSize: "1rem", color: "#666" }}>
            Mentor is analyzing your code...
          </p>
        )}


        {!mentorLoading && mentorFeedback && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "4px",
              backgroundColor: "#fef9c3",
              color: "#333",
              fontSize: "1rem",
              lineHeight: "1.5"
            }}
          >
            {mentorFeedback}
          </div>
        )}


        {!mentorLoading && !mentorFeedback && (
          <p style={{ fontSize: "1rem", color: "#666" }}>
            Feedback will appear here after running the code.
          </p>
        )}
      </div>
    </div>
  );
};


export default App;
function originalConsoleLog(...data: any[]): void {
  throw new Error("Function not implemented.");
}




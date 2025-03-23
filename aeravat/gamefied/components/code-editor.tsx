"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Zap, Play, Copy, Save, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeEditor } from "@/components/code-editor"
import { AIFeedback } from "@/components/ai-feedback"

export default function SkillEvolution() {
  const [code, setCode] = useState(`function bubbleSort(arr) {\n  // Your implementation here\n  \n}`)
  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ]

  const runCode = () => {
    setIsRunning(true)
    // Simulate code execution
    setTimeout(() => {
      setOutput("Running your code...\n\nFunction bubbleSort is incomplete. Try implementing the sorting algorithm.")
      setIsRunning(false)
      setShowFeedback(true)
    }, 1500)
  }

  const skills = [
    { name: "JavaScript", level: 7, progress: 75, color: "from-yellow-500 to-amber-600" },
    { name: "Python", level: 5, progress: 52, color: "from-blue-500 to-indigo-600" },
    { name: "Data Structures", level: 6, progress: 62, color: "from-emerald-500 to-teal-600" },
    { name: "Algorithms", level: 4, progress: 38, color: "from-purple-500 to-violet-600" },
    { name: "Web Development", level: 8, progress: 83, color: "from-red-500 to-rose-600" },
  ]

  const challenges = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      tags: ["Arrays", "Hash Table"],
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/valid-parentheses/",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      tags: ["Stack", "String"],
    },
    {
      id: 3,
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      description: "Merge two sorted linked lists and return it as a sorted list.",
      tags: ["Linked List", "Recursion"],
    },
    {
      id: 4,
      title: "Maximum Subarray",
      difficulty: "Medium",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/maximum-subarray/",
      description: "Find the contiguous subarray which has the largest sum and return its sum.",
      tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container px-4 py-8 md:px-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-teal-400">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Skill Evolution</h1>
            <p className="text-slate-400">Level up your skills with AI-guided learning paths and feedback</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Tabs defaultValue="code-editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code-editor">Code Editor</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>

              <TabsContent value="code-editor" className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex-1">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run Code
                  </Button>
                  <Button variant="outline" size="icon">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="rounded-md border border-slate-700 bg-slate-900">
                  <CodeEditor code={code} setCode={setCode} language={language} />
                </div>

                <div className="rounded-md border border-slate-700 bg-slate-900 p-4">
                  <h3 className="mb-2 text-sm font-medium text-slate-400">Output</h3>
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {isRunning ? "Running code..." : output || "Code output will appear here..."}
                  </pre>
                </div>

                {showFeedback && (
                  <AIFeedback
                    feedback="Your bubble sort implementation is missing. Here's a hint: you need to compare adjacent elements and swap them if they're in the wrong order. Try implementing the algorithm and run it again."
                    suggestions={[
                      "Use two nested loops to compare adjacent elements",
                      "Remember to swap elements when they're out of order",
                      "Track whether any swaps were made in each pass",
                    ]}
                    onClose={() => setShowFeedback(false)}
                  />
                )}
              </TabsContent>

              <TabsContent value="challenges" className="space-y-4">
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <h2 className="mb-4 text-lg font-semibold">Recommended LeetCode Challenges</h2>
                  <p className="mb-4 text-sm text-slate-400">
                    Based on your skill level, here are some challenges to help you improve your algorithm skills. Click
                    on any challenge to open it on LeetCode.
                  </p>

                  <div className="space-y-3">
                    {challenges.map((challenge) => (
                      <a
                        key={challenge.id}
                        href={challenge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md border border-slate-700 bg-slate-800 p-4 transition-all hover:border-teal-500/50 hover:bg-slate-800/80"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{challenge.title}</h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              challenge.difficulty === "Easy"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : challenge.difficulty === "Medium"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">{challenge.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {challenge.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-700 px-2 py-1 text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </a>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => window.open("https://leetcode.com/problemset/all/", "_blank")}
                  >
                    View More on LeetCode
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Your Skills</h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{skill.name}</span>
                        <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs">Level {skill.level}</span>
                      </div>
                      <span className="text-sm font-medium">{skill.progress}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-700">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color}`}
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">AI Recommendations</h2>
              <div className="space-y-3">
                <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                  <h3 className="font-medium">Improve Algorithm Skills</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Focus on sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort.
                  </p>
                </div>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                  <h3 className="font-medium">Practice Python</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Your Python skills need improvement. Try solving 3 easy LeetCode problems in Python.
                  </p>
                </div>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                  <h3 className="font-medium">Learn Hash Tables</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Hash tables are important for interviews. Complete the hash table module.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
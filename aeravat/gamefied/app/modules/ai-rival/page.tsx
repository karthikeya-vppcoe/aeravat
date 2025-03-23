"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, User, Swords, Trophy, Clock, Target, Zap, Shield, Flame, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useXP } from "@/lib/xp-context"
import { getRivalData } from "@/lib/xp-service"
import { Skeleton } from "@/components/ui/skeleton"

export default function AIRival() {
  const { xp, level, addXP } = useXP()
  const [rival, setRival] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dailyChallenge, setDailyChallenge] = useState<any>(null)
  const [challengeStatus, setChallengeStatus] = useState<
    "pending" | "in_progress" | "completed" | "victory" | "defeat"
  >("pending")
  const [challengeProgress, setChallengeProgress] = useState(0)
  const [battleHistory, setBattleHistory] = useState<any[]>([])

  // New state for chat functionality
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<{ id: number; sender: "user" | "rival"; text: string; timestamp: Date }[]>(
    [],
  )
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isRivalTyping, setIsRivalTyping] = useState(false)

  useEffect(() => {
    const loadRivalData = async () => {
      try {
        const data = await getRivalData()
        setRival(data)

        // Generate a daily challenge
        const challenge = generateDailyChallenge(data.level)
        setDailyChallenge(challenge)

        // Generate battle history
        const history = generateBattleHistory()
        setBattleHistory(history)

        // Add initial rival message
        setMessages([
          {
            id: 1,
            sender: "rival",
            text: `Hello, ${data.name} here. Ready to test your skills against me today?`,
            timestamp: new Date(),
          },
        ])

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load rival data:", error)
        setIsLoading(false)
      }
    }

    loadRivalData()
  }, [])

  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateDailyChallenge = (rivalLevel: number) => {
    const challengeTypes = [
      "Algorithm Challenge",
      "Data Structure Problem",
      "Coding Speed Test",
      "Debugging Challenge",
      "System Design Problem",
    ]

    const difficultyLevels = ["Easy", "Medium", "Hard"]
    const difficultyIndex = Math.min(2, Math.floor(rivalLevel / 4))

    return {
      id: "challenge-" + Date.now(),
      title: challengeTypes[Math.floor(Math.random() * challengeTypes.length)],
      difficulty: difficultyLevels[difficultyIndex],
      xpReward: 50 + rivalLevel * 10,
      timeLimit: 20 + difficultyIndex * 10, // minutes
      description:
        "Compete against your rival in this daily challenge. Complete it faster and with better code quality to win!",
      rivalTime: 15 + Math.floor(Math.random() * 10), // minutes
    }
  }

  const generateBattleHistory = () => {
    const results = ["victory", "defeat", "victory", "victory", "defeat"]
    const dates = [
      new Date(Date.now() - 86400000), // 1 day ago
      new Date(Date.now() - 86400000 * 2), // 2 days ago
      new Date(Date.now() - 86400000 * 3), // 3 days ago
      new Date(Date.now() - 86400000 * 5), // 5 days ago
      new Date(Date.now() - 86400000 * 7), // 7 days ago
    ]

    return Array(5)
      .fill(0)
      .map((_, i) => ({
        id: i,
        title: `${["Algorithm", "Data Structure", "Coding", "Debugging", "System Design"][i]} Challenge`,
        date: dates[i],
        result: results[i],
        xpGained: results[i] === "victory" ? 50 + Math.floor(Math.random() * 50) : 20 + Math.floor(Math.random() * 20),
        rivalPerformance: Math.floor(Math.random() * 40) + 60, // 60-100%
      }))
  }

  const startChallenge = () => {
    setChallengeStatus("in_progress")
    setChallengeProgress(0)

    // Add a rival message about starting the challenge
    addRivalMessage(
      `Let's see how you handle this ${dailyChallenge.difficulty.toLowerCase()} challenge. I completed it in ${dailyChallenge.rivalTime} minutes. Think you can beat that?`,
    )

    // Simulate challenge progress
    const interval = setInterval(() => {
      setChallengeProgress((prev) => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 300) // Fast progress for demo purposes
  }

  // Add a useEffect to handle challenge completion when progress reaches 100%
  useEffect(() => {
    if (challengeProgress === 100 && challengeStatus === "in_progress") {
      const handleCompletion = async () => {
        // Determine if user won or lost
        const userWon = Math.random() > 0.3 // 70% chance of winning for demo

        if (userWon) {
          setChallengeStatus("victory")
          // Award XP for victory
          if (dailyChallenge) {
            await addXP(dailyChallenge.xpReward, `Defeated rival in ${dailyChallenge.title}`)

            // Update battle history
            const newBattle = {
              id: battleHistory.length,
              title: dailyChallenge.title,
              date: new Date(),
              result: "victory",
              xpGained: dailyChallenge.xpReward,
              rivalPerformance: Math.floor(Math.random() * 20) + 70, // 70-90%
            }

            setBattleHistory([newBattle, ...battleHistory.slice(0, 4)])

            // Add rival message about defeat
            addRivalMessage(
              "Impressive! You beat me this time. Your solution was more efficient than mine. I'll be analyzing your approach to improve my skills.",
            )
          }
        } else {
          setChallengeStatus("defeat")
          // Award some XP even for defeat
          if (dailyChallenge) {
            const consolationXP = Math.floor(dailyChallenge.xpReward * 0.4)
            await addXP(consolationXP, `Participated in ${dailyChallenge.title}`)

            // Update battle history
            const newBattle = {
              id: battleHistory.length,
              title: dailyChallenge.title,
              date: new Date(),
              result: "defeat",
              xpGained: consolationXP,
              rivalPerformance: Math.floor(Math.random() * 10) + 90, // 90-100%
            }

            setBattleHistory([newBattle, ...battleHistory.slice(0, 4)])

            // Add rival message about victory
            addRivalMessage(
              "Not bad, but I was faster this time. Keep practicing! My solution used a more optimized algorithm that reduced the time complexity.",
            )
          }
        }
      }

      handleCompletion()
    }
  }, [challengeProgress, challengeStatus, dailyChallenge, addXP, battleHistory])

  const resetChallenge = () => {
    setChallengeStatus("pending")
    setChallengeProgress(0)

    // Generate a new challenge
    if (rival) {
      const challenge = generateDailyChallenge(rival.level)
      setDailyChallenge(challenge)

      // Add rival message about new challenge
      addRivalMessage("Ready for another round? I've got a new challenge for you. This one might be trickier!")
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
  }

  // New functions for chat functionality
  const addRivalMessage = (text: string) => {
    setIsRivalTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "rival",
          text,
          timestamp: new Date(),
        },
      ])
      setIsRivalTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: inputMessage,
        timestamp: new Date(),
      },
    ])

    setInputMessage("")

    // Generate rival response
    const userMessage = inputMessage.toLowerCase()

    setTimeout(() => {
      if (userMessage.includes("hint") || userMessage.includes("help")) {
        addRivalMessage(
          "Here's a hint: try thinking about the problem in terms of time complexity. Can you optimize your algorithm to be more efficient?",
        )
      } else if (userMessage.includes("solution") || userMessage.includes("answer")) {
        addRivalMessage(
          "I can't give you the full solution, but I can tell you that using a hash map would make this much faster.",
        )
      } else if (userMessage.includes("difficult") || userMessage.includes("hard") || userMessage.includes("stuck")) {
        addRivalMessage(
          "Don't give up! Break the problem down into smaller steps. What's the simplest version of this problem you could solve?",
        )
      } else if (userMessage.includes("easy") || userMessage.includes("simple")) {
        addRivalMessage(
          "Feeling confident? Let's see if you can optimize it further. Can you reduce the space complexity?",
        )
      } else if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("hey")) {
        addRivalMessage("Hello! Ready to tackle today's challenge? I've been practicing this one all week.")
      } else {
        // Default responses
        const responses = [
          "Interesting approach. Have you considered edge cases?",
          "I solved a similar problem last week. The key is finding the right data structure.",
          "Keep going! You're on the right track.",
          "Remember that efficiency matters in these challenges. Both time and space complexity.",
          "The best solutions are often the most elegant ones. Can you simplify your approach?",
          "Don't forget to test your solution with different inputs!",
          "I'm analyzing your coding style. You have a unique way of approaching problems.",
        ]
        addRivalMessage(responses[Math.floor(Math.random() * responses.length)])
      }
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

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
          <div className="rounded-full bg-gradient-to-br from-red-500 to-rose-600 p-3">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Rival System</h1>
            <p className="text-slate-400">Compete against an AI-generated rival that adapts to your skill level</p>
          </div>

          {/* Chat toggle button */}
          <Button onClick={() => setShowChat(!showChat)} variant="outline" className="ml-auto">
            <MessageSquare className="mr-2 h-4 w-4" />
            {showChat ? "Hide Chat" : "Chat with Rival"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {/* Chat interface - only shown when showChat is true */}
            {showChat && (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-4 text-xl font-semibold">Chat with {rival?.name || "Rival"}</h2>

                <div className="h-80 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-4 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user" ? "bg-teal-500 text-white" : "bg-slate-700 text-white"
                          }`}
                        >
                          <p>{message.text}</p>
                          <div
                            className={`mt-1 text-right text-xs ${
                              message.sender === "user" ? "text-teal-200" : "text-slate-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isRivalTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg bg-slate-700 p-3 text-white">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message to your rival..."
                    className="flex-1 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="rounded-full bg-red-500 p-2 hover:bg-red-600"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid gap-6 md:grid-cols-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-6 text-xl font-semibold">Rival Matchup</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-teal-500">
                        <img
                          src="/placeholder.svg?height=64&width=64"
                          alt="Your Avatar"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">You</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-xs font-medium text-teal-400">
                            Level {level}
                          </span>
                          <span className="text-slate-400">{xp} XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Strengths</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-teal-500/20 px-2 py-1 text-xs text-teal-400">
                            JavaScript
                          </span>
                          <span className="rounded-full bg-teal-500/20 px-2 py-1 text-xs text-teal-400">React</span>
                          <span className="rounded-full bg-teal-500/20 px-2 py-1 text-xs text-teal-400">
                            Web Development
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Win Rate</span>
                          <span>70%</span>
                        </div>
                        <Progress value={70} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-red-500">
                        <img
                          src="/placeholder.svg?height=64&width=64"
                          alt="Rival Avatar"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-slate-800 bg-amber-500"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{rival.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                            Level {rival.level}
                          </span>
                          <span className="text-slate-400">{rival.xp} XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Strengths</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {rival.strengths.map((strength: string, index: number) => (
                            <span key={index} className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Win Rate</span>
                          <span>{rival.winRate}%</span>
                        </div>
                        <Progress value={rival.winRate} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-60 w-full" />
              </div>
            ) : (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-4 text-xl font-semibold">Daily Challenge</h2>

                {/* {challengeStatus === "pending" && (
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{dailyChallenge.title}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          dailyChallenge.difficulty === "Easy"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : dailyChallenge.difficulty === "Medium"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {dailyChallenge.difficulty}
                      </span>
                    </div>

                    <p className="mt-3 text-slate-400">{dailyChallenge.description}</p>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div className="rounded-md border border-slate-700 bg-slate-800/50 p-3 text-center">
                        <Clock className="mx-auto mb-1 h-5 w-5 text-amber-400" />
                        <div className="text-sm font-medium">{dailyChallenge.timeLimit} min</div>
                        <div className="text-xs text-slate-400">Time Limit</div>
                      </div>
                      <div className="rounded-md border border-slate-700 bg-slate-800/50 p-3 text-center">
                        <Target className="mx-auto mb-1 h-5 w-5 text-red-400" />
                        <div className="text-sm font-medium">{dailyChallenge.rivalTime} min</div>
                        <div className="text-xs text-slate-400">Rival's Time</div>
                      </div>
                      <div className="rounded-md border border-slate-700 bg-slate-800/50 p-3 text-center">
                        <Trophy className="mx-auto mb-1 h-5 w-5 text-amber-400" />
                        <div className="text-sm font-medium">+{dailyChallenge.xpReward} XP</div>
                        <div className="text-xs text-slate-400">Reward</div>
                      </div>
                    </div>

                    <Button
                      onClick={startChallenge}
                      className="mt-6 w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                    >
                      <Swords className="mr-2 h-4 w-4" />
                      Start Challenge
                    </Button>
                  </div>
                )} */}
                <h1 className="text-4xl text-bold text-blue-500 underline"><Link href="https://www.codingame.com/ide/puzzle/coders-of-the-realm---1v1" >Click on this link everyday to get a new challenge</Link></h1>

                {challengeStatus === "in_progress" && (
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{dailyChallenge.title}</h3>
                      <span className="animate-pulse rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                        In Progress
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Challenge Progress</span>
                        <span>{challengeProgress}%</span>
                      </div>
                      <Progress value={challengeProgress} className="h-2" />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400">Time Remaining</div>
                        <div className="text-xl font-bold">
                          {Math.floor((dailyChallenge.timeLimit * (100 - challengeProgress)) / 100)} min
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Rival's Progress</div>
                        <div className="text-xl font-bold">{Math.min(100, Math.floor(challengeProgress * 1.1))}%</div>
                      </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-slate-400">
                      Simulating challenge completion for demo purposes...
                    </div>
                  </div>
                )}

                {(challengeStatus === "victory" || challengeStatus === "defeat") && (
                  <div
                    className={`rounded-lg border p-6 ${
                      challengeStatus === "victory"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                          challengeStatus === "victory" ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      >
                        {challengeStatus === "victory" ? (
                          <Trophy className="h-8 w-8 text-white" />
                        ) : (
                          <Shield className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <h3 className="mt-4 text-2xl font-bold">
                        {challengeStatus === "victory" ? "Victory!" : "Defeat!"}
                      </h3>
                      <p className="mt-2 text-slate-400">
                        {challengeStatus === "victory"
                          ? `You've defeated ${rival.name} and earned ${dailyChallenge.xpReward} XP!`
                          : `${rival.name} was faster this time. You earned ${Math.floor(dailyChallenge.xpReward * 0.4)} XP for participating.`}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-md border border-slate-700 bg-slate-800/50 p-3">
                        <div className="text-center text-sm text-slate-400">Your Performance</div>
                        <div className="mt-2 text-center text-2xl font-bold">
                          {challengeStatus === "victory" ? "95%" : "85%"}
                        </div>
                      </div>
                      <div className="rounded-md border border-slate-700 bg-slate-800/50 p-3">
                        <div className="text-center text-sm text-slate-400">Rival's Performance</div>
                        <div className="mt-2 text-center text-2xl font-bold">
                          {challengeStatus === "victory" ? "85%" : "95%"}
                        </div>
                      </div>
                    </div>

                    <Button onClick={resetChallenge} className="mt-6 w-full">
                      Try Another Challenge
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Battle History</h2>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {battleHistory.map((battle) => (
                    <div
                      key={battle.id}
                      className={`flex items-center justify-between rounded-md border p-4 ${
                        battle.result === "victory"
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-red-500/30 bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            battle.result === "victory" ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        >
                          {battle.result === "victory" ? (
                            <Trophy className="h-5 w-5 text-white" />
                          ) : (
                            <Shield className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{battle.title}</h3>
                          <p className="text-sm text-slate-400">{formatDate(battle.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${battle.result === "victory" ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {battle.result === "victory" ? "Victory" : "Defeat"}
                        </div>
                        <div className="text-sm text-amber-400">+{battle.xpGained} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Rival Stats</h2>

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Challenges Completed</span>
                      <span>{rival.challengesCompleted}</span>
                    </div>
                    <Progress value={(rival.challengesCompleted / 100) * 100} className="h-1.5" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Win Rate</span>
                      <span>{rival.winRate}%</span>
                    </div>
                    <Progress value={rival.winRate} className="h-1.5" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Last Active</span>
                      <span>{formatDate(new Date(rival.lastActive))}</span>
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                    <h3 className="font-medium">Rival Analysis</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      This rival is particularly strong in {rival.strengths.join(" and ")}. Focus on exploiting their
                      weaknesses in {rival.weaknesses.join(" and ")}
                      to gain an advantage in challenges.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Rival Personality</h2>

              <div className="space-y-3">
                <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                  <h3 className="font-medium">Personality Traits</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Competitiveness</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Flame
                            key={i}
                            className={`h-4 w-4 ${i <= 4 ? "text-red-400" : "text-slate-600"}`}
                            fill={i <= 4 ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Helpfulness</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Flame
                            key={i}
                            className={`h-4 w-4 ${i <= 3 ? "text-amber-400" : "text-slate-600"}`}
                            fill={i <= 3 ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Analytical</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Flame
                            key={i}
                            className={`h-4 w-4 ${i <= 5 ? "text-blue-400" : "text-slate-600"}`}
                            fill={i <= 5 ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                  <h3 className="font-medium">Communication Style</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    This rival tends to be direct and analytical in their feedback. They'll point out flaws in your code
                    but also offer constructive suggestions. They occasionally use competitive taunts to motivate you.
                  </p>
                </div>

                <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                  <h3 className="font-medium">Interaction Tips</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-400 list-disc list-inside">
                    <li>Ask specific questions about algorithms for detailed responses</li>
                    <li>Request hints when you're stuck on a challenge</li>
                    <li>Discuss your approach to get analytical feedback</li>
                    <li>Share your victories to receive congratulations and insights</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Your Achievements</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Rival Crusher</h3>
                    <p className="text-xs text-slate-400">Win 10 challenges against rivals</p>
                  </div>
                  <div className="ml-auto text-xs">
                    <span className="font-medium text-amber-400">7/10</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                    <Flame className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Winning Streak</h3>
                    <p className="text-xs text-slate-400">Win 5 challenges in a row</p>
                  </div>
                  <div className="ml-auto text-xs">
                    <span className="font-medium text-emerald-400">3/5</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Speed Demon</h3>
                    <p className="text-xs text-slate-400">Complete a challenge in half the time of your rival</p>
                  </div>
                  <div className="ml-auto text-xs">
                    <span className="font-medium text-violet-400">1/1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


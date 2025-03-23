"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Map, Trophy, Book, Star, Lock, Check, Info, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useXP } from "@/lib/xp-context"
import { getWorldProgress } from "@/lib/xp-service"
import { Skeleton } from "@/components/ui/skeleton"

export default function LearningAdventure() {
  const { level, addXP } = useXP()
  const [worldData, setWorldData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWorld, setSelectedWorld] = useState<any>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [challengeStatus, setChallengeStatus] = useState<"pending" | "in_progress" | "completed">("pending")
  const [challengeProgress, setChallengeProgress] = useState(0)

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const data = await getWorldProgress()
        setWorldData(data)

        // Set the selected world to the current world
        if (data.worlds[data.currentWorld]) {
          setSelectedWorld(data.worlds[data.currentWorld])
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load world data:", error)
        setIsLoading(false)
      }
    }

    loadWorldData()
  }, [])

  const generateChallenges = (worldId: string) => {
    const challengeTypes = {
      "syntax-valley": ["Variable Declaration", "Function Basics", "Control Flow", "Arrays and Objects"],
      "algorithm-mountains": ["Sorting Algorithms", "Search Algorithms", "Recursion", "Dynamic Programming"],
      "data-structure-forest": ["Linked Lists", "Trees", "Graphs", "Hash Tables"],
      "backend-caverns": ["API Design", "Database Queries", "Authentication", "Server Architecture"],
      "frontend-peaks": ["React Components", "State Management", "CSS Layouts", "Responsive Design"],
      "system-design-citadel": ["Scalability", "Caching", "Load Balancing", "Microservices"],
    }

    const challenges = challengeTypes[worldId as keyof typeof challengeTypes] || []

    return challenges.map((title, index) => ({
      id: `${worldId}-challenge-${index}`,
      title,
      description: `Master the concepts of ${title.toLowerCase()} in this interactive challenge.`,
      difficulty: index === 0 ? "Easy" : index === 1 ? "Easy" : index === 2 ? "Medium" : "Hard",
      xpReward: 50 + index * 25,
      completed: Math.random() > 0.6, // Randomly mark some as completed for demo
      timeEstimate: 15 + index * 5, // minutes
    }))
  }

  const selectWorld = (world: any) => {
    if (!world.unlocked) return
    setSelectedWorld(world)
    setSelectedChallenge(null)
    setChallengeStatus("pending")
  }

  const startChallenge = (challenge: any) => {
    setSelectedChallenge(challenge)
    setChallengeStatus("in_progress")
    setChallengeProgress(0)

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
    if (challengeProgress === 100 && challengeStatus === "in_progress" && selectedChallenge) {
      const handleCompletion = async () => {
        setChallengeStatus("completed")

        // Award XP
        await addXP(selectedChallenge.xpReward, `Completed "${selectedChallenge.title}" in ${selectedWorld?.name}`)
      }

      handleCompletion()
    }
  }, [challengeProgress, challengeStatus, selectedChallenge, selectedWorld, addXP])

  const resetChallenge = () => {
    setChallengeStatus("pending")
    setSelectedChallenge(null)
  }

  // Calculate these values only when worldData is available
  const worldsExplored = worldData?.worlds ? worldData.worlds.filter((w: any) => w.progress > 0).length : 0
  const worldsCompleted = worldData?.worlds ? worldData.worlds.filter((w: any) => w.completed).length : 0
  const totalWorlds = worldData?.worlds ? worldData.worlds.length : 0

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
          <div className="rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600 p-3">
            <Map className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Learning Adventure</h1>
            <p className="text-slate-400">Progress through a story-based journey by solving coding problems</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {isLoading ? (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-60 w-full" />
              </div>
            ) : (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <h2 className="mb-6 text-xl font-semibold">Adventure Map</h2>

                <div className="relative">
                  {/* World map with connections */}
                  <div className="absolute inset-0 z-0">
                    <svg className="h-full w-full" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100,150 C200,50 300,250 400,150 C500,50 600,250 700,150"
                        stroke="#475569"
                        strokeWidth="4"
                        strokeDasharray="8 4"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {worldData && worldData.worlds && (
                    <div className="relative z-10 flex flex-wrap justify-between gap-4">
                      {worldData.worlds.map((world: any, index: number) => (
                        <div
                          key={world.id}
                          className={`relative w-[calc(33%-1rem)] cursor-pointer rounded-lg border p-4 transition-all ${
                            selectedWorld?.id === world.id
                              ? "border-fuchsia-500 bg-fuchsia-500/10"
                              : world.unlocked
                                ? "border-slate-700 bg-slate-800 hover:border-fuchsia-500/50"
                                : "border-slate-700 bg-slate-800/50 opacity-70"
                          }`}
                          onClick={() => selectWorld(world)}
                        >
                          {!world.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/80">
                              <div className="text-center">
                                <Lock className="mx-auto h-6 w-6 text-slate-400" />
                                <p className="mt-2 text-sm text-slate-400">Unlocks at Level {index * 2 + 3}</p>
                              </div>
                            </div>
                          )}

                          <div className="mb-2 flex items-center justify-between">
                            <div
                              className={`rounded-full p-2 ${
                                world.completed
                                  ? "bg-emerald-500"
                                  : world.progress > 0
                                    ? "bg-amber-500"
                                    : "bg-slate-700"
                              }`}
                            >
                              {world.completed ? (
                                <Check className="h-4 w-4 text-white" />
                              ) : (
                                <Star className="h-4 w-4 text-white" />
                              )}
                            </div>

                            {world.progress > 0 && !world.completed && (
                              <span className="text-xs font-medium text-amber-400">{world.progress}%</span>
                            )}

                            {world.completed && (
                              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                Completed
                              </span>
                            )}
                          </div>

                          <h3 className="font-medium">{world.name}</h3>

                          {world.unlocked && !world.completed && (
                            <div className="mt-2">
                              <Progress value={world.progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedWorld && (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedWorld.name}</h2>
                  {selectedWorld.progress > 0 && !selectedWorld.completed && (
                    <span className="text-sm font-medium text-amber-400">{selectedWorld.progress}% Complete</span>
                  )}

                  {selectedWorld.completed && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                      World Completed
                    </span>
                  )}
                </div>

                {!selectedChallenge ? (
                  <>
                    <div className="mb-4 rounded-md border border-slate-700 bg-slate-800 p-4">
                      <h3 className="mb-2 font-medium">World Story</h3>
                      <p className="text-sm text-slate-400">
                        Welcome to {selectedWorld.name}, a realm where{" "}
                        {selectedWorld.id === "syntax-valley"
                          ? "the basics of programming come to life. Master variables, functions, and control flow to progress."
                          : selectedWorld.id === "algorithm-mountains"
                            ? "algorithms rule the landscape. Climb the peaks by mastering sorting, searching, and recursion."
                            : selectedWorld.id === "data-structure-forest"
                              ? "data structures grow like ancient trees. Navigate through linked lists, trees, and graphs."
                              : selectedWorld.id === "backend-caverns"
                                ? "backend concepts echo in dark caverns. Build APIs, query databases, and secure your applications."
                                : selectedWorld.id === "frontend-peaks"
                                  ? "frontend skills are tested at high altitudes. Create responsive interfaces and manage state effectively."
                                  : "system design principles form a mighty citadel. Scale your applications and optimize performance."}
                      </p>
                    </div>

                    <h3 className="mb-3 font-medium">Challenges</h3>
                    <div className="space-y-3">
                      {generateChallenges(selectedWorld.id).map((challenge) => (
                        <div
                          key={challenge.id}
                          className={`rounded-md border p-4 ${
                            challenge.completed
                              ? "border-emerald-500/30 bg-emerald-500/10"
                              : "border-slate-700 bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{challenge.title}</h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
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

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center gap-1 text-amber-400">
                                <Trophy className="h-4 w-4" />
                                <span>+{challenge.xpReward} XP</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                <Clock className="h-4 w-4" />
                                <span>~{challenge.timeEstimate} min</span>
                              </div>
                            </div>

                            {challenge.completed ? (
                              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                                Completed
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => startChallenge(challenge)}
                                className="bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700"
                              >
                                Start Challenge
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {challengeStatus === "in_progress" && (
                      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{selectedChallenge.title}</h3>
                          <span className="animate-pulse rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                            In Progress
                          </span>
                        </div>

                        <p className="mt-3 text-slate-400">{selectedChallenge.description}</p>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Challenge Progress</span>
                            <span>{challengeProgress}%</span>
                          </div>
                          <Progress value={challengeProgress} className="h-2" />
                        </div>

                        <div className="mt-6 text-center text-sm text-slate-400">
                          Simulating challenge completion for demo purposes...
                        </div>
                      </div>
                    )}

                    {challengeStatus === "completed" && (
                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6">
                        <div className="text-center">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
                            <Trophy className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="mt-4 text-2xl font-bold">Challenge Completed!</h3>
                          <p className="mt-2 text-slate-400">
                            You've mastered {selectedChallenge.title} and earned {selectedChallenge.xpReward} XP!
                          </p>
                        </div>

                        <div className="mt-6 rounded-md border border-slate-700 bg-slate-800/50 p-4">
                          <h4 className="mb-2 font-medium">Story Progress</h4>
                          <p className="text-sm text-slate-400">
                            As you complete the {selectedChallenge.title} challenge, you gain deeper understanding of
                            the
                            {selectedWorld.id === "syntax-valley"
                              ? " fundamental building blocks of programming. The valley begins to reveal more of its secrets."
                              : selectedWorld.id === "algorithm-mountains"
                                ? " powerful algorithms that can solve complex problems efficiently. The mountain path becomes clearer."
                                : selectedWorld.id === "data-structure-forest"
                                  ? " data structures that organize information. The forest path opens up to new areas."
                                  : selectedWorld.id === "backend-caverns"
                                    ? " backend systems that power applications. The caverns reveal hidden passages."
                                    : selectedWorld.id === "frontend-peaks"
                                      ? " frontend techniques that create engaging user experiences. The view from the peaks becomes clearer."
                                      : " system design principles that enable scalable applications. The citadel's architecture becomes more apparent."}
                          </p>
                        </div>

                        <Button
                          onClick={resetChallenge}
                          className="mt-6 w-full bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700"
                        >
                          Continue Adventure
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Your Journey</h2>

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Worlds Explored</span>
                      <span>
                        {worldsExplored}/{totalWorlds}
                      </span>
                    </div>
                    <Progress value={(worldsExplored / totalWorlds) * 100} className="h-1.5" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Worlds Completed</span>
                      <span>
                        {worldsCompleted}/{totalWorlds}
                      </span>
                    </div>
                    <Progress value={(worldsCompleted / totalWorlds) * 100} className="h-1.5" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Current Level</span>
                      <span>{level}</span>
                    </div>
                    <Progress value={(level / 15) * 100} className="h-1.5" />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Adventure Rewards</h2>

              {worldData && worldData.worlds ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Syntax Valley Master</h3>
                      <p className="text-xs text-slate-400">Complete all challenges in Syntax Valley</p>
                    </div>
                    <div className="ml-auto">
                      {worldData.worlds[0]?.completed ? (
                        <Check className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <span className="text-xs font-medium text-amber-400">
                          {worldData.worlds[0]?.progress || 0}%
                        </span>
                      )}
                    </div>
                  </div>

                  {worldData.worlds.length > 1 && (
                    <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                        <Book className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Algorithm Explorer</h3>
                        <p className="text-xs text-slate-400">Complete all challenges in Algorithm Mountains</p>
                      </div>
                      <div className="ml-auto">
                        {worldData.worlds[1]?.completed ? (
                          <Check className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <span className="text-xs font-medium text-amber-400">
                            {worldData.worlds[1]?.progress || 0}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {worldData.worlds.length > 2 && (
                    <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Data Structure Sage</h3>
                        <p className="text-xs text-slate-400">Complete all challenges in Data Structure Forest</p>
                      </div>
                      <div className="ml-auto">
                        {worldData.worlds[2]?.completed ? (
                          <Check className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <span className="text-xs font-medium text-amber-400">
                            {worldData.worlds[2]?.progress || 0}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              )}

              <Button variant="outline" className="mt-4 w-full">
                View All Rewards
              </Button>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Adventure Tips</h2>

              <div className="space-y-3">
                <div className="flex gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                    <Info className="h-4 w-4 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Complete Worlds in Order</h3>
                    <p className="text-sm text-slate-400">
                      For the best learning experience, try to complete worlds in sequence.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                    <Info className="h-4 w-4 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Revisit Completed Challenges</h3>
                    <p className="text-sm text-slate-400">
                      Revisiting completed challenges can help reinforce your learning.
                    </p>
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


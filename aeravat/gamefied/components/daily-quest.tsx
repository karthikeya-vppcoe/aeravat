"use client"

import { useState } from "react"
import { Flame, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useXP } from "@/lib/xp-context"

export function DailyQuest() {
  const { addXP } = useXP()
  const [quests, setQuests] = useState([
    { id: 1, title: "Complete Python challenge", completed: true, xp: 50 },
    { id: 2, title: "Review JavaScript basics", completed: false, xp: 30 },
    { id: 3, title: "Solve algorithm puzzle", completed: false, xp: 75 },
    { id: 4, title: "Read article on React hooks", completed: false, xp: 25 },
  ])

  const completedCount = quests.filter((quest) => quest.completed).length
  const totalQuests = quests.length
  const streakDays = 6

  const toggleQuest = (id: number) => {
    const quest = quests.find((q) => q.id === id)
    if (!quest) return

    const newCompleted = !quest.completed

    // Update the quest state first
    setQuests(quests.map((quest) => (quest.id === id ? { ...quest, completed: newCompleted } : quest)))

    // Then award XP if completing a quest (not during render)
    if (newCompleted && !quest.completed) {
      // Use setTimeout to move this out of the render cycle
      setTimeout(() => {
        addXP(quest.xp, `Completed daily quest: ${quest.title}`)
      }, 0)
    }
  }

  const claimRewards = () => {
    // Calculate bonus XP based on completion percentage
    const completionPercentage = completedCount / totalQuests
    const bonusXP = Math.floor(100 * completionPercentage)

    // Reset quests first
    setQuests(quests.map((quest) => ({ ...quest, completed: false })))

    // Then award XP (not during render)
    setTimeout(() => {
      addXP(bonusXP, `Daily quest bonus (${completedCount}/${totalQuests} completed)`)
    }, 0)
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Daily Quests</h2>
        <div className="flex items-center gap-1 text-amber-400">
          <Flame className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span className="font-bold">{streakDays} day streak!</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`flex items-center justify-between rounded-md border p-3 ${
              quest.completed ? "border-emerald-500/30 bg-emerald-500/10" : "border-slate-700 bg-slate-800"
            } cursor-pointer`}
            onClick={() => toggleQuest(quest.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  quest.completed ? "bg-emerald-500 text-white" : "border border-slate-600"
                }`}
              >
                {quest.completed && <CheckCircle2 className="h-5 w-5" />}
              </div>
              <span className={quest.completed ? "text-slate-400 line-through" : ""}>{quest.title}</span>
            </div>
            <span className="text-sm font-medium text-amber-400">+{quest.xp} XP</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Daily progress</span>
          <span>
            {completedCount}/{totalQuests} completed
          </span>
        </div>
        <Progress value={(completedCount / totalQuests) * 100} className="h-2" />
      </div>

      <Button
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        onClick={claimRewards}
        disabled={completedCount === 0}
      >
        Claim Daily Rewards
      </Button>
    </div>
  )
}


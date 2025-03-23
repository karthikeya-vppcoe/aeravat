"use client"

import { Progress } from "@/components/ui/progress"
import { useXP } from "@/lib/xp-context"
import { Skeleton } from "@/components/ui/skeleton"

export function LevelProgress() {
  const { xp, level, nextLevelXP, isLoading } = useXP()

  const progressPercentage = Math.min(100, Math.floor((xp / nextLevelXP) * 100))

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="mt-2 flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
            {level}
          </div>
          <span className="font-medium">Level {level}</span>
        </div>
        <div className="text-sm text-slate-400">
          {xp} / {nextLevelXP} XP
        </div>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>Current</span>
        <span>Next Level</span>
      </div>
    </div>
  )
}


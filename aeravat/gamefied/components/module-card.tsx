"use client"

import Link from "next/link"
import { Swords, Scroll, Zap, Code, User, Map, Users, Bot, type LucideIcon, Lock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useXP } from "@/lib/xp-context"

interface ModuleCardProps {
  title: string
  description: string
  icon: string
  color: string
  // progress: number
  href: string
  completed?: boolean
  locked?: boolean
}

export function ModuleCard({
  title,
  description,
  icon,
  color,
  // progress,
  href,
  completed = false,
  locked = false,
}: ModuleCardProps) {
  const { level } = useXP()
  const icons: Record<string, LucideIcon> = {
    swords: Swords,
    scroll: Scroll,
    zap: Zap,
    code: Code,
    user: User,
    map: Map,
    users: Users,
    bot: Bot,
  }

  const Icon = icons[icon] || Swords

  return (
    <Link
      href={locked ? "#" : href}
      className={`group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-all hover:border-slate-600 hover:shadow-lg ${
        locked ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 transition-opacity group-hover:opacity-15`}
      />
      <div className="relative z-10">
        <div className="mb-2 flex items-center justify-between">
          <div className={`rounded-full bg-gradient-to-br ${color} p-2`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {locked && (
            <div className="flex items-center text-slate-400">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-xs">Unlock at Level 10</span>
            </div>
          )}
          {completed && (
            <div className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
              Completed
            </div>
          )}
        </div>
        <h3 className="mb-1 font-semibold">{title}</h3>
        <p className="mb-3 text-sm text-slate-400">{description}</p>

        {/* <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Progress</span>
            {/* <span className="font-medium text-white">{progress}%</span> 
          </div>
          {/* <Progress value={progress} className="h-1.5" /> 
        </div> */}
      </div>
    </Link>
  )
}


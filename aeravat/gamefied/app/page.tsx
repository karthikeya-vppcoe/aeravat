"use client";


import Link from "next/link";
// import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav";
import { ModuleCard } from "@/components/module-card";
import { DailyQuest } from "@/components/daily-quest";
import { LevelProgress } from "@/components/level-progress";
import { Notifications } from "@/components/notifications";


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <MainNav />
          <div className="flex items-center gap-4 text-teal-400">
            <Link href={"http://127.0.0.1:8000/profile/"}>Dashboard</Link>
            <Notifications />
            {/* <UserNav /> */}
          </div>
        </div>
      </header>
      <main className="container px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back,
              </h1>
            </div>
            <LevelProgress />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ModuleCard
                title="Skill Battle Arena"
                description="Battle against AI-generated coding challenges and compete with friends."
                icon="swords"
                color="from-purple-600 to-indigo-600"
                // progress={65}
                href="/modules/battle-arena"
              />
              {/* <ModuleCard
                title="Daily Quests"
                description="Complete personalized tasks to maintain your streak and earn rewards."
                icon="scroll"
                color="from-amber-500 to-orange-600"
                progress={100}
                href="/modules/daily-quests"
                completed={true}
              /> */}
              <ModuleCard
                title="Ai Interview Prep"
                description="Prepare for interviews with AI-generated questions and solutions."
                icon="zap"
                color="from-emerald-500 to-teal-600"
                // progress={42}
                href="https://placement-pre-ai.vercel.app/sign-in"
              />
              <ModuleCard
                title="Hackathons"
                description="Test your readiness with AI-generated coding competitions."
                icon="code"
                color="from-blue-500 to-cyan-600"
                // progress={28}
                href="/modules/hackathon"
              />
              <ModuleCard
                title="AI Rival System"
                description="Compete against an AI-generated rival that matches your skill level."
                icon="user"
                color="from-red-500 to-rose-600"
                // progress={50}
                href="/modules/ai-rival"
              />
              <ModuleCard
                title="Learning Adventure"
                description="Progress through a story-based journey solving coding problems."
                icon="map"
                color="from-fuchsia-500 to-pink-600"
                href="/modules/learning-adventure"
              />
              <ModuleCard
                title="Study Groups"
                description="Join AI-matched study groups for collaborative challenges."
                icon="users"
                color="from-sky-500 to-blue-600"
                // progress={0}
                href="/modules/study-groups"
                // locked={level < 10}
              />
              <ModuleCard
                title="AI Code Mentor"
                description="Get personalized feedback and guidance from your virtual AI coach."
                icon="bot"
                color="from-violet-500 to-purple-600"
                // progress={33}
                href="/modules/ai-code"
              />
            </div>
          </div>
          <div className="space-y-6">
            <DailyQuest />
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <span className="font-bold">24</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Web Dev Hackathon</h3>
                    <p className="text-sm text-slate-400">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                    <span className="font-bold">28</span>
                  </div>
                  <div>
                    <h3 className="font-medium">AI Workshop</h3>
                    <p className="text-sm text-slate-400">Friday, 4:00 PM</p>
                  </div>
                </div>
              </div>
              <Link
                href="/events"
                className="mt-3 inline-flex items-center text-sm font-medium text-teal-400 hover:text-teal-300"
              >
                View all events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}




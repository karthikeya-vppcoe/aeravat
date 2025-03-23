"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Swords, Trophy, Code, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function BattleArena() {
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);

  const opponents = [
    {
      id: "ai-python",
      name: "Python AI",
      level: 6,
      difficulty: "Medium",
      description:
        "AI-generated Python challenges focused on data structures and algorithms.",
      icon: <Code className="h-5 w-5" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: "ai-javascript",
      name: "JavaScript AI",
      level: 5,
      difficulty: "Easy",
      description:
        "AI-generated JavaScript challenges focused on DOM manipulation and ES6 features.",
      icon: <Zap className="h-5 w-5" />,
      color: "from-yellow-500 to-amber-600"
    },
    {
      id: "rival-john",
      name: "John (Rival)",
      level: 7,
      difficulty: "Hard",
      description:
        "Your AI-generated rival with similar skill level but different strengths.",
      icon: <User className="h-5 w-5" />,
      color: "from-red-500 to-rose-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container px-4 py-8 md:px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-400 hover:text-teal-400"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 p-3">
            <Swords className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Skill Battle Arena</h1>
            <p className="text-slate-400">
              Challenge AI opponents or compete with friends in coding battles
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Choose Your Opponent
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {opponents.map((opponent) => (
                  <div
                    key={opponent.id}
                    className={`relative overflow-hidden rounded-lg border p-4 transition-all hover:border-slate-600 ${
                      selectedOpponent === opponent.id
                        ? "border-teal-500 bg-slate-800"
                        : "border-slate-700 bg-slate-800/50"
                    }`}
                    onClick={() => setSelectedOpponent(opponent.id)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${opponent.color} opacity-10`}
                    />
                    <div className="relative z-10">
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className={`rounded-full bg-gradient-to-br ${opponent.color} p-2`}
                        >
                          {opponent.icon}
                        </div>
                        <div className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs">
                          Level {opponent.level}
                        </div>
                      </div>
                      <h3 className="mb-1 font-semibold">{opponent.name}</h3>
                      <div className="mb-2 text-xs font-medium text-amber-400">
                        {opponent.difficulty}
                      </div>
                      <p className="text-sm text-slate-400">
                        {opponent.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Link href="https://www.codebattle.in/editor/5f071f2b-3a4e-41e7-9403-df5d44cf2d84">
                    Start Battle
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Recent Battles</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-800 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          JavaScript Challenge {i}
                        </h3>
                        <p className="text-sm text-slate-400">
                          Completed 2 days ago
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-emerald-400">
                        Victory
                      </div>
                      <div className="text-sm text-slate-400">
                        Score: 850 XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Your Battle Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-slate-400">Win Rate</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-slate-400">Battles Won</span>
                    <span className="font-medium">15/20</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border border-slate-700 bg-slate-800 p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">
                      1,250
                    </div>
                    <div className="text-xs text-slate-400">
                      Total XP Earned
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-700 bg-slate-800 p-3 text-center">
                    <div className="text-2xl font-bold text-teal-400">#12</div>
                    <div className="text-xs text-slate-400">Global Rank</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold">Leaderboard</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div
                    key={rank}
                    className={`flex items-center justify-between rounded-md border p-3 ${
                      rank === 3
                        ? "border-teal-500/30 bg-teal-500/10"
                        : "border-slate-700 bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          rank === 1
                            ? "bg-amber-500 text-white"
                            : rank === 2
                            ? "bg-slate-400 text-white"
                            : rank === 3
                            ? "bg-amber-800 text-white"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {rank}
                      </div>
                      <span className={rank === 3 ? "font-medium" : ""}>
                        {rank === 3
                          ? "You"
                          : `User ${
                              rank === 1
                                ? "Alpha"
                                : rank === 2
                                ? "Beta"
                                : `${rank + 3}`
                            }`}
                      </span>
                    </div>
                    <span className="font-medium text-amber-400">
                      {rank === 1
                        ? "2,450"
                        : rank === 2
                        ? "2,120"
                        : rank === 3
                        ? "1,890"
                        : rank === 4
                        ? "1,740"
                        : "1,520"}{" "}
                      XP
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="mt-3 w-full text-sm text-slate-400 hover:text-white"
              >
                View Full Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

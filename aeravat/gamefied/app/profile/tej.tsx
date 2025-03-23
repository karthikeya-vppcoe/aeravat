"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  Github,
  Linkedin,
  Twitter,
  Award,
  Zap,
  Code,
  Book,
  Trophy,
  Calendar,
  Flame,
  ArrowUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillChart } from "@/components/skill-chart"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview")

  const skills = [
    { name: "JavaScript", level: 85 },
    { name: "Python", level: 65 },
    { name: "React", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "Data Structures", level: 70 },
    { name: "Algorithms", level: 60 },
    { name: "System Design", level: 50 },
  ]

  const achievements = [
    {
      id: 1,
      title: "Algorithm Master",
      description: "Completed 50 algorithm challenges",
      date: "2 weeks ago",
      icon: <Code className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: 2,
      title: "7-Day Streak",
      description: "Logged in for 7 consecutive days",
      date: "1 week ago",
      icon: <Flame className="h-5 w-5" />,
      color: "bg-amber-500",
    },
    {
      id: 3,
      title: "JavaScript Guru",
      description: "Reached level 8 in JavaScript",
      date: "3 days ago",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      id: 4,
      title: "Battle Champion",
      description: "Won 10 coding battles in a row",
      date: "Yesterday",
      icon: <Trophy className="h-5 w-5" />,
      color: "bg-emerald-500",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: "Completed 'Two Sum' Challenge",
      type: "challenge",
      date: "Today, 10:30 AM",
      icon: <Code className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Earned 'JavaScript Guru' Badge",
      type: "achievement",
      date: "Yesterday, 3:45 PM",
      icon: <Award className="h-4 w-4" />,
      color: "bg-amber-500",
    },
    {
      id: 3,
      title: "Joined 'React Masters' Study Group",
      type: "group",
      date: "Yesterday, 1:20 PM",
      icon: <Book className="h-4 w-4" />,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Reached Level 7",
      type: "level",
      date: "2 days ago, 5:15 PM",
      icon: <ArrowUp className="h-4 w-4" />,
      color: "bg-emerald-500",
    },
    {
      id: 5,
      title: "Completed Daily Quests",
      type: "quest",
      date: "2 days ago, 11:30 AM",
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-teal-500",
    },
  ]

  const leetcodeStats = {
    solved: 127,
    easy: 45,
    medium: 62,
    hard: 20,
    ranking: 24563,
    contestRating: 1756,
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

        <div className="mb-8 grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-center">
            <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-teal-500">
              <img src="/placeholder.svg?height=128&width=128" alt="Profile" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold">Alex Smith</h1>
            <p className="text-teal-400">Full Stack Developer</p>
            <p className="mt-1 text-sm text-slate-400">University of Technology</p>

            <div className="mt-4 flex justify-center space-x-3">
              <Button variant="outline" size="icon" className="rounded-full">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Level 7</span>
                <span>1,250 / 2,000 XP</span>
              </div>
              <Progress value={62.5} className="mt-2 h-2" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-slate-700 bg-slate-800 p-2">
                <div className="text-xl font-bold text-amber-400">127</div>
                <div className="text-xs text-slate-400">Problems</div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-800 p-2">
                <div className="text-xl font-bold text-emerald-400">15</div>
                <div className="text-xs text-slate-400">Badges</div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-800 p-2">
                <div className="text-xl font-bold text-purple-400">7</div>
                <div className="text-xs text-slate-400">Streak</div>
              </div>
            </div>

            <Button className="mt-6 w-full">Edit Profile</Button>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold">About Me</h2>
                      <p className="mt-2 text-sm text-slate-400">
                        Computer Science student passionate about web development and algorithms. Currently focusing on
                        mastering data structures and algorithms for technical interviews. Looking for internship
                        opportunities in software development.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">Top Skills</h2>
                      <div className="mt-2 space-y-2">
                        {skills.slice(0, 4).map((skill) => (
                          <div key={skill.name}>
                            <div className="flex items-center justify-between text-sm">
                              <span>{skill.name}</span>
                              <span className="text-teal-400">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold">LeetCode Stats</h2>
                      <div className="mt-2 rounded-md border border-slate-700 bg-slate-800 p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-slate-400">Problems Solved</div>
                            <div className="text-xl font-bold">{leetcodeStats.solved}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Global Ranking</div>
                            <div className="text-xl font-bold">#{leetcodeStats.ranking}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Contest Rating</div>
                            <div className="text-xl font-bold">{leetcodeStats.contestRating}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Hard Problems</div>
                            <div className="text-xl font-bold text-red-400">{leetcodeStats.hard}</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex h-4 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-emerald-500"
                              style={{ width: `${(leetcodeStats.easy / leetcodeStats.solved) * 100}%` }}
                            ></div>
                            <div
                              className="bg-amber-500"
                              style={{ width: `${(leetcodeStats.medium / leetcodeStats.solved) * 100}%` }}
                            ></div>
                            <div
                              className="bg-red-500"
                              style={{ width: `${(leetcodeStats.hard / leetcodeStats.solved) * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 flex text-xs">
                            <div className="flex items-center">
                              <div className="mr-1 h-2 w-2 rounded-full bg-emerald-500"></div>
                              <span>Easy ({leetcodeStats.easy})</span>
                            </div>
                            <div className="ml-3 flex items-center">
                              <div className="mr-1 h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Medium ({leetcodeStats.medium})</span>
                            </div>
                            <div className="ml-3 flex items-center">
                              <div className="mr-1 h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Hard ({leetcodeStats.hard})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">Recent Achievements</h2>
                      <div className="mt-2 space-y-2">
                        {achievements.slice(0, 2).map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-800 p-3"
                          >
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${achievement.color}`}
                            >
                              {achievement.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{achievement.title}</h3>
                              <p className="text-xs text-slate-400">{achievement.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h2 className="mb-4 text-lg font-semibold">Skill Levels</h2>
                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between text-sm">
                            <span>{skill.name}</span>
                            <span className="text-teal-400">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-4 text-lg font-semibold">Skill Radar</h2>
                    <div className="flex h-64 items-center justify-center rounded-md border border-slate-700 bg-slate-800 p-4">
                      <SkillChart skills={skills} />
                    </div>

                    <div className="mt-6">
                      <h2 className="mb-4 text-lg font-semibold">Recommended Focus Areas</h2>
                      <div className="space-y-2">
                        <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                          <h3 className="font-medium">System Design</h3>
                          <p className="text-sm text-slate-400">Your lowest skill. Focus on improving this area.</p>
                        </div>
                        <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                          <h3 className="font-medium">Algorithms</h3>
                          <p className="text-sm text-slate-400">Complete more LeetCode challenges to improve.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-start gap-3 rounded-md border border-slate-700 bg-slate-800 p-4"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${achievement.color}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-slate-400">{achievement.description}</p>
                        <p className="mt-1 text-xs text-slate-500">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h2 className="mb-4 text-lg font-semibold">Upcoming Achievements</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-md border border-slate-700 bg-slate-800 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
                        <Trophy className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">30-Day Streak</h3>
                        <p className="text-sm text-slate-400">Log in for 30 consecutive days</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Progress</span>
                            <span>7/30 days</span>
                          </div>
                          <Progress value={23.33} className="h-1.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-md border border-slate-700 bg-slate-800 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
                        <Code className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Algorithm Expert</h3>
                        <p className="text-sm text-slate-400">Complete 100 algorithm challenges</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Progress</span>
                            <span>50/100 challenges</span>
                          </div>
                          <Progress value={50} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-700"></div>
                  <div className="space-y-6">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="relative flex gap-4">
                        <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 rounded-md border border-slate-700 bg-slate-800 p-3">
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-xs text-slate-400">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="mt-6 w-full">
                  View All Activity
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}


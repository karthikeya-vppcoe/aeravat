"use server"

// This file simulates a backend service for XP management
// In a real application, this would connect to a database

// Simulated user data storage
const userData = {
  userId: "user123",
  xp: 1250,
  level: 7,
  completedChallenges: [],
  achievements: [],
  lastUpdated: new Date(),
}

// XP required for each level
const levelXPRequirements = [
  0, // Level 0 (not used)
  500, // Level 1
  1000, // Level 2
  1500, // Level 3
  2000, // Level 4
  2500, // Level 5
  3000, // Level 6
  4000, // Level 7
  5000, // Level 8
  6000, // Level 9
  7500, // Level 10
  9000, // Level 11
  11000, // Level 12
  13000, // Level 13
  15000, // Level 14
  17500, // Level 15
]

export async function getXP(): Promise<number> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return userData.xp
}

export async function updateXP(amount: number): Promise<number> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  userData.xp += amount
  userData.lastUpdated = new Date()

  // Check if user leveled up
  const newLevel = calculateLevel(userData.xp)
  if (newLevel > userData.level) {
    userData.level = newLevel
  }

  return userData.xp
}

export async function getLevel(): Promise<number> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return userData.level
}

export async function getLevelProgress(
  level: number,
): Promise<{ current: number; nextLevel: number; progress: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const currentLevelXP = level > 0 && level < levelXPRequirements.length ? levelXPRequirements[level] : 0

  const nextLevelXP = level + 1 < levelXPRequirements.length ? levelXPRequirements[level + 1] : currentLevelXP + 2500

  const xpForCurrentLevel = userData.xp - currentLevelXP
  const xpRequiredForNextLevel = nextLevelXP - currentLevelXP
  const progress = Math.min(100, Math.floor((xpForCurrentLevel / xpRequiredForNextLevel) * 100))

  return {
    current: currentLevelXP,
    nextLevel: nextLevelXP,
    progress,
  }
}

function calculateLevel(xp: number): number {
  for (let i = levelXPRequirements.length - 1; i >= 0; i--) {
    if (xp >= levelXPRequirements[i]) {
      return i
    }
  }
  return 1
}

export async function trackActivity(activityType: string, details: any): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, this would log user activity to a database
  console.log(`Activity tracked: ${activityType}`, details)

  // Update last activity timestamp
  userData.lastUpdated = new Date()
}

export async function getRivalData(): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate rival data based on user's level and XP
  const rivalLevel = Math.max(1, userData.level - 1 + Math.floor(Math.random() * 3))
  const rivalXP = levelXPRequirements[rivalLevel] + Math.floor(Math.random() * 500)

  return {
    id: "rival-001",
    name: "CodeMaster",
    level: rivalLevel,
    xp: rivalXP,
    strengths: ["Algorithms", "Data Structures"],
    weaknesses: ["System Design", "Frontend"],
    winRate: 65,
    challengesCompleted: userData.level * 7 + Math.floor(Math.random() * 10),
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random time in last 24h
  }
}

export async function getWorldProgress(): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Calculate world progress based on user level
  const worlds = [
    { id: "syntax-valley", name: "Syntax Valley", unlocked: true, completed: userData.level >= 3, progress: 100 },
    {
      id: "algorithm-mountains",
      name: "Algorithm Mountains",
      unlocked: userData.level >= 3,
      completed: userData.level >= 5,
      progress: userData.level >= 5 ? 100 : Math.min(100, Math.floor(((userData.level - 3) / 2) * 100)),
    },
    {
      id: "data-structure-forest",
      name: "Data Structure Forest",
      unlocked: userData.level >= 5,
      completed: userData.level >= 7,
      progress: userData.level >= 7 ? 100 : Math.min(100, Math.floor(((userData.level - 5) / 2) * 100)),
    },
    {
      id: "backend-caverns",
      name: "Backend Caverns",
      unlocked: userData.level >= 7,
      completed: userData.level >= 9,
      progress: userData.level >= 9 ? 100 : Math.min(100, Math.floor(((userData.level - 7) / 2) * 100)),
    },
    {
      id: "frontend-peaks",
      name: "Frontend Peaks",
      unlocked: userData.level >= 9,
      completed: userData.level >= 11,
      progress: userData.level >= 11 ? 100 : Math.min(100, Math.floor(((userData.level - 9) / 2) * 100)),
    },
    {
      id: "system-design-citadel",
      name: "System Design Citadel",
      unlocked: userData.level >= 11,
      completed: userData.level >= 13,
      progress: userData.level >= 13 ? 100 : Math.min(100, Math.floor(((userData.level - 11) / 2) * 100)),
    },
  ]

  return {
    currentWorld:
      worlds.findIndex((w) => w.progress < 100 && w.unlocked) !== -1
        ? worlds.findIndex((w) => w.progress < 100 && w.unlocked)
        : worlds.length - 1,
    worlds,
  }
}


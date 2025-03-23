"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getXP, getLevel, getLevelProgress } from "@/lib/xp-service"

type XPContextType = {
  xp: number
  level: number
  nextLevelXP: number
  addXP: (amount: number, reason?: string) => Promise<void>
  isLoading: boolean
  recentXPGains: { id: string; amount: number; reason: string; timestamp: Date }[]
}

const XPContext = createContext<XPContextType | undefined>(undefined)

export function XPProvider({ children }: { children: ReactNode }) {
  const [xp, setXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [nextLevelXP, setNextLevelXP] = useState(1000)
  const [isLoading, setIsLoading] = useState(true)
  const [recentXPGains, setRecentXPGains] = useState<{ id: string; amount: number; reason: string; timestamp: Date }[]>(
    [],
  )

  useEffect(() => {
    const loadXP = async () => {
      try {
        const currentXP = await getXP()
        const currentLevel = await getLevel()
        const { nextLevel } = await getLevelProgress(currentLevel)

        setXP(currentXP)
        setLevel(currentLevel)
        setNextLevelXP(nextLevel)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load XP data:", error)
        setIsLoading(false)
      }
    }

    loadXP()
  }, [])

  const addXP = async (amount: number, reason = "Activity completed") => {
    try {
      setIsLoading(true)

      // Simulate API call to update XP
      const updatedXP = xp + amount

      // Check if user leveled up
      let newLevel = level
      let newNextLevelXP = nextLevelXP

      if (updatedXP >= nextLevelXP) {
        newLevel = level + 1
        const { nextLevel } = await getLevelProgress(newLevel)
        newNextLevelXP = nextLevel
      }

      // Update state
      setXP(updatedXP)
      setLevel(newLevel)
      setNextLevelXP(newNextLevelXP)

      // Add to recent XP gains
      const newGain = {
        id: Date.now().toString(),
        amount,
        reason,
        timestamp: new Date(),
      }

      setRecentXPGains((prev) => [newGain, ...prev].slice(0, 5))

      setIsLoading(false)

      return Promise.resolve()
    } catch (error) {
      console.error("Failed to add XP:", error)
      setIsLoading(false)
      return Promise.reject(error)
    }
  }

  return (
    <XPContext.Provider value={{ xp, level, nextLevelXP, addXP, isLoading, recentXPGains }}>
      {children}
    </XPContext.Provider>
  )
}

export function useXP() {
  const context = useContext(XPContext)
  if (context === undefined) {
    throw new Error("useXP must be used within an XPProvider")
  }
  return context
}


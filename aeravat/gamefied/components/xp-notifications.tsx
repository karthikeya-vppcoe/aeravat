"use client"

import { useState, useEffect } from "react"
import { useXP } from "@/lib/xp-context"
import { AnimatePresence, motion } from "framer-motion"
import { Award } from "lucide-react"

export function XPNotifications() {
  const { recentXPGains } = useXP()
  const [visibleNotifications, setVisibleNotifications] = useState<{ id: string; amount: number; reason: string }[]>([])

  useEffect(() => {
    // When recentXPGains changes, add the newest one to visible notifications
    if (recentXPGains.length > 0) {
      const latestGain = recentXPGains[0]

      // Check if this notification is already visible
      if (!visibleNotifications.some((n) => n.id === latestGain.id)) {
        setVisibleNotifications((prev) => [...prev, latestGain])

        // Remove notification after 5 seconds
        setTimeout(() => {
          setVisibleNotifications((prev) => prev.filter((n) => n.id !== latestGain.id))
        }, 5000)
      }
    }
  }, [recentXPGains, visibleNotifications])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-slate-800 p-3 shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="font-medium text-amber-400">+{notification.amount} XP</div>
              <div className="text-sm text-slate-300">{notification.reason}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}


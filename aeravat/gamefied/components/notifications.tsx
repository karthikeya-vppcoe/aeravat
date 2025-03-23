"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useXP } from "@/lib/xp-context"

export function Notifications() {
  const { recentXPGains } = useXP()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New AI challenge available",
      description: "A new Python challenge has been generated for you.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Your rival has completed a challenge",
      description: "John has completed the JavaScript challenge. Can you beat their score?",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Study group invitation",
      description: "You've been invited to join the 'React Masters' study group.",
      time: "3 hours ago",
      unread: false,
    },
  ])

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification)),
    )
  }

  // Add XP gain notifications to the list
  const allNotifications = [
    ...notifications,
    ...recentXPGains.map((gain, index) => ({
      id: `xp-${index}`,
      title: `Earned ${gain.amount} XP`,
      description: gain.reason,
      time: "Just now",
      unread: true,
    })),
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-teal-400 hover:text-teal-300">
                Mark all as read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {allNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => typeof notification.id === "number" && markAsRead(notification.id)}
            >
              <div className={`w-full space-y-1 ${notification.unread ? "font-medium" : ""}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm">{notification.title}</p>
                  {notification.unread && <span className="h-2 w-2 rounded-full bg-teal-400"></span>}
                </div>
                <p className="text-xs text-slate-400">{notification.description}</p>
                <p className="text-xs text-slate-500">{notification.time}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <Button variant="ghost" size="sm" className="w-full text-center text-sm text-slate-400 hover:text-white">
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


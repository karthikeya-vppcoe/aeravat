"use client"

import { useEffect, useRef } from "react"

interface SkillChartProps {
  skills: { name: string; level: number }[]
}

export function SkillChart({ skills }: SkillChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const size = Math.min(canvas.parentElement?.clientWidth || 300, 300)
    canvas.width = size
    canvas.height = size

    // Calculate center and radius
    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4

    // Draw radar background
    const levels = 5
    ctx.strokeStyle = "#475569" // slate-600
    ctx.fillStyle = "rgba(51, 65, 85, 0.3)" // slate-700 with opacity

    for (let i = 1; i <= levels; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * (i / levels), 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw axes
    const numSkills = skills.length
    const angleStep = (Math.PI * 2) / numSkills

    ctx.strokeStyle = "#64748b" // slate-500
    ctx.fillStyle = "#f8fafc" // slate-50
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2 // Start from top

      // Draw axis line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
      ctx.stroke()

      // Draw skill label
      const labelX = centerX + (radius + 15) * Math.cos(angle)
      const labelY = centerY + (radius + 15) * Math.sin(angle)
      ctx.fillText(skills[i].name, labelX, labelY)
    }

    // Draw skill data
    ctx.fillStyle = "rgba(20, 184, 166, 0.3)" // teal-500 with opacity
    ctx.strokeStyle = "rgb(20, 184, 166)" // teal-500
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2 // Start from top
      const skillRadius = radius * (skills[i].level / 100)

      const x = centerX + skillRadius * Math.cos(angle)
      const y = centerY + skillRadius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    // Close the path
    const firstAngle = -Math.PI / 2
    const firstSkillRadius = radius * (skills[0].level / 100)
    ctx.lineTo(centerX + firstSkillRadius * Math.cos(firstAngle), centerY + firstSkillRadius * Math.sin(firstAngle))

    ctx.fill()
    ctx.stroke()

    // Draw data points
    ctx.fillStyle = "rgb(20, 184, 166)" // teal-500

    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const skillRadius = radius * (skills[i].level / 100)

      const x = centerX + skillRadius * Math.cos(angle)
      const y = centerY + skillRadius * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [skills])

  return <canvas ref={canvasRef} className="max-w-full" />
}


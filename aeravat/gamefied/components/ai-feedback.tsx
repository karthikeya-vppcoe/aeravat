import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIFeedbackProps {
  feedback: string
  suggestions?: string[]
  onClose: () => void
}

export function AIFeedback({ feedback, suggestions, onClose }: AIFeedbackProps) {
  return (
    <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-teal-400"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
          <h3 className="font-medium text-teal-400">AI Feedback</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-sm">{feedback}</p>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-teal-400">Suggestions:</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


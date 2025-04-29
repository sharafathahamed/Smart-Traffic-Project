"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

export default function ProcessingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Initializing...")

  useEffect(() => {
    const statuses = [
      "Initializing...",
      "Analyzing frames...",
      "Detecting vehicles...",
      "Identifying emergency vehicles...",
      "Calculating vehicle density...",
      "Determining optimal signal timing...",
      "Generating results...",
      "Complete!",
    ]

    let currentStep = 0

    // Simulate processing steps
    const interval = setInterval(() => {
      if (currentStep < statuses.length - 1) {
        currentStep++
        setStatus(statuses[currentStep])
        setProgress(Math.round((currentStep / (statuses.length - 1)) * 100))
      } else {
        clearInterval(interval)
        // Navigate to simulation page after processing is complete
        setTimeout(() => {
          router.push("/simulation")
        }, 1000)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="container max-w-2xl py-20 flex flex-col items-center">
      <div className="w-full text-center mb-12">
        <h1 className="text-3xl font-bold mb-6">Processing Your Media</h1>
        <p className="text-muted-foreground mb-8">
          Our AI is analyzing the traffic patterns and vehicle density. This may take a few moments.
        </p>
      </div>

      <div className="w-full mb-8">
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0%</span>
          <span>{progress}%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-lg font-medium">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>{status}</span>
      </div>
    </div>
  )
}

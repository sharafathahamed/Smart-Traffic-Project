"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, ArrowRight } from "lucide-react"
import TrafficLight from "@/components/traffic-light"
import { generateMockTrafficData } from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"

interface TrafficData {
  lanes: {
    id: number
    vehicleCount: number
    hasEmergencyVehicle: boolean
    density: "high" | "medium" | "low"
    allocatedTime: number
  }[]
}

export default function SimulationPage() {
  const router = useRouter()
  const [isRunning, setIsRunning] = useState(false)
  const [currentLane, setCurrentLane] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Load configuration and generate mock data
  useEffect(() => {
    const configStr = localStorage.getItem("trafficConfig")
    if (!configStr) {
      router.push("/")
      return
    }

    const config = JSON.parse(configStr)

    // Simulate API call to Flask server
    const simulateApiCall = async () => {
      setLoading(true)

      // Simulate progress updates
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock data based on configuration
      const data = generateMockTrafficData(config.laneCount, config.highThreshold, config.mediumThreshold)

      setTrafficData(data)
      setProcessingProgress(100)

      // Small delay to show 100% before removing progress bar
      setTimeout(() => {
        setLoading(false)
        clearInterval(interval)
      }, 500)
    }

    simulateApiCall()
  }, [router])

  // Start simulation when data is loaded
  useEffect(() => {
    if (trafficData && !loading) {
      startSimulation()
    }
  }, [trafficData, loading])

  const startSimulation = () => {
    if (!trafficData) return

    setIsRunning(true)
    setCurrentLane(0)
    setTimeRemaining(trafficData.lanes[0].allocatedTime)
    setSimulationComplete(false)
  }

  const pauseSimulation = () => {
    setIsRunning(false)
  }

  const resetSimulation = () => {
    if (!trafficData) return

    setIsRunning(false)
    setCurrentLane(0)
    setTimeRemaining(trafficData.lanes[0].allocatedTime)
    setSimulationComplete(false)
  }

  // Timer effect
  useEffect(() => {
    if (!isRunning || !trafficData) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next lane or complete simulation
          if (currentLane < trafficData.lanes.length - 1) {
            const nextLane = currentLane + 1
            setCurrentLane(nextLane)
            return trafficData.lanes[nextLane].allocatedTime
          } else {
            clearInterval(timer)
            setIsRunning(false)
            setSimulationComplete(true)
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, currentLane, trafficData])

  if (loading) {
    return (
      <div className="container max-w-2xl py-20 flex flex-col items-center">
        <div className="w-full text-center mb-12">
          <h1 className="text-3xl font-bold mb-6">Processing Traffic Data</h1>
          <p className="text-muted-foreground mb-8">
            Analyzing traffic patterns and vehicle density using YOLO model...
          </p>
        </div>

        <div className="w-full mb-8">
          <Progress value={processingProgress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Detecting vehicles</span>
            <span>{processingProgress}%</span>
          </div>
        </div>
      </div>
    )
  }

  if (!trafficData) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Error Loading Data</h1>
        <p>Failed to load traffic data. Please return to the home page and try again.</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Return Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Traffic Light Simulation</h1>
      <p className="text-muted-foreground mb-8">
        Watch the simulation of traffic light changes based on the analyzed data. Each lane is allocated time according
        to its vehicle density and emergency vehicle presence.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Traffic Lights</h2>
            <div className="grid grid-cols-2 gap-6">
              {trafficData.lanes.map((lane, index) => (
                <div key={index} className="flex flex-col items-center">
                  <h3 className="font-medium mb-2">Lane {lane.id}</h3>
                  <TrafficLight
                    active={currentLane === index}
                    state={currentLane === index ? (timeRemaining > 3 ? "green" : "yellow") : "red"}
                  />
                  <div className="mt-2 text-sm">
                    {currentLane === index ? (
                      <span className="font-bold">{timeRemaining}s</span>
                    ) : (
                      <span className="text-muted-foreground">Waiting</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lane Information</h2>
            <div className="space-y-4">
              {trafficData.lanes.map((lane, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border ${currentLane === index ? "bg-primary/10 border-primary" : ""}`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Lane {lane.id}</span>
                    <span className="font-medium">{lane.vehicleCount} vehicles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={lane.hasEmergencyVehicle ? "text-red-500 font-medium" : "text-muted-foreground"}>
                      {lane.hasEmergencyVehicle ? "Emergency vehicle detected" : "No emergency vehicles"}
                    </span>
                    <span className="text-muted-foreground">{lane.allocatedTime}s allocated</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {isRunning ? (
            <Button onClick={pauseSimulation} variant="outline" className="gap-2">
              <Pause className="h-4 w-4" /> Pause
            </Button>
          ) : (
            <Button onClick={startSimulation} variant="outline" className="gap-2" disabled={simulationComplete}>
              <Play className="h-4 w-4" /> {simulationComplete ? "Simulation Complete" : "Start"}
            </Button>
          )}
          <Button onClick={resetSimulation} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>

        <Button onClick={() => router.push("/results")} className="gap-2" disabled={!simulationComplete && isRunning}>
          View Results <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

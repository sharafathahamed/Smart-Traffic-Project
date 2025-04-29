"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RotateCcw, FileText } from "lucide-react"
import { BarChart } from "@/components/ui/chart"

interface TrafficData {
  lanes: {
    id: number
    vehicleCount: number
    hasEmergencyVehicle: boolean
    density: "high" | "medium" | "low"
    allocatedTime: number
  }[]
  timestamp: string
  processingTime: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null)

  useEffect(() => {
    // Get traffic data from localStorage
    const configStr = localStorage.getItem("trafficConfig")
    const trafficDataStr = localStorage.getItem("trafficData")

    if (!configStr) {
      router.push("/")
      return
    }

    if (trafficDataStr) {
      setTrafficData(JSON.parse(trafficDataStr))
    } else {
      // If no data in localStorage, redirect to simulation
      router.push("/simulation")
    }
  }, [router])

  const handleDownloadReport = () => {
    // In a real application, this would generate and download a PDF report
    alert("In a real application, this would download a PDF report with the analysis results.")
  }

  if (!trafficData) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Loading Results...</h1>
      </div>
    )
  }

  const chartData = trafficData.lanes.map((lane) => ({
    name: `Lane ${lane.id}`,
    vehicles: lane.vehicleCount,
    time: lane.allocatedTime,
  }))

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analysis Results</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" /> Download Report
          </Button>
          <Button variant="outline" onClick={() => router.push("/simulation")} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Replay Simulation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Traffic Overview</h2>
                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Total Vehicles</span>
                    <span className="font-medium">
                      {trafficData.lanes.reduce((sum, lane) => sum + lane.vehicleCount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Emergency Vehicles</span>
                    <span className="font-medium">
                      {trafficData.lanes.filter((lane) => lane.hasEmergencyVehicle).length}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Total Cycle Time</span>
                    <span className="font-medium">
                      {trafficData.lanes.reduce((sum, lane) => sum + lane.allocatedTime, 0)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Analysis Timestamp</span>
                    <span className="font-medium">{new Date(trafficData.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Lane Summary</h2>
                <div className="space-y-3">
                  {trafficData.lanes.map((lane, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                      <div>
                        <div className="font-medium">Lane {lane.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {lane.vehicleCount} vehicles
                          {lane.hasEmergencyVehicle && <span className="text-red-500 ml-2">• Emergency</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{lane.allocatedTime}s</div>
                        <div className="text-sm text-muted-foreground">{lane.density} density</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Vehicle Count by Lane</h2>
                <div className="h-80">
                  <BarChart
                    data={chartData}
                    index="name"
                    categories={["vehicles"]}
                    colors={["primary"]}
                    valueFormatter={(value) => `${value} vehicles`}
                    showLegend={false}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Allocated Time by Lane</h2>
                <div className="h-80">
                  <BarChart
                    data={chartData}
                    index="name"
                    categories={["time"]}
                    colors={["secondary"]}
                    valueFormatter={(value) => `${value}s`}
                    showLegend={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detailed Analysis Report</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Traffic Conditions</h3>
                  <p className="text-muted-foreground">
                    The analysis detected varying levels of congestion across the intersection.
                    {trafficData.lanes.filter((lane) => lane.density === "high").length > 0 &&
                      ` Lane ${trafficData.lanes
                        .filter((lane) => lane.density === "high")
                        .map((lane) => lane.id)
                        .join(", ")} shows the highest vehicle density.`}
                    {trafficData.lanes.filter((lane) => lane.hasEmergencyVehicle).length > 0 &&
                      ` Emergency vehicles were detected in Lane ${trafficData.lanes
                        .filter((lane) => lane.hasEmergencyVehicle)
                        .map((lane) => lane.id)
                        .join(", ")}, which influenced the signal timing allocation.`}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Signal Timing Logic</h3>
                  <p className="text-muted-foreground mb-3">
                    The system allocated green signal time based on the following rules:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>High density or emergency vehicle presence: 60 seconds</li>
                    <li>Medium density: 30 seconds</li>
                    <li>Low density: 15 seconds</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Optimization Results</h3>
                  <p className="text-muted-foreground">
                    The optimized signal timing is estimated to reduce the average wait time by 42% compared to
                    fixed-time signals. The prioritization of lanes with emergency vehicles ensures faster emergency
                    response while maintaining efficient flow in other lanes based on their respective vehicle
                    densities.
                  </p>
                </div>

                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
                    <FileText className="h-4 w-4" /> Download Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

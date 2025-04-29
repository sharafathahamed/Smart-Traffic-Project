"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FileUploader from "@/components/file-uploader"
import { Slider } from "@/components/ui/slider"

export default function Home() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Lane configuration
  const [laneCount, setLaneCount] = useState<number>(4)
  const [highThreshold, setHighThreshold] = useState<number>(15)
  const [mediumThreshold, setMediumThreshold] = useState<number>(8)
  const [apiEndpoint, setApiEndpoint] = useState<string>("http://localhost:5000/analyze")

  const handleFileChange = (uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) {
      setFiles([])
      setPreview(null)
      setFileType(null)
      return
    }

    const file = uploadedFiles[0]

    // Check file type
    if (file.type.startsWith("image/")) {
      setFileType("image")
    } else if (file.type.startsWith("video/")) {
      setFileType("video")
    } else {
      setError("Please upload an image or video file.")
      return
    }

    setError(null)
    setFiles([file])

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload a file first.")
      return
    }

    setLoading(true)

    try {
      // In a real application, we would upload the file to the Flask server
      // For now, we'll simulate the API call and store the configuration in localStorage

      // Store configuration in localStorage
      localStorage.setItem(
        "trafficConfig",
        JSON.stringify({
          laneCount,
          highThreshold,
          mediumThreshold,
          apiEndpoint,
          fileType,
        }),
      )

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to simulation page
      router.push("/simulation")
    } catch (err) {
      setError("Failed to process the file. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-5xl py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Smart Traffic Light Control System</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Upload traffic intersection footage and our AI will analyze vehicle density, detect emergency vehicles, and
          optimize traffic light timing for maximum efficiency.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="upload" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload Media</TabsTrigger>
          <TabsTrigger value="config">System Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardContent className="pt-6">
              <FileUploader onFilesSelected={handleFileChange} />

              <div className="text-sm text-muted-foreground mt-4">
                <p>Note: Browser security prevents direct access to local file paths like:</p>
                <code className="bg-muted p-1 rounded text-xs block mt-1 mb-1">
                  C:\Users\shara\Desktop\project\images
                </code>
                <p>Please use the file selector or drag and drop instead.</p>
              </div>

              {preview && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Preview</h2>
                  <div className="border rounded-lg overflow-hidden bg-muted/30 flex justify-center">
                    {fileType === "image" ? (
                      <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-[300px] object-contain" />
                    ) : (
                      <video src={preview} controls className="max-h-[300px] w-full" />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="laneCount">Number of Lanes (3-4)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="laneCount"
                    min={3}
                    max={4}
                    step={1}
                    value={[laneCount]}
                    onValueChange={(value) => setLaneCount(value[0])}
                  />
                  <span className="w-8 text-center">{laneCount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="highThreshold">High Traffic Threshold (vehicles)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="highThreshold"
                    min={10}
                    max={30}
                    step={1}
                    value={[highThreshold]}
                    onValueChange={(value) => setHighThreshold(value[0])}
                  />
                  <span className="w-8 text-center">{highThreshold}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Lanes with {highThreshold}+ vehicles will get 60 seconds of green time
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediumThreshold">Medium Traffic Threshold (vehicles)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="mediumThreshold"
                    min={5}
                    max={15}
                    step={1}
                    value={[mediumThreshold]}
                    onValueChange={(value) => setMediumThreshold(value[0])}
                  />
                  <span className="w-8 text-center">{mediumThreshold}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Lanes with {mediumThreshold}-{highThreshold - 1} vehicles will get 30 seconds of green time
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint (Flask Server)</Label>
                <Input
                  id="apiEndpoint"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="http://localhost:5000/analyze"
                />
                <p className="text-xs text-muted-foreground">The endpoint where the YOLO model is running</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={files.length === 0 || loading} size="lg" className="gap-2">
          {loading ? "Processing..." : "Analyze Traffic"}
          {!loading && <Upload className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

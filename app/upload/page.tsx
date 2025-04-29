"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FileUploader from "@/components/file-uploader"

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const handleSubmit = () => {
    if (files.length === 0) {
      setError("Please upload a file first.")
      return
    }

    // In a real application, you would upload the file to the server here
    // For now, we'll just navigate to the processing page
    router.push("/processing")
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Upload Traffic Media</h1>
      <p className="text-muted-foreground mb-8">
        Upload images or videos of traffic intersections for analysis. Our AI will detect vehicles, identify emergency
        vehicles, and suggest optimal traffic light timing.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6 mb-8">
        <FileUploader onFilesSelected={handleFileChange} />

        <div className="text-sm text-muted-foreground mt-4">
          <p>Note: Browser security prevents direct access to local file paths like:</p>
          <code className="bg-muted p-1 rounded text-xs block mt-1 mb-1">C:\Users\shara\Desktop\project\images</code>
          <p>Please use the file selector or drag and drop instead.</p>
        </div>
      </Card>

      {preview && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="border rounded-lg overflow-hidden bg-muted/30 flex justify-center">
            {fileType === "image" ? (
              <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-[400px] object-contain" />
            ) : (
              <video src={preview} controls className="max-h-[400px] w-full" />
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={files.length === 0} size="lg" className="gap-2">
          Process Media <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

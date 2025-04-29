"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileVideo, FileImage, Upload } from "lucide-react"

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
}

export default function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles)
    },
    [onFilesSelected],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "video/*": [".mp4", ".mov", ".avi"],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
      }`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="bg-muted rounded-full p-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="font-medium mb-1">Drag and drop your files here or click to browse</p>
          <p className="text-sm text-muted-foreground">Supported formats: JPEG, PNG, MP4, MOV, AVI</p>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileImage className="h-5 w-5" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileVideo className="h-5 w-5" />
            <span>Videos</span>
          </div>
        </div>
      </div>
    </div>
  )
}

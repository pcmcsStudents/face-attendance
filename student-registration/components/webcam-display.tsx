"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RotateCcw } from "lucide-react"
import type { ReactNode, RefObject } from "react"

interface WebcamDisplayProps {
  videoRef: RefObject<HTMLVideoElement>
  canvasRef: RefObject<HTMLCanvasElement>
  children?: ReactNode
  onCapture?: (photoData: string) => void
  onBack?: () => void
}

export function WebcamDisplay({ videoRef, canvasRef, children, onCapture, onBack }: WebcamDisplayProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const photoData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedPhoto(photoData)

        // Stop the camera stream
        const stream = video.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        setIsStreaming(false)
      }
    }
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null)
    startCamera()
  }, [startCamera])

  const confirmPhoto = useCallback(() => {
    if (capturedPhoto && onCapture) {
      onCapture(capturedPhoto)
    }
  }, [capturedPhoto, onCapture])

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Take Your Photo</h2>
        <p className="text-gray-600">Position yourself in the center of the frame and click capture when ready</p>
      </div>

      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3] w-full max-w-2xl mx-auto">
        {/* Video element for webcam feed */}
        <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" />

        {/* Canvas overlay for face detection outlines */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Instruction overlay container */}
        {children}
      </div>

      <div className="flex justify-center gap-4">
        {isStreaming && (
          <Button onClick={capturePhoto} size="lg" className="gap-2">
            <Camera className="w-5 h-5" />
            Capture Photo
          </Button>
        )}

        {capturedPhoto && (
          <>
            <Button onClick={retakePhoto} variant="outline" size="lg" className="gap-2 bg-transparent">
              <RotateCcw className="w-5 h-5" />
              Retake
            </Button>
            {onCapture && (
              <Button onClick={confirmPhoto} size="lg">
                Use This Photo
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between">
        {onBack && (
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
        )}
      </div>
    </div>
  )
}

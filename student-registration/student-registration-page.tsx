"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { WebcamDisplay } from "./components/webcam-display"
import { InstructionOverlay } from "./components/instruction-overlay"
import { ProgressIndicator } from "./components/progress-indicator"
import { RegistrationForm } from "./components/registration-form"
import { Button } from "@/components/ui/button"
import axios from "axios"
import type { FormEvent } from "react"

export default function StudentRegistrationPage() {
  // Required State (using useState)
  const [instruction, setInstruction] = useState<string>("Loading AI Models...")
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false)
  const [isCaptureComplete, setIsCaptureComplete] = useState<boolean>(false)
  const [studentName, setStudentName] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Required Refs (using useRef)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const descriptorsRef = useRef<any[]>([])

  // Total steps for the progress indicator
  const totalSteps = 5

  // Step descriptions for better UX
  const stepInstructions = [
    "Loading AI Models...",
    "Position your face in the center",
    "Look straight ahead and hold still",
    "Turn your head slightly to the left",
    "Turn your head slightly to the right",
  ]

  // Required Handler Functions
  const handleCapturePose = async () => {
    try {
      // Simulate face detection and descriptor extraction
      // In a real implementation, this would use a face detection library
      // like face-api.js or MediaPipe

      if (!videoRef.current || !canvasRef.current) {
        console.error("Video or canvas ref not available")
        return
      }

      // Simulate face detection processing
      setInstruction("Processing face data...")

      // Simulate async face detection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock face descriptor data
      const mockDescriptor = {
        step: currentStep + 1,
        timestamp: Date.now(),
        pose: stepInstructions[currentStep + 1] || "Unknown pose",
        // In real implementation, this would be actual face descriptor data
        data: new Array(128).fill(0).map(() => Math.random()),
      }

      // Save descriptor to ref (won't cause re-render)
      descriptorsRef.current.push(mockDescriptor)

      // Advance to next step
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      // Update instruction for next step or completion
      if (nextStep < totalSteps) {
        setInstruction(stepInstructions[nextStep])
      } else {
        setInstruction("All poses captured successfully!")
        setIsCaptureComplete(true)
      }

      console.log("Captured descriptor:", mockDescriptor)
      console.log("Total descriptors:", descriptorsRef.current.length)
    } catch (error) {
      console.error("Error capturing pose:", error)
      setInstruction("Error capturing pose. Please try again.")
    }
  }

  const handleNameChange = (value: string) => {
    setStudentName(value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!studentName.trim()) {
      alert("Please enter your name")
      return
    }

    if (descriptorsRef.current.length === 0) {
      alert("No face data captured. Please complete the face capture process first.")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for submission
      const registrationData = {
        studentName: studentName.trim(),
        faceDescriptors: descriptorsRef.current,
        timestamp: new Date().toISOString(),
        totalSteps: totalSteps,
        completedSteps: currentStep,
      }

      console.log("Submitting registration data:", registrationData)

      // Make axios call to backend
      // Replace with your actual API endpoint
      const response = await axios.post("/api/register-student", registrationData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      })

      console.log("Registration successful:", response.data)

      // Handle successful registration
      setInstruction("Registration completed successfully!")
      alert(`Registration successful! Welcome, ${studentName}!`)

      // Reset form for next registration
      resetRegistration()
    } catch (error) {
      console.error("Registration failed:", error)

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          alert(`Registration failed: ${error.response.data?.message || "Server error"}`)
        } else if (error.request) {
          // Request was made but no response received
          alert("Registration failed: No response from server. Please check your connection.")
        } else {
          // Something else happened
          alert(`Registration failed: ${error.message}`)
        }
      } else {
        alert("Registration failed: An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to reset registration state
  const resetRegistration = () => {
    setInstruction("Loading AI Models...")
    setCurrentStep(0)
    setIsFaceDetected(false)
    setIsCaptureComplete(false)
    setStudentName("")
    setIsSubmitting(false)
    descriptorsRef.current = []
  }

  // Helper function to start the capture process
  const startCapture = () => {
    setInstruction(stepInstructions[1])
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
              <p className="text-gray-600">Complete face capture and registration process</p>
            </div>

            {/* Progress Indicator */}
            <ProgressIndicator totalSteps={totalSteps} currentStep={currentStep} />

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Webcam Display Section */}
              <div className="space-y-4">
                <WebcamDisplay videoRef={videoRef} canvasRef={canvasRef}>
                  <InstructionOverlay instruction={instruction} />
                </WebcamDisplay>

                {/* Capture Controls */}
                <div className="flex justify-center gap-4">
                  {currentStep === 0 && (
                    <Button onClick={startCapture} size="lg">
                      Start Face Capture
                    </Button>
                  )}

                  {currentStep > 0 && currentStep < totalSteps && (
                    <Button onClick={handleCapturePose} size="lg" disabled={isSubmitting}>
                      Capture Pose {currentStep}
                    </Button>
                  )}

                  {currentStep > 0 && (
                    <Button onClick={resetRegistration} variant="outline" size="lg" disabled={isSubmitting}>
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Registration Form Section */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>
                  <p className="text-sm text-gray-600">Complete face capture first, then enter your details</p>
                </div>

                <RegistrationForm
                  isFormActive={isCaptureComplete}
                  isSubmitting={isSubmitting}
                  studentName={studentName}
                  onNameChange={handleNameChange}
                  onSubmit={handleSubmit}
                />

                {/* Debug Information */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
                  <h3 className="font-semibold mb-2">Debug Info:</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      Current Step: {currentStep}/{totalSteps}
                    </p>
                    <p>Face Detected: {isFaceDetected ? "Yes" : "No"}</p>
                    <p>Capture Complete: {isCaptureComplete ? "Yes" : "No"}</p>
                    <p>Descriptors Captured: {descriptorsRef.current.length}</p>
                    <p>Student Name: {studentName || "Not entered"}</p>
                    <p>Submitting: {isSubmitting ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

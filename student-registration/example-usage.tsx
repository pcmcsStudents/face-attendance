"use client"

import { useState } from "react"
import { RegistrationForm } from "./components/registration-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Camera, User } from "lucide-react"
import type { FormEvent } from "react"

export default function RegistrationFormExample() {
  const [studentName, setStudentName] = useState("")
  const [isFormActive, setIsFormActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false)
  const [faceCaptureDone, setFaceCaptureDone] = useState(false)

  const handleNameChange = (value: string) => {
    setStudentName(value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsRegistrationComplete(true)
  }

  const simulateFaceCapture = async () => {
    setFaceCaptureDone(false)
    setIsFormActive(false)

    // Simulate face capture process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setFaceCaptureDone(true)
    setIsFormActive(true)
  }

  const resetDemo = () => {
    setStudentName("")
    setIsFormActive(false)
    setIsSubmitting(false)
    setIsRegistrationComplete(false)
    setFaceCaptureDone(false)
  }

  if (isRegistrationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Registration Complete!</h2>
              <p className="text-gray-600">
                Welcome, {studentName}! Your registration has been successfully submitted.
              </p>
              <Button onClick={resetDemo} className="w-full">
                Start New Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Registration Form Demo</h1>
          <p className="text-gray-600">Final user input and submission after face capture completion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Face Capture Simulation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Face Capture Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                {faceCaptureDone ? (
                  <div className="text-center space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="text-sm text-gray-600">Face capture completed successfully</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Face capture simulation area</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={faceCaptureDone ? "default" : "secondary"}>
                  {faceCaptureDone ? "Completed" : "Pending"}
                </Badge>
                <Button onClick={simulateFaceCapture} disabled={isSubmitting} variant="outline">
                  {faceCaptureDone ? "Recapture" : "Start Face Capture"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Student Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationForm
                isFormActive={isFormActive}
                isSubmitting={isSubmitting}
                studentName={studentName}
                onNameChange={handleNameChange}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </div>

        {/* Component Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Form States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Form Active:</span>
                <Badge variant={isFormActive ? "default" : "secondary"}>{isFormActive ? "Enabled" : "Disabled"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Submitting:</span>
                <Badge variant={isSubmitting ? "destructive" : "secondary"}>
                  {isSubmitting ? "Processing" : "Ready"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Face Capture:</span>
                <Badge variant={faceCaptureDone ? "default" : "secondary"}>
                  {faceCaptureDone ? "Complete" : "Pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Component Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Controlled input field with validation</li>
                <li>• Disabled states based on form activity</li>
                <li>• Loading spinner during submission</li>
                <li>• Full-width submit button</li>
                <li>• Proper form submission handling</li>
                <li>• Accessible labels and form structure</li>
                <li>• Shadcn/ui component integration</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 rounded p-4 overflow-x-auto">
              {`<RegistrationForm
  isFormActive={true}
  isSubmitting={false}
  studentName="John Doe"
  onNameChange={(value) => setStudentName(value)}
  onSubmit={(event) => handleSubmit(event)}
/>`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

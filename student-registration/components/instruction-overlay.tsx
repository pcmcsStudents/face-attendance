"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Camera, FileText, UserCheck } from "lucide-react"

interface InstructionOverlayProps {
  instruction: string
  isVisible: boolean
  onContinue: () => void
}

export function InstructionOverlay({ instruction, isVisible, onContinue }: InstructionOverlayProps) {
  // Only render if instruction is not null or empty and isVisible is true
  if (!instruction || instruction.trim() === "" || !isVisible) {
    return null
  }

  const instructions = [
    {
      icon: Camera,
      title: "Photo Capture",
      description: "We'll take a clear photo of you for your student ID",
    },
    {
      icon: FileText,
      title: "Personal Information",
      description: "Fill in your basic details and program information",
    },
    {
      icon: UserCheck,
      title: "Verification",
      description: "Review and confirm all your information",
    },
    {
      icon: CheckCircle,
      title: "Complete",
      description: "Your registration will be processed and confirmed",
    },
  ]

  return (
    <div className="w-full space-y-8">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/50 rounded-lg px-6 py-3">
          <p className="text-white text-center text-base font-medium whitespace-nowrap">{instruction}</p>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Welcome! Let's get you registered in just a few simple steps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {instructions.map((instructionItem, index) => {
          const Icon = instructionItem.icon
          return (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">{instructionItem.title}</h3>
                <p className="text-sm text-gray-600">{instructionItem.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Before you begin:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure you have good lighting for your photo</li>
          <li>• Have your student ID number ready</li>
          <li>• Know your program of study</li>
          <li>• Use a valid email address</li>
        </ul>
      </div>

      <div className="text-center">
        <Button onClick={onContinue} size="lg" className="px-8">
          Start Registration
        </Button>
      </div>
    </div>
  )
}

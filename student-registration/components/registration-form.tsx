"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { FormEvent } from "react"

interface RegistrationFormProps {
  isFormActive: boolean
  isSubmitting: boolean
  studentName: string
  onNameChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function RegistrationForm({
  isFormActive,
  isSubmitting,
  studentName,
  onNameChange,
  onSubmit,
}: RegistrationFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Name Input */}
      <div className="space-y-2">
        <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
          Student Name
        </Label>
        <Input
          id="studentName"
          type="text"
          value={studentName}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={!isFormActive}
          placeholder="Enter your full name"
          className="w-full"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={!isFormActive || isSubmitting || !studentName.trim()} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Registration"
        )}
      </Button>
    </form>
  )
}

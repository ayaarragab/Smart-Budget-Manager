"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"
import { useMockData } from "@/components/mock-data-provider"

export default function ApiStatusBanner() {
  const { useMockData: usingMockData } = useMockData()
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show the banner if we're using mock data
    if (usingMockData) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [usingMockData])

  if (!visible || dismissed) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4 bg-yellow-50 border-yellow-200">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="text-yellow-800">
          <p className="font-medium">API Connection Issue</p>
          <p className="text-sm">
            Unable to connect to the backend API. The app is currently running with demo data. Your changes won't be
            saved until the connection is restored.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setDismissed(true)} className="text-yellow-800">
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

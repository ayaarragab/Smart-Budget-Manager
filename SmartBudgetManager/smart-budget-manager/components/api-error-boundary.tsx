"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ApiErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ApiErrorBoundary({ children, fallback }: ApiErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Add global error handler for fetch errors
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        return response
      } catch (error) {
        console.error("Global fetch error:", error)
        setHasError(true)
        setError(error as Error)
        throw error
      }
    }

    return () => {
      // Restore original fetch when component unmounts
      window.fetch = originalFetch
    }
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setError(null)
    window.location.reload()
  }

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="p-4 max-w-md mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Error</AlertTitle>
          <AlertDescription>
            <p className="mb-4">There was a problem connecting to the server. This could be due to:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Network connectivity issues</li>
              <li>The server being unavailable</li>
              <li>CORS policy restrictions</li>
            </ul>
            <p className="mb-4">Error details: {error?.message || "Unknown error"}</p>
            <Button onClick={handleRetry} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}

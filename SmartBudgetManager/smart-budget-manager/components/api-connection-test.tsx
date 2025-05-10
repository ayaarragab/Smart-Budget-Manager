"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

interface ApiConnectionTestProps {
  apiUrl: string
}

export default function ApiConnectionTest({ apiUrl }: ApiConnectionTestProps) {
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking")
  const [message, setMessage] = useState<string>("")
  const [isVisible, setIsVisible] = useState(true)

  const checkConnection = async () => {
    setStatus("checking")
    setMessage("Testing connection to API...")

    try {
      const response = await fetch(apiUrl, {
        method: "OPTIONS",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setStatus("success")
        setMessage("Successfully connected to the API")
      } else {
        setStatus("error")
        setMessage(`API responded with status: ${response.status} ${response.statusText}`)
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(`Failed to connect to API: ${error.message}`)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [apiUrl])

  if (!isVisible) return null

  return (
    <Alert
      variant={status === "success" ? "default" : status === "error" ? "destructive" : "default"}
      className={`mb-4 ${
        status === "success"
          ? "bg-green-50 border-green-200"
          : status === "checking"
            ? "bg-blue-50 border-blue-200"
            : ""
      }`}
    >
      {status === "success" ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : status === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      )}
      <AlertTitle>
        {status === "success"
          ? "API Connection Successful"
          : status === "error"
            ? "API Connection Failed"
            : "Checking API Connection"}
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>{message}</span>
        <div className="flex gap-2">
          {status === "error" && (
            <Button size="sm" variant="outline" onClick={checkConnection}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setIsVisible(false)}>
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

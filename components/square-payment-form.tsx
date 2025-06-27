"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface SquarePaymentFormProps {
  amount: number
  onPaymentSuccess: (paymentResult: any) => void
  onPaymentError: (error: Error) => void
  customerName: string
  customerEmail: string
  disabled?: boolean
}

declare global {
  interface Window {
    Square: any
  }
}

/* -------------------------------------------------------------------------- */
/*                               Helper: logger                               */
/* -------------------------------------------------------------------------- */

const useDebug = () => {
  const [logs, setLogs] = useState<string[]>([])
  const log = (msg: string) => {
    const entry = `${new Date().toLocaleTimeString()}: ${msg}`
    // eslint-disable-next-line no-console
    console.log(`[Square Debug] ${entry}`)
    setLogs((prev) => [...prev, entry])
  }
  return { logs, log }
}

/* -------------------------------------------------------------------------- */
/*                         Main Component – Default Export                     */
/* -------------------------------------------------------------------------- */

export default function SquarePaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  customerName,
  customerEmail,
  disabled = false,
}: SquarePaymentFormProps) {
  const { toast } = useToast()
  const { logs, log } = useDebug()

  /* ------------------------- UI / State handling ------------------------- */
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [card, setCard] = useState<any>(null)
  const [payments, setPayments] = useState<any>(null)
  const [cardholderName, setCardholderName] = useState(customerName || "")
  const [error, setError] = useState<string | null>(null)

  /* ------------------------ DOM container ref logic ----------------------- */
  const containerRef = useRef<HTMLDivElement>(null)

  /* ---------------------------- Initialization ---------------------------- */
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      log("Component mounted, beginning initialization")
      const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
      const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
      log(`App ID exists: ${!!applicationId}`)
      log(`Location ID exists: ${!!locationId}`)

      /* ---- wait for container element ---- */
      let tries = 0
      const maxTries = 15
      while (!containerRef.current && tries < maxTries) {
        log(`Waiting for container element (try ${tries + 1}/${maxTries})`)
        // 200 ms between tries
        await new Promise((r) => setTimeout(r, 200))
        tries++
      }
      if (!containerRef.current || cancelled) {
        setError("Payment container not found. Reload the page and try again.")
        setIsLoading(false)
        return
      }
      log("Container element found!")

      /* ---- wait for Square SDK ---- */
      tries = 0
      const maxSdkTries = 100
      while (!window.Square && tries < maxSdkTries) {
        log(`Waiting for Square SDK (try ${tries + 1}/${maxSdkTries})`)
        await new Promise((r) => setTimeout(r, 150))
        tries++
      }
      if (!window.Square || cancelled) {
        setError("Square SDK failed to load. Please refresh the page.")
        setIsLoading(false)
        return
      }
      log("Square SDK loaded")

      if (!applicationId || !locationId) {
        setError("Missing Square configuration. Contact support.")
        setIsLoading(false)
        return
      }

      try {
        const paymentsInstance = window.Square.payments(applicationId, locationId)
        log("Payments instance created")
        const cardInstance = await paymentsInstance.card()
        log("Card instance created, attaching…")
        await cardInstance.attach(containerRef.current!)
        log("Card attached ✔️")

        if (!cancelled) {
          setPayments(paymentsInstance)
          setCard(cardInstance)
          setIsLoading(false)
          log("Initialization complete ✅")
        }
      } catch (err: any) {
        log(`Initialization error: ${err.message}`)
        setError(err.message)
        setIsLoading(false)
        onPaymentError(err)
      }
    }

    init()
    return () => {
      cancelled = true
    }
    // we only want this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ------------------------------------------------------------------------ */
  /*                                Handlers                                  */
  /* ------------------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!card || !payments) return

    if (!cardholderName.trim()) {
      toast({
        title: "Missing name",
        description: "Enter the name on the card.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    log("Tokenizing card…")

    try {
      const tokenResult = await card.tokenize()
      if (tokenResult.status !== "OK") {
        throw new Error(tokenResult.errors?.[0]?.detail || "Card validation failed")
      }

      log("Tokenization successful, calling payments API")
      const res = await fetch("/api/square/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          amount: Math.round(amount * 100),
          currency: "USD",
          customerDetails: { name: cardholderName, email: customerEmail },
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Payment failed")

      log("Payment processed successfully")
      toast({ title: "Payment successful!", description: "Thank you for your purchase." })
      onPaymentSuccess(data.payment)
    } catch (err: any) {
      log(`Payment error: ${err.message}`)
      toast({
        title: "Payment failed",
        description: err.message ?? "Something went wrong.",
        variant: "destructive",
      })
      onPaymentError(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const retry = () => {
    window.location.reload()
  }

  /* ------------------------------------------------------------------------ */
  /*                                 Render                                   */
  /* ------------------------------------------------------------------------ */

  if (error) {
    return <ErrorState message={error} logs={logs} onRetry={retry} />
  }

  if (isLoading) {
    return <LoadingState logs={logs} onRetry={retry} />
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="cardholderName">Name on Card *</Label>
          <Input
            id="cardholderName"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            disabled={disabled || isProcessing}
            className="mt-1"
          />
        </div>

        {/* Card container */}
        <div>
          <Label>Card Information *</Label>
          <div ref={containerRef} className="mt-1 p-4 border-2 border-gray-300 rounded-lg bg-white min-h-[120px]" />
          <p className="text-xs mt-2 text-muted-foreground">
            Your payment information is encrypted and processed securely by Square.
          </p>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={disabled || isProcessing || !card}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">Secured by Square</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                       Re-usable Loading & Error states                     */
/* -------------------------------------------------------------------------- */

function LoadingState({ logs, onRetry }: { logs: string[]; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 space-y-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading secure payment form…</p>

      <Details logs={logs} />

      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

function ErrorState({ message, logs, onRetry }: { message: string; logs: string[]; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 space-y-4 text-center">
      <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
      </svg>

      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>

      <Details logs={logs} />

      <Button onClick={onRetry}>Refresh</Button>
    </div>
  )
}

function Details({ logs }: { logs: string[] }) {
  if (!logs.length) return null
  return (
    <details className="text-left text-xs">
      <summary className="cursor-pointer mb-2 font-medium">Debug details</summary>
      <div className="max-h-40 overflow-y-auto p-3 bg-gray-100 rounded">{logs.join("\n")}</div>
    </details>
  )
}

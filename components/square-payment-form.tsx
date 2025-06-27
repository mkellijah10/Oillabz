import { useEffect, useState, useRef, useCallback } from "react"
// ...rest of your imports and code...

export default function SquarePaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  customerName,
  customerEmail,
  disabled = false,
}: SquarePaymentFormProps) {
  // ... your existing states ...

  // Replace containerRef with a ref plus a callback to detect when ready
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerReady, setContainerReady] = useState(false)

  // Callback ref to track when container div is attached
  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      containerRef.current = node
      setContainerReady(true)
    } else {
      setContainerReady(false)
    }
  }, [])

  const { toast } = useToast()

  const addDebugInfo = (message: string) => {
    console.log(`[Square Debug] ${message}`)
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    // Only initialize once container is ready
    if (!containerReady) {
      addDebugInfo("Waiting for container to be ready...")
      return
    }

    addDebugInfo("Container ready, starting initialization...")

    const initializeSquare = async () => {
      try {
        setError(null)

        addDebugInfo("Container element confirmed, checking Square SDK...")

        const squareScript = document.querySelector('script[src*="square.js"]')
        addDebugInfo(`Square script element found: ${!!squareScript}`)

        let sdkRetries = 0
        const maxRetries = 100

        while (!window.Square && sdkRetries < maxRetries) {
          addDebugInfo(`SDK check attempt ${sdkRetries + 1}/${maxRetries}`)
          await new Promise((resolve) => setTimeout(resolve, 200))
          sdkRetries++
        }

        if (!window.Square) {
          throw new Error(`Square SDK failed to load after ${maxRetries} attempts. Please refresh the page.`)
        }

        addDebugInfo("Square SDK loaded successfully!")

        const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID

        if (!applicationId || !locationId) {
          throw new Error("Missing Square configuration. Please contact support.")
        }

        addDebugInfo(`Initializing with App ID: ${applicationId.substring(0, 10)}...`)
        addDebugInfo(`Location ID: ${locationId.substring(0, 10)}...`)

        const paymentsInstance = window.Square.payments(applicationId, locationId)
        addDebugInfo("Square payments instance created")
        setPayments(paymentsInstance)

        addDebugInfo("Creating card instance...")

        const cardInstance = await paymentsInstance.card()
        addDebugInfo("Card instance created successfully")

        addDebugInfo("Attaching card to container...")

        await cardInstance.attach(containerRef.current!)
        addDebugInfo("Card attached to container successfully!")

        setCard(cardInstance)
        setIsLoading(false)
        addDebugInfo("Square payment form fully initialized!")
      } catch (error: any) {
        addDebugInfo(`Initialization error: ${error.message}`)
        console.error("Square initialization error:", error)
        setError(error.message)
        setIsLoading(false)
        onPaymentError(error)
      }
    }

    // Start initialization immediately since containerReady is true
    initializeSquare()

    // no cleanup needed here
  }, [containerReady, onPaymentError])

  // ... rest of your code unchanged ...

  // Update your JSX to use the callback ref here:
  return (
    // ... other JSX above ...
    <div
      ref={containerRefCallback}
      className="mt-1 p-4 border-2 border-gray-300 rounded-lg bg-white min-h-[120px] w-full"
      style={{
        minHeight: "120px",
        width: "100%",
        display: "block",
        position: "relative",
      }}
    />
    // ... rest of JSX ...
  )
}

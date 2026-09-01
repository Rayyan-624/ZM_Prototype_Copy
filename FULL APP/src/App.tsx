import { useState } from "react"
import OnboardingFlow, { type OnboardingUserData } from "./OnboardingFlow"
import CustomerFaceApp from "./CustomerFaceApp"

export default function App() {
  const [stage, setStage] = useState<"onboarding" | "customer_face">("onboarding")
  const [userData, setUserData] = useState<OnboardingUserData | null>(null)

  const handleOnboardingComplete = (data: OnboardingUserData) => {
    console.log("Onboarding completed with user data:", data)
    setUserData(data)
    setStage("customer_face")
  }

  const handleRestartOnboarding = () => {
    setStage("onboarding")
  }

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#111] overflow-hidden">
      {/* Compact Floating Flow Control Pill */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 14,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(6, 45, 36, 0.94)",
          backdropFilter: "blur(12px)",
          padding: "3px 6px 3px 10px",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
        }}
      >
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 800,
            color: "#B4E6D2",
            letterSpacing: "0.03em",
          }}
        >
          {stage === "onboarding" ? "Onboarding" : "App"}
        </span>
        <button
          onClick={() =>
            setStage(stage === "onboarding" ? "customer_face" : "onboarding")
          }
          className="tap-target"
          style={{
            background: "#2FAE68",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "2px 8px",
            fontSize: 9.5,
            fontWeight: 800,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
          }}
          title={stage === "onboarding" ? "Skip to Customer App" : "Restart Onboarding"}
        >
          {stage === "onboarding" ? "Skip ➔" : "↺ Reset"}
        </button>
      </div>

      {stage === "onboarding" ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <CustomerFaceApp
          initialUserData={userData || undefined}
          onRestartOnboarding={handleRestartOnboarding}
        />
      )}
    </div>
  )
}
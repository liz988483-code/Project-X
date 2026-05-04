import React from "react"
import { cn } from "@/lib/utils"
import { Check, Truck, CreditCard, CheckCircle, LucideIcon } from "lucide-react"

export interface Step {
  id: string
  name: string
  icon: LucideIcon
}

interface CheckoutStepsProps {
  steps?: Step[]
  currentStep: string
  className?: string
}

// Default steps for checkout
const defaultSteps: Step[] = [
  { id: 'shipping', name: 'Shipping', icon: Truck },
  { id: 'payment', name: 'Payment', icon: CreditCard },
  { id: 'review', name: 'Review', icon: CheckCircle },
]

export default function CheckoutSteps({ 
  steps = defaultSteps, 
  currentStep, 
  className 
}: CheckoutStepsProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)
  
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = step.id === currentStep
        const isCompleted = index < currentIndex
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                isCompleted 
                  ? "bg-green-500 border-green-500 text-white"
                  : isActive
                  ? "border-blue-500 text-blue-500 bg-blue-50"
                  : "border-gray-300 text-gray-400 bg-gray-50"
              )}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={cn(
                "mt-2 text-sm font-medium text-center",
                isActive ? "text-blue-600" : 
                isCompleted ? "text-green-600" : 
                "text-gray-500"
              )}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2",
                isCompleted ? "bg-green-500" : "bg-gray-300"
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
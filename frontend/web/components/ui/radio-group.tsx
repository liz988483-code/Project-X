import * as React from "react"

const RadioGroupContext = React.createContext<{ value: string; onValueChange: (value: string) => void }>({
  value: "",
  onValueChange: () => {},
})

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ className, value = "", onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value)
  
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange]
  )
  
  return (
    <RadioGroupContext.Provider value={{ value: internalValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={className} {...props} />
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext)
  const isChecked = context.value === value
  
  return (
    <input
      ref={ref}
      type="radio"
      className={`h-4 w-4 border-gray-300 text-primary focus:ring-primary ${className}`}
      checked={isChecked}
      onChange={() => context.onValueChange(value)}
      {...props}
    />
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
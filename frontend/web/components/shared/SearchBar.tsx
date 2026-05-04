'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showClear?: boolean
  onSearch?: () => void
  navigateOnSearch?: boolean
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  showClear = true,
  onSearch,
  navigateOnSearch = true,
}: SearchBarProps) {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (navigateOnSearch) {
        performSearch()
      } else if (onSearch) {
        onSearch()
      }
    }
  }

  const performSearch = () => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'pl-10 pr-10 transition-all duration-200',
          isFocused && 'ring-2 ring-primary-200'
        )}
      />
      {showClear && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      {onSearch && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          Search
        </Button>
      )}
    </div>
  )
}
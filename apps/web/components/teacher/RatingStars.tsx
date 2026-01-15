'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface RatingStarsProps {
  rating: number
  interactive?: boolean
  onChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
}

export function RatingStars({
  rating,
  interactive = false,
  onChange,
  size = 'md',
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const displayRating = interactive ? hoverRating || rating : rating

  const handleClick = (selectedRating: number) => {
    if (interactive && onChange) {
      onChange(selectedRating)
    }
  }

  const handleMouseEnter = (selectedRating: number) => {
    if (interactive) {
      setHoverRating(selectedRating)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= displayRating

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              'transition-all',
              interactive && 'cursor-pointer hover:scale-110 active:scale-95',
              !interactive && 'cursor-default'
            )}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

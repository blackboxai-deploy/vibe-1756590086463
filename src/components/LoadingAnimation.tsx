'use client'

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'purple' | 'pink' | 'blue' | 'white'
}

export default function LoadingAnimation({ size = 'md', color = 'purple' }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  }

  const colorClasses = {
    purple: 'border-purple-500 border-t-transparent',
    pink: 'border-pink-500 border-t-transparent',  
    blue: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  }

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-2 
          rounded-full 
          animate-spin
        `}
      />
    </div>
  )
}
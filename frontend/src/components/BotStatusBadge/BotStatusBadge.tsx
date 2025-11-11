import React from 'react'

interface BadgeStatusProps {
  status: string
  color?: string
}

const colorMap: Record<string, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  gray: 'bg-gray-500'
}

const BadgeStatus: React.FC<BadgeStatusProps> = ({ status, color }) => {
   const bgClass = colorMap[color!] || colorMap.gray

  return (
    <div className="absolute top-0 left-0 w-[100px] h-[100px] overflow-hidden">
      <span className={`absolute block w-[200px] text-center ${bgClass} text-white font-bold uppercase text-[8px] py-[3px]
            shadow-[0_5px_10px_rgba(0,0,0,0.2)] rotate-[-45deg] top-[15px] right-[-25px]`}>
        {status}
      </span>
    </div>
  )
}

export default BadgeStatus

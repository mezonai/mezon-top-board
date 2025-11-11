import React from 'react'

interface BadgeStatusProps {
  status: string
  color?: string
}

const BadgeStatus: React.FC<BadgeStatusProps> = ({ status, color }) => {
  const bgColor = color
  const label = status

  return (
    <div className="absolute top-0 left-0 w-[100px] h-[100px] overflow-hidden">
      <span className={`absolute block w-[200px] text-center bg-${bgColor}-500 text-white font-bold uppercase text-[8px] py-[3px]
            shadow-[0_5px_10px_rgba(0,0,0,0.2)] rotate-[-45deg] top-[15px] right-[-25px]`}>
        {label}
      </span>
    </div>
  )
}

export default BadgeStatus

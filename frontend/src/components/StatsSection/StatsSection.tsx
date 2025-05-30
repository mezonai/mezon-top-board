import { IStatsSectionProps } from "./StatsSection.types"

function StatsSection({ stats }: IStatsSectionProps) {
  return (
    <div className='flex flex-wrap items-stretch justify-center items-center my-10 gap-6'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className='bg-white shadow-xl rounded-xl p-8 w-90 text-center flex flex-col justify-center min-h-[180px]'
          
        >
          <div className='text-pink-500 text-5xl font-bold mb-2'>{stat.number}</div>
          <div className='text-primary text-sm'>{stat.description}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsSection

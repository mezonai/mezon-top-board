import { IStatsSectionProps } from "./StatsSection.types"
import { cn } from "@app/utils/cn"

function StatsSection({ stats }: IStatsSectionProps) {
  return (
    <div className='flex flex-wrap items-stretch justify-center my-10 gap-6'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'card-base',
            'shadow-xl rounded-xl p-8 w-90 text-center flex flex-col justify-center min-h-[180px] transition-all duration-300',
            'border border-transparent dark:border-border'
          )}
        >
          <div className='text-primary-active text-5xl font-bold mb-2'>{stat.number}</div>
          <div className='text-secondary text-sm'>{stat.description}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsSection

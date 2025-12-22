import { ITestimonialsSectionProps } from './TestimonialsSection.types'
import { cn } from '@app/utils/cn'

function TestimonialsSection({ testimonials }: ITestimonialsSectionProps) {
  return (
    <div className='flex items-center justify-center py-20'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4'>
        {testimonials.map((item, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-xl transition-all duration-300",
              "bg-bg-container border border-transparent dark:border-border",
              "shadow-xl hover:shadow-2xl"
            )}
          >
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-full bg-secondary flex-shrink-0' />
              <div>
                <h2 className='text-lg font-semibold text-primary'>
                  {item.title}
                </h2>
                <p className='text-sm text-primary font-medium'>
                  {item.type}
                </p>
              </div>

              <a className='ml-auto p-2 rounded-md hover:bg-secondary cursor-pointer transition-colors'>
                <svg 
                  className='w-5 h-5 text-tertiary' 
                  fill='currentColor' 
                  viewBox='0 0 24 24'
                >
                  <path d='M3.293,20.707a1,1,0,0,1,0-1.414L17.586,5H12a1,1,0,0,1,0-2h8a1,1,0,0,1,1,1v8a1,1,0,0,1-2,0V6.414L4.707,20.707a1,1,0,0,1-1.414,0Z' />
                </svg>
              </a>
            </div>
            <p className='text-sm whitespace-pre-line leading-relaxed text-secondary'>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
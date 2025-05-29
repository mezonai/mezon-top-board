import { ITestimonialsSectionProps } from './TestimonialsSection.types'

function TestimonialsSection({ testimonials }: ITestimonialsSectionProps) {
  return (
    <div className='flex items-center justify-center py-20'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl'>
        {testimonials.map((item, index) => (
          <div key={index} className='bg-white text-dark p-6 rounded-xl shadow-xl'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-8 h-8 bg-gray-700 rounded-full' />
              <div>
                <h2 className='text-lg font-semibold'>{item.title}</h2>
                <p className='text-sm text-primary'>{item.type}</p>
              </div>
              <a className='ml-auto p-2 rounded-md hover:bg-gray-700'>
                <svg className='w-4 h-4 text-gray-400' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M3.293,20.707a1,1,0,0,1,0-1.414L17.586,5H12a1,1,0,0,1,0-2h8a1,1,0,0,1,1,1v8a1,1,0,0,1-2,0V6.414L4.707,20.707a1,1,0,0,1-1.414,0Z' />
                </svg>
              </a>
            </div>
            <p className='text-sm whitespace-pre-line leading-normal'>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection

import Image from 'next/image'

const services = [
  {
    name: 'Agriculture & Forestry',
    description: 'Enhancing crop management with precision',
    image: '/images/services/service-1.jpeg',
  },
  {
    name: 'Construction & Infra',
    description: 'Streamlining construction processes with efficiency.',
    image: '/images/services/service-2.jpeg',
  },
  {
    name: 'Inspections',
    description: 'Safely assessing structures from above.',
    image: '/images/services/service-3.jpeg',
  },
  {
    name: 'Security & Surveillance',
    description: 'Providing security through aerial monitoring.',
    image: '/images/services/service-4.jpeg',
  },
  {
    name: 'Entertainment & Media',
    description: 'Capturing stunning visuals from above.',
    image: '/images/services/service-5.jpeg',
  },
  {
    name: 'Delivery Services',
    description: 'Fast, efficient package delivery solutions.',
    image: '/images/services/service-6.jpeg',
  },
  {
    name: 'Emergency Response',
    description: 'Rapid response for critical situations.',
    image: '/images/services/service-7.jpeg',
  },
  {
    name: 'Research & Development',
    description: 'Innovative solutions for drone advancements.',
    image: '/images/services/service-8.jpeg',
  },
  {
    name: 'Shipping & Logistics',
    description: 'Optimizing supply chain management seamlessly.',
    image: '/images/services/service-9.jpeg',
  },
  {
    name: 'Environmental Monitoring',
    description: 'Protecting ecosystems with aerial insights.',
    image: '/images/services/service-10.jpeg',
  },
  {
    name: 'Mining & Exploration',
    description: 'Discovering new landscapes from heights.',
    image: '/images/services/service-11.jpeg',
  },
  {
    name: 'Advertising & Marketing',
    description: 'Elevating brand visibility through creativity.',
    image: '/images/services/service-12.jpeg',
  },
]

export default function Services() {
  return (
    <section className="py-12 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Services</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Transforming industries with drone technology
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Discover how our drone solutions can benefit your specific industry needs.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.name} className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{service.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
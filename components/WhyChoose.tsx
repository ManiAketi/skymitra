import { CheckCircle, Users, Zap } from 'lucide-react'

const reasons = [
  {
    name: 'Expertise',
    description: 'Our team consists of certified drone pilots and industry experts.',
    icon: CheckCircle,
  },
  {
    name: 'Customer-Centric',
    description: 'We prioritize your needs and provide tailored solutions.',
    icon: Users,
  },
  {
    name: 'Cutting-Edge Technology',
    description: 'We use the latest drone technology for optimal results.',
    icon: Zap,
  },
]

export default function WhyChoose() {
  return (
    <section className="py-12 bg-indigo-700" id="why-skymithra">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-200 font-semibold tracking-wide uppercase">Why Choose Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            The SkyMithra Advantage
          </p>
          <p className="mt-4 max-w-2xl text-xl text-indigo-200 lg:mx-auto">
            Discover why leading businesses trust SkyMithra for their drone service needs.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {reasons.map((reason) => (
              <div key={reason.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <reason.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p  className="ml-16 text-lg leading-6 font-medium text-white">{reason.name}</p>
                <p className="mt-2 ml-16 text-base text-indigo-200">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
import { CheckCircle, Calendar, Settings, DollarSign, Star, CreditCard, MapPin, Headset, Repeat, Route, Package, UserPlus } from 'lucide-react'

const features = [
  {
    name: 'Verified Service Providers',
    description: 'All service providers are thoroughly vetted and verified to ensure quality and reliability.',
    icon: CheckCircle,
  },
  {
    name: 'Real-Time Booking',
    description: 'Customers can book drone services instantly through the platform with real-time availability of service providers.',
    icon: Calendar,
  },
  {
    name: 'Service Customization',
    description: 'Tailored drone services based on customer needs (e.g., aerial photography, mapping, or inspection services).',
    icon: Settings,
  },
  {
    name: 'Transparent Pricing',
    description: 'Upfront and transparent pricing for all drone services, with no hidden charges.',
    icon: DollarSign,
  },
  {
    name: 'Ratings and Reviews',
    description: 'Customers can rate and review service providers to help maintain high-quality standards.',
    icon: Star,
  },
  {
    name: 'Multiple Payment Options',
    description: 'Supports various payment methods, including credit/debit cards, digital wallets, and UPI.',
    icon: CreditCard,
  },
  {
    name: 'Location-Based Service Discovery',
    description: 'Automatically detects the user’s location and suggests the nearest service providers.',
    icon: MapPin,
  },
  {
    name: 'In-App Support and Chat',
    description: 'Users can get customer support through in-app chat or call, ensuring timely assistance.',
    icon: Headset,
  },
  {
    name: 'Subscription Plans for Regular Users',
    description: 'Subscription-based services for frequent users offering discounts and priority bookings.',
    icon: Repeat,
  },
  {
    name: 'Service Tracking',
    description: 'Real-time tracking of drone service progress, especially for deliveries or inspections.',
    icon: Route,
  },
  {
    name: 'Custom Packages',
    description: 'Bundle different drone services into custom packages (e.g., aerial photography with site inspection).',
    icon: Package,
  },
  {
    name: 'Vendor Onboarding',
    description: 'Simplified onboarding process for drone service providers, with ongoing performance tracking and feedback.',
    icon: UserPlus,
  },
]

export default function Features() {
  return (
    <section className="py-12 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to capture aerial data
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our drones are equipped with the latest technology to provide you with the best aerial solutions.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
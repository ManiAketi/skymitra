'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Phone, Calendar, ThumbsUp } from 'lucide-react'

type ServiceProvider = {
  id: string
  name: string
  rating: number
  state: string
  district: string
  services: string[]
  phoneNumber: string
  pricePerHour: number
  responseTime: string
  recentEnquiries: number
  imageUrl: string // URL of the service provider's uploaded image
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [filters, setFilters] = useState({
    service: '',
    state: '',
    district: '',
  })

  // State variables for filter options
  const [serviceOptions, setServiceOptions] = useState<string[]>([])
  const [stateOptions, setStateOptions] = useState<string[]>([])
  const [districtOptions, setDistrictOptions] = useState<string[]>([])

  useEffect(() => {
    if (status === 'loading') {
      // Optionally show a loading state
      return
    }

    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (
      status === 'authenticated' &&
      (session.user as any).role !== 'USER'
    ) {
      router.push('/')
    } else {
      fetchFilterOptions()
      fetchServiceProviders()
    }
  }, [session, status, router])

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/filter-options')
      if (response.ok) {
        const data = await response.json()
        setServiceOptions(data.services)
        setStateOptions(data.states)
        setDistrictOptions(data.districts)
      } else {
        console.error('Failed to fetch filter options')
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const fetchServiceProviders = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.service) params.append('service', filters.service)
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
  
      const response = await fetch('/api/service-providers?' + params.toString())
      if (response.ok) {
        const data = await response.json()
        setServiceProviders(data)
      } else {
        console.error('Failed to fetch service providers')
      }
    } catch (error) {
      console.error('Error fetching service providers:', error)
    }
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFilters = () => {
    fetchServiceProviders()
  }

  const handleShowPhoneNumber = (id: string) => {
    // In a real application, this would be an API call to reveal the phone number
    console.log(`Show phone number for provider ${id}`)
  }

  const handleBookSlot = (id: string) => {
    // In a real application, this would open a calendar for booking
    console.log(`Book slot for provider ${id}`)
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Menu */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-800">
                  DroneServices
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="#"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Services
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button onClick={() => signOut()} variant="ghost">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Responsive Grid */}
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Select
                onValueChange={(value) => handleFilterChange('service', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type of Service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => handleFilterChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => handleFilterChange('district', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districtOptions.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>

            {/* Service Provider Cards */}
            <div className="space-y-6">
              {serviceProviders.map((provider) => (
                <Card key={provider.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Image
                        src={provider.imageUrl || '/placeholder.svg'}
                        alt="Drone Service"
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold">
                            {provider.name}
                          </h2>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={
                                    i < Math.floor(provider.rating)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                  size={20}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-gray-600">
                              {provider.rating.toFixed(1)} (
                              {provider.recentEnquiries} Ratings)
                            </span>
                            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Responsive
                            </span>
                          </div>
                        </div>
                        <ThumbsUp className="text-green-500" size={24} />
                      </div>
                      <p className="text-gray-600 mb-2">
                        {provider.district}, {provider.state}
                      </p>
                      <p className="text-xl font-bold mb-2">
                        ₹{provider.pricePerHour} per hour
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {provider.services.map((service, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <Button
                          onClick={() => handleShowPhoneNumber(provider.id)}
                          className="flex items-center justify-center"
                        >
                          <Phone className="mr-2" size={16} />
                          {provider.phoneNumber}
                        </Button>
                        <Button
                          onClick={() => handleBookSlot(provider.id)}
                          variant="outline"
                          className="flex items-center justify-center"
                        >
                          GET BEST DEAL
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center bg-green-500 text-white hover:bg-green-600"
                        >
                          WHATSAPP
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Responds in {provider.responseTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        {provider.recentEnquiries} people recently enquired
                      </p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <h2 className="text-2xl font-bold mb-4">Drone Services Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
              {/* Replace with actual images */}
              <Image
                src="/images/services/service-1.jpeg"
                alt="Drone Service 1"
                width={200}
                height={150}
                className="w-full h-full object-cover"
              />
              <Image
                src="/images/services/service-2.jpeg"
                alt="Drone Service 2"
                width={200}
                height={150}
                className="w-full h-full object-cover"
              />
              <Image
                src="/images/services/service-3.jpeg"
                alt="Drone Service 3"
                width={200}
                height={150}
                className="w-full h-full object-cover"
              />
              <Image
                src="/images/services/service-4.jpeg"
                alt="Drone Service 4"
                width={200}
                height={150}
                className="w-full h-full object-cover"
              />
              {/* Add more images as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

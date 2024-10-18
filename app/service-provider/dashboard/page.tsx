// pages/your-dashboard-file.tsx or wherever your dashboard component resides

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Search, Menu, X, Home, Briefcase, Image as ImageIcon, Calendar, User, LogOut } from 'lucide-react'

// Import the new modals
import AddServiceModal from '@/components/AddServiceModal'
import EditServiceModal from '@/components/EditServiceModal'

type Booking = {
  id: string
  clientName: string
  service: string
  date: string
  status: string
}

type Profile = {
  name: string
  email: string
  phoneNumber: string
  services: string[]
  state: string
  district: string
}

type ServiceType = {
  id: string
  name: string
}

// Add ImageType
type ImageType = {
  id: string
  url: string
  createdAt: string
}


const dummyBookings = [
  { id: 'B001', clientName: 'John Doe', service: 'Aerial Photography', date: '2023-06-01', status: 'Pending' },
  { id: 'B002', clientName: 'Jane Smith', service: 'Mapping', date: '2023-06-03', status: 'Confirmed' },
  { id: 'B003', clientName: 'Bob Johnson', service: 'Inspection', date: '2023-06-05', status: 'Completed' },
]

export default function ServiceProviderDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Initialize services state
  const [services, setServices] = useState<ServiceType[]>([])
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [showEditServiceModal, setShowEditServiceModal] = useState(false)
  const [currentService, setCurrentService] = useState<ServiceType | null>(null)

  // Add images state and file input ref
  const [images, setImages] = useState<ImageType[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'loading') {
      // Optionally handle loading state
      return
    }

    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      if ((session?.user as any)?.role !== 'SERVICE_PROVIDER') {
        router.push('/')
      } else {
        fetchBookings()
        fetchProfile()
        fetchServices() // Fetch services from the database
        fetchImages()   // Fetch Images from database
      }
    }
  }, [session, status, router])

  const fetchBookings = async () => {
    // In a real application, this would be an API call
    setBookings(dummyBookings)
  }

  const fetchProfile = async () => {
    // In a real application, this would be an API call
    setProfile({
      name: session?.user?.name || 'Service Provider',
      email: session?.user?.email || 'provider@example.com',
      phoneNumber: '+1234567890',
      services: ['Aerial Photography', 'Mapping', 'Inspection'],
      state: 'California',
      district: 'San Francisco',
    })
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        console.error('Failed to fetch services')
      }
    } catch (error) {
      console.error('An error occurred while fetching services:', error)
    }
  }

  const handleAddService = async (serviceData: { name: string }) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      })
      if (response.ok) {
        const newService = await response.json()
        setServices((prevServices) => [...prevServices, newService])
        setShowAddServiceModal(false)
      } else {
        console.error('Failed to add service')
      }
    } catch (error) {
      console.error('An error occurred while adding the service:', error)
    }
  }

  const handleEditService = (service: ServiceType) => {
    setCurrentService(service)
    setShowEditServiceModal(true)
  }

  const handleUpdateService = async (serviceData: ServiceType) => {
    try {
      const response = await fetch(`/api/services/${serviceData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      })
      if (response.ok) {
        setServices((prevServices) =>
          prevServices.map((s) => (s.id === serviceData.id ? serviceData : s))
        )
        setShowEditServiceModal(false)
        setCurrentService(null)
      } else {
        console.error('Failed to update service')
      }
    } catch (error) {
      console.error('An error occurred while updating the service:', error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setServices((prevServices) => prevServices.filter((s) => s.id !== serviceId))
      } else {
        console.error('Failed to delete service')
      }
    } catch (error) {
      console.error('An error occurred while deleting the service:', error)
    }
  }

  // From Handling Images Upload

  // Fetch images
  const fetchImages = async () => {
    try {
        const response = await fetch('/api/images')
        if (response.ok) {
          const data = await response.json()
          setImages(data)
        } else {
          console.error('Failed to fetch images')
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

      // Handle image upload
  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    if (fileInputRef.current?.files?.[0]) {
      formData.append('image', fileInputRef.current.files[0])
    } else {
      alert('Please select an image to upload')
      return
    }

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const newImage = await response.json()
        setImages((prevImages) => [newImage, ...prevImages])
        if (fileInputRef.current) fileInputRef.current.value = ''
        toast.success('Image uploaded successfully')
      } else {
        console.error('Failed to upload image')
        toast.error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image')
    }
  }

  const handleBookingAction = async (bookingId: string, action: string) => {
    // In a real application, this would be an API call
    console.log(`Booking ${bookingId} ${action}ed`)
    fetchBookings()
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, value: 'dashboard' },
    { name: 'Services', icon: Briefcase, value: 'services' },
    { name: 'Image Upload', icon: ImageIcon, value: 'image-upload' },
    { name: 'Booking Management', icon: Calendar, value: 'booking-management' },
    { name: 'Logout', icon: LogOut, value: 'logout', onClick: handleLogout },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 min-h-screen p-4 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}
      >
        <nav>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.value} className="mb-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === item.value ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick()
                    } else {
                      setActiveTab(item.value)
                      setIsSidebarOpen(false)
                    }
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-semibold ml-2">Service Provider Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input type="text" placeholder="Search..." className="pl-8" />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Image
                      src={session?.user?.image || '/placeholder.svg'}
                      alt="Profile"
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setActiveTab('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {activeTab === 'dashboard' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}!</h2>
              <Tabs defaultValue="bookings">
                <TabsList>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="bookings">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardHeader>
                          <CardTitle>{booking.service}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Client: {booking.clientName}</p>
                          <p>Date: {new Date(booking.date).toLocaleString()}</p>
                          <p>Status: {booking.status}</p>
                          <div className="mt-4 space-x-2">
                            <Button onClick={() => handleBookingAction(booking.id, 'accept')}>Accept</Button>
                            <Button onClick={() => handleBookingAction(booking.id, 'reject')}>Reject</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="profile">
                  {profile && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Name: {profile.name}</p>
                        <p>Email: {profile.email}</p>
                        <p>Phone: {profile.phoneNumber}</p>
                        <p>Services: {profile.services.join(', ')}</p>
                        <p>
                          Location: {profile.district}, {profile.state}
                        </p>
                        <Button className="mt-4">Edit Profile</Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
          {activeTab === 'services' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Services</h2>
              <Button onClick={() => setShowAddServiceModal(true)}>Add New Service</Button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-4 flex space-x-2">
                        <Button onClick={() => handleEditService(service)}>Edit</Button>
                        <Button variant="destructive" onClick={() => handleDeleteService(service.id)}>
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Modals for Adding and Editing Services */}
              {showAddServiceModal && (
                <AddServiceModal
                  onClose={() => setShowAddServiceModal(false)}
                  onSave={handleAddService}
                />
              )}
              {showEditServiceModal && currentService && (
                <EditServiceModal
                  service={currentService}
                  onClose={() => {
                    setShowEditServiceModal(false)
                    setCurrentService(null)
                  }}
                  onSave={handleUpdateService}
                />
              )}
            </div>
          )}
    {activeTab === 'image-upload' && (
      <div>
        <h2 className="text-2xl font-bold mb-4">Image Upload</h2>

        <form onSubmit={handleImageUpload} className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="border p-2"
            />
            <Button type="submit">Upload Image</Button>
          </div>
        </form>

        {images.length === 0 ? (
          <p>No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id}>
                <CardHeader>
                  <CardTitle>
                    Uploaded on {new Date(image.createdAt).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={image.url}
                    alt="Uploaded Image"
                    className="w-full h-48 object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )}
          {activeTab === 'booking-management' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Booking Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle>{booking.service}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Client: {booking.clientName}</p>
                      <p>Date: {booking.date}</p>
                      <p>Status: {booking.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

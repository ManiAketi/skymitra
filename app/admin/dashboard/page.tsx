'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type User = {
  id: string;
  name: string;
  email: string;
  status: string;
}

type ServiceProvider = {
  id: string;
  name: string;
  email: string;
  services: string[];
  status: string;
}

type RegistrationData = {
  date: string;
  users: number;
  serviceProviders: number;
}

type ContactClickData = {
  serviceProvider: string;
  clicks: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [registrationData, setRegistrationData] = useState<RegistrationData[]>([])
  const [contactClickData, setContactClickData] = useState<ContactClickData[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchUsers()
      fetchServiceProviders()
      fetchRegistrationData()
      fetchContactClickData()
    }
  }, [session, status, router])

  const fetchUsers = async () => {
    // In a real application, this would be an API call
    const response = await fetch('/api/admin/users')
    const data = await response.json()
    setUsers(data)
  }

  const fetchServiceProviders = async () => {
    // In a real application, this would be an API call
    const response = await fetch('/api/admin/service-providers')
    const data = await response.json()
    setServiceProviders(data)
  }

  const fetchRegistrationData = async () => {
    // In a real application, this would be an API call
    const response = await fetch('/api/admin/registration-data')
    const data = await response.json()
    setRegistrationData(data)
  }

  const fetchContactClickData = async () => {
    // In a real application, this would be an API call
    const response = await fetch('/api/admin/contact-click-data')
    const data = await response.json()
    setContactClickData(data)
  }

  const handleUserAction = async (userId: string, action: string) => {
    // In a real application, this would be an API call
    await fetch(`/api/admin/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    })
    fetchUsers()
  }

  const handleServiceProviderAction = async (providerId: string, action: string) => {
    // In a real application, this would be an API call
    await fetch(`/api/admin/service-providers/${providerId}`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    })
    fetchServiceProviders()
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {session?.user?.name}!</p>

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="serviceProviders">Service Providers</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" />
                    <Line type="monotone" dataKey="serviceProviders" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={contactClickData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="serviceProvider" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Email: {user.email}</p>
                  <p>Status: {user.status}</p>
                  <div className="mt-4 space-x-2">
                    <Button onClick={() => handleUserAction(user.id, 'activate')}>Activate</Button>
                    <Button onClick={() => handleUserAction(user.id, 'deactivate')}>Deactivate</Button>
                    <Button onClick={() => handleUserAction(user.id, 'delete')}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="serviceProviders">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <CardTitle>{provider.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Email: {provider.email}</p>
                  <p>Services: {provider.services.join(', ')}</p>
                  <p>Status: {provider.status}</p>
                  <div className="mt-4 space-x-2">
                    <Button onClick={() => handleServiceProviderAction(provider.id, 'activate')}>Activate</Button>
                    <Button onClick={() => handleServiceProviderAction(provider.id, 'deactivate')}>Deactivate</Button>
                    <Button onClick={() => handleServiceProviderAction(provider.id, 'delete')}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  'Agriculture & Forestry',
  'Construction & Infrastructure',
  'Inspections',
  'Security & Surveillance',
  'Entertainment & Media',
  'Delivery Services',
  'Emergency Response',
  'Research & Development',
  'Shipping & Logistics',
  'Environmental Monitoring',
  'Mining & Exploration',
  'Advertising & Marketing'
]

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: '',
    state: '',
    district: '',
    services: [] as string[],
  })
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'service-provider') {
      setFormData(prev => ({ ...prev, role: 'SERVICE_PROVIDER' }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleServiceChange = (service: string) => {
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter(s => s !== service)
      : [...formData.services, service]
    setFormData({ ...formData, services: updatedServices })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/login?registered=true')
      } else {
        const data = await response.json()
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      setError('An error occurred during registration')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Register for SkyMithra</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select registration type:</Label>
              <ul className="space-y-2">
                <li>
                  <Button
                    type="button"
                    variant={formData.role === 'USER' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'USER' }))}
                  >
                    • Register as User
                  </Button>
                </li>
                <li>
                  <Button
                    type="button"
                    variant={formData.role === 'SERVICE_PROVIDER' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'SERVICE_PROVIDER' }))}
                  >
                    • Register as Service Provider
                  </Button>
                </li>
              </ul>
            </div>

            {formData.role && (
              <>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                </div>
                
                {formData.role === 'SERVICE_PROVIDER' && (
                  <>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select onValueChange={(value) => handleSelectChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input 
                        id="district" 
                        name="district" 
                        value={formData.district} 
                        onChange={handleChange} 
                        placeholder="Enter your district"
                        required
                      />
                    </div>
                    <div>
                      <Label>Services</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {services.map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              checked={formData.services.includes(service)}
                              onCheckedChange={() => handleServiceChange(service)}
                            />
                            <Label htmlFor={service}>{service}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <Button type="submit" className="w-full">Register</Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
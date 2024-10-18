import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AddServiceModalProps = {
  onClose: () => void
  onSave: (serviceData: { name: string }) => void
}

export default function AddServiceModal({ onClose, onSave }: AddServiceModalProps) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim() === '') {
      alert('Please enter a service name')
      return
    }
    onSave({ name })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Service</h2>
        <div className="mb-4">
          <Label htmlFor="service-name">Service Name</Label>
          <Input
            id="service-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  )
}

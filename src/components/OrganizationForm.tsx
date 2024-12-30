import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrganizationFormProps {
  onOrganizationAdded: () => void
}

export default function OrganizationForm({ onOrganizationAdded }: OrganizationFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase
      .from('organizations')
      .insert({ name, email, location })
    if (error) console.error('Error adding organization:', error)
    else {
      setName('')
      setEmail('')
      setLocation('')
      onOrganizationAdded()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="org-name">Name</Label>
        <Input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-email">Email</Label>
        <Input
          id="org-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-location">Location</Label>
        <Input
          id="org-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">Add Organization</Button>
    </form>
  )
}

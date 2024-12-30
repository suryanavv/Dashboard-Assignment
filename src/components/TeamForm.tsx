import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Organization } from '../types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeamFormProps {
  organizations: Organization[]
  onTeamAdded: () => void
}

export default function TeamForm({ organizations, onTeamAdded }: TeamFormProps) {
  const [name, setName] = useState('')
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase
      .from('teams')
      .insert({
        name,
        organization_id: organizationId  // Match database column name
      })
    if (error) console.error('Error adding team:', error)
    else {
      setName('')
      setOrganizationId(organizations[0]?.id || '')
      onTeamAdded()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="team-name">Name</Label>
        <Input
          id="team-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      {organizations.length > 1 && (
        <div className="space-y-2">
          <Label htmlFor="team-org">Organization</Label>
          <Select value={organizationId} onValueChange={setOrganizationId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button type="submit" className="w-full">Add Team</Button>
    </form>
  )
}

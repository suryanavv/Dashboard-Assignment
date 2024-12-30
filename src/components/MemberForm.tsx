import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Team } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import FileUpload from './FileUpload.tsx'

// Interface defining the structure of member form props
interface MemberFormProps {
  teams: Team[]
  onMemberAdded: () => void
}

// Component for creating new team members
export default function MemberForm({ teams, onMemberAdded }: MemberFormProps) {
  // Initialize form state with default values
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [teamId, setTeamId] = useState(teams[0]?.id || '')
  const [profileImage, setProfileImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    // Prevent default form submission behavior
    e.preventDefault()
    
    // Form validation
    if (!name.trim()) {
      // Display error toast if name is empty
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      })
      return
    }
    
    if (!email.trim() || !email.includes('@')) {
      // Display error toast if email is invalid
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }
    
    if (!teamId) {
      // Display error toast if team is not selected
      toast({
        title: "Error",
        description: "Please select a team",
        variant: "destructive"
      })
      return
    }

    // Set submitting state to true
    setIsSubmitting(true)
    try {
      // Insert new member data into the database
      const { error } = await supabase
        .from('members')
        .insert({ 
          name, 
          email, 
          team_id: teamId,           // Changed from teamId
          profile_image: profileImage // Match database column name
        })
      
      if (error) throw error

      // Display success toast and reset form
      toast({
        title: "Success",
        description: "Member added successfully"
      })
      
      setName('')
      setEmail('')
      setTeamId('')
      setProfileImage('')
      onMemberAdded()
    } catch (error) {
      // Display error toast if insertion fails
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error adding member',
        variant: "destructive"
      })
    } finally {
      // Set submitting state to false
      setIsSubmitting(false)
    }
  }

  // Render form component
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="team">Team</Label>
        <Select value={teamId} onValueChange={setTeamId}>
          <SelectTrigger>
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Profile Image</Label>
        <FileUpload onUpload={setProfileImage} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Member'}
      </Button>
    </form>
  )
}
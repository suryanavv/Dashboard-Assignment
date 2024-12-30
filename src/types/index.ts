// Interface for Organization data structure
export interface Organization {
  id: string
  name: string
  email?: string      // Make optional if not always present
  location?: string   // Make optional if not always present
  teams?: Team[]
  created_at?: string
}

// Interface for Team data structure
export interface Team {
  id: string
  name: string
  organization_id: string  // Changed from organizationId
  members?: Member[]
  created_at?: string
}

// Interface for Member data structure
export interface Member {
  id: string
  name: string
  team_id: string        // Changed from teamId
  email: string
  profile_image?: string
  created_at?: string
}

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Organization, Team, Member } from './types'
import HierarchicalList from './components/HierarchicalList'

// Main application component
function App() {
  // State to store organizations data
  const [organizations, setOrganizations] = useState<Organization[]>([])
  
  // State to track loading status
  const [loading, setLoading] = useState(true)
  
  // State to store any error messages
  const [error, setError] = useState<string | null>(null)

  // State to store teams data
  const [teams, setTeams] = useState<Team[]>([])
  
  // State to store members data
  const [members, setMembers] = useState<Member[]>([])

  // Fetch organizations data on component mount
  useEffect(() => {
    fetchOrganizations()
    fetchTeams()
    fetchMembers()
    return () => setLoading(false)
  }, [])

  // Function to fetch organizations from the database
  async function fetchOrganizations() {
    try {
      // Fetch organizations with their teams and members
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          teams (
            *,
            members (*)
          )
        `)
        .order('name')

      if (error) throw error

      // Update organizations state with fetched data
      setOrganizations(data || [])
    } catch (error) {
      console.error('Error fetching organizations:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch teams from the database
  async function fetchTeams() {
    try {
      const { data, error } = await supabase.from('teams').select('*')
      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching data')
    }
  }

  // Function to fetch members from the database
  async function fetchMembers() {
    try {
      const { data, error } = await supabase.from('members').select('*')
      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Error fetching members:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching data')
    }
  }

  // Handle adding a new organization
  const handleOrganizationAdded = () => {
    fetchOrganizations()
  }

  // Handle adding a new team
  const handleTeamAdded = () => {
    fetchTeams()
  }

  // Handle adding a new member
  const handleMemberAdded = () => {
    fetchMembers()
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto py-10">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <HierarchicalList
            organizations={organizations}
            teams={teams}
            members={members}
            onOrganizationAdded={handleOrganizationAdded}
            onTeamAdded={handleTeamAdded}
            onMemberAdded={handleMemberAdded}
          />
        )}
      </div>
    </div>
  )
}

export default App

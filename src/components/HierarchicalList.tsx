import { useState } from 'react'
import { Organization, Team, Member } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Users, User, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import OrganizationForm from './OrganizationForm'
import TeamForm from './TeamForm'
import MemberForm from './MemberForm'

interface HierarchicalListProps {
  organizations: Organization[]
  teams: Team[]
  members: Member[]
  onOrganizationAdded: () => void  // Changed to match actual usage
  onTeamAdded: () => void         // Changed to match actual usage
  onMemberAdded: () => void
}

export default function HierarchicalList({ 
  organizations, 
  teams, 
  members, 
  onOrganizationAdded, 
  onTeamAdded, 
  onMemberAdded 
}: HierarchicalListProps) {
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>([])
  const [expandedTeams, setExpandedTeams] = useState<string[]>([])
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  const toggleOrg = (orgId: string) => {
    setExpandedOrgs(prev => 
      prev.includes(orgId) ? prev.filter(id => id !== orgId) : [...prev, orgId]
    )
  }

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    )
  }

  const handleDialogOpen = (key: string, open: boolean) => {
    setOpenDialogs(prev => ({ ...prev, [key]: open }))
  }

  const handleOrganizationAdded = () => {
    onOrganizationAdded()
    handleDialogOpen('addOrg', false)
    toast({
      title: "Organization added",
      description: "Organization has been added successfully.",
    })
  }

  const handleTeamAdded = () => {
    onTeamAdded()
    handleDialogOpen('addTeam', false)
    toast({
      title: "Team added",
      description: "Team has been added successfully.",
    })
  }

  const handleMemberAdded = () => {
    onMemberAdded()
    handleDialogOpen('addMember', false)
    toast({
      title: "Member added",
      description: "Member has been added successfully.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Organizations Overview</h2>
        <Dialog open={openDialogs['addOrg']} onOpenChange={(open) => handleDialogOpen('addOrg', open)}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
            </DialogHeader>
            <OrganizationForm onOrganizationAdded={handleOrganizationAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-8">
        {organizations.map((org) => (
          <Card key={org.id} className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader 
              className="bg-white text-gray-800 p-6 cursor-pointer"
              onClick={() => toggleOrg(org.id)}
            >
              <CardTitle className="text-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  {org.name}
                </div>
                {expandedOrgs.includes(org.id) ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            {expandedOrgs.includes(org.id) && (
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    {org.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{org.email}</span>
                      </div>
                    )}
                    {org.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{org.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Teams
                      </h3>
                      <Dialog open={openDialogs['addTeam']} onOpenChange={(open) => handleDialogOpen('addTeam', open)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Team
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Team</DialogTitle>
                          </DialogHeader>
                          <TeamForm organizations={[org]} onTeamAdded={handleTeamAdded} />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="grid gap-4">
                      {teams
                        .filter((team) => team.organization_id === org.id)
                        .map((team) => (
                          <Card key={team.id} className="overflow-hidden">
                            <CardHeader 
                              className="bg-gray-50 p-4 cursor-pointer"
                              onClick={() => toggleTeam(team.id)}
                            >
                              <CardTitle className="text-md flex items-center justify-between">
                                <span>{team.name}</span>
                                {expandedTeams.includes(team.id) ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            {expandedTeams.includes(team.id) && (
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="font-semibold">Members</h4>
                                  <Dialog open={openDialogs['addMember']} onOpenChange={(open) => handleDialogOpen('addMember', open)}>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" /> Add Member
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add New Member</DialogTitle>
                                      </DialogHeader>
                                      <MemberForm teams={[team]} onMemberAdded={handleMemberAdded} />
                                    </DialogContent>
                                  </Dialog>
                                </div>
                                <div className="grid gap-3">
                                  {members
                                    .filter((member) => member.team_id === team.id)
                                    .map((member) => (
                                      <div key={member.id} 
                                        className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <Avatar className={`h-10 w-10 border-2 ${member.profile_image ? 'border-green-500' : 'border-red-500'}`}>
                                          {member.profile_image ? (
                                            <AvatarImage
                                              src={member.profile_image}
                                              alt={member.name}
                                              className="object-cover"
                                            />
                                          ) : (
                                            <AvatarFallback>
                                              <User className="w-6 h-6 text-gray-400" />
                                            </AvatarFallback>
                                          )}
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium truncate">{member.name}</p>
                                          <p className="text-sm text-gray-500 truncate">{member.email}</p>
                                          <p className="text-sm text-gray-500 truncate">{member.id}</p>
                                        </div>
                                        <span className={`text-xs font-medium ${member.profile_image ? 'text-green-500' : 'text-red-500'}`}>
                                          {member.profile_image ? 'Image Uploaded' : 'Image Not Uploaded'}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

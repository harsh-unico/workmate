import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { OrganisationLayout } from '../../layouts'
import { DashboardSectionCard } from '../../components'
import { useTheme } from '../../context/theme'

const OrganisationTeamMembers = () => {
  const t = useTheme()
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')

  const organisationName = 'Quantum Solutions'

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="Add Team Member"
      onPrimaryAction={() => {}}
      searchPlaceholder="Search team members..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardSectionCard title="Team Members">
        <p style={{ margin: 0, color: t.colors.textMutedDark, fontSize: t.font.size.md }}>
          This section will show detailed team member information for {organisationName}. Replace this placeholder with
          real data and components as the functionality is implemented.
        </p>
      </DashboardSectionCard>
    </OrganisationLayout>
  )
}

export default OrganisationTeamMembers



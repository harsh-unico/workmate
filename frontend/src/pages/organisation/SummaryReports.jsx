import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { OrganisationLayout } from '../../layouts'
import { DashboardSectionCard } from '../../components'
import { useTheme } from '../../context/theme'

const OrganisationSummaryReports = () => {
  const t = useTheme()
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')

  const organisationName = 'Quantum Solutions'

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="Generate Report"
      onPrimaryAction={() => {}}
      searchPlaceholder="Search reports..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardSectionCard title="Summary & Reports">
        <p style={{ margin: 0, color: t.colors.textMutedDark, fontSize: t.font.size.md }}>
          This section will contain analytics, KPIs, and exportable reports for {organisationName}. Replace this
          placeholder with charts, tables, and filters as reporting features are implemented.
        </p>
      </DashboardSectionCard>
    </OrganisationLayout>
  )
}

export default OrganisationSummaryReports



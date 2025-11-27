import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { OrganisationLayout } from '../../layouts'
import { StatsCard } from '../../components'
import { useTheme } from '../../context/theme'

const OrganisationSummaryReports = () => {
  const t = useTheme()
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')

  const organisationName = 'Quantum Solutions'

  const stats = [
    { label: 'Total Reports Generated', value: 48, delta: '+8.4%' },
    { label: 'Reports Shared', value: 132, delta: '+3.2%' },
    { label: 'Insights Identified', value: 320, delta: '+11.6%' },
    { label: 'Exports This Month', value: 27, delta: '-1.8%' },
  ]

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="Generate Report"
      onPrimaryAction={() => {}}
      searchPlaceholder="Search reports..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: t.spacing(4),
        }}
      >
        {stats.map((stat) => (
          <StatsCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} />
        ))}
      </div>
    </OrganisationLayout>
  )
}

export default OrganisationSummaryReports

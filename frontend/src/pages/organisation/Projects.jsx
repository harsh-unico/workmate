import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { OrganisationLayout } from '../../layouts'
import { ProjectCard } from '../../components'
import { useTheme } from '../../context/theme'

const OrganisationProjects = () => {
  const t = useTheme()
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')

  // Temporary mock data – replace with API data later, ideally fetched using `id`
  const organisationName = 'Quantum Solutions'

  const projects = [
    { name: 'Website Redesign', due: 'Nov 30, 2025', progress: 70, members: 5 },
    { name: 'API Integration', due: 'Dec 05, 2025', progress: 45, members: 4 },
    { name: 'Mobile App Development', due: 'Dec 22, 2025', progress: 30, members: 8 },
    { name: 'Model Training', due: 'Jan 15, 2026', progress: 22, members: 3 },
    { name: 'Market Research', due: 'Jan 31, 2026', progress: 10, members: 5 },
  ]

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="Create Project"
      onPrimaryAction={() => {}}
      searchPlaceholder="Search project, tasks, or members..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div style={{ marginTop: t.spacing(2) }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: t.spacing(4),
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: t.spacing(4),
            }}
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </div>
    </OrganisationLayout>
  )
}

export default OrganisationProjects



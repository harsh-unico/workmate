import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { OrganisationLayout } from '../../layouts'
import { StatsCard, DashboardSectionCard } from '../../components'
import { useTheme } from '../../context/theme'

const OrganisationOverview = () => {
  const t = useTheme()
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')

  // Temporary mock data – replace with API data later, ideally fetched using `id`
  const organisationName = 'Quantum Solutions'

  const stats = [
    { label: 'Total Projects', value: 124, delta: '+5.2%' },
    { label: 'Total Team Members', value: 86, delta: '+2.1%' },
    { label: 'Tasks Completed', value: 1532, delta: '+12.8%' },
    { label: 'Active Tasks', value: 48, delta: '-3.4%' },
  ]

  const overviewProjects = [
    { name: 'Market Research', due: 'Jan 18, 2026', progress: 100 },
    { name: 'Model Training', due: 'Jan 15, 2026', progress: 72 },
    { name: 'Project Beta', due: 'Dec 22, 2025', progress: 90 },
    { name: 'API Integration', due: 'Dec 05, 2025', progress: 45 },
    { name: 'Project Alpha', due: 'Nov 30, 2025', progress: 70 },
  ]

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing(4) }}>
      {/* Stats Row */}
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

      {/* About Section */}
      <DashboardSectionCard title={`About ${organisationName}`} actionLabel="Read More..." onAction={() => {}}>
        <p
          style={{
            margin: 0,
            marginBottom: t.spacing(2),
            color: t.colors.textBodyDark,
            lineHeight: 1.6,
            fontSize: t.font.size.md,
          }}
        >
          Quantum Solutions is a forward-thinking AI and software engineering company specializing in intelligent
          automation and data-driven enterprise solutions. Our mission is to empower organizations with cutting-edge
          technology that simplifies workflows, enhances collaboration, and drives measurable impact.
        </p>
      </DashboardSectionCard>

      {/* Bottom Row: Recent Projects & Activity Feed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.5fr)',
          gap: t.spacing(4),
        }}
      >
        {/* Recent Projects */}
        <DashboardSectionCard title="Recent Projects" actionLabel="View All" onAction={() => {}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing(3) }}>
            {overviewProjects.map((project) => (
              <div key={project.name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: t.spacing(1),
                    fontSize: t.font.size.sm,
                    color: t.colors.textBodyDark,
                  }}
                >
                  <span
                    style={{
                      fontWeight: t.font.weight.medium,
                      color: t.colors.textHeadingDark,
                    }}
                  >
                    {project.name}
                  </span>
                  <span>Due {project.due}</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: t.colors.progressTrack,
                    overflow: 'hidden',
                    marginBottom: t.spacing(0.5),
                  }}
                >
                  <div
                    style={{
                      width: `${project.progress}%`,
                      height: '100%',
                      backgroundColor: t.colors.progressBar,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: t.font.size.xs,
                    color: t.colors.textMutedDark,
                  }}
                >
                  <span>{project.progress}%</span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'none',
                      color: t.colors.accentBlue,
                      cursor: 'pointer',
                      fontSize: t.font.size.xs,
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashboardSectionCard>

        {/* Activity Feed */}
        <DashboardSectionCard title="Activity Feed" actionLabel="View All" onAction={() => {}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing(2.5) }}>
            {[
              {
                user: 'Alex Ray',
                action: 'created a new task in API Integration.',
                time: '2 hours ago',
              },
              {
                user: 'Project Horizon',
                action: 'was marked as 30% done.',
                time: '3 hours ago',
              },
              {
                user: 'Jane Doe',
                action: 'was added to the team.',
                time: '1 day ago',
              },
              {
                user: 'Mike Ross',
                action: 'commented on a task in Model Training.',
                time: '2 days ago',
              },
            ].map((item) => (
              <div key={item.user + item.time}>
                <div
                  style={{
                    fontSize: t.font.size.sm,
                    color: t.colors.textHeadingDark,
                    marginBottom: t.spacing(0.5),
                  }}
                >
                  <strong>{item.user}</strong> {item.action}
                </div>
                <div style={{ fontSize: t.font.size.xs, color: t.colors.textMutedDark }}>{item.time}</div>
              </div>
            ))}
          </div>
        </DashboardSectionCard>
      </div>
    </div>
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
      {renderOverview()}
    </OrganisationLayout>
  )
}

export default OrganisationOverview



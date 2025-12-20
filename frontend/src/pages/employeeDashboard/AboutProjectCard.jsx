import React, { useState } from 'react'
import { DashboardSectionCard, Popup, AttachmentList } from '../../components'
import { useTheme } from '../../context/theme'

const AboutProjectCard = ({ projectName = 'Project Beta' }) => {
  const t = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const shortDescription =
    'This task management application helps users efficiently organize, track, and prioritise their work through a structured and intuitive system.'

  const attachments = [
    {
      id: 'project-doc',
      name: 'Project.docx',
      size: 12.5 * 1024 * 1024,
      type: 'Document',
    },
    {
      id: 'screen-png',
      name: 'Screen.png',
      size: 3.1 * 1024 * 1024,
      type: 'PNG Image',
    },
  ]

  return (
    <>
      <DashboardSectionCard
        title={`About ${projectName}`}
        actionLabel="Read More..."
        actionPlacement="bottom-right"
        onAction={() => setIsOpen(true)}
      >
        <p
          style={{
            margin: 0,
            color: t.colors.textBodyDark,
            lineHeight: 1.6,
            fontSize: t.font.size.md,
          }}
        >
          {shortDescription}{' '}
          <span style={{ fontWeight: t.font.weight.medium }}>
            Users can create and manage tasks with detailed descriptions, set deadlines,
            assign priority levels, and track progress in real time.
          </span>
        </p>
      </DashboardSectionCard>

      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`About ${projectName}`}
        maxWidth="860px"
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: t.spacing(4),
            color: t.colors.textBodyDark,
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: t.spacing(2),
              fontSize: t.font.size.sm,
              lineHeight: 1.6,
            }}
          >
            This task management application helps users efficiently organize, track, and
            prioritise their work through a structured and intuitive system. Users can
            create and manage tasks with detailed descriptions, set deadlines, assign
            priority levels, and track progress in real time. The application supports
            better planning by allowing tasks to be grouped, updated, and reviewed as
            work evolves.
          </p>

          <p
            style={{
              margin: 0,
              marginBottom: t.spacing(4),
              fontSize: t.font.size.sm,
              lineHeight: 1.6,
            }}
          >
            With a clean and user-friendly interface, streamlined workflows, and
            real-time updates, the application reduces complexity and distractions. It
            enhances productivity by helping users stay organized, manage time
            effectively, and maintain focus on their goals.
          </p>

          {/* Attachments row – reuse AttachmentList styling from TaskDetails */}
          <div style={{ marginBottom: t.spacing(4) }}>
            <AttachmentList attachments={attachments} />
          </div>

          {/* Meta info row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: t.spacing(4),
              borderTop: '1px solid rgba(31, 41, 55, 0.8)',
              paddingTop: t.spacing(3),
            }}
          >
            <div>
              <div
                style={{
                  fontSize: t.font.size.sm,
                  opacity: 0.8,
                  marginBottom: t.spacing(1),
                }}
              >
                Team Size
              </div>
              <div style={{ fontSize: t.font.size.md, fontWeight: t.font.weight.medium }}>
                10
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: t.font.size.sm,
                  opacity: 0.8,
                  marginBottom: t.spacing(1),
                }}
              >
                Start Date
              </div>
              <div style={{ fontSize: t.font.size.md, fontWeight: t.font.weight.medium }}>
                Dec 01, 2025
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: t.font.size.sm,
                  opacity: 0.8,
                  marginBottom: t.spacing(1),
                }}
              >
                Due Date
              </div>
              <div style={{ fontSize: t.font.size.md, fontWeight: t.font.weight.medium }}>
                Dec 31, 2025
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
}

export default AboutProjectCard



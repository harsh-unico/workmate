import React from 'react'
import { useTheme } from '../../context/theme'
import notificationsIcon from '../../assets/icons/notificationsIcon.png'

const EmployeeSidebar = ({ projects, activeProject, onProjectChange }) => {
  const t = useTheme()

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: t.colors.primary,
        height: '100vh',
        padding: t.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        gap: t.spacing(2),
        color: t.colors.textPrimary,
      }}
    >
      <div
        style={{
          marginBottom: t.spacing(4),
          color: t.colors.textPrimary,
          fontSize: t.font.size.sm,
          opacity: 0.8,
        }}
      >
        Projects
      </div>

      {projects.map((project) => {
        const isActive = project === activeProject
        return (
          <button
            key={project}
            type="button"
            onClick={() => onProjectChange(project)}
            style={{
              width: '100%',
              padding: `${t.spacing(2.5)} ${t.spacing(3)}`,
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isActive ? '#4B5563' : 'transparent',
              color: t.colors.textPrimary,
              textAlign: 'left',
              fontSize: t.font.size.md,
              fontFamily: t.font.family,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{project}</span>
          </button>
        )
      })}

      {/* Sidebar notifications button just below project list */}
      <button
        type="button"
        style={{
          width: '100%',
          marginTop: t.spacing(4),
          padding: `${t.spacing(2.5)} ${t.spacing(3)}`,
          borderRadius: '12px',
          border: 'none',
          backgroundColor: '#374151',
          color: t.colors.textPrimary,
          textAlign: 'left',
          fontSize: t.font.size.md,
          fontFamily: t.font.family,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: t.spacing(2),
        }}
      >
        <img
          src={notificationsIcon}
          alt="Notifications"
          style={{ width: 20, height: 20, objectFit: 'contain' }}
        />
        <span>Notifications</span>
      </button>
    </aside>
  )
}

export default EmployeeSidebar



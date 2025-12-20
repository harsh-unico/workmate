import React, { useState } from 'react'
import { useTheme } from '../../context/theme'
import { ProfileDropdown } from '../../components'
import sampleProfile from '../../assets/images/sampleProfile.png'

const EmployeeHeader = ({ activeProject }) => {
  const t = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: t.spacing(4),
      }}
    >
      <div>
        <div
          style={{
            fontSize: t.font.size.sm,
            color: t.colors.textMutedDark,
            marginBottom: t.spacing(1),
          }}
        >
          Quantum Solutions / {activeProject} /
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: t.font.size.display,
            fontWeight: t.font.weight.bold,
            color: t.colors.textHeadingDark,
            fontFamily: t.font.heading,
          }}
        >
          About Project Beta
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing(4) }}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((open) => !open)}
            style={{
              width: 44,
              height: 44,
              borderRadius: '999px',
              border: '2px solid #d1d5db',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={sampleProfile}
              alt="Profile"
              style={{
                width: 32,
                height: 32,
                borderRadius: '999px',
                objectFit: 'cover',
              }}
            />
          </button>
          {isProfileOpen && <ProfileDropdown onClose={() => setIsProfileOpen(false)} />}
        </div>
      </div>
    </div>
  )
}

export default EmployeeHeader



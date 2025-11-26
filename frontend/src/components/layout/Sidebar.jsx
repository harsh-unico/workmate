import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/theme'
import { ROUTES } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/icons/logo.png'
import dashboardIcon from '../../assets/icons/dashboardIcon.png'
import orgsIcon from '../../assets/icons/orgsIcon.png'
import notificationsIcon from '../../assets/icons/notificationsIcon.png'
import profileIcon from '../../assets/icons/profileIcon.png'
import settingsIcon from '../../assets/icons/settingsIcon.png'
import signoutIcon from '../../assets/icons/signoutIcon.png'
import summaryIcon from '../../assets/icons/summaryIcon.png'
import teamIcon from '../../assets/icons/teamIcon.png'
import projectIcon from '../../assets/icons/projectIcon.png'

const Sidebar = () => {
  const t = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const isOrganisationDetail = location.pathname.startsWith('/organisations/') && location.pathname.split('/').length >= 4

  let menuItems

  if (isOrganisationDetail) {
    const parts = location.pathname.split('/')
    const orgId = parts[2]

    const orgPath = (section) => `/organisations/${orgId}/${section}`

    menuItems = [
      { id: 'overview', label: 'Overview', icon: dashboardIcon, path: orgPath('overview') },
      { id: 'projects', label: 'Projects', icon: projectIcon, path: orgPath('projects') },
      { id: 'team', label: 'Team Members', icon: teamIcon, path: orgPath('team') },
      { id: 'reports', label: 'Summary & Reports', icon: summaryIcon, path: orgPath('reports') },
      { id: 'settings', label: 'Settings', icon: settingsIcon, path: orgPath('settings') },
    ]
  } else {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon, path: ROUTES.DASHBOARD },
      { id: 'organisations', label: 'Organisations', icon: orgsIcon, path: ROUTES.ORGANISATIONS },
      { id: 'notifications', label: 'Notifications', icon: notificationsIcon, path: ROUTES.NOTIFICATIONS },
      { id: 'profile', label: 'Profile', icon: profileIcon, path: ROUTES.PROFILE },
      { id: 'settings', label: 'Settings', icon: settingsIcon, path: ROUTES.SETTINGS },
    ]
  }

  const handleSignOut = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const isActive = (path) => {
    if (!isOrganisationDetail && path === ROUTES.DASHBOARD) {
      return location.pathname === ROUTES.DASHBOARD
    }
    if (isOrganisationDetail) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div
      style={{
        width: '320px',
        height: '100vh',
        backgroundColor: t.colors.primary,
        display: 'flex',
        flexDirection: 'column',
        padding: t.spacing(4),
        boxSizing: 'border-box',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: t.spacing(6),
          paddingBottom: t.spacing(4),
          borderBottom: `1px solid ${t.colors.cardBorder}`,
        }}
      >
        <img
          src={logo}
          alt="Workmate AI logo"
          style={{
            height: 110,
            objectFit: 'contain',
          }}
        />
      </div>

      {menuItems.map((item) => {
        const active = isActive(item.path)
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: t.spacing(3),
              padding: t.spacing(3),
              marginBottom: t.spacing(1),
              backgroundColor: active ? '#374151' : 'transparent',
              border: 'none',
              borderRadius: t.radius.input,
              color: t.colors.textPrimary,
              fontSize: t.font.size.md,
              fontFamily: t.font.family, // Poppins
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = '#374151'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <img
              src={item.icon}
              alt={item.label}
              style={{
                width: '25px',
                height: '25px',
                objectFit: 'contain',
              }}
            />
            <span>{item.label}</span>
          </button>
        )
      })}

      <div style={{ flex: 1 }} />

      <button
        onClick={handleSignOut}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: t.spacing(3),
          padding: t.spacing(3),
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: t.radius.input,
          color: t.colors.textPrimary,
          fontSize: t.font.size.md,
          fontFamily: t.font.family, // Poppins
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#374151'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <img
          src={signoutIcon}
          alt="Sign Out"
          style={{
            width: '20px',
            height: '20px',
            objectFit: 'contain',
          }}
        />
        <span>Sign Out</span>
      </button>
    </div>
  )
}

export default Sidebar


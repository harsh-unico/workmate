import React from 'react'
import { DashboardLayout } from '../../layouts'
import { useTheme } from '../../context/theme'

const Settings = () => {
  const t = useTheme()

  return (
    <DashboardLayout>
      <div
        style={{
          padding: t.spacing(6),
          minHeight: '100vh',
          backgroundColor: '#ffffff',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: t.font.weight.bold,
            color: '#1f2937',
            fontFamily: t.font.heading, // Song Myung
          }}
        >
          Settings
        </h1>
      </div>
    </DashboardLayout>
  )
}

export default Settings


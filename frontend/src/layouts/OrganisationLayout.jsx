import React from 'react'
import { DashboardLayout } from '.'
import { PrimaryButton, SearchBar } from '../components'
import { useTheme } from '../context/theme'
import addIcon from '../assets/icons/addIcon.png'

/**
 * Shared layout for organisation detail pages (Overview, Projects, Team, Reports, Settings)
 * Handles the common header (title, primary button, search) and background layout.
 */
const OrganisationLayout = ({
  organisationName,
  primaryActionLabel,
  onPrimaryAction,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
}) => {
  const t = useTheme()

  return (
    <DashboardLayout>
      <div
        style={{
          padding: t.spacing(6),
          minHeight: '100vh',
          backgroundColor: t.colors.backgroundColor,
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: t.spacing(4),
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: t.spacing(4),
              flexWrap: 'wrap',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: t.font.size.display,
                fontWeight: t.font.weight.bold,
                color: t.colors.textHeadingDark,
                fontFamily: t.font.heading,
              }}
            >
              {organisationName}
            </h1>
            {primaryActionLabel && (
              <PrimaryButton
              icon={
                <img
                  src={addIcon}
                  alt="Add organisation"
                  style={{ width: 22, height: 22 }}
                />
              }
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </PrimaryButton>
            )}
          </div>

          {searchPlaceholder && onSearchChange && (
            <div
              style={{
                marginTop: t.spacing(4),
                maxWidth: '720px',
              }}
            >
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ marginTop: t.spacing(2) }}>{children}</div>
      </div>
    </DashboardLayout>
  )
}

export default OrganisationLayout




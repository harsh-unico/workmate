import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../layouts'
import { OrganisationCard, SecondaryButton, SearchBar, PrimaryButton } from '../../components'
import { useTheme } from '../../context/theme'
import { ROUTES } from '../../utils/constants'
import addIcon from '../../assets/icons/addIcon.png'

const Organisations = () => {
  const t = useTheme()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Dummy data - will be replaced with API data later
  const organisations = [
    { id: 1, name: 'Quantum Solutions', hasLogo: false, folders: 10, members: 10, projects: 10 },
    { id: 2, name: 'Quantum Solutions', hasLogo: true, folders: 10, members: 10, projects: 10 },
    { id: 3, name: 'Quantum Solutions', hasLogo: true, folders: 10, members: 10, projects: 10 },
    { id: 4, name: 'Quantum Solutions', hasLogo: true, folders: 10, members: 10, projects: 10 },
  ]

  const filteredOrganisations = organisations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div
        style={{
          padding: t.spacing(6),
          minHeight: '100vh',
          backgroundColor: t.colors.secondary,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: t.spacing(6),
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
            All Organisations
          </h1>
          <PrimaryButton
            icon={
              <img
                src={addIcon}
                alt="Add organisation"
                style={{ width: 22, height: 22 }}
              />
            }
            onClick={() => navigate(ROUTES.CREATE_ORGANISATION)}
          >
            Create Organisation
          </PrimaryButton>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: t.spacing(6) }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search organisations..."
          />
        </div>

        {/* Organisations Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: t.spacing(4),
          }}
        >
          {filteredOrganisations.map((org) => (
            <OrganisationCard key={org.id} organisation={org} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Organisations


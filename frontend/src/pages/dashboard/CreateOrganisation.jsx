import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../layouts'
import { PrimaryButton, RichTextEditor, DashboardSectionCard } from '../../components'
import { useTheme } from '../../context/theme'
import { ROUTES } from '../../utils/constants'
import building from '../../assets/icons/building.png'
import editIcon from '../../assets/icons/editIcon.png'

const teamSizeOptions = ['1 - 10', '11 - 25', '26 - 50', '51 - 100', '101 - 250', '250+']

const CreateOrganisation = () => {
  const t = useTheme()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    organisationName: '',
    email: '',
    contactNumber: '',
    description: '',
    teamSize: teamSizeOptions[0],
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
  })

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const inputStyle = {
    width: '100%',
    padding: t.spacing(3),
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(170, 173, 174, 0.2)',
    boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.06)',
    fontFamily: t.font.family,
    fontSize: t.font.size.md,
    color: '#111827',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: t.font.size.sm,
    color: '#111827',
    fontWeight: t.font.weight.medium,
    marginBottom: t.spacing(1),
  }

  const fieldWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing(1),
  }

  const renderTextField = (label, name, placeholder, type = 'text') => (
    <div style={fieldWrapperStyle}>
      <label style={labelStyle} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        value={formData[name]}
        onChange={handleChange(name)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    // Placeholder for submit logic
    console.log('Create organisation form data:', formData)
  }

  return (
    <DashboardLayout>
      <div
        style={{
          padding: t.spacing(6),
          minHeight: '100vh',
          backgroundColor: t.colors.backgroundColor,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '980px',
            margin: '0 auto',
            maxHeight: 'calc(100vh - 24px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: t.spacing(4) }}>
            <h1
              style={{
                margin: 0,
                fontSize: '36px',
                fontFamily: t.font.heading,
                color: '#0f172a',
              }}
            >
              Create New Organisation
            </h1>
            <p
              style={{
                marginTop: t.spacing(1),
                color: '#4b5563',
                fontFamily: t.font.family,
              }}
            >
              Set up new workspace for your team
            </p>
          </div>

          <DashboardSectionCard>
            <form
              className="auth-card-scroll"
              style={{
                maxHeight: 'calc(100vh - 190px)',
                overflowY: 'auto',
                paddingRight: `calc(${t.spacing(6)} + 4px)`,
              }}
              onSubmit={handleSubmit}
            >
            <div
              style={{
                paddingTop: t.spacing(6),
                display: 'flex',
                gap: t.spacing(6),
                marginBottom: t.spacing(6),
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  flex: '0 0 240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: t.spacing(2),
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '210px',
                    height: '210px',
                    borderRadius: '50%',
                    border: '2px dashed rgba(15, 23, 42, 0.15)',
                    background: 'radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 -10px 18px rgba(15, 23, 42, 0.08)',
                    overflow: 'visible',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      right: '6px',
                      bottom: '6px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={building}
                      alt="Organisation logo"
                      style={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        bottom: '-3%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        opacity: 0.2,
                        filter: 'grayscale(1)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 12px 20px rgba(15, 23, 42, 0.3)',
                      cursor: 'pointer',
                    }}
                  >
                    <img src={editIcon} alt="Edit logo" style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
                <span style={{ color: '#6b7280', fontSize: t.font.size.sm, textAlign: 'center' }}>
                  Upload organisation logo
                </span>
              </div>

              <div
                style={{
                  flex: '1 1 420px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: t.spacing(4),
                }}
              >
                {renderTextField('Organisation Name', 'organisationName', "Enter the organisation's name")}
                {renderTextField('Email', 'email', "Enter the organisation's email", 'email')}
                {renderTextField('Contact Number', 'contactNumber', "Enter the organisation's contact number")}
              </div>
            </div>

            <div style={{ marginBottom: t.spacing(4) }}>
              <label style={labelStyle} htmlFor="description">
                Description
              </label>
              <RichTextEditor
                id="description"
                value={formData.description}
                placeholder="Provide a short description for the organisation"
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                wrapperStyle={{
                  marginTop: t.spacing(1),
                }}
                minHeight={140}
              />
            </div>

            <div style={{ marginBottom: t.spacing(4) }}>
              <label style={labelStyle} htmlFor="teamSize">
                Team Size
              </label>
              <select
                id="teamSize"
                value={formData.teamSize}
                onChange={handleChange('teamSize')}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  backgroundImage:
                    'linear-gradient(45deg, transparent 50%, #94a3b8 50%), linear-gradient(135deg, #94a3b8 50%, transparent 50%)',
                  backgroundPosition: 'calc(100% - 20px) calc(50% - 4px), calc(100% - 12px) calc(50% - 4px)',
                  backgroundSize: '8px 8px, 8px 8px',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {teamSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: t.spacing(4) }}>
              <label style={labelStyle} htmlFor="address">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={handleChange('address')}
                  placeholder="Enter the Address"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: t.spacing(4),
                marginBottom: t.spacing(4),
              }}
            >
              <div style={fieldWrapperStyle}>
                <label style={labelStyle} htmlFor="country">
                  Country
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={handleChange('country')}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value=""></option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              <div style={fieldWrapperStyle}>
                <label style={labelStyle} htmlFor="state">
                  State
                </label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={handleChange('state')}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value=""></option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: t.spacing(4),
                marginBottom: t.spacing(6),
              }}
            >
              <div style={fieldWrapperStyle}>
                <label style={labelStyle} htmlFor="city">
                  City
                </label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={handleChange('city')}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value=""></option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="London">London</option>
                </select>
              </div>
              <div style={fieldWrapperStyle}>
                <label style={labelStyle} htmlFor="pincode">
                  Pincode
                </label>
                <input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleChange('pincode')}
                  placeholder="Enter the pincode"
                  style={inputStyle}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: t.spacing(3),
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => navigate(ROUTES.ORGANISATIONS)}
                style={{
                  padding: `${t.spacing(2.5)} ${t.spacing(6)}`,
                  borderRadius: t.radius.button,
                  border: '1px solid #cbd5f5',
                  backgroundColor: '#fff',
                  color: '#111827',
                  fontFamily: t.font.family,
                  fontSize: t.font.size.md,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <PrimaryButton type="submit" fullWidth={false}>
                Create Organisation
              </PrimaryButton>
            </div>
            </form>
          </DashboardSectionCard>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateOrganisation



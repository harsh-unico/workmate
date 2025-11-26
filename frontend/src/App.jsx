import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import OtpVerification from './pages/auth/OtpVerification'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import Organisations from './pages/dashboard/Organisations'
import CreateOrganisation from './pages/dashboard/CreateOrganisation'
import Notifications from './pages/dashboard/Notifications'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'
import OrganisationOverview from './pages/organisation/Overview'
import OrganisationProjects from './pages/organisation/Projects'
import OrganisationTeamMembers from './pages/organisation/TeamMembers'
import OrganisationSummaryReports from './pages/organisation/SummaryReports'
import OrganisationSettings from './pages/organisation/Settings'
import { ROUTES } from './utils/constants'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Signup />} />
        <Route path={ROUTES.OTP_VERIFICATION} element={<OtpVerification />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* Dashboard-level */}
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.ORGANISATIONS} element={<Organisations />} />
        <Route path={ROUTES.CREATE_ORGANISATION} element={<CreateOrganisation />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />

        {/* Organisation detail sub-pages */}
        <Route path="/organisations/:id/overview" element={<OrganisationOverview />} />
        <Route path="/organisations/:id/projects" element={<OrganisationProjects />} />
        <Route path="/organisations/:id/team" element={<OrganisationTeamMembers />} />
        <Route path="/organisations/:id/reports" element={<OrganisationSummaryReports />} />
        <Route path="/organisations/:id/settings" element={<OrganisationSettings />} />

        {/* Redirect root and any unknown paths to login */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

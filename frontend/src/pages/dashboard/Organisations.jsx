import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts";
import {
  OrganisationCard,
  SearchBar,
  PrimaryButton,
  ProfileDropdown,
} from "../../components";
import { useTheme } from "../../context/theme";
import { ROUTES } from "../../utils/constants";
import addIcon from "../../assets/icons/addIcon.png";
import sampleProfile from "../../assets/images/sampleProfile.png";

const Organisations = () => {
  const t = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dummy data - will be replaced with API data later
  const organisations = [
    {
      id: 1,
      name: "Quantum Solutions",
      hasLogo: false,
      folders: 10,
      members: 10,
      projects: 10,
    },
    {
      id: 2,
      name: "Quantum Solutions",
      hasLogo: true,
      folders: 10,
      members: 10,
      projects: 10,
    },
    {
      id: 3,
      name: "Quantum Solutions",
      hasLogo: true,
      folders: 10,
      members: 10,
      projects: 10,
    },
    {
      id: 4,
      name: "Quantum Solutions",
      hasLogo: true,
      folders: 10,
      members: 10,
      projects: 10,
    },
  ];

  const filteredOrganisations = organisations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout showSidebar={false}>
      <div
        style={{
          padding: t.spacing(6),
          minHeight: "100vh",
          backgroundColor: t.colors.secondary,
        }}
      >
        {/* Header with title and profile avatar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: t.spacing(4),
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: t.font.weight.bold,
              color: "#1f2937",
              fontFamily: t.font.heading, // Song Myung
            }}
          >
            All Organisations
          </h1>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "999px",
                border: "2px solid #d1d5db",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <img
                src={sampleProfile}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain",
                }}
              />
            </button>
            {isProfileOpen && (
              <ProfileDropdown onClose={() => setIsProfileOpen(false)} />
            )}
          </div>
        </div>

        {/* Search bar with Create Organisation button aligned to the right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: t.spacing(4),
            marginBottom: t.spacing(6),
          }}
        >
          <div style={{ flex: 1 }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search organisations..."
            />
          </div>
          <PrimaryButton
            icon={
              <img
                src={addIcon}
                alt="Add organisation"
                style={{ width: 16, height: 16 }}
              />
            }
            onClick={() => navigate(ROUTES.CREATE_ORGANISATION)}
          >
            Create Organisation
          </PrimaryButton>
        </div>

        {/* Organisations Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: t.spacing(4),
          }}
        >
          {filteredOrganisations.map((org) => (
            <OrganisationCard key={org.id} organisation={org} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Organisations;

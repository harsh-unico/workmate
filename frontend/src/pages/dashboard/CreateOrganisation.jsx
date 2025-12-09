import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts";
import {
  PrimaryButton,
  DashboardSectionCard,
  OrganisationForm,
} from "../../components";
import { useTheme } from "../../context/theme";
import { ROUTES } from "../../utils/constants";

const CreateOrganisation = () => {
  const t = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organisationName: "",
    email: "",
    contactNumber: "",
    description: "",
    teamSize: "1 - 10",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Placeholder for submit logic
    console.log("Create organisation form data:", formData);
  };

  return (
    <DashboardLayout>
      <div
        style={{
          padding: t.spacing(6),
          minHeight: "100vh",
          backgroundColor: t.colors.backgroundColor,
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "980px",
            margin: "0 auto",
            maxHeight: "calc(100vh - 24px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: t.spacing(4) }}>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                fontFamily: t.font.heading,
                color: "#0f172a",
              }}
            >
              Create New Organisation
            </h1>
            <p
              style={{
                marginTop: t.spacing(1),
                color: "#4b5563",
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
                maxHeight: "calc(100vh - 190px)",
                overflowY: "auto",
                paddingRight: `calc(${t.spacing(6)} + 4px)`,
              }}
              onSubmit={handleSubmit}
            >
              <OrganisationForm
                formData={formData}
                onFieldChange={handleFieldChange}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: t.spacing(3),
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ORGANISATIONS)}
                  style={{
                    padding: `${t.spacing(2.5)} ${t.spacing(6)}`,
                    borderRadius: t.radius.button,
                    border: "1px solid #cbd5f5",
                    backgroundColor: "#fff",
                    color: "#111827",
                    fontFamily: t.font.family,
                    fontSize: t.font.size.md,
                    cursor: "pointer",
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
  );
};

export default CreateOrganisation;

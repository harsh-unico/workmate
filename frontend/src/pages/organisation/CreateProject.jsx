import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import {
  DashboardSectionCard,
  PrimaryButton,
  ProjectForm,
} from "../../components";
import { useTheme } from "../../context/theme";

const initialFormData = {
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  teamSearch: "",
  teamMembers: [],
  attachments: [],
};

const CreateProject = () => {
  const t = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    // TODO: Replace with API call to create a project for this organisation.
    // For now, just log to the console.
    console.log("Create project for organisation:", id, formData);
  };

  const handleCancel = () => {
    navigate(`/organisations/${id}/projects`);
  };

  return (
    <OrganisationLayout
      organisationName="Create Project"
      primaryActionLabel="Create Project"
      onPrimaryAction={handleSubmit}
    >
      <DashboardSectionCard title="New Project Details">
        <form onSubmit={handleSubmit}>
          <ProjectForm formData={formData} onFieldChange={handleFieldChange} />

          <div
            style={{
              marginTop: t.spacing(4),
              display: "flex",
              justifyContent: "flex-end",
              gap: t.spacing(3),
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
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
              Create Project
            </PrimaryButton>
          </div>
        </form>
      </DashboardSectionCard>
    </OrganisationLayout>
  );
};

export default CreateProject;




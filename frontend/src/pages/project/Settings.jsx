import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import {
  DashboardSectionCard,
  PrimaryButton,
  ProjectForm,
} from "../../components";
import { DangerZoneSection } from "../../components";
import { useTheme } from "../../context/theme";

const initialFormData = {
  projectName: "Project Alpha",
  description:
    "A complete overhaul of the internal dashboard to improve performance, user experience, and data visualization capabilities for all cross-functional teams.",
  startDate: "2025-07-01",
  endDate: "2025-12-31",
  teamSearch: "",
  teamMembers: ["John Doe", "David Lee"],
  attachments: [],
};

const ProjectSettings = () => {
  const t = useTheme();
  const { projectId } = useParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const organisationName = "Quantum Solutions";
  const projectNameFromState = location.state?.projectName;
  const derivedProjectName =
    projectId && typeof projectId === "string"
      ? projectId
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "Project Alpha";

  const projectName = projectNameFromState || derivedProjectName;
  const headerTitle = `${organisationName} / ${projectName} /`;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (event) => {
    if (event) {
      event.preventDefault();
    }
    // Placeholder for save logic
    // eslint-disable-next-line no-console
    console.log("Save project settings for", projectName, formData);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  const handleDeleteProject = () => {
    // Placeholder for delete logic
    // eslint-disable-next-line no-console
    console.log("Delete project:", projectName);
  };

  return (
    <OrganisationLayout
      organisationName={headerTitle}
      primaryActionLabel="Save Changes"
      onPrimaryAction={handleSave}
      searchPlaceholder="Search settings..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardSectionCard title="Project Settings">
        <form onSubmit={handleSave}>
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
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </DashboardSectionCard>

      <DangerZoneSection
        title="Delete this project"
        description="Once you delete a project, there is no going back. Please be certain."
        buttonLabel="Delete Project"
        onButtonClick={handleDeleteProject}
      />
    </OrganisationLayout>
  );
};

export default ProjectSettings;

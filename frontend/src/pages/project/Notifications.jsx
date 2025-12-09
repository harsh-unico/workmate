import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { DashboardSectionCard } from "../../components";
import { useTheme } from "../../context/theme";

const ProjectNotifications = () => {
  const t = useTheme();
  const { projectId } = useParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

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
  const headerTitle = `${organisationName} / ${projectName} / Notifications`;

  return (
    <OrganisationLayout
      organisationName={headerTitle}
      searchPlaceholder="Search notifications..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardSectionCard title="Notifications">
        <p
          style={{
            margin: 0,
            color: t.colors.textBodyDark,
            fontSize: t.font.size.md,
          }}
        >
          This is a placeholder for project notifications. Show project-specific
          alerts, updates, and reminders here.
        </p>
      </DashboardSectionCard>
    </OrganisationLayout>
  );
};

export default ProjectNotifications;



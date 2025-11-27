import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { DashboardSectionCard } from "../../components";
import { useTheme } from "../../context/theme";

const OrganisationSettings = () => {
  const t = useTheme();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const organisationName = "Quantum Solutions";

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="Save Changes"
      onPrimaryAction={() => {}}
      searchPlaceholder="Search settings..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardSectionCard title="Settings">
        <p
          style={{
            margin: 0,
            color: t.colors.textMutedDark,
            fontSize: t.font.size.md,
          }}
        >
          This section will allow you to configure organisation-level settings
          such as roles, permissions, notifications, and integrations for{" "}
          {organisationName}. Replace this placeholder with the actual settings
          forms and controls.
        </p>
      </DashboardSectionCard>
    </OrganisationLayout>
  );
};

export default OrganisationSettings;

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import {
  DashboardSectionCard,
  OrganisationForm,
  PrimaryButton,
} from "../../components";
import { DangerZoneSection } from "../../components";
import { useTheme } from "../../context/theme";
import DeleteOrganisationPopup from "./DeleteOrganisationPopup";

const initialFormData = {
  organisationName: "Unico International",
  email: "unico@gmail.com",
  contactNumber: "9764138525",
  description:
    "The central hub for managing all team tasks, projects and collaboration efforts. Our mission is to streamline workflows and boost productivity.",
  teamSize: "1 - 10",
  address: "17/152/5 Neeladri nagara, Doddathogur",
  country: "India",
  state: "Karnataka",
  city: "Bangalore",
  pincode: "560087",
};

const OrganisationSettings = () => {
  const t = useTheme();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const organisationName = formData.organisationName || "Organisation Settings";

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
    // Placeholder for update logic
    console.log("Update organisation settings for id:", id, formData);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const handleConfirmDelete = (typedName) => {
    console.log("Delete organisation:", { id, typedName, organisationName });
    setIsDeleteOpen(false);
  };

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="Save Changes"
      onPrimaryAction={handleSubmit}
      searchPlaceholder="Search settings..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardSectionCard title="Organisation Settings">
        <form onSubmit={handleSubmit}>
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
        title="Delete this organisation"
        description="Once you delete an organisation, there is no going back. Please be certain."
        buttonLabel="Delete Organisation"
        onButtonClick={handleOpenDelete}
      />

      <DeleteOrganisationPopup
        isOpen={isDeleteOpen}
        organisationName={organisationName}
        onCancel={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </OrganisationLayout>
  );
};

export default OrganisationSettings;

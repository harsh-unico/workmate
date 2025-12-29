import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { DashboardSectionCard, PrimaryButton, TaskForm } from "../../components";
import { useTheme } from "../../context/theme";
import addIcon from "../../assets/icons/addIcon.png";

const initialFormData = {
  taskName: "",
  description: "",
  assigneeSearch: "",
  assignees: [],
  startDate: "",
  dueDate: "",
  priority: "Medium",
  status: "To do",
  attachments: [],
};

const CreateTask = () => {
  const t = useTheme();
  const { id, projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from;
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
  const headerTitle = "Create New Task";

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
    // TODO: Replace with API call to create a task for this project.
    // eslint-disable-next-line no-console
    console.log("Create task for project:", projectName, formData);

    // Return to the page this form was opened from (fallback: tasks list)
    navigate(returnTo || `/organisations/${id}/projects/${projectId}/tasks`);
  };

  const handleCancel = () => {
    navigate(returnTo || `/organisations/${id}/projects/${projectId}/tasks`);
  };

  return (
    <OrganisationLayout
      organisationName={headerTitle}
      primaryActionLabel="Create Task"
      onPrimaryAction={handleSubmit}
      searchPlaceholder=""
      searchValue=""
      onSearchChange={undefined}
    >
      <p
        style={{
          margin: 0,
          marginBottom: t.spacing(4),
          color: t.colors.textMutedDark,
          fontSize: t.font.size.sm,
        }}
      >
        Log a task to organize and prioritize work for{" "}
        <strong>{organisationName}</strong> / <strong>{projectName}</strong>.
      </p>

      <DashboardSectionCard title="">
        <form onSubmit={handleSubmit}>
          <TaskForm formData={formData} onFieldChange={handleFieldChange} />

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
            <PrimaryButton
              type="submit"
              fullWidth={false}
              icon={
                <img
                  src={addIcon}
                  alt="Create task"
                  style={{ width: 18, height: 18 }}
                />
              }
            >
              Create Task
            </PrimaryButton>
          </div>
        </form>
      </DashboardSectionCard>
    </OrganisationLayout>
  );
};

export default CreateTask;



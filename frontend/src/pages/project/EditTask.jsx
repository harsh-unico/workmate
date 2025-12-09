import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { DashboardSectionCard, PrimaryButton, TaskForm } from "../../components";
import { useTheme } from "../../context/theme";

const baseInitialFormData = {
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

const EditTask = () => {
  const t = useTheme();
  const { id, projectId, taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const organisationName = "Quantum Solutions";
  const projectNameFromState = location.state?.projectName;
  const taskFromState = location.state?.task || {};

  const derivedProjectName =
    projectId && typeof projectId === "string"
      ? projectId
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "Project Alpha";

  const projectName = projectNameFromState || derivedProjectName;

  const initialFormData = {
    ...baseInitialFormData,
    taskName: taskFromState.title || baseInitialFormData.taskName,
    description: taskFromState.description || baseInitialFormData.description,
    dueDate: taskFromState.dueDate || baseInitialFormData.dueDate,
    priority: taskFromState.priority || baseInitialFormData.priority,
    status: taskFromState.status || baseInitialFormData.status,
    attachments: taskFromState.attachments || baseInitialFormData.attachments,
  };

  const [formData, setFormData] = useState(initialFormData);

  const headerBreadcrumb = `Edit Task`;

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
    // TODO: Replace with API call to update a task for this project.
    // eslint-disable-next-line no-console
    console.log("Update task", taskId, "for project:", projectName, formData);
  };

  const handleCancel = () => {
    navigate(`/organisations/${id}/projects/${projectId}/tasks/${taskId}`, {
      state: { projectName, task: taskFromState },
    });
  };

  return (
    <OrganisationLayout
      organisationName={headerBreadcrumb}
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
        Update details for{" "}
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
            <PrimaryButton type="submit" fullWidth={false}>
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </DashboardSectionCard>
    </OrganisationLayout>
  );
};

export default EditTask;



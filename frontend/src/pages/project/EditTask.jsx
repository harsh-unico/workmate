import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { DashboardSectionCard, PrimaryButton, TaskForm } from "../../components";
import { useTheme } from "../../context/theme";
import { getOrganisationById } from "../../services/orgService";
import { getProjectById } from "../../services/projectService";
import { listProjectMembers } from "../../services/projectMemberService";

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

  const [orgName, setOrgName] = useState("");
  const [projName, setProjName] = useState(location.state?.projectName || "");
  const [memberOptions, setMemberOptions] = useState([]);
  const taskFromState = location.state?.task || {};

  useEffect(() => {
    const orgId = id;
    const pid = projectId;
    if (!orgId || !pid) return;
    let cancelled = false;
    (async () => {
      try {
        const [orgRes, projRes, membersRes] = await Promise.all([
          getOrganisationById(orgId),
          getProjectById(pid),
          listProjectMembers({ projectId: pid }),
        ]);
        if (cancelled) return;
        setOrgName(orgRes?.data?.org_name || "");
        setProjName(projRes?.data?.name || "");

        const rows = Array.isArray(membersRes?.data) ? membersRes.data : [];
        const options = rows
          .map((r) => r?.user)
          .filter((u) => u && u.email)
          .map((u) => ({ id: u.id, email: u.email, name: u.name }));
        setMemberOptions(options);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, projectId]);

  const breadcrumbLabel = `${orgName || "Organisation"} / ${projName || "Project"} /`;

  const initialFormData = {
    ...baseInitialFormData,
    taskName: taskFromState.title || baseInitialFormData.taskName,
    description: taskFromState.description || baseInitialFormData.description,
    dueDate: taskFromState.dueDate || baseInitialFormData.dueDate,
    priority: taskFromState.priority || baseInitialFormData.priority,
    status: taskFromState.status || baseInitialFormData.status,
    attachments: taskFromState.attachments || baseInitialFormData.attachments,
    assignees: taskFromState.assignee?.email ? [taskFromState.assignee.email] : baseInitialFormData.assignees,
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
    console.log("Update task", taskId, "for project:", projName || projectId, formData);
  };

  const handleCancel = () => {
    navigate(`/organisations/${id}/projects/${projectId}/tasks/${taskId}`, {
      state: { projectName: projName, task: taskFromState },
    });
  };

  return (
    <OrganisationLayout
      organisationName={breadcrumbLabel}
      pageTitle={headerBreadcrumb}
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
        <strong>{orgName || "Organisation"}</strong> / <strong>{projName || "Project"}</strong>.
      </p>

      <DashboardSectionCard title="">
        <form onSubmit={handleSubmit}>
          <TaskForm
            formData={formData}
            onFieldChange={handleFieldChange}
            memberOptions={memberOptions}
          />

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



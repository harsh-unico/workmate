import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import {
  TaskCard,
  PriorityFilterDropdown,
  AssigneeFilterDropdown,
  SortFilterDropdown,
} from "../../components";
import { useTheme } from "../../context/theme";
import addIcon from "../../assets/icons/addIcon.png";

const TASK_COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: 1,
        priority: "High",
        title:
          "Research Competitor APIs for new feature integration into the project",
        due: "Nov 30, 2025",
        assigneeInitials: "JD",
        avatarColor: "#22c55e",
      },
      {
        id: 2,
        priority: "Medium",
        title: "Design Registration Flow",
        due: "Nov 30, 2025",
        assigneeInitials: "AM",
        avatarColor: "#facc15",
      },
      {
        id: 3,
        priority: "Low",
        title: "Setup Dev Environment",
        due: "Nov 30, 2025",
        assigneeInitials: "SR",
        avatarColor: "#f97316",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: 4,
        priority: "High",
        title: "Create Authentication Flow",
        due: "Nov 30, 2025",
        assigneeInitials: "AR",
        avatarColor: "#3b82f6",
      },
    ],
  },
  {
    id: "in-review",
    title: "In Review",
    tasks: [
      {
        id: 5,
        priority: "Medium",
        title: "Database Schema Design",
        due: "Nov 30, 2025",
        assigneeInitials: "SJ",
        avatarColor: "#f97316",
      },
      {
        id: 6,
        priority: "High",
        title: "User Profile Page UI",
        due: "Nov 30, 2025",
        assigneeInitials: "DL",
        avatarColor: "#3b82f6",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: 7,
        priority: "Low",
        title: "Project Kickoff Meeting",
        due: "Nov 30, 2025",
        assigneeInitials: "MR",
        avatarColor: "#10b981",
      },
    ],
  },
];

const ProjectTasks = () => {
  const t = useTheme();
  const { id, projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(["High", "Medium", "Low"]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState([]);
  const [sortOption, setSortOption] = useState("due-desc");

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

  const filteredColumns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const activePriorities =
      priorityFilter && priorityFilter.length ? priorityFilter : ["High", "Medium", "Low"];

    const sortByDueDate = (a, b) => {
      const aDate = new Date(a.due);
      const bDate = new Date(b.due);
      if (Number.isNaN(aDate) || Number.isNaN(bDate)) return 0;
      return sortOption === "due-asc" ? aDate - bDate : bDate - aDate;
    };

    return TASK_COLUMNS.map((column) => {
      let tasks = column.tasks.slice();

      if (query) {
        tasks = tasks.filter((task) =>
          `${task.title} ${task.priority}`.toLowerCase().includes(query)
        );
      }

      tasks = tasks.filter((task) => activePriorities.includes(task.priority));

      tasks.sort(sortByDueDate);

      return {
        ...column,
        tasks,
      };
    });
  }, [searchQuery, priorityFilter, sortOption]);

  const handleTaskClick = (task) => {
    navigate(
      `/organisations/${id}/projects/${projectId}/tasks/${task.id}`,
      {
        state: {
          projectName,
          task,
        },
      }
    );
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return {
          backgroundColor: "rgba(248, 113, 113, 0.15)",
          color: "#b91c1c",
        };
      case "Medium":
        return {
          backgroundColor: "rgba(234, 179, 8, 0.15)",
          color: "#92400e",
        };
      case "Low":
      default:
        return {
          backgroundColor: "rgba(34, 197, 94, 0.15)",
          color: "#15803d",
        };
    }
  };

  const renderTaskCard = (task) => {
    return (
      <TaskCard
        key={task.id}
        priority={task.priority}
        title={task.title}
        dueDate={task.due}
        assigneeInitials={task.assigneeInitials}
        avatarColor={task.avatarColor}
        onClick={() => handleTaskClick(task)}
      />
    );
  };

  const handleClearFilters = () => {
    setPriorityFilter(["High", "Medium", "Low"]);
    setAssigneeSearch("");
    setAssigneeFilter([]);
    setSortOption("due-desc");
    setSearchQuery("");
  };

  return (
    <OrganisationLayout
      organisationName={headerTitle}
      primaryActionLabel="Create Task"
      primaryActionIcon={
        <img
          src={addIcon}
          alt="Create task"
          style={{ width: 16, height: 16 }}
        />
      }
      onPrimaryAction={() =>
        navigate(`/organisations/${id}/projects/${projectId}/tasks/create`, {
          state: { projectName },
        })
      }
      searchPlaceholder="Search tasks..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* Filters row */}
      <div
        style={{
          display: "flex",
          gap: t.spacing(3),
          marginTop: t.spacing(3),
          marginBottom: t.spacing(4),
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <PriorityFilterDropdown
          selected={priorityFilter}
          onChange={setPriorityFilter}
        />
        <AssigneeFilterDropdown
          search={assigneeSearch}
          selected={assigneeFilter}
          onSearchChange={setAssigneeSearch}
          onSelectedChange={setAssigneeFilter}
        />
        <SortFilterDropdown value={sortOption} onChange={setSortOption} />

        <button
          type="button"
          onClick={handleClearFilters}
          style={{
            marginLeft: "auto",
            padding: `${t.spacing(1.5)} ${t.spacing(3)}`,
            borderRadius: "999px",
            border: "none",
            backgroundColor: "transparent",
            color: t.colors.link,
            fontSize: t.font.size.sm,
            fontWeight: t.font.weight.medium,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Clear all
        </button>
      </div>

      {/* Kanban columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: t.spacing(4),
        }}
      >
        {filteredColumns.map((column) => (
          <div
            key={column.id}
            style={{
              backgroundColor: t.colors.taskSectionBackground,
              borderRadius: "18px",
              padding: t.spacing(3),
              minHeight: "480px",
              display: "flex",
              flexDirection: "column",
              gap: t.spacing(3),
            }}
          >
            <div
              style={{
                fontSize: t.font.size.md,
                fontWeight: t.font.weight.semiBold,
                color: t.colors.textHeadingDark,
              }}
            >
              {column.title}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: t.spacing(3),
              }}
            >
              {column.tasks.map((task) => renderTaskCard(task))}
            </div>
          </div>
        ))}
      </div>
    </OrganisationLayout>
  );
};

export default ProjectTasks;

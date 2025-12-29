import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { StatsCard, DashboardSectionCard } from "../../components";
import { useTheme } from "../../context/theme";
import addIcon from "../../assets/icons/addIcon.png";

const ProjectOverview = () => {
  const t = useTheme();
  const { id, projectId } = useParams();
  const navigate = useNavigate();
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

  const headerTitle = `${organisationName} / ${projectName} /`;

  const overallProgressValue =
    typeof location.state?.overallProgress === "number"
      ? location.state.overallProgress
      : 75;

  const stats = [
    {
      label: "Overall Progress",
      value: `${overallProgressValue}%`,
      delta: null,
      progress: overallProgressValue,
    },
    {
      label: "Total Tasks",
      value: 124,
      delta: "+ 12 this week",
    },
    {
      label: "Tasks Completed",
      value: 93,
      delta: "+ 8 this week",
    },
    {
      label: "Tasks Overdue",
      value: 5,
      delta: "+ 1 from yesterday",
    },
  ];

  const teamMembers = [
    { name: "Arthur Morgan", role: "Lead Developer", contribution: 10 },
    { name: "Saddie Adler", role: "QA Tester", contribution: 22 },
    { name: "John Mark", role: "UI/UX Designer", contribution: 30 },
    { name: "Emily Ray", role: "Junior Developer", contribution: 45 },
    { name: "Jane Doe", role: "Marketing Specialist", contribution: 70 },
  ];

  const activityFeed = [
    {
      id: 1,
      description: "Saddie Adler completed task API integration.",
      time: "2 hours ago",
    },
    {
      id: 2,
      description:
        "Arthur Morgan commented on the task Website Redesign.",
      time: "8 hours ago",
    },
    {
      id: 3,
      description: "Jane Doe was added to the project.",
      time: "1 day ago",
    },
    {
      id: 4,
      description: "Mike Ross uploaded a new file to Model Training.",
      time: "2 days ago",
    },
  ];

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
          state: { projectName, from: `${location.pathname}${location.search}` },
        })
      }
      searchPlaceholder="Search tasks..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: t.spacing(4),
        }}
      >
        {/* Top Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: t.spacing(4),
          }}
        >
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              delta={stat.delta}
              progress={stat.progress}
            />
          ))}
        </div>

        {/* Bottom Content Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.5fr)",
            gap: t.spacing(4),
          }}
        >
          {/* Team Members */}
          <DashboardSectionCard
            title="Team Members"
            actionLabel="View All"
            onAction={() => {}}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: t.spacing(3),
              }}
            >
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr) auto",
                    alignItems: "center",
                    columnGap: t.spacing(3),
                    rowGap: t.spacing(1),
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: t.font.size.md,
                        fontWeight: t.font.weight.semiBold,
                        color: t.colors.textHeadingDark,
                      }}
                    >
                      {member.name}
                    </div>
                    <div
                      style={{
                        fontSize: t.font.size.sm,
                        color: t.colors.textMutedDark,
                      }}
                    >
                      {member.role}
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "999px",
                      backgroundColor: t.colors.progressTrack,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${member.contribution}%`,
                        height: "100%",
                        backgroundColor: t.colors.progressBar,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: t.font.size.xs,
                      color: t.colors.textMutedDark,
                      textAlign: "right",
                      minWidth: "80px",
                    }}
                  >
                    Contribution: {member.contribution}%
                  </div>
                </div>
              ))}
            </div>
          </DashboardSectionCard>

          {/* Activity Feed */}
          <DashboardSectionCard
            title="Activity Feed"
            actionLabel="View All"
            onAction={() => {}}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: t.spacing(2.5),
              }}
            >
              {activityFeed.map((item) => (
                <div key={item.id}>
                  <div
                    style={{
                      fontSize: t.font.size.sm,
                      color: t.colors.textHeadingDark,
                      marginBottom: t.spacing(0.5),
                    }}
                  >
                    {item.description}
                  </div>
                  <div
                    style={{
                      fontSize: t.font.size.xs,
                      color: t.colors.textMutedDark,
                    }}
                  >
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </DashboardSectionCard>
        </div>
      </div>
    </OrganisationLayout>
  );
};

export default ProjectOverview;



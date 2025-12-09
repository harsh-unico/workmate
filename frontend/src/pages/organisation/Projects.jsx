import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { ProjectCard } from "../../components";
import { useTheme } from "../../context/theme";
import addIcon from "../../assets/icons/addIcon.png";

const OrganisationProjects = () => {
  const t = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Temporary mock data – replace with API data later, ideally fetched using `id`
  const organisationName = "Quantum Solutions";

  const projects = [
    {
      id: "project-alpha",
      name: "Project Alpha",
      due: "Nov 30, 2025",
      progress: 70,
      members: 5,
    },
    {
      id: "api-integration",
      name: "API Integration",
      due: "Dec 05, 2025",
      progress: 45,
      members: 4,
    },
    {
      id: "mobile-app-development",
      name: "Mobile App Development",
      due: "Dec 22, 2025",
      progress: 30,
      members: 8,
    },
    {
      id: "model-training",
      name: "Model Training",
      due: "Jan 15, 2026",
      progress: 22,
      members: 3,
    },
    {
      id: "market-research",
      name: "Market Research",
      due: "Jan 31, 2026",
      progress: 10,
      members: 5,
    },
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <OrganisationLayout
      organisationName={organisationName}
      primaryActionLabel="Create Project"
      primaryActionIcon={
        <img
          src={addIcon}
          alt="Create project"
          style={{ width: 16, height: 16 }}
        />
      }
      onPrimaryAction={() => navigate(`/organisations/${id}/projects/create`)}
      searchPlaceholder="Search project, tasks, or members..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div style={{ marginTop: t.spacing(2) }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.spacing(4),
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: t.spacing(4),
            }}
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() =>
                  navigate(
                    `/organisations/${id}/projects/${project.id}/overview`,
                    {
                      state: {
                        projectName: project.name,
                        overallProgress: project.progress,
                      },
                    }
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </OrganisationLayout>
  );
};

export default OrganisationProjects;

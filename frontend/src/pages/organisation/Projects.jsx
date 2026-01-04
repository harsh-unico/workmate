import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { ProjectCard, Loader } from "../../components";
import { useTheme } from "../../context/theme";
import addIcon from "../../assets/icons/addIcon.png";
import {
  getOrganisationById,
  getOrganisationProjects,
} from "../../services/orgService";

const OrganisationProjects = () => {
  const t = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const [org, setOrg] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const organisationName = org?.org_name || "Organisation";

  useEffect(() => {
    const orgId = id;
    if (!orgId) return;

    let cancelled = false;
    setIsLoading(true);
    setError("");

    (async () => {
      try {
        const [orgRes, projectsRes] = await Promise.all([
          getOrganisationById(orgId),
          getOrganisationProjects(orgId),
        ]);

        if (cancelled) return;

        setOrg(orgRes?.data || null);

        const list = Array.isArray(projectsRes?.data) ? projectsRes.data : [];
        // Map backend projects -> ProjectCard expected shape
        const mapped = list.map((p) => ({
          id: p.id,
          name: p.name,
          due: p.end_date ? new Date(p.end_date).toLocaleDateString() : "—",
          progress: 0, // not available yet in backend
          members: 0, // not available yet in backend
        }));
        setProjects(mapped);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load organisation projects:", err);
        setError(err?.message || "Failed to load projects.");
        setOrg(null);
        setProjects([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return projects;
    return projects.filter((project) => project.name.toLowerCase().includes(q));
  }, [projects, searchQuery]);

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
      onPrimaryAction={() =>
        navigate(`/organisations/${id}/projects/create`, {
          state: { from: `${location.pathname}${location.search}` },
        })
      }
      searchPlaceholder="Search project, tasks, or members..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div style={{ marginTop: t.spacing(2) }}>
        {error && (
          <div
            style={{
              marginBottom: t.spacing(4),
              padding: t.spacing(2),
              borderRadius: t.radius.card,
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        )}
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
              // Keep cards a consistent size (don't stretch when there are few items)
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 260px))",
              justifyContent: "start",
              gap: t.spacing(4),
            }}
          >
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                  gridColumn: "1 / -1",
                }}
              >
                <Loader size={48} />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div>No projects found.</div>
            ) : (
              filteredProjects.map((project) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </OrganisationLayout>
  );
};

export default OrganisationProjects;

import React, { useState } from "react";
import { DashboardLayout } from "../../layouts";
import { SearchBar } from "../../components";
import { useTheme } from "../../context/theme";
import AboutProjectCard from "./AboutProjectCard";
import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeTaskBoard from "./EmployeeTaskBoard";

const EMPLOYEE_PROJECTS = ["Project Alpha", "Project Beta", "Project Gamma"];

const EmployeeDashboard = () => {
  const t = useTheme();
  const [activeProject, setActiveProject] = useState("Project Beta");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout showSidebar={false}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: t.colors.pageBackground,
        }}
      >
        {/* Left project list sidebar (modular component) */}
        <EmployeeSidebar
          projects={EMPLOYEE_PROJECTS}
          activeProject={activeProject}
          onProjectChange={setActiveProject}
        />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: t.spacing(6),
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Header row (modular component) */}
          <EmployeeHeader activeProject={activeProject} />

          {/* Search bar matching other screens */}
          <div style={{ marginBottom: t.spacing(4) }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks..."
            />
          </div>

          {/* Project description card with popup (modular component) */}
          <div style={{ marginBottom: t.spacing(4) }}>
            <AboutProjectCard projectName={activeProject} />
          </div>

          {/* Task filters + Kanban board (modular component) */}
          <EmployeeTaskBoard
            searchQuery={searchQuery}
            activeProject={activeProject}
          />
        </main>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;

import React from "react";
import { useTheme } from "../context/theme";
import { EmployeeSidebar } from "../components/layout";
import { SearchBar } from "../components";

const EmployeeLayout = ({
  pageTitle = "Employee Dashboard",
  primaryActionLabel,
  primaryActionDisabled = false,
  onPrimaryAction,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  projects = [],
  selectedProjectId,
  onSelectProject,
  children,
}) => {
  const t = useTheme();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: t.colors.pageBackground,
        fontFamily: t.font.family,
      }}
    >
      <EmployeeSidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={{
            padding: t.spacing(6),
            minHeight: "100vh",
            backgroundColor: t.colors.backgroundColor,
          }}
        >
          <div style={{ marginBottom: t.spacing(4) }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: t.spacing(4),
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: t.font.size.display,
                  fontWeight: t.font.weight.bold,
                  color: t.colors.textHeadingDark,
                  fontFamily: t.font.heading,
                }}
              >
                {pageTitle}
              </h1>

              {primaryActionLabel ? (
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  disabled={primaryActionDisabled}
                  style={{
                    padding: `${t.spacing(2)} ${t.spacing(5)}`,
                    borderRadius: t.radius.button,
                    border: "none",
                    backgroundColor: t.colors.primary,
                    color: "#ffffff",
                    cursor: primaryActionDisabled ? "not-allowed" : "pointer",
                    opacity: primaryActionDisabled ? 0.7 : 1,
                    fontFamily: t.font.family,
                    fontSize: t.font.size.md,
                    whiteSpace: "nowrap",
                  }}
                >
                  {primaryActionLabel}
                </button>
              ) : null}
            </div>

            {searchPlaceholder && onSearchChange ? (
              <div style={{ marginTop: t.spacing(4), maxWidth: "720px" }}>
                <SearchBar
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: t.spacing(2) }}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;



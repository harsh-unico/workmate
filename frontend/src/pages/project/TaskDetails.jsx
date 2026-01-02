import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OrganisationLayout } from "../../layouts";
import { AttachmentList, DashboardSectionCard } from "../../components";
import { useTheme } from "../../context/theme";
import editIconBlack from "../../assets/icons/editIconBlack.png";
import attachmentIcon from "../../assets/icons/attachment.png";
import fileIcon from "../../assets/icons/fileIcon.png";
import imageIcon from "../../assets/icons/imageIcon.png";
import downloadIcon from "../../assets/icons/download.png";
import { getOrganisationById } from "../../services/orgService";
import { getProjectById } from "../../services/projectService";

const DEFAULT_TASK = {
  id: 1,
  title: "Design New Landing Page",
  status: "In Progress",
  description:
    "Create 3–5 high-fidelity mockups for the new homepage based on the provided wireframes. Focus on a clean, modern aesthetic and ensure the design is responsive for mobile and desktop. Include variations for both light and dark themes.",
  assignee: {
    name: "Alex Garfield",
    initials: "AG",
  },
  dueDate: "Dec 28, 2025",
  priority: "High",
  attachments: [
    {
      id: "wireframes",
      name: "Wireframes.fig",
      size: 125 * 1024 * 1024,
      type: "Figma",
    },
    {
      id: "screen",
      name: "Screen.png",
      size: 3.1 * 1024 * 1024,
      type: "PNG Image",
    },
  ],
};

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: "Ann Rayman",
    initials: "AR",
    timestamp: "2 days ago",
    text: "Just reviewed the wireframes. They look solid! Ready to start on the visual design.",
  },
  {
    id: 2,
    author: "Michael",
    initials: "M",
    timestamp: "1 day ago",
    text: "Great to hear! Let me know if you need any assets for the mockups.",
  },
  {
    id: 3,
    author: "Olivia",
    initials: "O",
    timestamp: "4 hours ago",
    text: "Remember to include the new CTA button variants we discussed in the design system.",
  },
];

const STATUS_OPTIONS = ["To do", "In Progress", "In Review", "Done"];

const TaskDetails = () => {
  const t = useTheme();
  const { id, projectId, taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [commentAttachments, setCommentAttachments] = useState([]);
  const commentFileInputRef = useRef(null);

  const [orgName, setOrgName] = useState("");
  const [projName, setProjName] = useState(location.state?.projectName || "");
  const projectNameFromState = location.state?.projectName;
  const taskFromState = location.state?.task;

  useEffect(() => {
    const orgId = id;
    const pid = projectId;
    if (!orgId || !pid) return;
    let cancelled = false;
    (async () => {
      try {
        const [orgRes, projRes] = await Promise.all([
          getOrganisationById(orgId),
          getProjectById(pid),
        ]);
        if (cancelled) return;
        setOrgName(orgRes?.data?.org_name || "");
        setProjName(projRes?.data?.name || "");
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, projectId]);

  const projectName = projectNameFromState || projName || projectId;
  const task = { ...DEFAULT_TASK, ...taskFromState };

  const breadcrumbLabel = useMemo(
    () => `${orgName || "Organisation"} / ${projectName || "Project"} /`,
    [orgName, projectName]
  );

  const getCommentAttachmentIcon = (file) => {
    const name = (file?.name || "").toLowerCase();
    if (/\.(png|jpe?g|gif|webp|svg)$/.test(name)) {
      return imageIcon;
    }
    return fileIcon;
  };

  const openLocalAttachment = (file) => {
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to preview attachment:", error);
    }
  };

  const downloadLocalAttachment = (file) => {
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name || "attachment";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to download attachment:", error);
    }
  };

  const handleCommentAttachmentClick = () => {
    if (commentFileInputRef.current) {
      commentFileInputRef.current.click();
    }
  };

  const handleCommentFilesSelected = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setCommentAttachments((prev) => [...prev, ...files]);
    // reset input so selecting the same file again still triggers change
    // eslint-disable-next-line no-param-reassign
    event.target.value = "";
  };

  const handleAddComment = (event) => {
    if (event) {
      event.preventDefault();
    }
    const value = newComment.trim();
    if (!value && commentAttachments.length === 0) return;

    const next = {
      id: comments.length + 1,
      author: "You",
      initials: "Y",
      timestamp: "Just now",
      text: value,
      attachments: commentAttachments,
    };

    setComments([next, ...comments]);
    setNewComment("");
    setCommentAttachments([]);
  };

  const renderStatusChip = (statusOption) => {
    const isActive = statusOption.toLowerCase() === task.status.toLowerCase();

    return (
      <button
        key={statusOption}
        type="button"
        style={{
          padding: `${t.spacing(1.5)} ${t.spacing(3)}`,
          borderRadius: "8px",
          border: isActive
            ? `1px solid ${t.colors.primary}`
            : `1px solid ${t.colors.cardBorder}`,
          backgroundColor: isActive
            ? "rgba(37, 99, 235, 0.06)"
            : t.colors.cardBackground,
          color: isActive ? t.colors.primary : t.colors.textBodyDark,
          fontSize: t.font.size.sm,
          fontFamily: t.font.family,
          cursor: "default",
        }}
      >
        {statusOption}
      </button>
    );
  };

  const renderPriorityBadge = (value) => {
    let backgroundColor = "rgba(34, 197, 94, 0.15)";
    let textColor = "#15803d";

    if (value === "High") {
      backgroundColor = "rgba(248, 113, 113, 0.15)";
      textColor = "#b91c1c";
    } else if (value === "Medium") {
      backgroundColor = "rgba(234, 179, 8, 0.15)";
      textColor = "#92400e";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: `${t.spacing(0.5)} ${t.spacing(2)}`,
          borderRadius: "999px",
          backgroundColor,
          color: textColor,
          fontSize: t.font.size.xs,
          fontWeight: t.font.weight.medium,
        }}
      >
        {value}
      </span>
    );
  };

  const renderComment = (comment) => (
    <div
      key={comment.id}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: t.spacing(3),
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "999px",
          backgroundColor: "#f97316",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: t.font.weight.semiBold,
          fontSize: t.font.size.sm,
          flexShrink: 0,
        }}
      >
        {comment.initials}
      </div>
      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: t.spacing(1.5),
            marginBottom: t.spacing(1),
          }}
        >
          <span
            style={{
              fontWeight: t.font.weight.semiBold,
              fontSize: t.font.size.sm,
              color: t.colors.textHeadingDark,
            }}
          >
            {comment.author}
          </span>
          <span
            style={{
              fontSize: t.font.size.xs,
              color: t.colors.textMutedDark,
            }}
          >
            {comment.timestamp}
          </span>
        </div>
        {comment.text && (
          <p
            style={{
              margin: 0,
              marginBottom: t.spacing(1),
              fontSize: t.font.size.sm,
              color: t.colors.textBodyDark,
            }}
          >
            {comment.text}
          </p>
        )}

        {comment.attachments && comment.attachments.length > 0 && (
          <div
            style={{
              marginBottom: t.spacing(1.5),
              display: "flex",
              flexWrap: "wrap",
              gap: t.spacing(1.5),
            }}
          >
            {comment.attachments.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: `${t.spacing(1)} ${t.spacing(1.75)}`,
                  borderRadius: "999px",
                  backgroundColor: "transparent",
                  color: t.colors.textBodyDark,
                  fontSize: t.font.size.xs,
                  gap: t.spacing(1),
                  maxWidth: 260,
                }}
              >
                <button
                  type="button"
                  onClick={() => openLocalAttachment(file)}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    margin: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: t.spacing(1),
                    cursor: "pointer",
                    maxWidth: "100%",
                  }}
                >
                  <img
                    src={getCommentAttachmentIcon(file)}
                    alt="Attachment"
                    style={{ width: 14, height: 14, objectFit: "contain" }}
                  />
                  <span
                    title={file.name}
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadLocalAttachment(file)}
                  style={{
                    marginLeft: t.spacing(0.5),
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label={`Download ${file.name}`}
                >
                  <img
                    src={downloadIcon}
                    alt="Download"
                    style={{ width: 12, height: 12, objectFit: "contain" }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          style={{
            border: "none",
            background: "none",
            padding: 0,
            fontSize: t.font.size.xs,
            color: t.colors.link,
            cursor: "pointer",
          }}
        >
          Reply
        </button>
      </div>
    </div>
  );

  return (
    <OrganisationLayout
      organisationName={breadcrumbLabel}
      pageTitle={task.title}
      showSidebar={false}
    >
      {/* Status row */}
      <div
        style={{
          marginBottom: t.spacing(4),
          display: "flex",
          flexWrap: "wrap",
          gap: t.spacing(2),
        }}
      >
        {STATUS_OPTIONS.map((status) => renderStatusChip(status))}
      </div>

      {/* Top row: description + side card with equal height */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 1.2fr)",
          gap: t.spacing(4),
          alignItems: "stretch",
          marginBottom: t.spacing(4),
        }}
      >
        <DashboardSectionCard title="">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: t.spacing(3),
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: t.font.size.lg,
                  fontWeight: t.font.weight.semiBold,
                  color: t.colors.textHeadingDark,
                }}
              >
                Description
              </h3>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/organisations/${id}/projects/${projectId}/tasks/${taskId}/edit`,
                    {
                      state: {
                        projectName,
                        task,
                      },
                    }
                  )
                }
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: t.spacing(1),
                  borderRadius: "999px",
                }}
              >
                <img
                  src={editIconBlack}
                  alt="Edit description"
                  style={{ width: 18, height: 18, display: "block" }}
                />
              </button>
            </div>
            <p
              style={{
                margin: 0,
                marginBottom: t.spacing(4),
                color: t.colors.textBodyDark,
                fontSize: t.font.size.sm,
                lineHeight: 1.6,
              }}
            >
              {task.description}
            </p>
            <div
              style={{
                marginBottom: t.spacing(4),
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: t.spacing(2),
                  fontSize: t.font.size.sm,
                  fontWeight: t.font.weight.semiBold,
                  color: t.colors.textHeadingDark,
                }}
              >
                Attachments
              </h4>
              <AttachmentList attachments={task.attachments} />
            </div>
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                style={{
                  padding: `${t.spacing(2)} ${t.spacing(4)}`,
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: t.font.size.sm,
                  fontWeight: t.font.weight.medium,
                  cursor: "pointer",
                }}
              >
                Delete Task
              </button>
            </div>
          </div>
        </DashboardSectionCard>

        {/* Right side: Task meta (same height as description card) */}
        <DashboardSectionCard title="">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: t.spacing(4),
              height: "100%",
            }}
          >
            <div>
              <h4
                style={{
                  margin: 0,
                  marginBottom: t.spacing(2),
                  fontSize: t.font.size.sm,
                  fontWeight: t.font.weight.semiBold,
                  color: t.colors.textHeadingDark,
                }}
              >
                Assignee
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: t.spacing(2),
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "999px",
                    backgroundColor: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: t.font.weight.semiBold,
                    fontSize: t.font.size.sm,
                  }}
                >
                  {task.assignee.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: t.font.size.sm,
                      fontWeight: t.font.weight.semiBold,
                      color: t.colors.textHeadingDark,
                    }}
                  >
                    {task.assignee.name}
                  </div>
                  <div
                    style={{
                      fontSize: t.font.size.xs,
                      color: t.colors.textMutedDark,
                    }}
                  >
                    Product Designer
                  </div>
                </div>
              </div>
            </div>

            <hr
              style={{
                border: "none",
                borderTop: `1px solid ${t.colors.cardBorder}`,
                margin: 0,
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: t.spacing(2.5),
                fontSize: t.font.size.sm,
                color: t.colors.textBodyDark,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Due Date</span>
                <span
                  style={{
                    fontWeight: t.font.weight.semiBold,
                  }}
                >
                  {task.dueDate}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Priority</span>
                {renderPriorityBadge(task.priority)}
              </div>
            </div>
          </div>
        </DashboardSectionCard>
      </div>

      {/* Full-width activity section */}
      <DashboardSectionCard title="Activity">
        <form onSubmit={handleAddComment}>
          <div
            style={{
              display: "flex",
              gap: t.spacing(3),
              marginBottom: t.spacing(4),
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "999px",
                backgroundColor: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: t.font.weight.semiBold,
                fontSize: t.font.size.sm,
                flexShrink: 0,
              }}
            >
              Y
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  position: "relative",
                }}
              >
                <textarea
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  style={{
                    width: "100%",
                    resize: "vertical",
                    padding: t.spacing(3),
                    paddingRight: t.spacing(8),
                    borderRadius: "12px",
                    border: `1px solid ${t.colors.blackBorder}`,
                    backgroundColor: "transparent",
                    fontFamily: t.font.family,
                    fontSize: t.font.size.sm,
                    color: t.colors.textBodyDark,
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={handleCommentAttachmentClick}
                  style={{
                    position: "absolute",
                    right: t.spacing(3),
                    bottom: t.spacing(2.5),
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label="Add attachment"
                >
                  <img
                    src={attachmentIcon}
                    alt="Attachment"
                    style={{ width: 18, height: 18, objectFit: "contain" }}
                  />
                </button>
                <input
                  ref={commentFileInputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleCommentFilesSelected}
                />
              </div>

              <div
                style={{
                  marginTop: t.spacing(2),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: t.spacing(2),
                }}
              >
                {commentAttachments.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: t.spacing(1.5),
                    }}
                  >
                    {commentAttachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: `${t.spacing(1)} ${t.spacing(1.75)}`,
                          borderRadius: "999px",
                          backgroundColor: "transparent",
                          color: t.colors.textBodyDark,
                          fontSize: t.font.size.xs,
                          gap: t.spacing(1),
                          maxWidth: 260,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => openLocalAttachment(file)}
                          style={{
                            border: "none",
                            background: "none",
                            padding: 0,
                            margin: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: t.spacing(1),
                            cursor: "pointer",
                            maxWidth: "100%",
                          }}
                        >
                          <img
                            src={getCommentAttachmentIcon(file)}
                            alt="Attachment"
                            style={{
                              width: 14,
                              height: 14,
                              objectFit: "contain",
                            }}
                          />
                          <span
                            title={file.name}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.name}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCommentAttachments((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          style={{
                            marginLeft: t.spacing(0.5),
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: t.font.size.xs,
                          }}
                          aria-label={`Remove ${file.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: `${t.spacing(1.5)} ${t.spacing(3.5)}`,
                      borderRadius: "999px",
                      border: "none",
                      backgroundColor: t.colors.buttonPrimary,
                      color: t.colors.buttonText,
                      fontSize: t.font.size.sm,
                      fontWeight: t.font.weight.medium,
                      cursor: "pointer",
                    }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.spacing(4),
          }}
        >
          {comments.map((comment) => renderComment(comment))}
        </div>
      </DashboardSectionCard>
    </OrganisationLayout>
  );
};

export default TaskDetails;

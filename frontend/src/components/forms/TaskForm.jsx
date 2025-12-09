import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../context/theme";
import { AttachmentUploader, DatePicker, RichTextEditor } from "..";

const TaskFormField = ({
  label,
  name,
  baseInputStyle,
  labelStyle,
  fieldWrapperStyle,
  inputProps = {},
  inputStyle = {},
}) => {
  const mergedStyle = { ...baseInputStyle, ...inputStyle };

  return (
    <div style={fieldWrapperStyle}>
      {label && (
        <label style={labelStyle} htmlFor={name}>
          {label}
        </label>
      )}
      <input id={name} name={name} style={mergedStyle} {...inputProps} />
    </div>
  );
};

const TaskForm = ({ formData, onFieldChange }) => {
  const t = useTheme();

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    onFieldChange?.(field, value);
  };

  const handleDescriptionChange = (value) => {
    onFieldChange?.("description", value);
  };

  const handleAddAssignee = () => {
    const name = (formData.assigneeSearch || "").trim();
    if (!name) return;

    const current = formData.assignees || [];
    if (!current.includes(name)) {
      onFieldChange?.("assignees", [...current, name]);
    }
    onFieldChange?.("assigneeSearch", "");
  };

  const handleAssigneeSearchKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Tab" || event.key === ",") {
      event.preventDefault();
      handleAddAssignee();
    } else if (
      event.key === "Backspace" &&
      !formData.assigneeSearch &&
      (formData.assignees || []).length
    ) {
      const next = [...(formData.assignees || [])];
      next.pop();
      onFieldChange?.("assignees", next);
    }
  };

  const handleRemoveAssignee = (member) => {
    const next = (formData.assignees || []).filter((m) => m !== member);
    onFieldChange?.("assignees", next);
  };

  const baseInputStyle = {
    width: "100%",
    padding: t.spacing(3),
    borderRadius: "8px",
    border: `1px solid ${t.colors.blackBorder}`,
    backgroundColor: "transparent",
    fontFamily: t.font.family,
    fontSize: t.font.size.md,
    color: "#111827",
    outline: "none",
  };

  const labelStyle = {
    fontSize: t.font.size.sm,
    color: "#111827",
    fontWeight: t.font.weight.medium,
    marginBottom: t.spacing(1),
  };

  const fieldWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: t.spacing(1),
  };

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: `${t.spacing(1)} ${t.spacing(2.5)}`,
    borderRadius: "999px",
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
    fontSize: t.font.size.sm,
    marginRight: t.spacing(1.5),
  };

  const chipRemoveButtonStyle = {
    marginLeft: t.spacing(1),
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "12px",
    lineHeight: 1,
    color: "#4b5563",
  };

  return (
    <>
      <div style={{ marginBottom: t.spacing(4) }}>
        <TaskFormField
          label="Task Name"
          name="taskName"
          baseInputStyle={baseInputStyle}
          labelStyle={labelStyle}
          fieldWrapperStyle={fieldWrapperStyle}
          inputProps={{
            type: "text",
            value: formData.taskName,
            onChange: handleChange("taskName"),
            placeholder: "Enter the task's name",
          }}
        />
      </div>

      <div style={{ marginBottom: t.spacing(4) }}>
        <label style={labelStyle} htmlFor="description">
          Description
        </label>
        <RichTextEditor
          id="description"
          value={formData.description}
          placeholder="Provide a short description for the task"
          onChange={handleDescriptionChange}
          wrapperStyle={{
            marginTop: t.spacing(1),
          }}
          minHeight={140}
        />
      </div>

      <div style={{ marginBottom: t.spacing(4) }}>
        <TaskFormField
          label="Assignee"
          name="assigneeSearch"
          baseInputStyle={baseInputStyle}
          labelStyle={labelStyle}
          fieldWrapperStyle={fieldWrapperStyle}
          inputProps={{
            type: "text",
            value: formData.assigneeSearch,
            onChange: handleChange("assigneeSearch"),
            onKeyDown: handleAssigneeSearchKeyDown,
            placeholder: "Search for a member...",
          }}
        />
        <div
          style={{
            marginTop: t.spacing(2),
            display: "flex",
            flexWrap: "wrap",
            gap: t.spacing(1.5),
          }}
        >
          {(formData.assignees || []).map((member) => (
            <span key={member} style={chipStyle}>
              {member}
              <button
                type="button"
                style={chipRemoveButtonStyle}
                onClick={() => handleRemoveAssignee(member)}
                aria-label={`Remove ${member}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.spacing(4),
          marginBottom: t.spacing(4),
        }}
      >
        <DatePicker
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={(value) => onFieldChange?.("startDate", value)}
        />
        <DatePicker
          label="Due Date"
          name="dueDate"
          value={formData.dueDate}
          onChange={(value) => onFieldChange?.("dueDate", value)}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.spacing(4),
          marginBottom: t.spacing(4),
        }}
      >
        <div style={fieldWrapperStyle}>
          <label style={labelStyle} htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange("priority")}
            style={{
              ...baseInputStyle,
              paddingRight: t.spacing(2),
            }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div style={fieldWrapperStyle}>
          <label style={labelStyle} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange("status")}
            style={{
              ...baseInputStyle,
              paddingRight: t.spacing(2),
            }}
          >
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="In review">In review</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: t.spacing(6) }}>
        <AttachmentUploader
          label="Attachments"
          attachments={formData.attachments || []}
          onChange={(files) => onFieldChange?.("attachments", files)}
        />
      </div>
    </>
  );
};

TaskForm.propTypes = {
  formData: PropTypes.shape({
    taskName: PropTypes.string,
    description: PropTypes.string,
    assigneeSearch: PropTypes.string,
    assignees: PropTypes.arrayOf(PropTypes.string),
    startDate: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    attachments: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default TaskForm;



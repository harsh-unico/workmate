'use strict';

const projectRepository = require('../repositories/projectRepository');
const projectMemberRepository = require('../repositories/projectMemberRepository');
const userRepository = require('../repositories/userRepository');
const taskRepository = require('../repositories/taskRepository');
const { PROJECT_STATUS } = require('../enums');

function nowIso() {
  return new Date().toISOString();
}

async function getAllProjects(filters = {}) {
  const queryFilters = {};
  if (filters.orgId) {
    queryFilters.org_id = filters.orgId;
  }
  return projectRepository.findMany(queryFilters);
}

async function createProject(payload) {
  const createdBy = payload.userId || payload.createdBy || null;

  const data = {
    org_id: payload.orgId || null,
    name: payload.name,
    description: payload.description || null,
    start_date: payload.startDate || null,
    end_date: payload.endDate || null,
    status: payload.status || PROJECT_STATUS.PLANNING,
    created_by: createdBy,
    updated_at: nowIso()
  };

  // First create the project
  const project = await projectRepository.insertOne(data);

  // If a userId is provided, automatically add them as a project member
  if (payload.userId && project && project.id) {
    await projectMemberRepository.insertOne({
      project_id: project.id,
      user_id: payload.userId,
      role: payload.role || null
    });
  }

  return project;
}

async function updateProject(id, payload) {
  const data = {
    org_id: payload.orgId,
    name: payload.name,
    description: payload.description,
    start_date: payload.startDate,
    end_date: payload.endDate,
    status: payload.status,
    created_by: payload.createdBy,
    updated_at: nowIso()
  };

  return projectRepository.updateById(id, data);
}

async function getProjectById(id) {
  return projectRepository.findById(id);
}

async function getProjectTasks(projectId) {
  return taskRepository.findMany({ project_id: projectId });
}

async function getProjectMembers(projectId) {
  const members = await projectMemberRepository.findMany({ project_id: projectId });
  if (!members || members.length === 0) return [];

  const usersById = {};

  await Promise.all(
    members.map(async (member) => {
      if (!member.user_id || usersById[member.user_id]) return;
      const user = await userRepository.findById(member.user_id);
      if (user) {
        usersById[member.user_id] = user;
      }
    })
  );

  return members.map((member) => ({
    ...member,
    user: member.user_id ? usersById[member.user_id] || null : null
  }));
}

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  getProjectById,
  getProjectTasks,
  getProjectMembers
};



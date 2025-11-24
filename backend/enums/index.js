'use strict';

// Notification
const NotificationEntityType = Object.freeze({
  PROJECT: 'project',
  TASK: 'task'
});
const notificationEntityTypeValues = Object.freeze([
  NotificationEntityType.PROJECT,
  NotificationEntityType.TASK
]);

// Organization sizes
const OrgSize = Object.freeze({
  S_1_10: '1 - 10',
  S_11_50: '11 - 50',
  S_51_200: '51 - 200',
  S_200_500: '200 - 500'
});
const orgSizeValues = Object.freeze([
  OrgSize.S_1_10,
  OrgSize.S_11_50,
  OrgSize.S_51_200,
  OrgSize.S_200_500
]);

// Project
const ProjectPriority = Object.freeze({ LOW: 'low', MEDIUM: 'medium', HIGH: 'high' });
const projectPriorityValues = Object.freeze([
  ProjectPriority.LOW,
  ProjectPriority.MEDIUM,
  ProjectPriority.HIGH
]);

const ProjectStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  TESTING: 'testing'
});
const projectStatusValues = Object.freeze([
  ProjectStatus.PENDING,
  ProjectStatus.IN_PROGRESS,
  ProjectStatus.DONE,
  ProjectStatus.TESTING
]);

// Task
const TaskPriority = Object.freeze({ LOW: 'low', MEDIUM: 'medium', HIGH: 'high' });
const taskPriorityValues = Object.freeze([
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH
]);

const TaskStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  IN_REVIEW: 'in_review'
});
const taskStatusValues = Object.freeze([
  TaskStatus.PENDING,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
  TaskStatus.IN_REVIEW
]);

// User
const UserStatus = Object.freeze({ ACTIVE: 'active', INACTIVE: 'inactive' });
const userStatusValues = Object.freeze([
  UserStatus.ACTIVE,
  UserStatus.INACTIVE
]);

module.exports = {
  NotificationEntityType,
  notificationEntityTypeValues,
  OrgSize,
  orgSizeValues,
  ProjectPriority,
  projectPriorityValues,
  ProjectStatus,
  projectStatusValues,
  TaskPriority,
  taskPriorityValues,
  TaskStatus,
  taskStatusValues,
  UserStatus,
  userStatusValues
};



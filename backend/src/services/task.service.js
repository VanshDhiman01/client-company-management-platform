import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const taskStatusMap = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  NEEDS_CHANGES: 'Needs Changes',
  COMPLETED: 'Completed'
};

const taskPriorityMap = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
};

const formatTask = (task) => {
  if (!task) return null;
  const status = taskStatusMap[task.status] || task.status;
  const priority = taskPriorityMap[task.priority] || task.priority;
  return {
    ...task,
    status,
    priority,
    createdDate: task.createdDate ? new Date(task.createdDate).toISOString().split('T')[0] : new Date(task.createdAt).toISOString().split('T')[0]
  };
};

export const getAllTasks = async (user) => {
  let where = {};
  if (user && user.role === 'CLIENT') {
    const clientProjects = await prisma.project.findMany({
      where: { clientId: user.id },
      select: { id: true }
    });
    const projectIds = clientProjects.map((p) => p.id);
    where = { projectId: { in: projectIds } };
  } else if (user && user.role === 'DEVELOPER') {
    where = { assignedDeveloperId: user.id };
  }

  const tasks = await prisma.task.findMany({
    where,
    include: { workUpdates: { orderBy: { timestamp: 'desc' } } },
    orderBy: { createdAt: 'desc' }
  });

  const allUsers = await prisma.user.findMany({ select: { id: true, name: true } });
  const userMap = new Map(allUsers.map((u) => [u.id, u.name]));

  return tasks.map((t) => {
    const formatted = formatTask(t);
    if (!formatted.assignedDeveloperName && formatted.assignedDeveloperId) {
      formatted.assignedDeveloperName = userMap.get(formatted.assignedDeveloperId) || null;
    }
    return formatted;
  });
};

export const getTaskById = async (id) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { workUpdates: { orderBy: { timestamp: 'desc' } } }
  });
  const formatted = formatTask(task);
  if (formatted && !formatted.assignedDeveloperName && formatted.assignedDeveloperId) {
    const dev = await prisma.user.findUnique({ where: { id: formatted.assignedDeveloperId } });
    if (dev) formatted.assignedDeveloperName = dev.name;
  }
  return formatted;
};

const syncProjectProgress = async (projectId) => {
  if (!projectId) return;
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { progress: true, status: true, reviewStatus: true }
    });
    let overallProgress = 0;
    if (tasks.length > 0) {
      const totalProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0);
      overallProgress = Math.round(totalProgress / tasks.length);
    }
    const isCompleted = overallProgress === 100 || (tasks.length > 0 && tasks.every(t => (t.progress || 0) === 100 && (t.status === 'COMPLETED' || t.reviewStatus === 'Approved')));

    await prisma.project.update({
      where: { id: projectId },
      data: {
        overallProgress,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        completedDate: isCompleted ? new Date().toISOString().split('T')[0] : null
      }
    });
  } catch (e) {
    // Ignore if project not found
  }
};

export const createTask = async (data) => {
  let projectName = data.projectName;
  if (!projectName && data.projectId) {
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (project) projectName = project.name;
  }

  let assignedDeveloperName = data.assignedDeveloperName;
  if (data.assignedDeveloperId) {
    const dev = await prisma.user.findUnique({ where: { id: data.assignedDeveloperId } });
    if (dev) {
      assignedDeveloperName = dev.name;
    }
  }

  const initialProgress = Number(data.progress || data.initialProgress || 0);

  const rawPriority = (data.priority || 'Medium').toUpperCase();
  const priorityEnum = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(rawPriority) ? rawPriority : 'MEDIUM';

  const statusEnum = initialProgress === 100 ? 'IN_PROGRESS' : (initialProgress > 0 ? 'IN_PROGRESS' : 'PENDING');

  const created = await prisma.task.create({
    data: {
      projectId: data.projectId,
      projectName: projectName || 'Project',
      title: data.title,
      description: data.description || '',
      assignedDeveloperId: data.assignedDeveloperId || null,
      assignedDeveloperName: assignedDeveloperName || null,
      dueDate: data.dueDate || '',
      priority: priorityEnum,
      progress: initialProgress,
      status: statusEnum,
      reviewStatus: initialProgress === 100 ? 'Pending Review' : 'None'
    },
    include: { workUpdates: true }
  });

  await syncProjectProgress(created.projectId);

  const formatted = formatTask(created);
  if (formatted && !formatted.assignedDeveloperName && formatted.assignedDeveloperId) {
    const dev = await prisma.user.findUnique({ where: { id: formatted.assignedDeveloperId } });
    if (dev) formatted.assignedDeveloperName = dev.name;
  }
  return formatted;
};

export const updateTaskProgress = async (id, progress, developerId, developerName, message, fileName) => {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (existing && (existing.progress === 100 || existing.reviewStatus === 'Approved')) {
    // Locked at 100% / Approved
    return formatTask(existing);
  }

  const numProgress = Number(progress);
  const statusEnum = numProgress === 100 ? 'IN_PROGRESS' : (numProgress === 0 ? 'PENDING' : 'IN_PROGRESS');

  const updated = await prisma.task.update({
    where: { id },
    data: {
      progress: numProgress,
      status: statusEnum,
      reviewStatus: numProgress === 100 ? 'Pending Review' : 'None',
      workUpdates: {
        create: {
          developerId: developerId || 'unknown',
          developerName: developerName || 'Developer',
          progressAtTime: numProgress,
          message: message || `Updated task progress to ${numProgress}%`,
          fileName: fileName || null
        }
      }
    },
    include: { workUpdates: { orderBy: { timestamp: 'desc' } } }
  });

  await syncProjectProgress(updated.projectId);

  return formatTask(updated);
};

export const reviewTask = async (id, action, internalReviewNotes) => {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (existing && existing.reviewStatus === 'Approved') {
    // Permanently locked once Approved
    return formatTask(existing);
  }

  const isApproved = action === 'Approve' || action === 'Approved';
  const statusEnum = isApproved ? 'COMPLETED' : 'NEEDS_CHANGES';

  const updated = await prisma.task.update({
    where: { id },
    data: {
      status: statusEnum,
      reviewStatus: isApproved ? 'Approved' : 'Not Approved',
      progress: isApproved ? 100 : undefined,
      completedDate: isApproved ? new Date().toISOString().split('T')[0] : null,
      internalReviewNotes: internalReviewNotes || null
    },
    include: { workUpdates: { orderBy: { timestamp: 'desc' } } }
  });

  await syncProjectProgress(updated.projectId);

  return formatTask(updated);
};

export const assignDeveloper = async (id, developerId) => {
  let devName = null;
  if (developerId) {
    const dev = await prisma.user.findUnique({ where: { id: developerId } });
    if (dev) devName = dev.name;
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      assignedDeveloperId: developerId || null,
      assignedDeveloperName: devName
    },
    include: { workUpdates: { orderBy: { timestamp: 'desc' } } }
  });

  return formatTask(updated);
};

export const deleteTask = async (id) => {
  const task = await prisma.task.findUnique({ where: { id }, select: { projectId: true } });
  const deleted = await prisma.task.delete({ where: { id } });
  if (task && task.projectId) {
    await syncProjectProgress(task.projectId);
  }
  return deleted;
};



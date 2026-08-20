import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const statusMap = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

const formatProject = async (proj) => {
  if (!proj) return null;
  const status = statusMap[proj.status] || proj.status;
  const tasks = await prisma.task.findMany({
    where: { projectId: proj.id },
    select: { progress: true, assignedDeveloperId: true }
  });
  const devIdsSet = new Set(tasks.map((t) => t.assignedDeveloperId).filter(Boolean));
  const assignedDeveloperIds = Array.from(devIdsSet);

  let overallProgress = proj.overallProgress || 0;
  if (tasks.length > 0) {
    const totalProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    overallProgress = Math.round(totalProgress / tasks.length);
  }

  return {
    ...proj,
    status,
    overallProgress,
    assignedDeveloperIds,
    assignedTeamCount: Math.max(proj.assignedTeamCount || 0, assignedDeveloperIds.length)
  };
};

export const getAllProjects = async (user) => {
  let where = {};
  if (user && user.role === 'CLIENT') {
    where = { clientId: user.id };
  } else if (user && user.role === 'DEVELOPER') {
    const devTasks = await prisma.task.findMany({
      where: { assignedDeveloperId: user.id },
      select: { projectId: true }
    });
    const projectIds = Array.from(new Set(devTasks.map((t) => t.projectId)));
    if (projectIds.length > 0) {
      where = { id: { in: projectIds } };
    }
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return Promise.all(projects.map(formatProject));
};

export const getProjectById = async (id) => {
  const project = await prisma.project.findUnique({ where: { id } });
  return formatProject(project);
};

export const createProject = async (data) => {
  let clientName = data.clientName;
  let clientEmail = data.clientEmail;
  let companyName = data.companyName;

  if (data.clientId) {
    const clientUser = await prisma.user.findUnique({ where: { id: data.clientId } });
    if (clientUser) {
      clientName = clientUser.name;
      clientEmail = clientUser.email;
      companyName = clientUser.companyName || companyName || 'Client Org';
    }
  }

  const created = await prisma.project.create({
    data: {
      name: data.name,
      clientId: data.clientId || '',
      clientName: clientName || 'Client',
      clientEmail: clientEmail || '',
      companyName: companyName || 'Client Org',
      description: data.description || '',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      expectedDelivery: data.expectedDelivery || '2026-12-31',
      budget: data.budget || '$30,000',
      category: data.category || 'Web Application',
      requestId: data.requestId,
      latestUpdate: data.latestUpdate || 'Project workspace created and sprint planning initiated.'
    }
  });

  return formatProject(created);
};

export const updateProject = async (id, updates) => {
  const payload = { ...updates };
  if (payload.status) {
    const statusUpper = payload.status.toUpperCase().replace(/\s+/g, '_');
    const validStatuses = ['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
    if (validStatuses.includes(statusUpper)) {
      payload.status = statusUpper;
    }
  }

  const updated = await prisma.project.update({
    where: { id },
    data: payload
  });

  return formatProject(updated);
};


// Project Requests
const formatProjectRequest = (req) => {
  if (!req) return null;
  let requirements = [];
  try {
    requirements = typeof req.requirements === 'string' ? JSON.parse(req.requirements) : (req.requirements || []);
  } catch {
    requirements = req.requirements ? [req.requirements] : [];
  }
  if (!Array.isArray(requirements)) {
    requirements = [String(requirements)];
  }

  const statusMap = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected'
  };
  const status = statusMap[req.status] || req.status;

  return {
    ...req,
    status,
    requirements,
    submittedDate: req.submittedDate ? new Date(req.submittedDate).toISOString().split('T')[0] : new Date(req.createdAt).toISOString().split('T')[0],
    reviewedDate: req.reviewedDate ? new Date(req.reviewedDate).toISOString().split('T')[0] : null
  };
};

export const getAllProjectRequests = async (user) => {
  const where = user && user.role === 'CLIENT' ? { clientId: user.id } : {};
  const requests = await prisma.projectRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  return requests.map(formatProjectRequest);
};

export const createProjectRequest = async (data) => {
  const reqStr = Array.isArray(data.requirements)
    ? JSON.stringify(data.requirements)
    : JSON.stringify(data.requirements ? [data.requirements] : []);

  const created = await prisma.projectRequest.create({
    data: {
      clientId: data.clientId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      companyName: data.companyName,
      projectName: data.projectName,
      description: data.description,
      requirements: reqStr,
      expectedDeadline: data.expectedDeadline || '',
      budget: data.budget || ''
    }
  });
  return formatProjectRequest(created);
};

export const reviewProjectRequest = async (id, status, adminNotes) => {
  const rawStatus = (status || '').toUpperCase();
  const enumStatus = rawStatus === 'ACCEPTED' ? 'ACCEPTED'
    : rawStatus === 'REJECTED' ? 'REJECTED'
    : 'PENDING';

  const updated = await prisma.projectRequest.update({
    where: { id },
    data: {
      status: enumStatus,
      adminNotes,
      reviewedDate: new Date()
    }
  });
  return formatProjectRequest(updated);
};

export const acceptAndCreateProject = async (id) => {
  const request = await prisma.projectRequest.findUnique({ where: { id } });
  if (!request) {
    throw new Error('Project request not found');
  }

  const updatedRequest = await prisma.projectRequest.update({
    where: { id },
    data: {
      status: 'ACCEPTED',
      reviewedDate: new Date(),
      adminNotes: request.adminNotes || 'Accepted for development initiation.'
    }
  });

  const project = await prisma.project.create({
    data: {
      requestId: request.id,
      clientId: request.clientId,
      clientName: request.clientName,
      clientEmail: request.clientEmail,
      companyName: request.companyName,
      name: request.projectName,
      description: request.description,
      status: 'PLANNING',
      startDate: new Date().toISOString().split('T')[0],
      expectedDelivery: request.expectedDeadline || '2026-12-15',
      budget: request.budget || '$35,000',
      overallProgress: 0,
      latestUpdate: 'Project scope accepted and sprint planning in progress.',
      assignedTeamCount: 0,
      clientVisibleNotes: 'Project scope accepted. Sprint kickoff scheduled.',
      category: 'Web Application'
    }
  });

  await prisma.projectRequest.update({
    where: { id },
    data: { convertedProjectId: project.id }
  });

  return {
    request: formatProjectRequest(updatedRequest),
    project
  };
};


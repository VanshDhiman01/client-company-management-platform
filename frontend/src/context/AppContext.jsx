import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_PROJECT_REQUESTS,
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROJECT_UPDATES
} from '../data/initialData';
import { authService } from '../services/authService';
import { getAuthToken, setAuthToken } from '../services/apiClient';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';

const STORAGE_KEY = 'client_company_saas_data_v1';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  // Load or initialize state safely from localStorage
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Authenticate session on startup via GET /api/auth/me
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (response && response.user) {
          setCurrentUser(response.user);
          setIsLoggedIn(true);
        } else {
          authService.logout();
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('Session verification via /api/auth/me failed:', err.message);
        authService.logout();
        setIsLoggedIn(false);
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await authService.getUsers();
      if (res && res.success && Array.isArray(res.users)) {
        setUsers(res.users);
      }
    } catch (err) {
      console.warn('Failed to fetch users from backend:', err.message);
    }
  };

  const fetchProjectRequests = async () => {
    try {
      const res = await projectService.getProjectRequests();
      if (res && res.success && Array.isArray(res.requests)) {
        setProjectRequests(res.requests);
      }
    } catch (err) {
      console.warn('Failed to fetch project requests from backend:', err.message);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await projectService.getProjects();
      if (res && res.success && Array.isArray(res.projects)) {
        setProjects(res.projects);
      }
    } catch (err) {
      console.warn('Failed to fetch projects from backend:', err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await taskService.getTasks();
      if (res && res.success && Array.isArray(res.tasks)) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.warn('Failed to fetch tasks from backend:', err.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchUsers();
      fetchProjectRequests();
      fetchProjects();
      fetchTasks();
    }
  }, [isLoggedIn, currentUser]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [selectedDetailSubTab, setSelectedDetailSubTab] = useState('overview');
  const [authScreen, setAuthScreen] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');

  const formatUpdateString = (upd) => {
    if (!upd) return '';
    if (typeof upd === 'string') return upd;
    if (typeof upd === 'object' && upd.summary) return upd.summary;
    return String(upd);
  };

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      const rawProjects = saved ? JSON.parse(saved) : INITIAL_PROJECTS;
      return rawProjects.map(p => ({
        ...p,
        latestUpdate: formatUpdateString(p.latestUpdate)
      }));
    } catch {
      return INITIAL_PROJECTS.map(p => ({
        ...p,
        latestUpdate: formatUpdateString(p.latestUpdate)
      }));
    }
  });

  const [projectRequests, setProjectRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT_REQUESTS;
    } catch {
      return INITIAL_PROJECT_REQUESTS;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });


  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_conversations`);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [projectUpdates, setProjectUpdates] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_updates`);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT_UPDATES;
    } catch {
      return INITIAL_PROJECT_UPDATES;
    }
  });

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    }
    localStorage.setItem(`${STORAGE_KEY}_isLoggedIn`, JSON.stringify(isLoggedIn));
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(projectRequests));
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${STORAGE_KEY}_conversations`, JSON.stringify(conversations));
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    localStorage.setItem(`${STORAGE_KEY}_updates`, JSON.stringify(projectUpdates));
  }, [users, currentUser, isLoggedIn, projects, projectRequests, tasks, conversations, notifications, projectUpdates]);

  // Recalculate Project Progress automatically whenever tasks change
  useEffect(() => {
    if (tasks.length > 0 && projects.length > 0) {
      setProjects(prevProjects =>
        prevProjects.map(proj => {
          const projectTasks = tasks.filter(t => t.projectId === proj.id);
          if (projectTasks.length === 0) return proj;

          const totalProgress = projectTasks.reduce((acc, t) => acc + (t.progress || 0), 0);
          const avgProgress = Math.round(totalProgress / projectTasks.length);

          if (proj.overallProgress === avgProgress) return proj;

          const allCompleted = projectTasks.every(t => t.progress === 100 && (t.status === 'Completed' || t.reviewStatus === 'Approved'));
          const newStatus = allCompleted ? 'Completed' : (proj.status === 'Completed' ? 'In Progress' : proj.status);

          return {
            ...proj,
            overallProgress: avgProgress,
            status: newStatus
          };
        })
      );
    }
  }, [tasks]);

  // Auth methods connected strictly to real Node.js/Express API + JWT
  const login = async (email, password) => {
    const trimmed = (email || '').trim();
    const response = await authService.login(trimmed, password);
    if (response && response.user) {
      const user = response.user;
      setCurrentUser(user);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      setSelectedDetailId(null);
      return user;
    }
    throw new Error('Invalid email or password');
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
    setSelectedDetailId(null);
    setAuthScreen('login');
    try {
      localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
      localStorage.removeItem(`${STORAGE_KEY}_isLoggedIn`);
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    if (response && response.user) {
      setCurrentUser(response.user);
      return response.user;
    }
    throw new Error('Failed to update profile');
  };

  const uploadUserAvatar = async (file) => {
    const response = await authService.uploadAvatar(file);
    if (response && response.user) {
      setCurrentUser(response.user);
      return response.user;
    }
    throw new Error('Failed to upload avatar');
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await authService.updateUserRole(userId, newRole);
      if (response && response.success && response.user) {
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: response.user.role } : u)));
        await fetchUsers();
        return response.user;
      }
      throw new Error(response?.message || 'Failed to update user role');
    } catch (err) {
      console.error('Error updating user role:', err);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      throw err;
    }
  };



  const registerClient = async (data) => {
    const response = await authService.register({
      name: data.name,
      email: data.email,
      password: data.password,
      companyName: data.companyName,
      phone: data.phone || '',
      role: 'CLIENT'
    });

    if (response && response.user) {
      const newClient = response.user;
      setUsers(prev => {
        if (!prev.some(u => u.email === newClient.email)) {
          return [newClient, ...prev];
        }
        return prev;
      });
      setCurrentUser(newClient);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      setSelectedDetailId(null);
      return newClient;
    }
    throw new Error('Registration failed');
  };

  // Submit project request
  const submitProjectRequest = async (data) => {
    try {
      const response = await projectService.submitProjectRequest({
        projectName: data.projectName,
        description: data.description,
        requirements: data.requirements,
        expectedDeadline: data.expectedDeadline,
        budget: data.budget
      });

      if (response && response.success) {
        await fetchProjectRequests();
        return response.request;
      }
    } catch (err) {
      console.error('Error submitting project request to backend:', err);
      throw err;
    }
  };

  // Admin reviews request
  const reviewProjectRequest = async (requestId, status, adminNotes) => {
    try {
      const response = await projectService.reviewProjectRequest(requestId, status, adminNotes);
      if (response && response.success) {
        await fetchProjectRequests();
      }
    } catch (err) {
      console.error('Error reviewing project request:', err);
      // Fallback state update if backend fails
      setProjectRequests(prev =>
        prev.map(req => (req.id === requestId ? { ...req, status, adminNotes } : req))
      );
    }
  };

  const acceptAndCreateProjectWorkflow = async (requestId) => {
    try {
      const response = await projectService.acceptAndCreateProject(requestId);
      if (response && response.success) {
        await fetchProjectRequests();
        await fetchProjects();
        if (response.project) {
          setActiveTab('projects');
          setSelectedDetailId(response.project.id);
          setSelectedDetailSubTab('tasks');
          return response.project;
        }
      }
    } catch (err) {
      console.error('Error accepting project request:', err);
    }
  };

  // Create project
  const createProject = async (data) => {
    try {
      const response = await projectService.createProject(data);
      if (response && response.success && response.project) {
        await fetchProjects();
        return response.project.id;
      }
    } catch (err) {
      console.error('Error creating project on backend:', err);
      throw err;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      const response = await projectService.updateProject(projectId, updates);
      if (response && response.success) {
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error updating project on backend:', err);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, ...updates } : p))
      );
    }
  };

  const postProjectUpdate = (projectId, title, message) => {
    const proj = projects.find(p => p.id === projectId);
    const newUpdate = {
      id: `p-upd-${Date.now()}`,
      projectId,
      title,
      message,
      timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      authorName: `${currentUser.name} (${currentUser.role === 'ADMIN' ? 'Lead Project Manager' : 'Team Lead'})`,
      progressMentioned: proj ? proj.overallProgress : undefined
    };

    setProjectUpdates(prev => [newUpdate, ...prev]);
    if (proj) {
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, latestUpdate: message, clientVisibleNotes: message } : p))
      );
      // Notify client
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'CLIENT',
          targetUserId: proj.clientId,
          title: `Project Update: ${title}`,
          message,
          timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
          read: false,
          type: 'project',
          linkTab: 'projects',
          linkId: projectId
        },
        ...prev
      ]);
    }
  };

  // Tasks actions
  const createTask = async (data) => {
    try {
      const res = await taskService.createTask(data);
      if (res && res.success) {
        await fetchTasks();
        await fetchProjects();
        await fetchUsers();
        return res.task;
      }
    } catch (err) {
      console.error('Error creating task on backend:', err);
      throw err;
    }
  };

  const updateTaskProgress = async (taskId, progress, workNote, fileName) => {
    try {
      const res = await taskService.updateTaskProgress(taskId, progress, workNote, fileName);
      if (res && res.success) {
        await fetchTasks();
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error updating task progress on backend:', err);
    }
  };

  const reviewTask = async (taskId, action, reviewNotes) => {
    try {
      const res = await taskService.reviewTask(taskId, action, reviewNotes);
      if (res && res.success) {
        await fetchTasks();
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error reviewing task on backend:', err);
    }
  };

  const assignDeveloperToTask = async (taskId, developerId) => {
    try {
      const res = await taskService.assignDeveloper(taskId, developerId);
      if (res && res.success) {
        await fetchTasks();
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error assigning developer on backend:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await taskService.deleteTask(taskId);
      if (res && res.success) {
        await fetchTasks();
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error deleting task on backend:', err);
    }
  };

  // Messaging actions
  const sendMessage = (conversationId, text, attachment) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.role === 'CLIENT' ? currentUser.name : `Orange Mantra – Interview Project Team (${currentUser.name})`,
      senderRole: currentUser.role === 'CLIENT' ? 'CLIENT' : 'ADMIN',
      text,
      timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
      attachment
    };

    let clientTargetId = '';

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          clientTargetId = c.clientId;
          const isClientSender = currentUser.role === 'CLIENT';
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCountAdmin: isClientSender ? c.unreadCountAdmin + 1 : 0,
            unreadCountClient: isClientSender ? 0 : c.unreadCountClient + 1,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Notify counterpart
    if (currentUser.role === 'CLIENT') {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'ADMIN',
          title: `New Message from ${currentUser.name}`,
          message: text.slice(0, 100),
          timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: 'info',
          linkTab: 'messages',
          linkId: conversationId
        },
        ...prev
      ]);
    } else {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'CLIENT',
          targetUserId: clientTargetId,
          title: 'New Message from Orange Mantra – Interview Project Team',
          message: text.slice(0, 100),
          timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: 'info',
          linkTab: 'messages',
          linkId: conversationId
        },
        ...prev
      ]);
    }
  };

  const createOrOpenConversation = (clientId, projectId) => {
    const existing = conversations.find(c => c.clientId === clientId);
    if (existing) {
      return existing.id;
    }

    const client = users.find(u => u.id === clientId) || INITIAL_USERS[0];
    const project = projectId ? projects.find(p => p.id === projectId) : undefined;

    const newConv = {
      id: `conv-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      companyName: client.companyName || 'Client Org',
      clientAvatar: client.avatar,
      projectId: project?.id,
      projectName: project?.name,
      lastMessage: 'Conversation started.',
      lastMessageTime: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCountClient: 0,
      unreadCountAdmin: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'user-admin-1',
          senderName: 'Orange Mantra – Interview Project Team',
          senderRole: 'ADMIN',
          text: `Welcome ${client.name}! This is your direct communication line with your dedicated project management team.`,
          timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    return newConv.id;
  };



  // Notification actions
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev =>
      prev.map(n => (n.targetRole === currentUser.role || n.targetRole === 'ALL' ? { ...n, read: true } : n))
    );
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setProjects(INITIAL_PROJECTS);
    setProjectRequests(INITIAL_PROJECT_REQUESTS);
    setTasks(INITIAL_TASKS);
    setTickets(INITIAL_SUPPORT_TICKETS);
    setConversations(INITIAL_CONVERSATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProjectUpdates(INITIAL_PROJECT_UPDATES);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    setSelectedDetailId(null);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        isLoggedIn,
        isAuthLoading,
        activeTab,
        setActiveTab,
        selectedDetailId,
        setSelectedDetailId,
        selectedDetailSubTab,
        setSelectedDetailSubTab,
        authScreen,
        setAuthScreen,
        login,
        logout,
        updateUserProfile,
        uploadUserAvatar,
        updateUserRole,
        registerClient,
        projects,
        projectRequests,
        tasks,
        conversations,
        notifications,
        fetchUsers,
        fetchProjectRequests,
        fetchProjects,
        fetchTasks,
        submitProjectRequest,
        reviewProjectRequest,
        acceptAndCreateProjectWorkflow,
        createProject,
        updateProject,
        postProjectUpdate,
        createTask,
        updateTaskProgress,
        reviewTask,
        assignDeveloperToTask,
        deleteTask,
        sendMessage,
        createOrOpenConversation,
        markNotificationRead,
        clearAllNotifications,
        resetDemoData,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

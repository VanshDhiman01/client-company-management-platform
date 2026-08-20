// Mock dataset providing 5+ clients, 5+ developers, 5+ projects, 10+ tasks, 5+ tickets, conversations, files, and notifications.

export const MOCK_USERS = [
  // 5+ Clients
  {
    id: 'user-client-1',
    name: 'Sarah Lin',
    email: 'sarah.lin@apexretail.com',
    role: 'CLIENT',
    companyName: 'Apex Retail Brands',
    title: 'Head of Digital Commerce',
    joinedDate: '2026-01-15',
    status: 'Active'
  },
  {
    id: 'user-client-2',
    name: 'Marcus Vance',
    email: 'marcus@biohealthsys.io',
    role: 'CLIENT',
    companyName: 'BioHealth Systems',
    title: 'VP of Technology',
    joinedDate: '2026-02-01',
    status: 'Active'
  },
  {
    id: 'user-client-3',
    name: 'Elena Rostova',
    email: 'elena@horizonlogistics.co',
    role: 'CLIENT',
    companyName: 'Horizon Global Logistics',
    title: 'Operations Director',
    joinedDate: '2025-11-20',
    status: 'Active'
  },
  {
    id: 'user-client-4',
    name: 'Amara Okafor',
    email: 'amara.o@zenithmedia.agency',
    role: 'CLIENT',
    companyName: 'Zenith Media Labs',
    title: 'Chief Product Officer',
    joinedDate: '2026-03-10',
    status: 'Active'
  },
  {
    id: 'user-client-5',
    name: 'Thomas Wright',
    email: 't.wright@nexasolar.energy',
    role: 'CLIENT',
    companyName: 'Nexa Solar Energy',
    title: 'Director of Smart Grid Technology',
    joinedDate: '2026-04-05',
    status: 'Active'
  },

  // 1 Lead Admin / Project Manager
  {
    id: 'user-admin-1',
    name: 'Alex Mercer',
    email: 'alex.mercer@orangemantra.com',
    role: 'ADMIN',
    companyName: 'Orange Mantra',
    title: 'Lead Technical Project Manager & Partner',
    joinedDate: '2024-05-10',
    status: 'Active'
  },

  // 5+ Developers
  {
    id: 'user-dev-2',
    name: 'Maya Patel',
    email: 'maya.patel@orangemantra.com',
    role: 'DEVELOPER',
    companyName: 'Orange Mantra',
    title: 'Senior Backend & UI Architect',
    skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    workload: 3,
    maxWorkload: 5,
    joinedDate: '2024-08-12',
    status: 'Active'
  },
  {
    id: 'user-dev-2',
    name: 'Maya Patel',
    email: 'maya.patel@orangemantra.com',
    role: 'DEVELOPER',
    companyName: 'Orange Mantra',
    title: 'Frontend Specialist & UI Engineer',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion'],
    workload: 2,
    maxWorkload: 4,
    joinedDate: '2025-01-08',
    status: 'Active'
  },
  {
    id: 'user-dev-3',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@orangemantra.com',
    role: 'DEVELOPER',
    companyName: 'Orange Mantra',
    title: 'Full-Stack Integrations Engineer',
    skills: ['React', 'Express', 'Redis', 'WebSockets', 'Payment Gateways'],
    workload: 2,
    maxWorkload: 4,
    joinedDate: '2025-03-15',
    status: 'Active'
  },
  {
    id: 'user-dev-4',
    name: 'Zoe Nguyen',
    email: 'zoe.nguyen@orangemantra.com',
    role: 'DEVELOPER',
    companyName: 'Orange Mantra',
    title: 'QA Automation & Frontend Engineer',
    skills: ['Jest', 'Playwright', 'React Testing', 'Accessibility', 'CI/CD'],
    workload: 1,
    maxWorkload: 4,
    joinedDate: '2025-06-01',
    status: 'Active'
  },
  {
    id: 'user-dev-5',
    name: 'Julian Brooks',
    email: 'julian.brooks@orangemantra.com',
    role: 'DEVELOPER',
    companyName: 'Orange Mantra',
    title: 'Cloud Architect & DevOps Engineer',
    skills: ['Kubernetes', 'AWS/GCP', 'Terraform', 'PostgreSQL', 'Microservices'],
    workload: 1,
    maxWorkload: 4,
    joinedDate: '2025-09-10',
    status: 'Active'
  }
];

export const MOCK_PROJECT_REQUESTS = [
  {
    id: 'req-101',
    clientId: 'user-client-1',
    clientName: 'Sarah Lin',
    clientEmail: 'sarah.lin@apexretail.com',
    companyName: 'Apex Retail Brands',
    projectName: 'B2B Wholesale Procurement Portal',
    description: 'A custom self-service portal for our bulk wholesale distributors with tiered pricing, multi-currency invoicing, purchase order approvals, and ERP synchronization.',
    requirements: [
      'Tiered B2B customer price tiers',
      'Bulk CSV order upload with sku validation',
      'Net-30 / Net-60 invoice management',
      'ERP integration via REST Webhooks',
      'Manager multi-tier approval workflow'
    ],
    expectedDeadline: '2026-11-30',
    budget: '$35,000 - $48,000',
    attachments: [
      { name: 'Apex_Procurement_Spec_v1.pdf', size: '2.4 MB' },
      { name: 'Wholesale_Volume_Matrix.xlsx', size: '640 KB' }
    ],
    status: 'Pending',
    submittedDate: '2026-08-14'
  },
  {
    id: 'req-102',
    clientId: 'user-client-3',
    clientName: 'Elena Rostova',
    clientEmail: 'elena@horizonlogistics.co',
    companyName: 'Horizon Global Logistics',
    projectName: 'Carrier Mobile Dispatch Application',
    description: 'Cross-platform mobile companion app for freight drivers with real-time GPS route updates, digital bill of lading signatures, and instant proof-of-delivery uploads.',
    requirements: [
      'Offline-first GPS tracking',
      'Digital signature capture with audit trail',
      'Camera document scanner for BOL',
      'Push notifications for route modifications'
    ],
    expectedDeadline: '2026-10-15',
    budget: '$28,000 - $35,000',
    attachments: [
      { name: 'Horizon_Driver_Workflow.pdf', size: '1.8 MB' }
    ],
    status: 'Accepted',
    submittedDate: '2026-08-02',
    reviewedDate: '2026-08-05',
    adminNotes: 'Accepted after feasibility study. Converted into project PROJ-003.',
    convertedProjectId: 'proj-003'
  },
  {
    id: 'req-103',
    clientId: 'user-client-4',
    clientName: 'Amara Okafor',
    clientEmail: 'amara.o@zenithmedia.agency',
    companyName: 'Zenith Media Labs',
    projectName: 'AI Content Syndication Platform',
    description: 'Automated video and visual asset distribution engine connecting creator studios to multiple social advertising networks with live performance analytics.',
    requirements: [
      'Multi-channel social API posting',
      'Automated video transcoding & aspect resizing',
      'Real-time engagement telemetry dashboard',
      'Role-based creator team permissions'
    ],
    expectedDeadline: '2026-12-15',
    budget: '$45,000 - $60,000',
    attachments: [
      { name: 'Syndication_Architecture_Draft.pdf', size: '3.1 MB' }
    ],
    status: 'Pending',
    submittedDate: '2026-08-16'
  }
];

export const MOCK_PROJECTS = [
  {
    id: 'proj-001',
    name: 'E-commerce Website',
    code: 'PROJ-001',
    description: 'A modern, high-conversion headless e-commerce store with personalized product recommendations, real-time inventory management, multi-currency checkout, and seamless Stripe/PayPal integration.',
    clientId: 'user-client-1',
    clientName: 'Sarah Lin',
    clientEmail: 'sarah.lin@apexretail.com',
    companyName: 'Apex Retail Brands',
    status: 'In Progress',
    startDate: '2026-07-01',
    expectedDeliveryDate: '2026-09-30',
    budget: '$42,000',
    paidAmount: '$25,000',
    priority: 'High',
    progress: 43,
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe Elements', 'Tailwind CSS', 'Redis'],
    latestUpdate: 'Sprint 2 frontend catalog and faceted search components are 100% complete. Stripe sandbox checkout is currently in QA review.',
    updatesHistory: [
      {
        id: 'upd-proj-1',
        date: '2026-08-16',
        author: 'Alex Mercer (Lead PM)',
        title: 'Sprint 2 Milestone Reached',
        description: 'Frontend product gallery, responsive filters, and customer authentication passed automated regression test suite.'
      },
      {
        id: 'upd-proj-2',
        date: '2026-08-01',
        author: 'Alex Mercer (Lead PM)',
        title: 'Architecture & Database Setup Completed',
        description: 'PostgreSQL schema definitions and Stripe payment tokenization architecture configured on test staging environment.'
      }
    ]
  },
  {
    id: 'proj-002',
    name: 'Telehealth Patient Portal',
    code: 'PROJ-002',
    description: 'HIPAA-compliant web & mobile healthcare consultation portal featuring encrypted WebRTC video visits, EHR electronic health record syncing, automated prescription refills, and doctor scheduling.',
    clientId: 'user-client-2',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus@biohealthsys.io',
    companyName: 'BioHealth Systems',
    status: 'In Progress',
    startDate: '2026-06-15',
    expectedDeliveryDate: '2026-10-15',
    budget: '$65,000',
    paidAmount: '$40,000',
    priority: 'Urgent',
    progress: 68,
    techStack: ['React', 'WebRTC', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS HIPAA Enclave'],
    latestUpdate: 'WebRTC encrypted streaming verified in multi-party browser tests. EHR medical history connector undergoing final pen-testing.',
    updatesHistory: [
      {
        id: 'upd-proj-3',
        date: '2026-08-15',
        author: 'Alex Mercer (Lead PM)',
        title: 'Video Engine & Security Audit Approved',
        description: 'Passed third-party HIPAA pen-test with zero high severity findings.'
      }
    ]
  },
  {
    id: 'proj-003',
    name: 'Carrier Mobile Dispatch Application',
    code: 'PROJ-003',
    description: 'Cross-platform fleet driver dispatch application with live GPS route optimization, automated digital bill of lading signatures, offline caching, and instantaneous dispatch notifications.',
    clientId: 'user-client-3',
    clientName: 'Elena Rostova',
    clientEmail: 'elena@horizonlogistics.co',
    companyName: 'Horizon Global Logistics',
    status: 'In Progress',
    startDate: '2026-08-06',
    expectedDeliveryDate: '2026-10-28',
    budget: '$34,000',
    paidAmount: '$15,000',
    priority: 'High',
    progress: 30,
    techStack: ['React Native', 'TypeScript', 'Node.js', 'Google Maps Routes API', 'PostGIS'],
    latestUpdate: 'Offline sync architecture and digital stylus signature canvas implemented and verified on Android & iOS tablets.',
    updatesHistory: [
      {
        id: 'upd-proj-4',
        date: '2026-08-14',
        author: 'Alex Mercer (Lead PM)',
        title: 'Core Dispatch Engine MVP Complete',
        description: 'GPS routing and driver authentication modules deployed to internal TestFlight build.'
      }
    ]
  },
  {
    id: 'proj-004',
    name: 'FinTech Smart Invoicing Engine',
    code: 'PROJ-004',
    description: 'Automated recurring billing, multi-currency ledger reconciliation, and AI OCR receipt parsing engine for international creative agencies.',
    clientId: 'user-client-4',
    clientName: 'Amara Okafor',
    clientEmail: 'amara.o@zenithmedia.agency',
    companyName: 'Zenith Media Labs',
    status: 'In Progress',
    startDate: '2026-07-10',
    expectedDeliveryDate: '2026-10-30',
    budget: '$52,000',
    paidAmount: '$30,000',
    priority: 'Medium',
    progress: 55,
    techStack: ['Next.js', 'Python', 'PostgreSQL', 'Plaid API', 'Stripe Billing'],
    latestUpdate: 'Plaid banking data sync verified. Automated PDF invoice renderer deployed.',
    updatesHistory: []
  },
  {
    id: 'proj-005',
    name: 'CleanEnergy IoT Telemetry Dashboard',
    code: 'PROJ-005',
    description: 'High-frequency telemetry stream visualizer for industrial solar panel arrays, featuring predictive inverter failure detection and battery lifecycle analytics.',
    clientId: 'user-client-5',
    clientName: 'Thomas Wright',
    clientEmail: 't.wright@nexasolar.energy',
    companyName: 'Nexa Solar Energy',
    status: 'In Progress',
    startDate: '2026-07-20',
    expectedDeliveryDate: '2026-11-15',
    budget: '$48,000',
    paidAmount: '$20,000',
    priority: 'High',
    progress: 40,
    techStack: ['React', 'TimescaleDB', 'MQTT', 'D3.js', 'Go', 'Tailwind CSS'],
    latestUpdate: 'WebSocket real-time charting pipeline processing 10,000 metric events/sec without UI lag.',
    updatesHistory: []
  }
];

export const MOCK_TASKS = [
  // E-commerce Website Tasks (Project PROJ-001)
  {
    id: 'task-101',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'UI Design System & Wireframes',
    description: 'Design comprehensive Figma component library, high-fidelity responsive screens for desktop, tablet, and mobile views.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-07-15',
    priority: 'High',
    progress: 100,
    status: 'Completed',
    reviewStatus: 'Approved',
    internalReviewNotes: 'All Figma design tokens approved by design lead. Client sign-off received on desktop/mobile mocks.',
    workUpdates: [
      {
        id: 'upd-1',
        developerId: 'user-dev-2',
        developerName: 'Maya Patel',
        timestamp: '2026-07-14 16:30',
        progressAtTime: 100,
        message: 'Completed final design system tokens, responsive components, and checkout flow.'
      }
    ],
    attachments: [{ name: 'Apex_Ecom_Design_Tokens.fig', size: '14.2 MB', uploadedAt: '2026-07-14' }],
    createdDate: '2026-07-01',
    completedDate: '2026-07-15'
  },
  {
    id: 'task-102',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Authentication & Session Architecture',
    description: 'Implement JWT/OAuth2 authentication, customer register/login flow, password reset with secure email tokens, and session renewal.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-07-28',
    priority: 'High',
    progress: 100,
    status: 'Completed',
    reviewStatus: 'Approved',
    internalReviewNotes: 'Penetration check passed. JWT refresh tokens properly rotated with Redis blacklist.',
    workUpdates: [
      {
        id: 'upd-2',
        developerId: 'user-dev-2',
        developerName: 'Maya Patel',
        timestamp: '2026-07-27 18:10',
        progressAtTime: 100,
        message: 'Auth module complete with 2FA, session expiry handling, and social login hooks.'
      }
    ],
    attachments: [{ name: 'Auth_API_Endpoints.json', size: '120 KB', uploadedAt: '2026-07-27' }],
    createdDate: '2026-07-05',
    completedDate: '2026-07-28'
  },
  {
    id: 'task-103',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Product Catalog & Filter API',
    description: 'Build high-performance REST and GraphQL endpoints for product listing, multi-attribute facet filtering, inventory indexing, and search.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-08-22',
    priority: 'High',
    progress: 75,
    status: 'In Progress',
    reviewStatus: 'None',
    internalReviewNotes: 'Elasticsearch query caching needed for instant search under 40ms.',
    workUpdates: [
      {
        id: 'upd-3',
        developerId: 'user-dev-2',
        developerName: 'Maya Patel',
        timestamp: '2026-08-16 11:45',
        progressAtTime: 75,
        message: 'Product variant schemas and category facet aggregation completed. Working on inventory webhook syncing.'
      }
    ],
    attachments: [{ name: 'Catalog_Schema_v2.sql', size: '48 KB', uploadedAt: '2026-08-16' }],
    createdDate: '2026-07-18'
  },
  {
    id: 'task-104',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Product Catalog UI & Gallery Component',
    description: 'Implement responsive product grid, instant live search bar, swatch color selectors, interactive zoom photo gallery, and reviews widget.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-08-25',
    priority: 'Medium',
    progress: 50,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [
      {
        id: 'upd-4',
        developerId: 'user-dev-2',
        developerName: 'Maya Patel',
        timestamp: '2026-08-15 14:20',
        progressAtTime: 50,
        message: 'Integrated dynamic facets and product gallery with smooth thumbnail transitions.'
      }
    ],
    attachments: [],
    createdDate: '2026-07-22'
  },
  {
    id: 'task-105',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Shopping Cart & Promo Engine',
    description: 'Build persistent client and server-synced cart, coupon code discount validation, shipping cost estimator, and cross-sell recommendations.',
    assignedDeveloperId: 'user-dev-3',
    assignedDeveloperName: 'Liam O\'Connor',
    dueDate: '2026-08-28',
    priority: 'High',
    progress: 50,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [
      {
        id: 'upd-5',
        developerId: 'user-dev-3',
        developerName: 'Liam O\'Connor',
        timestamp: '2026-08-14 17:00',
        progressAtTime: 50,
        message: 'Cart drawer state persistent across tabs and guest-to-user session migration works.'
      }
    ],
    attachments: [],
    createdDate: '2026-07-25'
  },
  {
    id: 'task-106',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Stripe & PayPal Payment Gateway Integration',
    description: 'Secure checkout integration with Stripe Payment Elements, Apple Pay, Google Pay, 3D Secure 2 authentication, and automated tax calculations.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-09-05',
    priority: 'Urgent',
    progress: 25,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [
      {
        id: 'upd-6',
        developerId: 'user-dev-2',
        developerName: 'Maya Patel',
        timestamp: '2026-08-12 10:15',
        progressAtTime: 25,
        message: 'Created Stripe test sandbox environment and intent creation route.'
      }
    ],
    attachments: [],
    createdDate: '2026-08-01'
  },
  {
    id: 'task-107',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Merchant Admin Panel & Order Processing',
    description: 'Build internal company dashboard for managing SKU catalog, processing order fulfillment, customer refunds, and shipping label generation.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-09-10',
    priority: 'Medium',
    progress: 25,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [
      {
        id: 'upd-7',
        developerId: 'user-dev-2',
        developerName: 'Maya Patel',
        timestamp: '2026-08-10 15:40',
        progressAtTime: 25,
        message: 'Order management table with pagination, status tags, and export filters stubbed.'
      }
    ],
    attachments: [],
    createdDate: '2026-08-01'
  },
  {
    id: 'task-108',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'End-to-End QA & Load Testing',
    description: 'Conduct automated test suites with Playwright across Chrome, Safari, and iOS WebKit. Simulate 2,500 simultaneous checkout loads with k6.',
    assignedDeveloperId: 'user-dev-4',
    assignedDeveloperName: 'Zoe Nguyen',
    dueDate: '2026-09-20',
    priority: 'High',
    progress: 0,
    status: 'Pending',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-08-05'
  },
  {
    id: 'task-109',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Production Cloud Infrastructure & CI/CD',
    description: 'Configure multi-region Cloud Run containers, Cloud SQL Postgres replica, CDN static asset caching, and automated Github Actions pipeline.',
    assignedDeveloperId: 'user-dev-5',
    assignedDeveloperName: 'Julian Brooks',
    dueDate: '2026-09-25',
    priority: 'Medium',
    progress: 0,
    status: 'Pending',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-08-05'
  },
  {
    id: 'task-110',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Client Handover, Training & API Documentation',
    description: 'Prepare interactive Swagger/OpenAPI documentation, recorded video walkthroughs for CMS management, and admin operational manuals.',
    assignedDeveloperId: 'user-dev-4',
    assignedDeveloperName: 'Zoe Nguyen',
    dueDate: '2026-09-30',
    priority: 'Low',
    progress: 0,
    status: 'Pending',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-08-05'
  },

  // Telehealth Patient Portal Tasks (Project PROJ-002)
  {
    id: 'task-201',
    projectId: 'proj-002',
    projectName: 'Telehealth Patient Portal',
    title: 'HIPAA Compliant Video Consultations',
    description: 'Implement WebRTC encrypted peer-to-peer audio/video streaming with in-call chat and screen share.',
    assignedDeveloperId: 'user-dev-3',
    assignedDeveloperName: 'Liam O\'Connor',
    dueDate: '2026-09-15',
    priority: 'Urgent',
    progress: 75,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [
      {
        id: 'upd-201',
        developerId: 'user-dev-3',
        developerName: 'Liam O\'Connor',
        timestamp: '2026-08-16 09:00',
        progressAtTime: 75,
        message: 'Signaling server connected and tested with 4 concurrent call participants.'
      }
    ],
    attachments: [],
    createdDate: '2026-07-10'
  },
  {
    id: 'task-202',
    projectId: 'proj-002',
    projectName: 'Telehealth Patient Portal',
    title: 'Electronic Health Record (EHR) Sync',
    description: 'HL7 FHIR API data connector for syncing patient medical records, prescriptions, and lab test results securely.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-09-20',
    priority: 'High',
    progress: 50,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-07-15'
  },
  {
    id: 'task-203',
    projectId: 'proj-002',
    projectName: 'Telehealth Patient Portal',
    title: 'Automated Prescription Refills & Pharmacy Webhook',
    description: 'Surescripts pharmacy routing integration allowing certified physicians to digitally transmit prescriptions with signature audit logs.',
    assignedDeveloperId: 'user-dev-5',
    assignedDeveloperName: 'Julian Brooks',
    dueDate: '2026-09-28',
    priority: 'Medium',
    progress: 75,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-07-18'
  },

  // Carrier Mobile Dispatch Application (Project PROJ-003)
  {
    id: 'task-301',
    projectId: 'proj-003',
    projectName: 'Carrier Mobile Dispatch Application',
    title: 'Offline GPS Tracking & Geo-fencing',
    description: 'Background geolocation service logging coordinates to SQLite when offline and reconciling with backend upon cell signal reacquisition.',
    assignedDeveloperId: 'user-dev-3',
    assignedDeveloperName: 'Liam O\'Connor',
    dueDate: '2026-09-22',
    priority: 'High',
    progress: 50,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-08-08'
  },
  {
    id: 'task-302',
    projectId: 'proj-003',
    projectName: 'Carrier Mobile Dispatch Application',
    title: 'Digital Bill of Lading (BOL) e-Signature Canvas',
    description: 'High precision canvas signature capture module with tamper-evident SHA-256 hash embedding and instant PDF compilation.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-09-18',
    priority: 'Medium',
    progress: 25,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-08-08'
  },

  // FinTech Smart Invoicing Tasks (Project PROJ-004)
  {
    id: 'task-401',
    projectId: 'proj-004',
    projectName: 'FinTech Smart Invoicing Engine',
    title: 'Multi-Currency Bank Feed Sync via Plaid',
    description: 'Secure token exchange and daily transaction reconciliation connector for USD, EUR, GBP, and CAD accounts.',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    dueDate: '2026-09-25',
    priority: 'High',
    progress: 75,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-07-15'
  },

  // CleanEnergy IoT Telemetry Dashboard Tasks (Project PROJ-005)
  {
    id: 'task-501',
    projectId: 'proj-005',
    projectName: 'CleanEnergy IoT Telemetry Dashboard',
    title: 'MQTT Broker Ingestion & TimescaleDB Pipeline',
    description: 'High-throughput time-series streaming engine handling 10k solar inverter telemetry points per second.',
    assignedDeveloperId: 'user-dev-5',
    assignedDeveloperName: 'Julian Brooks',
    dueDate: '2026-09-30',
    priority: 'Urgent',
    progress: 50,
    status: 'In Progress',
    reviewStatus: 'None',
    workUpdates: [],
    attachments: [],
    createdDate: '2026-07-25'
  }
];

export const MOCK_SUPPORT_TICKETS = [
  {
    id: 'tick-101',
    ticketNumber: 'TICK-101',
    clientId: 'user-client-1',
    clientName: 'Sarah Lin',
    clientEmail: 'sarah.lin@apexretail.com',
    companyName: 'Apex Retail Brands',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Login button not working on mobile Safari iOS 17',
    description: 'When tapping the "Log in to Account" button on mobile Safari with private browsing mode enabled, the spinner freezes and no authentication modal appears.',
    priority: 'High',
    status: 'In Progress',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    createdDate: '2026-08-15 10:20',
    lastUpdate: '2026-08-16 11:15',
    attachment: { name: 'Safari_Login_Freeze.png', size: '420 KB' },
    responses: [
      {
        id: 'resp-1',
        senderId: 'user-client-1',
        senderName: 'Sarah Lin',
        senderRole: 'CLIENT',
        isInternal: false,
        message: 'Tested on iPhone 15 Pro iOS 17.5.1 in Safari Private Browsing mode. The login submit event is swallowed silently.',
        timestamp: '2026-08-15 10:20'
      },
      {
        id: 'resp-2',
        senderId: 'user-admin-1',
        senderName: 'Alex Mercer (Lead PM)',
        senderRole: 'ADMIN',
        isInternal: false,
        message: 'Thank you Sarah. We have reproduced the issue in our device lab and assigned Senior Architect Maya Patel to patch the Safari storage partitioning handler.',
        timestamp: '2026-08-15 11:00'
      },
      {
        id: 'resp-3',
        senderId: 'user-dev-2',
        senderName: 'Maya Patel (Engineer)',
        senderRole: 'DEVELOPER',
        isInternal: true, // INTERNAL NOTE - hidden from client!
        message: 'Root cause: Safari Private Mode blocks IndexedDB storage access on initial page bootstrap. Adding local in-memory fallback polyfill.',
        timestamp: '2026-08-16 11:15'
      }
    ]
  },
  {
    id: 'tick-102',
    ticketNumber: 'TICK-102',
    clientId: 'user-client-1',
    clientName: 'Sarah Lin',
    clientEmail: 'sarah.lin@apexretail.com',
    companyName: 'Apex Retail Brands',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    title: 'Add Canadian Dollar (CAD) currency toggle',
    description: 'We are expanding to the Canadian market next quarter. Can we ensure the product prices and Stripe checkout support CAD with real-time conversion rates?',
    priority: 'Medium',
    status: 'Open',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    createdDate: '2026-08-16 14:00',
    lastUpdate: '2026-08-16 14:00',
    responses: [
      {
        id: 'resp-101',
        senderId: 'user-client-1',
        senderName: 'Sarah Lin',
        senderRole: 'CLIENT',
        isInternal: false,
        message: 'We would love to know if CAD support can be bundled before our launch in September.',
        timestamp: '2026-08-16 14:00'
      }
    ]
  },
  {
    id: 'tick-103',
    ticketNumber: 'TICK-103',
    clientId: 'user-client-3',
    clientName: 'Elena Rostova',
    clientEmail: 'elena@horizonlogistics.co',
    companyName: 'Horizon Global Logistics',
    projectId: 'proj-003',
    projectName: 'Carrier Mobile Dispatch Application',
    title: 'Exported PDF invoice formatting issue with EU tax column',
    description: 'When generating international freight invoices, the VAT column width overflows the right margin on A4 PDF printouts.',
    priority: 'Low',
    status: 'Resolved',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    createdDate: '2026-08-01 11:00',
    lastUpdate: '2026-08-03 16:30',
    responses: [
      {
        id: 'resp-301',
        senderId: 'user-client-3',
        senderName: 'Elena Rostova',
        senderRole: 'CLIENT',
        isInternal: false,
        message: 'When exporting July report, EU tax column is blank.',
        timestamp: '2026-08-01 11:00'
      },
      {
        id: 'resp-302',
        senderId: 'user-admin-1',
        senderName: 'Orange Mantra Support Team',
        senderRole: 'ADMIN',
        isInternal: false,
        message: 'The report parser has been updated to include all multi-currency tax jurisdictions. You can now download the refreshed report from your dashboard.',
        timestamp: '2026-08-03 16:30'
      }
    ],
    resolutionSummary: 'Updated export serializer to map localized tax codes across all regional exports.'
  },
  {
    id: 'tick-104',
    ticketNumber: 'TICK-104',
    clientId: 'user-client-2',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus@biohealthsys.io',
    companyName: 'BioHealth Systems',
    projectId: 'proj-002',
    projectName: 'Telehealth Patient Portal',
    title: 'Audio echo observed on Bluetooth earbuds during consultation',
    description: 'Physicians reported an echo feedback loop when using AirPods or wireless headsets on macOS Chrome.',
    priority: 'High',
    status: 'Ready for Review',
    assignedDeveloperId: 'user-dev-3',
    assignedDeveloperName: 'Liam O\'Connor',
    createdDate: '2026-08-12 09:30',
    lastUpdate: '2026-08-16 16:20',
    responses: [
      {
        id: 'resp-401',
        senderId: 'user-client-2',
        senderName: 'Marcus Vance',
        senderRole: 'CLIENT',
        isInternal: false,
        message: 'Occurs primarily when doctors switch devices mid-call.',
        timestamp: '2026-08-12 09:30'
      },
      {
        id: 'resp-402',
        senderId: 'user-dev-3',
        senderName: 'Liam O\'Connor (Engineer)',
        senderRole: 'DEVELOPER',
        isInternal: true,
        message: 'Enabled browser native echoCancellation and autoGainControl constraints on mediaStream renegotiation.',
        timestamp: '2026-08-16 16:20'
      }
    ],
    resolutionSummary: 'WebRTC audio constraint profiles calibrated with automatic echoCancellation.'
  },
  {
    id: 'tick-105',
    ticketNumber: 'TICK-105',
    clientId: 'user-client-4',
    clientName: 'Amara Okafor',
    clientEmail: 'amara.o@zenithmedia.agency',
    companyName: 'Zenith Media Labs',
    projectId: 'proj-004',
    projectName: 'FinTech Smart Invoicing Engine',
    title: 'CSV export timeout on large date ranges',
    description: 'Selecting "All Time" history for accounts with over 20,000 line items causes a 504 Gateway Timeout.',
    priority: 'Medium',
    status: 'In Progress',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    createdDate: '2026-08-14 15:45',
    lastUpdate: '2026-08-15 10:10',
    responses: [
      {
        id: 'resp-501',
        senderId: 'user-client-4',
        senderName: 'Amara Okafor',
        senderRole: 'CLIENT',
        isInternal: false,
        message: 'Exporting 2-year history yields timeout after 30 seconds.',
        timestamp: '2026-08-14 15:45'
      }
    ]
  },
  {
    id: 'tick-106',
    ticketNumber: 'TICK-106',
    clientId: 'user-client-5',
    clientName: 'Thomas Wright',
    clientEmail: 't.wright@nexasolar.energy',
    companyName: 'Nexa Solar Energy',
    projectId: 'proj-005',
    projectName: 'CleanEnergy IoT Telemetry Dashboard',
    title: 'Night mode dark theme toggle request for control room monitors',
    description: 'Control room operators monitoring high voltage arrays 24/7 requested a dedicated ultra-dark OLED contrast theme.',
    priority: 'Low',
    status: 'Open',
    assignedDeveloperId: 'user-dev-2',
    assignedDeveloperName: 'Maya Patel',
    createdDate: '2026-08-16 08:30',
    lastUpdate: '2026-08-16 08:30',
    responses: []
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    clientId: 'user-client-1',
    clientName: 'Sarah Lin',
    companyName: 'Apex Retail Brands',
    projectId: 'proj-001',
    projectName: 'E-commerce Website',
    lastMessage: 'Yes, we will review the wishlist feature requirement with the technical team.',
    lastMessageTime: '2026-08-17 15:30',
    unreadCountClient: 0,
    unreadCountAdmin: 0,
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-client-1',
        senderName: 'Sarah Lin',
        senderRole: 'CLIENT',
        text: 'Hi Alex! How is the checkout integration progressing? Will we be able to test Apple Pay on our staging build this week?',
        timestamp: '2026-08-17 14:15'
      },
      {
        id: 'msg-2',
        senderId: 'user-admin-1',
        senderName: 'Orange Mantra Team (Alex Mercer)',
        senderRole: 'ADMIN',
        text: 'Hi Sarah! Yes, Apple Pay domain verification has been configured on the sandbox. We are staging the build by Wednesday afternoon for your team to review.',
        timestamp: '2026-08-17 14:35'
      },
      {
        id: 'msg-3',
        senderId: 'user-client-1',
        senderName: 'Sarah Lin',
        senderRole: 'CLIENT',
        text: 'Can we add a wishlist feature for guest and registered shoppers as well?',
        timestamp: '2026-08-17 15:10'
      },
      {
        id: 'msg-4',
        senderId: 'user-admin-1',
        senderName: 'Orange Mantra Team (Alex Mercer)',
        senderRole: 'ADMIN',
        text: 'Yes, we will review this requirement. We can architect this as part of Sprint 3 without impacting the September 30 target delivery date.',
        timestamp: '2026-08-17 15:30'
      }
    ]
  },
  {
    id: 'conv-2',
    clientId: 'user-client-2',
    clientName: 'Marcus Vance',
    companyName: 'BioHealth Systems',
    projectId: 'proj-002',
    projectName: 'Telehealth Patient Portal',
    lastMessage: 'Security compliance report signed and uploaded to your files tab.',
    lastMessageTime: '2026-08-16 18:00',
    unreadCountClient: 1,
    unreadCountAdmin: 0,
    messages: [
      {
        id: 'msg-21',
        senderId: 'user-client-2',
        senderName: 'Marcus Vance',
        senderRole: 'CLIENT',
        text: 'Alex, could you share the third-party HIPAA penetration audit report?',
        timestamp: '2026-08-16 16:45'
      },
      {
        id: 'msg-22',
        senderId: 'user-admin-1',
        senderName: 'Orange Mantra Team (Alex Mercer)',
        senderRole: 'ADMIN',
        text: 'Security compliance report signed and uploaded to your files tab.',
        timestamp: '2026-08-16 18:00'
      }
    ]
  },
  {
    id: 'conv-3',
    clientId: 'user-client-3',
    clientName: 'Elena Rostova',
    companyName: 'Horizon Global Logistics',
    projectId: 'proj-003',
    projectName: 'Carrier Mobile Dispatch Application',
    lastMessage: 'Great, the offline sync is running smoothly on our test fleet.',
    lastMessageTime: '2026-08-15 12:10',
    unreadCountClient: 0,
    unreadCountAdmin: 0,
    messages: [
      {
        id: 'msg-31',
        senderId: 'user-client-3',
        senderName: 'Elena Rostova',
        senderRole: 'CLIENT',
        text: 'Hi Alex, the driver dispatch APK was tested by our regional drivers this morning.',
        timestamp: '2026-08-15 11:30'
      },
      {
        id: 'msg-32',
        senderId: 'user-admin-1',
        senderName: 'Orange Mantra Team (Alex Mercer)',
        senderRole: 'ADMIN',
        text: 'Glad to hear! The offline queue should automatically push logs when entering 4G range.',
        timestamp: '2026-08-15 11:55'
      },
      {
        id: 'msg-33',
        senderId: 'user-client-3',
        senderName: 'Elena Rostova',
        senderRole: 'CLIENT',
        text: 'Great, the offline sync is running smoothly on our test fleet.',
        timestamp: '2026-08-15 12:10'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    targetRole: 'CLIENT',
    targetUserId: 'user-client-1',
    title: 'Project Progress Update',
    message: 'Your project "E-commerce Website" overall progress is now 43%.',
    timestamp: '2026-08-16 14:00',
    read: false,
    type: 'project',
    linkTab: 'projects',
    linkId: 'proj-001'
  },
  {
    id: 'notif-2',
    targetRole: 'CLIENT',
    targetUserId: 'user-client-1',
    title: 'New Support Update',
    message: 'Orange Mantra Support Team replied to Ticket #TICK-101: "Login button not working".',
    timestamp: '2026-08-16 11:20',
    read: false,
    type: 'ticket',
    linkTab: 'tickets',
    linkId: 'tick-101'
  },
  {
    id: 'notif-3',
    targetRole: 'ADMIN',
    title: 'New Project Request Submitted',
    message: 'Sarah Lin (Apex Retail Brands) submitted a new request: "B2B Wholesale Procurement Portal".',
    timestamp: '2026-08-14 10:30',
    read: false,
    type: 'info',
    linkTab: 'requests',
    linkId: 'req-101'
  },
  {
    id: 'notif-4',
    targetRole: 'ADMIN',
    title: 'Task Milestone Completed',
    message: 'Maya Patel completed task "Authentication & Session Architecture" (100%).',
    timestamp: '2026-07-28 17:00',
    read: true,
    type: 'task',
    linkTab: 'tasks',
    linkId: 'task-102'
  },
  {
    id: 'notif-5',
    targetRole: 'DEVELOPER',
    targetUserId: 'user-dev-2',
    title: 'New Support Ticket Assigned',
    message: 'You have been assigned internally to Ticket #TICK-101 (High Priority).',
    timestamp: '2026-08-16 10:45',
    read: false,
    type: 'ticket',
    linkTab: 'tickets',
    linkId: 'tick-101'
  },
  {
    id: 'notif-6',
    targetRole: 'DEVELOPER',
    targetUserId: 'user-dev-2',
    title: 'Task Assignment',
    message: 'You have been assigned to "Product Catalog & Filter API" (Due: Aug 22).',
    timestamp: '2026-07-18 09:00',
    read: true,
    type: 'task',
    linkTab: 'tasks',
    linkId: 'task-103'
  }
];

export const MOCK_PROJECT_UPDATES = [
  {
    id: 'upd-1',
    projectId: 'proj-001',
    title: 'Sprint 2 Milestone Achieved: Shopping Cart & Checkout API',
    message: 'Engineering team completed the secure checkout flow and inventory lock webhooks. Code review passed and deployed to client staging.',
    timestamp: '2026-08-15 16:30',
    authorName: 'Alex Mercer (Lead PM)',
    progressMentioned: 43
  },
  {
    id: 'upd-2',
    projectId: 'proj-001',
    title: 'OAuth2 Multi-Factor Authentication Implemented',
    message: 'Customer session management and passwordless login tokens verified against security penetration tests.',
    timestamp: '2026-07-28 14:00',
    authorName: 'Alex Mercer (Lead PM)',
    progressMentioned: 25
  },
  {
    id: 'upd-3',
    projectId: 'proj-002',
    title: 'HIPAA Video Consultation WebRTC Pipeline Finalized',
    message: 'Telehealth high-definition audio/video calls stress-tested with 100+ concurrent participant simulations.',
    timestamp: '2026-08-12 11:00',
    authorName: 'Alex Mercer (Lead PM)',
    progressMentioned: 67
  },
  {
    id: 'upd-4',
    projectId: 'proj-003',
    title: 'Fleet Tracking Socket Server Connected',
    message: 'Sub-second GPS coordinates pipeline established across live driver devices in the field.',
    timestamp: '2026-08-10 09:30',
    authorName: 'Alex Mercer (Lead PM)',
    progressMentioned: 25
  }
];


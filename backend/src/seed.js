import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  try {
    // Clean up any lingering 'David Chen' references from existing DB
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'david.chen@devcraftagency.com' },
          { id: 'user-dev-1' },
          { name: 'David Chen' }
        ]
      }
    }).catch(() => { });

    await prisma.task.updateMany({
      where: { assignedDeveloperName: 'David Chen' },
      data: { assignedDeveloperName: 'Maya Patel', assignedDeveloperId: 'user-dev-2' }
    }).catch(() => { });

    await prisma.taskWorkUpdate.updateMany({
      where: { developerName: 'David Chen' },
      data: { developerName: 'Maya Patel', developerId: 'user-dev-2' }
    }).catch(() => { });

    const userCount = await prisma.user.count();
    let sarah, marcus, elena, amara, thomas;

    if (userCount === 0) {
      console.log('🌱 Database empty. Seeding initial users...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      sarah = await prisma.user.create({
        data: {
          id: 'user-client-1',
          name: 'Sarah Lin',
          email: 'sarah.lin@apexretail.com',
          password: hashedPassword,
          role: 'CLIENT',
          companyName: 'Apex Retail Brands',
          title: 'Head of Digital Commerce'
        }
      });

      marcus = await prisma.user.create({
        data: {
          id: 'user-client-2',
          name: 'Marcus Vance',
          email: 'marcus@biohealthsys.io',
          password: hashedPassword,
          role: 'CLIENT',
          companyName: 'BioHealth Systems',
          title: 'VP of Technology'
        }
      });

      elena = await prisma.user.create({
        data: {
          id: 'user-client-3',
          name: 'Elena Rostova',
          email: 'elena@horizonlogistics.co',
          password: hashedPassword,
          role: 'CLIENT',
          companyName: 'Horizon Global Logistics',
          title: 'Operations Director'
        }
      });

      amara = await prisma.user.create({
        data: {
          id: 'user-client-4',
          name: 'Amara Okafor',
          email: 'amara.o@zenithmedia.agency',
          password: hashedPassword,
          role: 'CLIENT',
          companyName: 'Zenith Media Labs',
          title: 'Chief Product Officer'
        }
      });

      thomas = await prisma.user.create({
        data: {
          id: 'user-client-5',
          name: 'Thomas Wright',
          email: 't.wright@nexasolar.energy',
          password: hashedPassword,
          role: 'CLIENT',
          companyName: 'Nexa Solar Energy',
          title: 'Director of Smart Grid Technology'
        }
      });

      await prisma.user.create({
        data: {
          id: 'user-admin-1',
          name: 'Alex Mercer',
          email: 'alex.mercer@devcraftagency.com',
          password: hashedPassword,
          role: 'ADMIN',
          companyName: 'DevCraft Studios Inc.',
          title: 'Lead Technical Project Manager'
        }
      });

      await prisma.user.createMany({
        data: [
          {
            id: 'user-dev-2',
            name: 'Maya Patel',
            email: 'maya.patel@devcraftagency.com',
            password: hashedPassword,
            role: 'DEVELOPER',
            companyName: 'DevCraft Studios Inc.',
            title: 'Frontend Specialist & UI Engineer'
          },
          {
            id: 'user-dev-3',
            name: "Liam O'Connor",
            email: 'liam.oconnor@devcraftagency.com',
            password: hashedPassword,
            role: 'DEVELOPER',
            companyName: 'DevCraft Studios Inc.',
            title: 'Full-Stack Integrations Engineer'
          },
          {
            id: 'user-dev-4',
            name: 'Sofia Rodriguez',
            email: 'sofia.rodriguez@devcraftagency.com',
            password: hashedPassword,
            role: 'DEVELOPER',
            companyName: 'DevCraft Studios Inc.',
            title: 'Mobile Apps & Telemetry Specialist'
          },
          {
            id: 'user-dev-5',
            name: 'James Wilson',
            email: 'james.wilson@devcraftagency.com',
            password: hashedPassword,
            role: 'DEVELOPER',
            companyName: 'DevCraft Studios Inc.',
            title: 'DevOps & Cloud Infrastructure Engineer'
          }
        ]
      });
    } else {
      sarah = await prisma.user.findFirst({ where: { email: 'sarah.lin@apexretail.com' } }) || await prisma.user.findFirst({ where: { role: 'CLIENT' } });
      marcus = await prisma.user.findFirst({ where: { email: 'marcus@biohealthsys.io' } }) || sarah;
      elena = await prisma.user.findFirst({ where: { email: 'elena@horizonlogistics.co' } }) || sarah;
      amara = await prisma.user.findFirst({ where: { email: 'amara.o@zenithmedia.agency' } }) || sarah;
      thomas = await prisma.user.findFirst({ where: { email: 't.wright@nexasolar.energy' } }) || sarah;
    }

    const projCount = await prisma.project.count();
    if (projCount === 0 && sarah) {
      console.log('🌱 Seeding initial projects into PostgreSQL database via Prisma...');
      await prisma.project.createMany({
        data: [
          {
            id: 'proj-001',
            name: 'E-commerce Website',
            clientId: sarah.id,
            clientName: sarah.name,
            clientEmail: sarah.email,
            companyName: sarah.companyName || 'Apex Retail Brands',
            status: 'IN_PROGRESS',
            startDate: '2026-07-01',
            expectedDelivery: '2026-09-30',
            budget: '$42,000',
            description: 'A modern, high-conversion headless e-commerce store with personalized product recommendations, real-time inventory management, multi-currency checkout, and seamless Stripe integration.',
            category: 'E-Commerce Platform',
            overallProgress: 43,
            latestUpdate: 'Sprint 2 frontend catalog and faceted search components are 100% complete.',
            clientVisibleNotes: 'Sprint 2 catalog completed. QA review underway.',
            assignedTeamCount: 2
          },
          {
            id: 'proj-002',
            name: 'Telehealth Patient Portal',
            clientId: marcus ? marcus.id : sarah.id,
            clientName: marcus ? marcus.name : sarah.name,
            clientEmail: marcus ? marcus.email : sarah.email,
            companyName: marcus ? (marcus.companyName || 'BioHealth Systems') : 'BioHealth Systems',
            status: 'IN_PROGRESS',
            startDate: '2026-06-15',
            expectedDelivery: '2026-10-15',
            budget: '$65,000',
            description: 'HIPAA-compliant web & mobile healthcare consultation portal featuring encrypted WebRTC video visits and EHR records.',
            category: 'Healthcare SaaS',
            overallProgress: 68,
            latestUpdate: 'WebRTC encrypted streaming verified in multi-party browser tests.',
            clientVisibleNotes: 'Video consultation module verified.',
            assignedTeamCount: 3
          },
          {
            id: 'proj-003',
            name: 'Carrier Mobile Dispatch Application',
            clientId: elena ? elena.id : sarah.id,
            clientName: elena ? elena.name : sarah.name,
            clientEmail: elena ? elena.email : sarah.email,
            companyName: elena ? (elena.companyName || 'Horizon Global Logistics') : 'Horizon Global Logistics',
            status: 'PLANNING',
            startDate: '2026-08-05',
            expectedDelivery: '2026-10-15',
            budget: '$32,000',
            description: 'Cross-platform fleet driver dispatch application with live GPS route optimization, automated digital bill of lading signatures, and offline caching.',
            category: 'Mobile Logistics',
            overallProgress: 15,
            latestUpdate: 'Project scope accepted and sprint planning in progress.',
            clientVisibleNotes: 'Sprint kickoff scheduled.',
            assignedTeamCount: 2
          },
          {
            id: 'proj-004',
            name: 'Smart Grid Telemetry Dashboard',
            clientId: thomas ? thomas.id : sarah.id,
            clientName: thomas ? thomas.name : sarah.name,
            clientEmail: thomas ? thomas.email : sarah.email,
            companyName: thomas ? (thomas.companyName || 'Nexa Solar Energy') : 'Nexa Solar Energy',
            status: 'IN_PROGRESS',
            startDate: '2026-05-10',
            expectedDelivery: '2026-11-30',
            budget: '$85,000',
            description: 'IoT telemetry aggregation platform monitoring real-time solar inverter outputs and regional grid voltage stabilization.',
            category: 'CleanTech IoT Platform',
            overallProgress: 52,
            latestUpdate: 'IoT telemetry websocket streaming validated with simulated solar array nodes.',
            clientVisibleNotes: 'Websocket pipeline active.',
            assignedTeamCount: 4
          },
          {
            id: 'proj-005',
            name: 'Omnichannel Ad Analytics Hub',
            clientId: amara ? amara.id : sarah.id,
            clientName: amara ? amara.name : sarah.name,
            clientEmail: amara ? amara.email : sarah.email,
            companyName: amara ? (amara.companyName || 'Zenith Media Labs') : 'Zenith Media Labs',
            status: 'COMPLETED',
            startDate: '2026-02-01',
            expectedDelivery: '2026-06-30',
            budget: '$50,000',
            description: 'Centralized advertising campaign analytics engine unifying Meta, Google Ads, and TikTok API conversion tracking.',
            category: 'AdTech Analytics',
            overallProgress: 100,
            latestUpdate: 'All deliverables approved by Project Manager. Project 100% completed!',
            clientVisibleNotes: 'Project completed and handed over.',
            assignedTeamCount: 3
          }
        ]
      });
    }

    const reqCount = await prisma.projectRequest.count();
    if (reqCount === 0 && sarah) {
      console.log('🌱 Seeding initial project requests into PostgreSQL database via Prisma...');
      await prisma.projectRequest.createMany({
        data: [
          {
            id: 'req-101',
            clientId: sarah.id,
            clientName: sarah.name,
            clientEmail: sarah.email,
            companyName: sarah.companyName || 'Apex Retail Brands',
            projectName: 'B2B Wholesale Procurement Portal',
            description: 'A custom self-service portal for our bulk wholesale distributors with tiered pricing, multi-currency invoicing, purchase order approvals, and ERP synchronization.',
            requirements: JSON.stringify([
              'Tiered B2B customer price tiers',
              'Bulk CSV order upload with sku validation',
              'Net-30 / Net-60 invoice management',
              'ERP integration via REST Webhooks',
              'Manager multi-tier approval workflow'
            ]),
            expectedDeadline: '2026-11-30',
            budget: '$35,000 - $48,000',
            status: 'PENDING'
          },
          {
            id: 'req-102',
            clientId: elena ? elena.id : sarah.id,
            clientName: elena ? elena.name : sarah.name,
            clientEmail: elena ? elena.email : sarah.email,
            companyName: elena ? (elena.companyName || 'Horizon Global Logistics') : 'Horizon Global Logistics',
            projectName: 'Carrier Mobile Dispatch Application',
            description: 'Cross-platform mobile companion app for freight drivers with real-time GPS route updates, digital bill of lading signatures, and instant proof-of-delivery uploads.',
            requirements: JSON.stringify([
              'Offline-first GPS tracking',
              'Digital signature capture with audit trail',
              'Camera document scanner for BOL',
              'Push notifications for route modifications'
            ]),
            expectedDeadline: '2026-10-15',
            budget: '$28,000 - $35,000',
            status: 'ACCEPTED',
            adminNotes: 'Accepted after feasibility study. Converted into project PROJ-003.',
            convertedProjectId: 'proj-003'
          },
          {
            id: 'req-103',
            clientId: amara ? amara.id : sarah.id,
            clientName: amara ? amara.name : sarah.name,
            clientEmail: amara ? amara.email : sarah.email,
            companyName: amara ? (amara.companyName || 'Zenith Media Labs') : 'Zenith Media Labs',
            projectName: 'AI Content Syndication Platform',
            description: 'Automated video and visual asset distribution engine connecting creator studios to multiple social advertising networks with live performance analytics.',
            requirements: JSON.stringify([
              'Multi-channel social API posting',
              'Automated video transcoding & aspect resizing',
              'Real-time engagement telemetry dashboard',
              'Role-based creator team permissions'
            ]),
            expectedDeadline: '2026-12-15',
            budget: '$45,000 - $60,000',
            status: 'PENDING'
          }
        ]
      });
    }

    const taskCount = await prisma.task.count();
    if (taskCount === 0) {
      console.log('🌱 Seeding initial tasks into PostgreSQL database via Prisma...');
      const dev = await prisma.user.findFirst({ where: { role: 'DEVELOPER' } });
      const devId = dev ? dev.id : 'user-dev-2';
      const devName = dev ? dev.name : 'Maya Patel';

      await prisma.task.createMany({
        data: [
          {
            id: 'task-001',
            projectId: 'proj-001',
            projectName: 'E-commerce Website',
            title: 'Stripe Checkout Integration & Webhook Handler',
            description: 'Build robust tokenized Checkout Session flow supporting credit cards, Apple Pay, and asynchronous webhook handlers for payment confirmation.',
            assignedDeveloperId: 'user-dev-2',
            assignedDeveloperName: 'Maya Patel',
            dueDate: '2026-08-25',
            priority: 'HIGH',
            progress: 85,
            status: 'IN_PROGRESS',
            reviewStatus: 'None'
          },
          {
            id: 'task-002',
            projectId: 'proj-001',
            projectName: 'E-commerce Website',
            title: 'Product Faceted Search & Filtering API',
            description: 'Develop multi-attribute elastic search backend endpoint supporting brand, category, price range, and instant keyword querying.',
            assignedDeveloperId: 'user-dev-2',
            assignedDeveloperName: 'Maya Patel',
            dueDate: '2026-08-20',
            priority: 'MEDIUM',
            progress: 100,
            status: 'IN_PROGRESS',
            reviewStatus: 'Pending Review'
          },
          {
            id: 'task-003',
            projectId: 'proj-002',
            projectName: 'Telehealth Patient Portal',
            title: 'WebRTC Peer Video Session Controller',
            description: 'Configure encrypted peer-to-peer WebRTC video stream signaling server with adaptive resolution fallback.',
            assignedDeveloperId: 'user-dev-3',
            assignedDeveloperName: "Liam O'Connor",
            dueDate: '2026-09-10',
            priority: 'URGENT',
            progress: 60,
            status: 'IN_PROGRESS',
            reviewStatus: 'None'
          },
          {
            id: 'task-004',
            projectId: 'proj-003',
            projectName: 'Carrier Mobile Dispatch Application',
            title: 'Driver GPS Tracking Subsystem',
            description: 'Implement offline-capable geofenced position telemetry background daemon for mobile driver application.',
            assignedDeveloperId: 'user-dev-4',
            assignedDeveloperName: 'Sofia Rodriguez',
            dueDate: '2026-09-15',
            priority: 'MEDIUM',
            progress: 20,
            status: 'IN_PROGRESS',
            reviewStatus: 'None'
          }
        ]
      });
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};


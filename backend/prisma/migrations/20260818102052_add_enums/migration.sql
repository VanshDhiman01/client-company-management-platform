-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "startDate" TEXT NOT NULL,
    "expectedDelivery" TEXT NOT NULL,
    "completedDate" TEXT,
    "budget" TEXT,
    "overallProgress" INTEGER NOT NULL DEFAULT 0,
    "latestUpdate" TEXT,
    "assignedTeamCount" INTEGER NOT NULL DEFAULT 0,
    "clientVisibleNotes" TEXT,
    "internalNotes" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Web Application',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("assignedTeamCount", "budget", "category", "clientEmail", "clientId", "clientName", "clientVisibleNotes", "companyName", "completedDate", "createdAt", "description", "expectedDelivery", "id", "internalNotes", "latestUpdate", "name", "overallProgress", "requestId", "startDate", "status", "updatedAt") SELECT "assignedTeamCount", "budget", "category", "clientEmail", "clientId", "clientName", "clientVisibleNotes", "companyName", "completedDate", "createdAt", "description", "expectedDelivery", "id", "internalNotes", "latestUpdate", "name", "overallProgress", "requestId", "startDate", "status", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_ProjectRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL DEFAULT '[]',
    "expectedDeadline" TEXT NOT NULL,
    "budget" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedDate" DATETIME,
    "adminNotes" TEXT,
    "convertedProjectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ProjectRequest" ("adminNotes", "budget", "clientEmail", "clientId", "clientName", "companyName", "convertedProjectId", "createdAt", "description", "expectedDeadline", "id", "projectName", "requirements", "reviewedDate", "status", "submittedDate", "updatedAt") SELECT "adminNotes", "budget", "clientEmail", "clientId", "clientName", "companyName", "convertedProjectId", "createdAt", "description", "expectedDeadline", "id", "projectName", "requirements", "reviewedDate", "status", "submittedDate", "updatedAt" FROM "ProjectRequest";
DROP TABLE "ProjectRequest";
ALTER TABLE "new_ProjectRequest" RENAME TO "ProjectRequest";
CREATE TABLE "new_SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedDeveloperId" TEXT,
    "assignedDeveloperName" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdate" DATETIME NOT NULL,
    "developerNotes" TEXT,
    "resolutionSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SupportTicket" ("assignedDeveloperId", "assignedDeveloperName", "clientEmail", "clientId", "clientName", "companyName", "createdAt", "createdDate", "description", "developerNotes", "id", "lastUpdate", "priority", "projectId", "projectName", "resolutionSummary", "status", "ticketNumber", "title", "updatedAt") SELECT "assignedDeveloperId", "assignedDeveloperName", "clientEmail", "clientId", "clientName", "companyName", "createdAt", "createdDate", "description", "developerNotes", "id", "lastUpdate", "priority", "projectId", "projectName", "resolutionSummary", "status", "ticketNumber", "title", "updatedAt" FROM "SupportTicket";
DROP TABLE "SupportTicket";
ALTER TABLE "new_SupportTicket" RENAME TO "SupportTicket";
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedDeveloperId" TEXT,
    "assignedDeveloperName" TEXT,
    "dueDate" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewStatus" TEXT NOT NULL DEFAULT 'None',
    "internalReviewNotes" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Task" ("assignedDeveloperId", "assignedDeveloperName", "completedDate", "createdAt", "createdDate", "description", "dueDate", "id", "internalReviewNotes", "priority", "progress", "projectId", "projectName", "reviewStatus", "status", "title", "updatedAt") SELECT "assignedDeveloperId", "assignedDeveloperName", "completedDate", "createdAt", "createdDate", "description", "dueDate", "id", "internalReviewNotes", "priority", "progress", "projectId", "projectName", "reviewStatus", "status", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

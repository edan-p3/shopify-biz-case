-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "BusinessCaseStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED');

-- CreateEnum
CREATE TYPE "RiskCategory" AS ENUM ('TECHNICAL', 'FINANCIAL', 'OPERATIONAL', 'STRATEGIC');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('IDENTIFIED', 'MITIGATED', 'ACCEPTED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ExportType" AS ENUM ('PDF', 'EXCEL', 'JSON');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_cases" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "currentRevenue" DOUBLE PRECISION NOT NULL,
    "currentPlatform" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "grossMargin" DOUBLE PRECISION NOT NULL DEFAULT 0.30,
    "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 0.10,
    "implementationCost" DOUBLE PRECISION NOT NULL DEFAULT 50000,
    "currentPlatformCost" DOUBLE PRECISION NOT NULL,
    "status" "BusinessCaseStatus" NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "business_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operational_costs" (
    "id" TEXT NOT NULL,
    "businessCaseId" TEXT NOT NULL,
    "revenueLeakage" DOUBLE PRECISION NOT NULL,
    "operationalInefficiency" DOUBLE PRECISION NOT NULL,
    "integrationMaintenance" DOUBLE PRECISION NOT NULL,
    "manualProcessing" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "operational_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "businessCaseId" TEXT NOT NULL,
    "type" "ScenarioType" NOT NULL,
    "year1GrowthRate" DOUBLE PRECISION NOT NULL,
    "year2GrowthRate" DOUBLE PRECISION NOT NULL,
    "year3GrowthRate" DOUBLE PRECISION NOT NULL,
    "paybackPeriod" DOUBLE PRECISION NOT NULL,
    "roi3Year" DOUBLE PRECISION NOT NULL,
    "npv" DOUBLE PRECISION NOT NULL,
    "netBenefit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yearly_projections" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "costScenarioId" TEXT,
    "year" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "costs" DOUBLE PRECISION NOT NULL,
    "grossProfit" DOUBLE PRECISION NOT NULL,
    "netCashFlow" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "yearly_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_cash_flow" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "investment" DOUBLE PRECISION NOT NULL,
    "platformCosts" DOUBLE PRECISION NOT NULL,
    "returns" DOUBLE PRECISION NOT NULL,
    "netCashFlow" DOUBLE PRECISION NOT NULL,
    "cumulative" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "monthly_cash_flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_assumptions" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "desktopConversionRate" DOUBLE PRECISION NOT NULL,
    "mobileConversionRate" DOUBLE PRECISION NOT NULL,
    "cartAbandonmentRate" DOUBLE PRECISION NOT NULL,
    "cartRecoveryRate" DOUBLE PRECISION NOT NULL,
    "averageOrderValue" DOUBLE PRECISION NOT NULL,
    "aovGrowthRate" DOUBLE PRECISION NOT NULL,
    "repeatPurchaseRate" DOUBLE PRECISION NOT NULL,
    "customerLifetimeOrders" DOUBLE PRECISION NOT NULL,
    "b2bDigitalPenetration" DOUBLE PRECISION NOT NULL,
    "b2bOrderFrequencyIncrease" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "scenario_assumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "implementation_phases" (
    "id" TEXT NOT NULL,
    "businessCaseId" TEXT NOT NULL,
    "phaseNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startWeek" INTEGER NOT NULL,
    "endWeek" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "deliverables" TEXT[],
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "implementation_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "implementationPhaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risks" (
    "id" TEXT NOT NULL,
    "businessCaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "RiskCategory" NOT NULL,
    "probability" "RiskLevel" NOT NULL,
    "impact" "RiskLevel" NOT NULL,
    "description" TEXT NOT NULL,
    "mitigation" TEXT NOT NULL,
    "owner" TEXT,
    "status" "RiskStatus" NOT NULL DEFAULT 'IDENTIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exports" (
    "id" TEXT NOT NULL,
    "businessCaseId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "ExportType" NOT NULL,
    "scenario" "ScenarioType",
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmarks" (
    "id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "revenueRange" TEXT NOT NULL,
    "averageConversionRate" DOUBLE PRECISION NOT NULL,
    "averageAOV" DOUBLE PRECISION NOT NULL,
    "cartAbandonmentRate" DOUBLE PRECISION NOT NULL,
    "cartRecoveryRate" DOUBLE PRECISION NOT NULL,
    "repeatPurchaseRate" DOUBLE PRECISION NOT NULL,
    "averageGrowthRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "useCase" TEXT NOT NULL,
    "defaultRevenue" DOUBLE PRECISION NOT NULL,
    "defaultGrossMargin" DOUBLE PRECISION NOT NULL,
    "defaultImplementationCost" DOUBLE PRECISION NOT NULL,
    "configJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "operational_costs_businessCaseId_key" ON "operational_costs"("businessCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "scenarios_businessCaseId_type_key" ON "scenarios"("businessCaseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "yearly_projections_scenarioId_year_key" ON "yearly_projections"("scenarioId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_cash_flow_scenarioId_month_key" ON "monthly_cash_flow"("scenarioId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_assumptions_scenarioId_key" ON "scenario_assumptions"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "implementation_phases_businessCaseId_phaseNumber_key" ON "implementation_phases"("businessCaseId", "phaseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "benchmarks_industry_revenueRange_key" ON "benchmarks"("industry", "revenueRange");

-- AddForeignKey
ALTER TABLE "business_cases" ADD CONSTRAINT "business_cases_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operational_costs" ADD CONSTRAINT "operational_costs_businessCaseId_fkey" FOREIGN KEY ("businessCaseId") REFERENCES "business_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_businessCaseId_fkey" FOREIGN KEY ("businessCaseId") REFERENCES "business_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yearly_projections" ADD CONSTRAINT "yearly_projections_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yearly_projections" ADD CONSTRAINT "yearly_projections_costScenarioId_fkey" FOREIGN KEY ("costScenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_cash_flow" ADD CONSTRAINT "monthly_cash_flow_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_assumptions" ADD CONSTRAINT "scenario_assumptions_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "implementation_phases" ADD CONSTRAINT "implementation_phases_businessCaseId_fkey" FOREIGN KEY ("businessCaseId") REFERENCES "business_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_implementationPhaseId_fkey" FOREIGN KEY ("implementationPhaseId") REFERENCES "implementation_phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_businessCaseId_fkey" FOREIGN KEY ("businessCaseId") REFERENCES "business_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exports" ADD CONSTRAINT "exports_businessCaseId_fkey" FOREIGN KEY ("businessCaseId") REFERENCES "business_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exports" ADD CONSTRAINT "exports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

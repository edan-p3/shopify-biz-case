// API request/response types

import { Request } from 'express';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    timestamp: string;
    requestId: string;
  };
  pagination?: PaginationMeta;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  field?: string;
  value?: any;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BusinessCaseListQuery extends PaginationQuery {
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  companyName?: string;
  industry?: string;
}

export interface CreateBusinessCaseRequest {
  companyName: string;
  currentRevenue: number;
  currentPlatform: string;
  industry: string;
  grossMargin?: number;
  discountRate?: number;
  implementationCost?: number;
  currentPlatformCost: number;
  operationalCosts: {
    revenueLeakage: number;
    operationalInefficiency: number;
    integrationMaintenance: number;
    manualProcessing: number;
  };
}

export interface UpdateBusinessCaseRequest {
  companyName?: string;
  currentRevenue?: number;
  currentPlatform?: string;
  industry?: string;
  grossMargin?: number;
  discountRate?: number;
  implementationCost?: number;
  currentPlatformCost?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  tags?: string[];
}

export interface UpdateScenarioRequest {
  year1GrowthRate?: number;
  year2GrowthRate?: number;
  year3GrowthRate?: number;
  assumptions?: {
    desktopConversionRate?: number;
    mobileConversionRate?: number;
    cartAbandonmentRate?: number;
    cartRecoveryRate?: number;
    averageOrderValue?: number;
    aovGrowthRate?: number;
    repeatPurchaseRate?: number;
    customerLifetimeOrders?: number;
    b2bDigitalPenetration?: number;
    b2bOrderFrequencyIncrease?: number;
  };
}

export interface CreateRiskRequest {
  title: string;
  category: 'TECHNICAL' | 'FINANCIAL' | 'OPERATIONAL' | 'STRATEGIC';
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  mitigation: string;
  owner?: string;
}

export interface UpdateRiskRequest {
  title?: string;
  category?: 'TECHNICAL' | 'FINANCIAL' | 'OPERATIONAL' | 'STRATEGIC';
  probability?: 'LOW' | 'MEDIUM' | 'HIGH';
  impact?: 'LOW' | 'MEDIUM' | 'HIGH';
  description?: string;
  mitigation?: string;
  owner?: string;
  status?: 'IDENTIFIED' | 'MITIGATED' | 'ACCEPTED' | 'RESOLVED';
}

export interface ExportRequest {
  type: 'PDF' | 'EXCEL' | 'JSON';
  scenario?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
}

export interface ShareRequest {
  expiresIn: number; // seconds
  scenario?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
}

export type ErrorCode =
  | 'BUSINESS_CASE_NOT_FOUND'
  | 'INVALID_SCENARIO_TYPE'
  | 'CALCULATION_ERROR'
  | 'EXPORT_GENERATION_FAILED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'INTERNAL_SERVER_ERROR';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  website?: string;
  
  // Lead Qualification fields
  currentRevenue: string; // e.g., "0-10k", "10k-50k", "50k-200k", "200k+"
  budgetRange: string;     // e.g., "under_1000", "1000_3000", "3000_10000", "10000_plus"
  customBudget?: string;   // Saisi par le client si budgetRange === 'custom'
  timeline: string;        // e.g., "immediate", "1_3_months", "exploring"
  mainGoal: string;        // e.g., "leads", "sales", "brand", "website", "other"
  channels: string[];      // e.g., ["SEO", "Google Ads", "Social Media", "Email Marketing", "TikTok / Reels"]
  customNote?: string;
  
  // Computed qualification metadata
  submittedAt: string;
  qualificationScore: number; // 0 to 10 scale
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // Prioritization status
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'DISQUALIFIED';
  notes?: string;
}

export interface AgencyMetrics {
  totalLeads: number;
  highPriorityLeads: number;
  mediumPriorityLeads: number;
  lowPriorityLeads: number;
  estimatedPipelineValue: number; // calculated from budgets
}

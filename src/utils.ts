import { Lead, AgencyMetrics } from './types';

// Helper to calculate qualification score and priority
export function qualifyLead(
  budgetRange: string,
  currentRevenue: string,
  timeline: string
): { score: number; priority: 'HIGH' | 'MEDIUM' | 'LOW' } {
  let score = 0;

  // 1. Budget Scorer (Max 6 points)
  switch (budgetRange) {
    case 'under_1000':
      score += 0;
      break;
    case 'under_50k':
      score += 1;
      break;
    case '1000_3000':
      score += 2;
      break;
    case '3000_10000':
      score += 4;
      break;
    case '10000_plus':
      score += 6;
      break;
    case 'custom':
      score += 2;
      break;
    default:
      break;
  }

  // 2. Current Revenue Scorer (Max 5 points)
  switch (currentRevenue) {
    case 'under_5k':
      score += 0;
      break;
    case '5k_20k':
      score += 1;
      break;
    case '20k_100k':
      score += 3;
      break;
    case '100k_plus':
      score += 5;
      break;
    default:
      break;
  }

  // 3. Timeline/Urgency Scorer (Max 3 points)
  switch (timeline) {
    case 'immediate':
      score += 3;
      break;
    case '1_3_months':
      score += 1;
      break;
    case 'exploring':
      score += 0;
      break;
    default:
      break;
  }

  // Calculate Priority (Max 14 total points)
  let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (score >= 7) {
    priority = 'HIGH';
  } else if (score >= 3) {
    priority = 'MEDIUM';
  }

  return { score, priority };
}

// Map technical values to user-friendly labels in French & Arabic
export const labels = {
  fr: {
    currentRevenue: {
      'under_5k': 'Moins de 150 000 DA (15 Millions centimes) / mois',
      '5k_20k': '150 000 DA à 500 000 DA (15 à 50 Millions centimes)',
      '20k_100k': '500 000 DA à 2 000 000 DA (50 à 200 Millions centimes)',
      '100k_plus': 'Plus de 2 000 000 DA (Plus de 200 Millions) / mois',
    },
    budgetRange: {
      'under_x': '', // placeholder
      'under_50k': 'Moins de 50 000 DA / mois',
      'under_1000': 'Moins de 30 000 DA (~150 €) / mois',
      '1000_3000': '30 000 DA à 100 000 DA (150 € à 500 €)',
      '3000_10000': '100 000 DA à 300 000 DA (500 € à 1500 €)',
      '10000_plus': 'Plus de 300 000 DA (Plus de 1500 €) / mois',
      'custom': 'Autre (Mettre mon budget)',
    },
    timeline: {
      'immediate': 'Immédiat (Moins d\'un mois)',
      '1_3_months': 'Dans 1 à 3 mois',
      'exploring': 'Simple exploration / Sans engagement',
    },
    mainGoal: {
      'leads': 'Générer plus de prospects qualifiés',
      'sales': 'Augmenter les ventes en ligne (E-commerce)',
      'brand': 'Améliorer l\'image de marque & visibilité globale',
      'website': 'Concevoir un site web performant',
      'other': 'Autre objectif de croissance',
    },
    status: {
      'NEW': 'Nouveau',
      'CONTACTED': 'Contacté',
      'QUALIFIED': 'Qualifié d\'intérêt',
      'DISQUALIFIED': 'Non éligible / Archivé'
    }
  },
  ar: {
    currentRevenue: {
      'under_5k': 'أقل من 150,000 دج (15 مليون سنتيم) / شهرياً',
      '5k_20k': 'من 150,000 دج إلى 500,000 دج (15 إلى 50 مليون)',
      '20k_100k': 'من 500,000 دج إلى 2,000,000 دج (50 إلى 200 مليون)',
      '100k_plus': 'أكثـر من 2,000,000 دج (أكثر من 200 مليون سنتيم) / شهرياً',
    },
    budgetRange: {
      'under_x': '', // placeholder
      'under_50k': 'أقل من 50,000 دج / شهرياً',
      'under_1000': 'أقل من 30,000 دج (~150 يورو) / شهرياً',
      '1000_3000': 'من 30,000 دج إلى 100,000 دج (150 إلى 500 يورو)',
      '3000_10000': 'من 100,000 دج إلى 300,000 دج (500 إلى 1500 يورو)',
      '10000_plus': 'أكثر من 300,000 دج (أكثر من 1500 يورو) / شهرياً',
      'custom': 'آخر (تحديد ميزانية مخصصة)',
    },
    timeline: {
      'immediate': 'فوري (أقل من شهر)',
      '1_3_months': 'خلال 1 إلى 3 أشهر',
      'exploring': 'مجرد استكشاف وبحث',
    },
    mainGoal: {
      'leads': 'جلب المزيد من العملاء المحتملين المؤهلين',
      'sales': 'زيادة المبيعات عبر الإنترنت',
      'brand': 'تحسين صورة العلامة التجارية والوعي بها',
      'website': 'إنشاء أو تحسين الموقع الإلكتروني',
      'other': 'هدف نمو وتوسع آخر',
    },
    status: {
      'NEW': 'جديد',
      'CONTACTED': 'تم التواصل',
      'QUALIFIED': 'مؤهل ومهتم',
      'DISQUALIFIED': 'غير مؤهل / مؤرشف'
    }
  }
};

// Initial realistic leads to populate the applet's DB
const SAMPLE_LEADS: Lead[] = [
  {
    id: 'lead_1',
    fullName: 'Jean Dupont',
    email: 'j.dupont@novatech-solutions.com',
    phone: '06 12 34 56 78',
    companyName: 'NovaTech Solutions',
    website: 'novatech-solutions.com',
    currentRevenue: '100k_plus',
    budgetRange: '10000_plus',
    timeline: 'immediate',
    mainGoal: 'leads',
    channels: ['SEO', 'Google Ads', 'Email Marketing'],
    customNote: 'Nous cherchons de toute urgence à doubler notre flux de leads B2B qualifiés pour notre force de vente.',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2h ago
    qualificationScore: 14,
    priority: 'HIGH',
    status: 'NEW',
    notes: 'Super lead ! Grosse entreprise technologique, budget mensuel >10k€ avec intentions claires et besoin immédiat.'
  },
  {
    id: 'lead_2',
    fullName: 'Sophie Martin',
    email: 'sophie@ateliers-creatifs.fr',
    phone: '07 98 76 54 32',
    companyName: 'Les Ateliers Créatifs',
    website: 'atelierscreatifs.fr',
    currentRevenue: '20k_100k',
    budgetRange: '3000_10000',
    timeline: '1_3_months',
    mainGoal: 'sales',
    channels: ['Instagram / Paid Ads', 'TikTok / Reels'],
    customNote: 'Boutique e-commerce de décoration en croissance. On stagne un peu et on veut tester de nouvelles campagnes payantes.',
    submittedAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18h ago
    qualificationScore: 8,
    priority: 'HIGH',
    status: 'NEW',
    notes: 'Très bon profil e-commerce de taille intermédiaire. Budget réaliste de 3-10k€.'
  },
  {
    id: 'lead_3',
    fullName: 'Antoine Lefèvre',
    email: 'contact@lefevre-avocat.fr',
    phone: '06 43 21 09 87',
    companyName: 'Cabinet Antoine Lefèvre',
    website: 'lefevre-avocat.fr',
    currentRevenue: '5k_20k',
    budgetRange: '1000_3000',
    timeline: '1_3_months',
    mainGoal: 'brand',
    channels: ['SEO', 'LinkedIn Outreach'],
    customNote: 'Avocat indépendant cherchant à asseoir ma réputation locale et attirer de nouveaux dossiers professionnels.',
    submittedAt: new Date(Date.now() - 3600000 * 40).toISOString(), // 1.5 days ago
    qualificationScore: 3,
    priority: 'MEDIUM',
    status: 'CONTACTED',
    notes: 'Cabinet local. Budget limité mais sérieux. On peut lui offrir une formule SEO locale ciblée.'
  },
  {
    id: 'lead_4',
    fullName: 'Chloé Garcia',
    email: 'chloe@douceur-bio.fr',
    phone: '07 55 44 33 22',
    companyName: 'Douceur Bio Céleste',
    currentRevenue: 'under_5k',
    budgetRange: 'under_1000',
    timeline: 'exploring',
    mainGoal: 'website',
    channels: ['Instagram / Paid Ads'],
    customNote: 'Je débute tout juste en ligne, je recherche des conseils gratuits pour commencer.',
    submittedAt: new Date(Date.now() - 3600000 * 96).toISOString(), // 4 days ago
    qualificationScore: 0,
    priority: 'LOW',
    status: 'DISQUALIFIED',
    notes: 'Trop tôt pour notre agence car budget <1000€ et chiffre d\'affaires naissant. Envoyé vers notre newsletter de conseils.'
  }
];

// Localstorage state accessor
export function getSavedLeads(): Lead[] {
  const data = localStorage.getItem('agency_leads');
  if (!data) {
    localStorage.setItem('agency_leads', JSON.stringify(SAMPLE_LEADS));
    return SAMPLE_LEADS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SAMPLE_LEADS;
  }
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem('agency_leads', JSON.stringify(leads));
}

// Calculate key metrics
export function calculateMetrics(leads: Lead[]): AgencyMetrics {
  let high = 0;
  let medium = 0;
  let low = 0;
  let pipeline = 0;

  leads.forEach(lead => {
    if (lead.status === 'DISQUALIFIED') return; // Skip disqualified in pipeline metrics

    if (lead.priority === 'HIGH') high++;
    else if (lead.priority === 'MEDIUM') medium++;
    else if (lead.priority === 'LOW') low++;

    // Add approximate average values for pipelining
    switch (lead.budgetRange) {
      case 'under_50k':
        pipeline += 250;
        break;
      case 'under_1000':
        pipeline += 500;
        break;
      case '1000_3000':
        pipeline += 2000;
        break;
      case '3000_10000':
        pipeline += 6500;
        break;
      case '10000_plus':
        pipeline += 15000;
        break;
      case 'custom':
        pipeline += 1000;
        break;
    }
  });

  return {
    totalLeads: leads.length,
    highPriorityLeads: high,
    mediumPriorityLeads: medium,
    lowPriorityLeads: low,
    estimatedPipelineValue: pipeline
  };
}

// Export array of leads into CSV string
export function exportToCSV(leads: Lead[]): string {
  const headers = [
    'ID', 'Nom Complet', 'Email', 'Téléphone', 'Entreprise', 'Site Web', 
    'CA Actuel / mois', 'Budget / mois', 'Délai projet', 'Objectif Principal', 
    'Canaux d\'intérêt', 'Score de Qualification', 'Priorité', 'Statut', 'Date de Soumission', 'Note Client', 'Notes Internes'
  ];

  const rows = leads.map(lead => [
    lead.id,
    `"${lead.fullName.replace(/"/g, '""')}"`,
    lead.email,
    lead.phone,
    `"${lead.companyName.replace(/"/g, '""')}"`,
    lead.website || '',
    `"${(labels.fr.currentRevenue as any)[lead.currentRevenue] || lead.currentRevenue}"`,
    `"${lead.budgetRange === 'custom' ? (lead.customBudget ? `Autre (${lead.customBudget} DA)` : 'Autre') : ((labels.fr.budgetRange as any)[lead.budgetRange] || lead.budgetRange)}"`,
    `"${(labels.fr.timeline as any)[lead.timeline] || lead.timeline}"`,
    `"${(labels.fr.mainGoal as any)[lead.mainGoal] || lead.mainGoal}"`,
    `"${lead.channels.join(', ')}"`,
    lead.qualificationScore,
    lead.priority,
    lead.status,
    lead.submittedAt,
    `"${(lead.customNote || '').replace(/"/g, '""')}"`,
    `"${(lead.notes || '').replace(/"/g, '""')}"`
  ]);

  return [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');
}

// Helper to calculate approximate lead values or text summaries
export function getTimelineBadgeStyle(timeline: string) {
  switch (timeline) {
    case 'immediate':
      return 'bg-red-50 text-red-700 border-red-200';
    case '1_3_months':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

export function getPriorityBadgeStyle(priority: 'HIGH' | 'MEDIUM' | 'LOW') {
  switch (priority) {
    case 'HIGH':
      return 'bg-emerald-50 text-emerald-800 ring-emerald-600/20 ring-1 ring-inset font-bold';
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-800 ring-amber-600/20 ring-1 ring-inset font-semibold';
    case 'LOW':
      return 'bg-slate-50 text-slate-700 ring-slate-600/10 ring-1 ring-inset';
  }
}

import React, { useState, useMemo } from 'react';
import { Lead } from '../types';
import { calculateMetrics, exportToCSV, labels } from '../utils';
import LeadCard from './LeadCard';
import { 
  Search, Download, PlusCircle, Users, BarChart3, TrendingUp, Filter,
  ShieldAlert, RefreshCw, Layers, Award, CheckCircle, Info, Sparkles 
} from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteLead: (id: string) => void;
  onResetDatabase: () => void;
}

export default function Dashboard({ leads, onUpdateStatus, onUpdateNotes, onDeleteLead, onResetDatabase }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'score_desc' | 'score_asc'>('score_desc');

  // Compute stats based on current database
  const metrics = useMemo(() => calculateMetrics(leads), [leads]);

  // Download action
  const handleCSVExport = () => {
    const csvContent = exportToCSV(leads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `apex_digital_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        const matchesSearch = 
          lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPriority = priorityFilter === 'ALL' || lead.priority === priorityFilter;
        
        const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        if (sortBy === 'date_asc') return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        if (sortBy === 'score_desc') return b.qualificationScore - a.qualificationScore;
        if (sortBy === 'score_asc') return a.qualificationScore - b.qualificationScore;
        return 0;
      });
  }, [leads, searchTerm, priorityFilter, statusFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Banner introduction details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest block">
            Espace Administrateur Agence
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-950">
            Qualification & Tri Automatique ⚡
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Retrouvez tous les leads qualifiés via notre algorithme de scoring. Les prospects à fort potentiel et timelines immédiates sont marqués d'urgence pour prioriser vos relances.
          </p>
        </div>

        {/* Action button row */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleCSVExport}
            disabled={leads.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg shadow-xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Exporter CSV
          </button>
          
          <button
            id="btn-reset-db"
            onClick={onResetDatabase}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-500 bg-neutral-50 border border-neutral-150 rounded-lg shadow-xs hover:bg-white transition-all duration-150 cursor-pointer"
            title="Importer des leads de simulation"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Données démo
          </button>
        </div>
      </div>

      {/* METRICS ROW (Swiss/Minimalist Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-neutral-200 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-lg bg-neutral-900 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              Total Prospects Recus
            </span>
            <span className="text-2xl font-display font-bold text-neutral-950 block leading-tight">
              {metrics.totalLeads}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500 text-white">
            <Award className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold block">
              Haut Potentiel (Prioritaire)
            </span>
            <span className="text-2xl font-display font-bold text-neutral-950 block leading-tight">
              {metrics.highPriorityLeads} <span className="text-xs text-neutral-400 font-medium">({metrics.totalLeads > 0 ? Math.round((metrics.highPriorityLeads / metrics.totalLeads) * 100) : 0}%)</span>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-neutral-200 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-lg bg-neutral-100 text-neutral-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              Potentiel Moyen (Standard)
            </span>
            <span className="text-2xl font-display font-bold text-neutral-900 block leading-tight">
              {metrics.mediumPriorityLeads}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-neutral-200 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              Pipeline Estimé Moyen
            </span>
            <span className="text-2xl font-display font-bold text-neutral-950 block leading-tight">
              {metrics.estimatedPipelineValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>

      </div>

      {/* INTELLIGENT EXPLANATION PROMPT */}
      <div className="p-4 bg-neutral-900 text-white rounded-2xl flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
        <Sparkles className="h-6 w-6 text-emerald-400 shrink-0" />
        <p className="text-xs leading-relaxed flex-1 text-neutral-200">
          <span className="font-semibold text-emerald-300">Formule de tri intelligent active :</span> Les profils sont triés automatiquement de 0 à 14 points basés sur le Budget mensuel (+0 à +6), le CA actuel (+0 à +5) et l'Urgence de démarrage (+0 à +3). Un score supérieur ou égal à 7 positionne instantanément le lead en <strong>Dossier Prioritaire (HIGH/Fort Potentiel)</strong> pour maximiser votre taux de conversion.
        </p>
      </div>

      {/* FILTER & CONTROL PANEL */}
      <div className="bg-white border border-neutral-200 p-4 sm:p-5 rounded-2xl space-y-4">
        
        {/* Main query bar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              id="search-leads-input"
              type="text"
              placeholder="Rechercher par nom, email ou entreprise..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
            />
          </div>

          {/* Sorter selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 whitespace-nowrap hidden lg:inline font-mono">Trier par :</span>
            <select
              id="sort-leads-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden cursor-pointer text-neutral-700"
            >
              <option value="score_desc">Score de Qualification (Décroissant)</option>
              <option value="score_asc">Score de Qualification (Croissant)</option>
              <option value="date_desc">Plus récents d'abord</option>
              <option value="date_asc">Plus anciens d'abord</option>
            </select>
          </div>
        </div>

        {/* Tabs filters for Priority and Status toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          
          {/* Priority filter buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              id="tab-priority-all"
              onClick={() => setPriorityFilter('ALL')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                priorityFilter === 'ALL' 
                  ? 'bg-neutral-950 text-white' 
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Tous les leads
            </button>
            <button
              id="tab-priority-high"
              onClick={() => setPriorityFilter('HIGH')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                priorityFilter === 'HIGH' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-100'
              }`}
            >
              🚀 Fort Potentiel ({leads.filter(l => l.priority === 'HIGH').length})
            </button>
            <button
              id="tab-priority-medium"
              onClick={() => setPriorityFilter('MEDIUM')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                priorityFilter === 'MEDIUM' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100/80 border border-amber-100'
              }`}
            >
              📈 Moyen ({leads.filter(l => l.priority === 'MEDIUM').length})
            </button>
            <button
              id="tab-priority-low"
              onClick={() => setPriorityFilter('LOW')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                priorityFilter === 'LOW' 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-slate-50 text-slate-700 hover:bg-neutral-150'
              }`}
            >
              💡 Bas/Newsletter ({leads.filter(l => l.priority === 'LOW').length})
            </button>
          </div>

          {/* Status filtering */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">Filtre Statut :</span>
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-neutral-200 rounded-md focus:outline-hidden text-neutral-600 cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="NEW">Nouveau</option>
              <option value="CONTACTED">Contacté</option>
              <option value="QUALIFIED">Qualifié</option>
              <option value="DISQUALIFIED">Non éligible / Archivé</option>
            </select>
          </div>

        </div>

      </div>

      {/* LEADS CORE LIST VIEW */}
      {filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onUpdateStatus={onUpdateStatus}
              onUpdateNotes={onUpdateNotes}
              onDeleteLead={onDeleteLead}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl">
          <Info className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-sm text-neutral-800">Aucun prospect correspondant</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Modifiez vos critères de recherche, réinitialisez les tags de filtres ou utilisez le bouton "Données démo" au sommet pour réinjecter des exemples de qualification de prospects.
          </p>
        </div>
      )}

    </div>
  );
}

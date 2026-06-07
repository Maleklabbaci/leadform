import React, { useState } from 'react';
import { Lead } from '../types';
import { labels, getPriorityBadgeStyle, getTimelineBadgeStyle } from '../utils';
import { 
  Calendar, Building, Mail, Phone, Globe, Award, ClipboardEdit, 
  Trash2, FileText, CheckCircle2, ChevronDown, Check, UserCheck 
} from 'lucide-react';

interface LeadCardProps {
  key?: string;
  lead: Lead;
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteLead: (id: string) => void;
}

export default function LeadCard({ lead, onUpdateStatus, onUpdateNotes, onDeleteLead }: LeadCardProps) {
  const [internalNotes, setInternalNotes] = useState(lead.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const adminLabels = labels.fr;

  const handleNotesSave = () => {
    onUpdateNotes(lead.id, internalNotes);
    setIsEditingNotes(false);
  };

  const formattedDate = new Date(lead.submittedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-200">
      
      {/* Top Header Card Info */}
      <div className="p-5 border-b border-neutral-100">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          
          {/* Main Info */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-base text-neutral-900 group-hover:text-emerald-600 transition-colors">
                {lead.fullName}
              </h3>
              <span className={`inline-flex items-center text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full ${getPriorityBadgeStyle(lead.priority)}`}>
                {lead.priority === 'HIGH' ? '🚀 PRIORITAIRE' : lead.priority === 'MEDIUM' ? '📈 STANDARD' : '💡 CONSEILS'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono mt-1">
              <Calendar className="h-3 w-3" />
              Soumis le {formattedDate}
            </div>
          </div>
          
          {/* Qualification Score circle */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Qualification Score</span>
              <span className="text-sm font-sans font-extrabold text-neutral-900">{lead.qualificationScore} <span className="text-xs text-neutral-400 font-medium">/ 14</span></span>
            </div>
            <div className={`h-11 w-11 rounded-full border-2 flex items-center justify-center font-sans font-extrabold text-xs shadow-inner ${
              lead.priority === 'HIGH' 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                : lead.priority === 'MEDIUM' 
                  ? 'bg-amber-50 border-amber-400 text-amber-800' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600'
            }`}>
              {Math.round((lead.qualificationScore / 14) * 100)}%
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          {/* Status selector */}
          <div className="relative">
            <button
              id={`status-btn-${lead.id}`}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-950 text-white hover:bg-neutral-850 rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
            >
              Statut: {adminLabels.status[lead.status]}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            
            {showStatusDropdown && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1 text-xs">
                {Object.entries(adminLabels.status).map(([key, value]) => (
                  <button
                    key={key}
                    id={`status-opt-${lead.id}-${key}`}
                    onClick={() => {
                      onUpdateStatus(lead.id, key as Lead['status']);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center justify-between cursor-pointer ${
                      lead.status === key ? 'font-bold text-neutral-950 bg-neutral-50' : 'text-neutral-600'
                    }`}
                  >
                    <span>{value}</span>
                    {lead.status === key && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delete Action Button */}
          <button
            id={`delete-btn-${lead.id}`}
            onClick={() => onDeleteLead(lead.id)}
            className="p-1 text-neutral-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
            title="Archiver"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Fields */}
      <div className="p-5 bg-neutral-50/50 space-y-4">
        {/* Basic contact & company info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-neutral-100">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">Contact direct</span>
            <div className="flex items-center gap-2 text-neutral-700">
              <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <a href={`mailto:${lead.email}`} className="hover:underline font-medium break-all">{lead.email}</a>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 mt-1">
              <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <a href={`tel:${lead.phone}`} className="hover:underline font-medium">{lead.phone}</a>
            </div>
          </div>

          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-neutral-100">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">Entreprise</span>
            <div className="flex items-center gap-2 text-neutral-700">
              <Building className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span className="font-bold text-neutral-900">{lead.companyName}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700 mt-1">
              <Globe className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              {lead.website ? (
                <a href={`https://${lead.website}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-0.5">
                  {lead.website}
                </a>
              ) : (
                <span className="text-neutral-400 italic">Non renseigné</span>
              )}
            </div>
          </div>
        </div>

        {/* Qualification Criteria breakdown */}
        <div className="p-4 bg-white border border-neutral-150 rounded-xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">Variables de Qualification</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide block">CA Actuel / mois</span>
              <span className="text-xs font-semibold text-neutral-800">{(adminLabels.currentRevenue as any)[lead.currentRevenue]}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide block">Budget Mensuel</span>
              <span className="text-xs font-semibold text-neutral-800">{(adminLabels.budgetRange as any)[lead.budgetRange]}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide block">Horizon Projet</span>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] border font-semibold mt-0.5 ${getTimelineBadgeStyle(lead.timeline)}`}>
                {(adminLabels.timeline as any)[lead.timeline].split(' (')[0]}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wide block">Objectifs visés</span>
            <span className="text-xs text-neutral-900 font-medium">{(adminLabels.mainGoal as any)[lead.mainGoal]}</span>
          </div>

          {lead.channels.length > 0 && (
            <div className="pt-1">
              <span className="text-[9px] text-neutral-400 uppercase tracking-wide block">Canaux marketing favoris</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {lead.channels.map(chan => (
                  <span key={chan} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-150">
                    {chan}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer text note */}
        {lead.customNote && (
          <div className="p-3 bg-neutral-100/50 border border-neutral-200/50 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">Note originale du prospect</span>
            <p className="text-neutral-600 italic">"{lead.customNote}"</p>
          </div>
        )}

        {/* Agency Internals private editor */}
        <div className="border-t border-neutral-200 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              Notes Privées d'Agence & Planification
            </span>
            {!isEditingNotes && (
              <button
                id={`edit-notes-btn-${lead.id}`}
                onClick={() => setIsEditingNotes(true)}
                className="text-[11px] font-mono text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <ClipboardEdit className="h-3 w-3" /> Éditer
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                id={`textarea-notes-${lead.id}`}
                value={internalNotes}
                onChange={e => setInternalNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 font-sans"
                placeholder="Ex. Rappeler d'urgence jeudi matin avec l'étude SEO..."
              />
              <div className="flex justify-end gap-2">
                <button
                  id={`cancel-notes-btn-${lead.id}`}
                  onClick={() => setIsEditingNotes(false)}
                  className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  id={`save-notes-btn-${lead.id}`}
                  onClick={handleNotesSave}
                  className="px-3 py-1.5 text-xs text-white bg-neutral-950 hover:bg-neutral-800 rounded-md font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">
              {lead.notes ? (
                <span className="text-neutral-700 bg-neutral-100 p-2.5 rounded-lg block italic border border-neutral-200/50">"{lead.notes}"</span>
              ) : (
                <span className="text-neutral-400 italic">Aucune note privée rédigée. Ajoutez des remarques d'appel stratégique ou d'action.</span>
              )}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

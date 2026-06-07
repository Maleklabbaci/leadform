import React from 'react';
import { Sparkles, LayoutDashboard, Send, ChevronRight } from 'lucide-react';
import { Language } from '../translations';

interface ConversionHeaderProps {
  isAdminMode: boolean;
  onToggleMode: (admin: boolean) => void;
  leadCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function ConversionHeader({ 
  isAdminMode, 
  onToggleMode, 
  leadCount,
  language,
  onLanguageChange
}: ConversionHeaderProps) {
  const isRtl = language === 'ar';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 sm:h-20 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {/* Logo & Agency identity */}
          <div className={`flex items-center cursor-pointer ${isRtl ? 'flex-row-reverse text-right' : ''}`} onClick={() => onToggleMode(false)}>
            <img 
              referrerPolicy="no-referrer"
              src="https://i.ibb.co/vCV92NXv/logo2.png" 
              alt="iVision Agency Logo" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Core Minimalist Value Props (Highly persuasive, conversion optimized) */}
          <div className={`hidden lg:flex items-center gap-6 text-xs text-neutral-500 font-medium ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {isRtl ? 'تقييم ذكي خلال دقيقتين' : 'Qualification en 2 minutes'}
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-300"></span>
            <span>{isRtl ? 'إستراتيجية مخصصة بالكامل' : 'Stratégie sur-mesure'}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300"></span>
            <span>{isRtl ? 'أولوية تواصل مع الشركاء' : 'Accès prioritaire Décideurs'}</span>
          </div>

          {/* Call to Actions & Mode Toggles */}
          <div className={`flex items-center gap-3.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
            
            {/* Quick Language Toggle */}
            <div className={`flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200/50 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => onLanguageChange('fr')}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  language === 'fr' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ar')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  language === 'ar' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                عربي
              </button>
            </div>

            {isAdminMode ? (
              <button
                id="btn-switch-form"
                onClick={() => onToggleMode(false)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-neutral-900 bg-white border border-neutral-200 rounded-lg shadow-xs hover:bg-neutral-50 transition-all duration-200 cursor-pointer"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                <span>{isRtl ? 'الرجوع للاستبيان' : 'Formulaire'}</span>
                <ChevronRight className={`h-3 w-3 shrink-0 ml-0.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                id="btn-switch-admin"
                onClick={() => onToggleMode(true)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-neutral-950 rounded-lg shadow-sm hover:bg-neutral-800 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">{isRtl ? 'لوحة الإدارة' : 'Backstage'}</span>
                <span className="inline sm:hidden">Admin</span>
                {leadCount > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shrink-0">
                    {leadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

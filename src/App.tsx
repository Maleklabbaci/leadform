/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lead } from './types';
import { getSavedLeads, saveLeads, qualifyLead } from './utils';
import ConversionHeader from './components/ConversionHeader';
import LeadWizard from './components/LeadWizard';
import Dashboard from './components/Dashboard';
import { Sparkles, BarChart2, CheckCircle2, Award, Zap, ArrowRight, ArrowLeft, ArrowRightLeft, Video, Laptop, Target, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from './translations';

const SERVICES_DATA = [
  {
    icon: Video,
    titleFr: "Création de contenu (Photo & Vidéo)",
    descFr: "Production visuelle de tout type pour vos réseaux et plateformes afin d'impacter et captiver l'attention.",
    titleAr: "صناعة المحتوى (صورة وفيديو)",
    descAr: "إنتاج مرئي متكامل بشتى الأنواع لشبكاتكم ومنصاتكم الرقمية لجذب انتباه العملاء وزيادة تفاعلهم.",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    iconBg: "bg-blue-500/20 text-blue-400",
    bgGradient: "from-blue-600/10 to-transparent",
  },
  {
    icon: Laptop,
    titleFr: "Création de site web",
    descFr: "Des sites vitrines branchés ou des e-commerces ultra-optimisés pour booster vos ventes et votre crédibilité.",
    titleAr: "تصميم المواقع الإلكترونية",
    descAr: "مواقع تعريفية متطورة أو متاجر إلكترونية مهيأة بشكل كامل لزيادة المبيعات وبناء مصداقية قوية.",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    iconBg: "bg-purple-500/20 text-purple-400",
    bgGradient: "from-purple-600/10 to-transparent",
  },
  {
    icon: Target,
    titleFr: "Publicité Ciblée (Ads Meta & TikTok)",
    descFr: "Campagnes de publicité ultra-performantes conçues pour attirer des clients qualifiés et maximiser votre ROI.",
    titleAr: "الإعلانات الممولة (ميتا وتيك توك)",
    descAr: "إعلانات وحملات ترويجية مستهدفة بدقة لجلب عملاء مهتمين بالدفع ومضاعفة أرباحكم وسرعة نموكم.",
    badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    iconBg: "bg-orange-500/20 text-orange-400",
    bgGradient: "from-orange-600/10 to-transparent",
  },
  {
    icon: Compass,
    titleFr: "Stratégies Sur-Mesure",
    descFr: "Plans d'actions personnalisés et stratégies conçues spécifiquement pour dominer votre marché et accélérer votre croissance.",
    titleAr: "استراتيجيات مخصصة",
    descAr: "خطط مخصصة تناسب تماماً أهدافكم وتضمن السيطرة على قطاعكم والوصول لأعلى مستويات الأرباح.",
    badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    iconBg: "bg-teal-500/20 text-teal-400",
    bgGradient: "from-teal-600/10 to-transparent",
  }
];

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState<'salutation' | 'agency-info' | 'services-info' | 'growth-info' | 'language'>('salutation');
  const [currentServiceIdx, setCurrentServiceIdx] = useState(0);
  const [language, setLanguage] = useState<Language>('fr');

  // Load leads on mount
  useEffect(() => {
    const loadedLeads = getSavedLeads();
    setLeads(loadedLeads);
  }, []);

  // Transition automatically from pure salutation to agency info after 2 seconds
  useEffect(() => {
    if (showIntro && introStep === 'salutation') {
      const timer = setTimeout(() => {
        setIntroStep('agency-info');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showIntro, introStep]);

  // Display beautiful flash messages
  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  const handleSelectLanguageAndStart = (selectedLang: Language) => {
    setLanguage(selectedLang);
    setShowIntro(false);
  };

  // Add new lead from customer-facing wizard submissions
  const handleAddLead = (rawFormData: Omit<Lead, 'id' | 'submittedAt' | 'qualificationScore' | 'priority' | 'status'>) => {
    // Generate qualification scores
    const { score, priority } = qualifyLead(
      rawFormData.budgetRange,
      rawFormData.currentRevenue,
      rawFormData.timeline
    );

    const newLead: Lead = {
      ...rawFormData,
      id: 'lead_' + Math.random().toString(36).substring(2, 9),
      submittedAt: new Date().toISOString(),
      qualificationScore: score,
      priority: priority,
      status: 'NEW',
      notes: ''
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    saveLeads(updated);

    // Dynamic friendly notification for demo testing
    const priorityLabel = priority === 'HIGH' ? '🚀 FORT POTENTIEL (HIGH)' : priority === 'MEDIUM' ? '📈 STANDARD' : '💡 CONSEILS';
    triggerNotification(`Nouveau prospect reçu : ${newLead.fullName} qualifié en priorité [${priorityLabel}] !`);
  };

  // Status updates from admin dashboard
  const handleUpdateStatus = (id: string, status: Lead['status']) => {
    const updated = leads.map(lead => {
      if (lead.id === id) {
        return { ...lead, status };
      }
      return lead;
    });
    setLeads(updated);
    saveLeads(updated);
    triggerNotification(`Statut du prospect mis à jour avec succès : [${status}]`);
  };

  // Notes updates from admin dashboard
  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = leads.map(lead => {
      if (lead.id === id) {
        return { ...lead, notes };
      }
      return lead;
    });
    setLeads(updated);
    saveLeads(updated);
    triggerNotification('Notes internes enregistrées.');
  };

  // Lead removal
  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(lead => lead.id !== id);
    setLeads(updated);
    saveLeads(updated);
    triggerNotification('Prospect supprimé ou archivé avec succès.');
  };

  // Restore initial mockup state for easier demo/review
  const handleResetDatabase = () => {
    localStorage.removeItem('agency_leads');
    const freshLeads = getSavedLeads();
    setLeads(freshLeads);
    triggerNotification('Base de données réinitialisée avec les leads de démonstration !');
  };

  return (
    <div lang={language} data-lang={language} className="min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-neutral-900 selection:text-white antialiased">
      
      {/* Immersive Greeting Screen: Interactive Sequences */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="immersive-intro-layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="fixed inset-0 z-[1000] bg-gradient-to-br from-blue-600 to-purple-800 text-white overflow-y-auto p-4 sm:p-6 select-none flex flex-col items-center justify-start sm:justify-center py-8 sm:py-10"
          >
            <AnimatePresence mode="wait">
              {introStep === 'salutation' && (
                /* STEP 1: PURE SALUTATION GREETING SCREEN (PURE WHITE TYPOGRAPHY, NO ICONS OR EXTRA ACCENTS) */
                <motion.div
                  key="salutation-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="max-w-md w-full text-center space-y-6 my-auto flex flex-col items-center justify-center text-white"
                >
                  <img 
                    referrerPolicy="no-referrer"
                    src="https://i.ibb.co/vCV92NXv/logo2.png" 
                    alt="iVision Agency Logo" 
                    className="h-16 w-auto object-contain mx-auto mb-6 brightness-0 invert drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                  />
                  <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Bonjour &amp; Bienvenue
                  </h1>
                  <h2 lang="ar" className="text-2xl sm:text-4xl font-extrabold text-white leading-relaxed">
                    أهلاً وسهلاً بك
                  </h2>
                </motion.div>
              )}

              {introStep === 'agency-info' && (
                /* STEP 2: AGENCY INFO (IVISION ACCOMPANIED 300+ BRANDS & ECOMMERCE) */
                <motion.div
                  key="agency-info-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="max-w-xl w-full text-center space-y-6 px-2 my-auto flex flex-col items-center justify-center"
                >
                  <img 
                    referrerPolicy="no-referrer"
                    src="https://i.ibb.co/vCV92NXv/logo2.png" 
                    alt="iVision Agency Logo" 
                    className="h-16 w-auto object-contain mx-auto mb-2 brightness-0 invert drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                  />
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider">
                      iVision Agency
                    </span>
                    <h2 className="font-sans text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                      Une agence de référence qui a accompagné avec succès plus de <span className="text-yellow-300">300 marques</span> et e-commerces.
                    </h2>
                    <h2 lang="ar" className="text-lg xs:text-xl sm:text-3xl font-extrabold text-white leading-relaxed pt-2">
                      وكالة رائدة رافقت بنجاح أكثر من <span className="text-yellow-300">300 علامة تجارية</span> ومتجر إلكتروني.
                    </h2>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      id="next-step-btn-1"
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIntroStep('services-info')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-neutral-950 font-bold text-sm shadow-lg hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                      <span>Continuer</span>
                      <span className="text-neutral-400">|</span>
                      <span lang="ar" className="font-extrabold">متابعة</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {introStep === 'services-info' && (
                /* STEP 2.5: SERVICES SLIDER / CAROUSEL */
                <motion.div
                  key="services-info-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="max-w-xl w-full text-center space-y-4 px-2 my-auto"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      Nos Services • خدماتنا
                    </span>
                    <h2 className="font-sans text-lg xs:text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                      Des solutions pour propulser votre activité
                    </h2>
                    <h2 lang="ar" className="text-sm xs:text-base sm:text-lg font-bold text-white/90 leading-relaxed">
                      حلول متكاملة لدفع عجلة نمو نشاطكم التجاري
                    </h2>
                  </div>

                  {/* Elegant Service Card Slider */}
                  <div className="relative w-full py-0.5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentServiceIdx}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={`relative overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl p-4 xs:p-5 sm:p-8 border border-white/20 bg-gradient-to-br ${SERVICES_DATA[currentServiceIdx].bgGradient} flex flex-col items-center text-center space-y-4 shadow-xl`}
                      >
                        <div className={`p-2.5 rounded-xl ${SERVICES_DATA[currentServiceIdx].iconBg} shadow-inner shrink-0`}>
                          {React.createElement(SERVICES_DATA[currentServiceIdx].icon, { className: "h-6 w-6 sm:h-8 sm:w-8" })}
                        </div>

                        <div className="space-y-3 w-full">
                          {/* French block */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Service {currentServiceIdx + 1} / 4</span>
                            <h3 className="font-sans text-sm sm:text-lg font-black text-white leading-tight">
                              {SERVICES_DATA[currentServiceIdx].titleFr}
                            </h3>
                            <p className="text-[11px] sm:text-sm text-neutral-200 leading-relaxed font-medium">
                              {SERVICES_DATA[currentServiceIdx].descFr}
                            </p>
                          </div>

                          {/* Subtle Separator */}
                          <div className="h-px bg-white/15 w-1/2 mx-auto" />

                          {/* Arabic block */}
                          <div className="space-y-1" lang="ar">
                            <h3 className="text-xs sm:text-base font-black text-white leading-tight">
                              {SERVICES_DATA[currentServiceIdx].titleAr}
                            </h3>
                            <p className="text-[11px] sm:text-sm text-neutral-300 leading-relaxed font-semibold">
                              {SERVICES_DATA[currentServiceIdx].descAr}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Slide Indicators (Dots) */}
                  <div className="flex justify-center items-center gap-2 py-0.5">
                    {SERVICES_DATA.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentServiceIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentServiceIdx === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-1 flex flex-row items-center justify-center gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (currentServiceIdx > 0) {
                          setCurrentServiceIdx(prev => prev - 1);
                        } else {
                          setIntroStep('agency-info');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-[10px] xs:text-xs transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3 shrink-0" />
                      <span>{currentServiceIdx === 0 ? "Retour" : "Précédent"}</span>
                      <span className="text-white/30">|</span>
                      <span lang="ar">{currentServiceIdx === 0 ? "رجوع" : "السابق"}</span>
                    </motion.button>

                    <motion.button
                      id="next-step-btn-services"
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (currentServiceIdx < SERVICES_DATA.length - 1) {
                          setCurrentServiceIdx(prev => prev + 1);
                        } else {
                          setIntroStep('growth-info');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-[10px] xs:text-xs shadow-lg hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                      <span>{currentServiceIdx < SERVICES_DATA.length - 1 ? "Suivant" : "Continuer"}</span>
                      <span className="text-neutral-400">|</span>
                      <span lang="ar" className="font-extrabold">{currentServiceIdx < SERVICES_DATA.length - 1 ? "التالي" : "متابعة"}</span>
                      <ArrowRight className="h-3 w-3 shrink-0" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {introStep === 'growth-info' && (
                /* STEP 3: DIGITAL GROWTH FOCUS */
                <motion.div
                  key="growth-info-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="max-w-xl w-full text-center space-y-6 px-2 my-auto"
                >
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider">
                      Notre Engagement
                    </span>
                    <h2 className="font-sans text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                      Nous sommes là pour votre croissance dans le digital, avec nos stratégies et notre travail.
                    </h2>
                    <h2 lang="ar" className="text-lg xs:text-xl sm:text-3xl font-extrabold text-white leading-relaxed pt-2">
                      نحن هنا من أجل نموكم في العالم الرقمي، باستراتيجياتنا وعملنا الدؤوب.
                    </h2>
                  </div>

                  <div className="pt-4 flex flex-row items-center justify-center gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIntroStep('services-info')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                      <span>Retour</span>
                      <span className="text-white/30">|</span>
                      <span lang="ar">رجوع</span>
                    </motion.button>

                    <motion.button
                      id="next-step-btn-2"
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIntroStep('language')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs shadow-lg hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                      <span>Continuer</span>
                      <span className="text-neutral-400">|</span>
                      <span lang="ar" className="font-extrabold">متابعة</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {introStep === 'language' && (
                /* STEP 4: LANGUAGE SELECTION SCREEN (PURE MINIMALIST WITH TWO CRISP BUTTONS) */
                <motion.div
                  key="language-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="max-w-md w-full text-center space-y-8"
                >
                  <div className="space-y-3">
                    <h3 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                      Choisissez votre langue
                    </h3>
                    <h4 lang="ar" className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed">
                      اختر لغتك للبدء
                    </h4>
                  </div>
 
                  {/* High Contrast Selection Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                    {/* Français */}
                    <motion.button
                      id="choice-lang-fr"
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectLanguageAndStart('fr')}
                      className="w-full sm:w-44 py-3.5 px-6 rounded-xl bg-white text-neutral-950 font-bold text-sm shadow-lg hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center"
                    >
                      Français
                    </motion.button>
 
                    {/* Arabic */}
                    <motion.button
                      id="choice-lang-ar"
                      type="button"
                      lang="ar"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectLanguageAndStart('ar')}
                      className="w-full sm:w-44 py-3.5 px-6 rounded-xl bg-neutral-900 text-white border border-neutral-800 font-extrabold text-sm shadow-lg hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center"
                    >
                      العربية
                    </motion.button>
                  </div>

                  {/* Back button to growth stage */}
                  <div className="pt-2 flex justify-center">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIntroStep('growth-info')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3 shrink-0" />
                      <span>Retour</span>
                      <span className="text-white/25">|</span>
                      <span lang="ar">رجوع</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Floating Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm bg-neutral-900 text-white border border-neutral-800 text-xs px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium mr-2">{showNotification}</span>
        </div>
      )}

      {/* Main Agency Header with toggles - Only visible in Admin Dashboard to browse leads */}
      {isAdminMode && (
        <ConversionHeader
          isAdminMode={isAdminMode}
          onToggleMode={setIsAdminMode}
          leadCount={leads.filter(l => l.status === 'NEW').length}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      {/* Standalone Bilingual Language Indicator (Floating gracefully for clients, as requested for true form focus) */}
      {!isAdminMode && (
        <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} z-50 flex items-center bg-white/90 backdrop-blur-md px-1.5 py-1 rounded-2xl shadow-md border border-neutral-200/60 select-none`}>
          <button
            type="button"
            onClick={() => setLanguage('fr')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              language === 'fr' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Français
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              language === 'ar' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            العربية
          </button>
        </div>
      )}

      <main className={isAdminMode ? "pb-24" : "min-h-screen py-10 sm:py-20 flex flex-col justify-center items-center px-4 relative bg-linear-to-b from-neutral-50/50 to-neutral-100/50"}>
        {isAdminMode ? (
          /* ADMIN DASHBOARD WORKSPACE */
          <Dashboard
            leads={leads}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
            onDeleteLead={handleDeleteLead}
            onResetDatabase={handleResetDatabase}
          />
        ) : (
          /* CONVERSION ORIENTED LEAD CAPTURE FORM (PURE STANDALONE FORM LAYOUT) */
          <div className="w-full max-w-2xl">
            
            <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-2xl overflow-hidden relative">
              {/* Vibrant top decorative digital growth gradient header bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-neutral-900 to-indigo-600" />
              
              <LeadWizard onAddLead={handleAddLead} language={language} />
            </div>

            {/* Micro client trust indicators inside the form workspace */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center px-4" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-neutral-800 block">{translations[language].trustTitle1}</span>
                <span className="text-[10px] text-neutral-400 block leading-tight">{translations[language].trustDesc1}</span>
              </div>
              <div className="space-y-0.5 border-y sm:border-y-0 sm:border-x border-neutral-200/60 py-2 sm:py-0">
                <span className="text-xs font-semibold text-neutral-800 block">{translations[language].trustTitle2}</span>
                <span className="text-[10px] text-neutral-400 block leading-tight">{translations[language].trustDesc2}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-neutral-800 block">{translations[language].trustTitle3}</span>
                <span className="text-[10px] text-neutral-400 block leading-tight">{translations[language].trustDesc3}</span>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer / discreet action bar */}
      <footer className="py-4 border-t border-neutral-200 bg-white/90 text-center text-[10px] font-mono text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            © 2026 IVISION DIGITAL GROWTH AGENCY.
          </div>
          <div className="flex justify-center gap-4">
            <span 
              className="text-neutral-400 hover:text-neutral-800 font-semibold cursor-pointer transition-colors" 
              onClick={() => setIsAdminMode(!isAdminMode)}
            >
              {isAdminMode ? "← Client Form" : "👁 Admin"}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

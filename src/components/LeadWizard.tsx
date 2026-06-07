import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, AlertCircle, 
  TrendingUp, Compass, Globe, Check, MessageSquare, Briefcase, 
  CircleDollarSign, Clock, CheckCircle2, User, Mail, Phone, ExternalLink 
} from 'lucide-react';
import { Lead } from '../types';
import { qualifyLead, labels } from '../utils';
import { Language, translations } from '../translations';

interface LeadWizardProps {
  onAddLead: (lead: Omit<Lead, 'id' | 'submittedAt' | 'qualificationScore' | 'priority' | 'status'>) => void;
  language: Language;
}

export default function LeadWizard({ onAddLead, language }: LeadWizardProps) {
  const t = translations[language];
  const isRtl = language === 'ar';

  // Wizard steps: 
  // 1: Client Basic Contact Info (Name, Email, Phone)
  // 2: Business details (Company Name, Website, Main Goal)
  // 3: Intelligent Qualification Variables (Revenue, Budget Range)
  // 4: Project Urgency & Marketing Channels
  // 5: Personalized High Conversion Thank You & Recommendation Page
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form Draft State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    currentRevenue: '',
    budgetRange: '',
    customBudget: '',
    timeline: '',
    mainGoal: '',
    channels: [] as string[],
    customNote: ''
  });

  // Generated Lead after step 4 submission
  const [generatedLead, setGeneratedLead] = useState<Lead | null>(null);

  // Field validation helper
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calendlyStepFeedback, setCalendlyStepFeedback] = useState(false);

  const validateSingleField = (name: string, value: any) => {
    let errorMsg = '';
    
    if (name === 'fullName') {
      if (!value.trim()) {
        errorMsg = t.fullNameRequired;
      }
    } else if (name === 'phone') {
      const trimmed = value.trim();
      if (!trimmed) {
        errorMsg = t.phoneRequired;
      } else if (!/^\d+$/.test(trimmed)) {
        errorMsg = (t as any).phoneOnlyNumbers || t.phoneRequired;
      }
    } else if (name === 'email') {
      const trimmed = value.trim();
      if (trimmed && !/\S+@\S+\.\S+/.test(trimmed)) {
        errorMsg = t.emailInvalid;
      }
    } else if (name === 'companyName') {
      if (!value.trim()) {
        errorMsg = t.companyNameRequired;
      }
    } else if (name === 'mainGoal') {
      if (!value) {
        errorMsg = t.goalRequired;
      }
    } else if (name === 'currentRevenue') {
      if (!value) {
        errorMsg = t.revenueRequired;
      }
    } else if (name === 'budgetRange') {
      if (!value) {
        errorMsg = t.budgetRequired;
      }
    } else if (name === 'customBudget') {
      if (formData.budgetRange === 'custom' && !value.trim()) {
        errorMsg = language === 'ar' ? 'يرجى تحديد تفاصيل ميزانيتك' : 'Veuillez préciser votre budget personnalisé';
      }
    } else if (name === 'timeline') {
      if (!value) {
        errorMsg = t.timelineRequired;
      }
    }

    setErrors(prev => {
      const updated = { ...prev };
      if (errorMsg) {
        updated[name] = errorMsg;
      } else {
        delete updated[name];
      }
      return updated;
    });
  };

  const handleChange = (name: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateSingleField(name as string, value);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = { ...errors };

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = t.fullNameRequired;
      } else {
        delete newErrors.fullName;
      }

      if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t.emailInvalid;
      } else {
        delete newErrors.email;
      }

      const trimmedPhone = formData.phone.trim();
      if (!trimmedPhone) {
        newErrors.phone = t.phoneRequired;
      } else if (!/^\d+$/.test(trimmedPhone)) {
        newErrors.phone = (t as any).phoneOnlyNumbers || t.phoneRequired;
      } else {
        delete newErrors.phone;
      }
    } else if (step === 2) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = t.companyNameRequired;
      } else {
        delete newErrors.companyName;
      }
      if (!formData.mainGoal) {
        newErrors.mainGoal = t.goalRequired;
      } else {
        delete newErrors.mainGoal;
      }
    } else if (step === 3) {
      if (!formData.currentRevenue) {
        newErrors.currentRevenue = t.revenueRequired;
      } else {
        delete newErrors.currentRevenue;
      }
      if (!formData.budgetRange) {
        newErrors.budgetRange = t.budgetRequired;
      } else if (formData.budgetRange === 'custom' && !formData.customBudget.trim()) {
        newErrors.customBudget = language === 'ar' ? 'يرجى تحديد تفاصيل ميزانيتك' : 'Veuillez préciser votre budget personnalisé';
      } else {
        delete newErrors.budgetRange;
        delete newErrors.customBudget;
      }
    } else if (step === 4) {
      if (!formData.timeline) {
        newErrors.timeline = t.timelineRequired;
      } else {
        delete newErrors.timeline;
      }
    }

    setErrors(newErrors);
    
    if (step === 1) {
      return !newErrors.fullName && !newErrors.email && !newErrors.phone;
    } else if (step === 2) {
      return !newErrors.companyName && !newErrors.mainGoal;
    } else if (step === 3) {
      return !newErrors.currentRevenue && !newErrors.budgetRange && !newErrors.customBudget;
    } else if (step === 4) {
      return !newErrors.timeline;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  // Channel toggling helper
  const toggleChannel = (channel: string) => {
    setFormData(prev => {
      const exists = prev.channels.includes(channel);
      if (exists) {
        return { ...prev, channels: prev.channels.filter(c => c !== channel) };
      } else {
        return { ...prev, channels: [...prev.channels, channel] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    // Run qualification scoring engine
    const { score, priority } = qualifyLead(
      formData.budgetRange,
      formData.currentRevenue,
      formData.timeline
    );

    // Create the full lead payload
    const finalLead: Lead = {
      id: 'lead_' + Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      companyName: formData.companyName,
      website: formData.website,
      currentRevenue: formData.currentRevenue,
      budgetRange: formData.budgetRange,
      customBudget: formData.customBudget,
      timeline: formData.timeline,
      mainGoal: formData.mainGoal,
      channels: formData.channels,
      customNote: formData.customNote,
      submittedAt: new Date().toISOString(),
      qualificationScore: score,
      priority: priority,
      status: 'NEW'
    };

    // Callback to App parent to save state
    onAddLead(formData);
    
    // Save locally to display on the tailored thank you screen
    setGeneratedLead(finalLead);
    setCurrentStep(5);

    // Beautiful celebration confetti effect
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 }
        });
      }, 250);
    } catch (err) {
      console.warn('Confetti error:', err);
    }
  };

  // Quick reset to submit another lead for demo purposes
  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      website: '',
      currentRevenue: '',
      budgetRange: '',
      customBudget: '',
      timeline: '',
      mainGoal: '',
      channels: [],
      customNote: ''
    });
    setGeneratedLead(null);
    setCalendlyStepFeedback(false);
    setCurrentStep(1);
  };

  const goalOptions = [
    { value: 'leads', label: t.goalLeads, icon: Briefcase },
    { value: 'sales', label: t.goalSales, icon: CircleDollarSign },
    { value: 'brand', label: t.goalBrand, icon: Compass },
    { value: 'website', label: t.goalWebsite, icon: Globe },
    { value: 'other', label: t.goalOther, icon: TrendingUp }
  ];

  const channelOptions = isRtl ? [
    'إنشاء المواقع الإلكترونية',
    'إستراتيجية التسويق الرقمي',
    'صناعة المحتوى (تصوير، فيديو، تصميم)',
    'إعلانات ميتا وتيك توك'
  ] : [
    'Création de site internet',
    'Stratégie de marketing digital',
    'Création de contenu (Photo, Vidéo, Design)',
    'Publicité Meta ou TikTok'
  ];

  return (
    <div className={`max-w-xl mx-auto py-8 px-4 sm:py-10 sm:px-6 ${isRtl ? 'text-right' : 'text-left'}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Official Agency Logo Header */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <img 
          referrerPolicy="no-referrer"
          src="https://i.ibb.co/vCV92NXv/logo2.png" 
          alt="iVision Agency Logo" 
          className="h-11 sm:h-14 w-auto object-contain cursor-pointer transition-transform hover:scale-102"
          onClick={() => setCurrentStep(0)}
        />
      </div>

      {/* Interactive visual timeline stepper (Only visible on Steps 1 to 4) */}
      {currentStep > 0 && currentStep < 5 && (
        <div className="mb-6 sm:mb-10 text-center select-none">
          <div className="relative flex items-center justify-between max-w-sm mx-auto">
            {/* Base Connector track */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-100 z-0 rounded-full" />
            
            {/* Active filled connector track */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 transition-all duration-300 z-0 rounded-full" 
              style={{
                left: isRtl ? 'auto' : '0',
                right: isRtl ? '0' : 'auto',
                width: `${((currentStep - 1) / 3) * 100}%`
              }}
            />

            {[1, 2, 3, 4].map((stepNum) => {
              const isCompleted = currentStep > stepNum;
              const isActive = currentStep === stepNum;

              // Abbreviated step names 
              const stepName = isRtl ? (
                stepNum === 1 ? 'التواصل' :
                stepNum === 2 ? 'الشركة' :
                stepNum === 3 ? 'الميزانية' : 'الرؤية'
              ) : (
                stepNum === 1 ? 'Contact' :
                stepNum === 2 ? 'Structure' :
                stepNum === 3 ? 'Budget' : 'Vision'
              );

              return (
                <div key={stepNum} className="flex flex-col items-center relative z-10">
                  <motion.button
                    id={`stepper-dot-${stepNum}`}
                    type="button"
                    onClick={() => {
                      if (stepNum < currentStep) {
                        setCurrentStep(stepNum);
                      } else if (stepNum > currentStep) {
                        // Allow skipping forward ONLY if intermediate steps are fully valid
                        let canJump = true;
                        for (let s = currentStep; s < stepNum; s++) {
                          if (!validateStep(s)) canJump = false;
                        }
                        if (canJump) setCurrentStep(stepNum);
                      }
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-200' 
                        : isActive 
                        ? 'bg-neutral-950 border-neutral-950 text-white ring-4 ring-neutral-900/10' 
                        : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 stroke-[3]" />
                    ) : (
                      <span>{stepNum}</span>
                    )}
                  </motion.button>
                  <span className={`text-[9px] sm:text-[10px] font-mono tracking-wider font-bold uppercase mt-2 transition-colors ${
                    isActive ? 'text-neutral-950' : 'text-neutral-400'
                  }`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 0: Splash & Hook (Persuasive Pitch) */}
        {currentStep === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="inline-flex p-3 bg-neutral-50 border border-neutral-100 rounded-2xl mb-6">
              <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
            
            <h1 className="font-sans text-2xl xs:text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl mb-4 leading-normal sm:leading-none">
              {t.hookTitle}
            </h1>
            
            <p className="text-neutral-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              {t.hookIntro}
            </p>

            <button
              id="btn-start-form"
              onClick={() => setCurrentStep(1)}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-neutral-950 rounded-xl hover:bg-neutral-800 shadow-sm transition-all duration-200 group cursor-pointer"
            >
              <span>{t.startBtn}</span>
              <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <p className="text-[11px] text-neutral-400 mt-4 font-mono uppercase tracking-wider">
              {t.noCommitment}
            </p>
          </motion.div>
        )}

        {/* STEP 1: Basic Information with Custom Greeting */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="font-sans text-2xl font-bold text-neutral-950">
                {t.contactTitle}
              </h2>
              <p className="text-sm text-neutral-500">
                {t.contactIntro}
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5 focus-within:text-neutral-950">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.fullNameLabel}
                </label>
                <div className="relative">
                  <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400`} />
                  <input
                    id="input-name"
                    type="text"
                    autoFocus
                    value={formData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.fullNamePlaceholder}
                    className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-sans`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400`} />
                  <input
                    id="input-email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.emailPlaceholder}
                    className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-sans`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Line */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400`} />
                  <input
                    id="input-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.phonePlaceholder}
                    className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-sans`}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {t.phoneHelp}
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="pt-4 flex w-full">
              <motion.button
                id="btn-step1-next"
                onClick={handleNext}
                animate={formData.fullName.trim() && formData.phone.trim() ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-350 group cursor-pointer ${
                  formData.fullName.trim() && formData.phone.trim()
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md ring-2 ring-emerald-400/25'
                    : 'bg-neutral-950 hover:bg-neutral-800'
                }`}
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isRtl ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Company Info with Dynamic Greeting */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest block">
                {t.companySubtitle}, {formData.fullName.split(' ')[0]} !
              </span>
              <h2 className="font-sans text-2xl font-bold text-neutral-950">
                {t.companyTitle}
              </h2>
              <p className="text-sm text-neutral-500">
                {t.goalLabel}
              </p>
            </div>

            <div className="space-y-5">
              {/* Company name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.companyNameLabel}
                </label>
                <input
                  id="input-company"
                  type="text"
                  autoFocus
                  value={formData.companyName}
                  onChange={e => handleChange('companyName', e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.companyNamePlaceholder}
                  className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
                />
                {errors.companyName && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.companyName}
                  </p>
                )}
              </div>

              {/* Website URL (optional, conversion booster) */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.websiteLabel} <span className="text-neutral-400 lowercase font-normal">({t.websiteOptional})</span>
                </label>
                <input
                  id="input-website"
                  type="text"
                  value={formData.website}
                  onChange={e => handleChange('website', e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.websitePlaceholder}
                  className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-mono"
                />
              </div>

              {/* Main Goal Radio Group */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.goalLabel}
                </label>
                <div className="space-y-2">
                  {goalOptions.map(option => {
                    const IconComponent = option.icon;
                    const isSelected = formData.mainGoal === option.value;
                    return (
                      <motion.button
                        key={option.value}
                        id={`goal-option-${option.value}`}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleChange('mainGoal', option.value)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm rounded-xl border transition-all duration-200 cursor-pointer ${
                          isRtl ? 'text-right' : 'text-left'
                        } ${
                          isSelected 
                            ? 'bg-neutral-950 text-white border-neutral-950 font-medium shadow-md' 
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/15 text-white' : 'bg-neutral-50 text-neutral-600'}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-xs">{option.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>
                {errors.mainGoal && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {errors.mainGoal}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-2">
              <button
                id="btn-step2-prev"
                onClick={handlePrev}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                {t.backBtn}
              </button>
              <motion.button
                id="btn-step2-next"
                onClick={handleNext}
                animate={formData.companyName.trim() && formData.mainGoal ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-350 cursor-pointer ${
                  formData.companyName.trim() && formData.mainGoal
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md ring-2 ring-emerald-400/25'
                    : 'bg-neutral-950 hover:bg-neutral-800'
                }`}
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: FINANCIAL QUALIFICATION VARIABLES */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest block">
                {t.financialSubtitle}
              </span>
              <h2 className="font-sans text-2xl font-bold text-neutral-950">
                {t.financialTitle}
              </h2>
              <p className="text-sm text-neutral-500">
                {t.financialIntro}
              </p>
            </div>

            <div className="space-y-6">
              {/* Question 1: Current monthly revenue */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.revenueLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(labels[language].currentRevenue).map(([key, label]) => {
                    const isSelected = formData.currentRevenue === key;
                    return (
                      <motion.button
                        key={key}
                        id={`rev-option-${key}`}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleChange('currentRevenue', key)}
                        className={`px-3 py-3 text-xs rounded-xl border transition-all cursor-pointer ${
                          isRtl ? 'text-right' : 'text-left'
                        } ${
                          isSelected
                             ? 'bg-neutral-950 text-white border-neutral-950 font-medium shadow-md'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{label}</span>
                          <span className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-300'
                          }`}>
                            {isSelected && <span className="h-1 w-1 rounded-full bg-white" />}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {errors.currentRevenue && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.currentRevenue}
                  </p>
                )}
              </div>

              {/* Question 2: Intended/Target Marketing budget */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.budgetLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(labels[language].budgetRange)
                    .filter(([key]) => key !== 'under_x')
                    .map(([key, label]) => {
                      const isSelected = formData.budgetRange === key;
                      return (
                        <motion.button
                          key={key}
                          id={`budget-option-${key}`}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleChange('budgetRange', key)}
                          className={`px-3 py-3 text-xs rounded-xl border transition-all cursor-pointer ${
                            isRtl ? 'text-right' : 'text-left'
                          } ${
                            isSelected
                              ? 'bg-neutral-950 text-white border-neutral-950 font-medium shadow-md'
                              : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{label}</span>
                            <span className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-300'
                            }`}>
                              {isSelected && <span className="h-1 w-1 rounded-full bg-white" />}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                </div>

                {/* Custom Budget text input (If they select "Autre") */}
                <AnimatePresence>
                  {formData.budgetRange === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5 pt-2 pb-1 overflow-hidden"
                    >
                      <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                        {language === 'ar' ? 'أدخل ميزانيتك المخصصة (دج / شهرياً) :' : 'Votre budget publicitaire personnalisé (DA / mois) :'}
                      </label>
                      <input
                        id="input-custom-budget"
                        type="text"
                        autoFocus
                        value={formData.customBudget}
                        onChange={e => handleChange('customBudget', e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: 45,000 دج' : 'ex. 45 000 DA'}
                        className="w-full px-4 py-3 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
                      />
                      {errors.customBudget && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {errors.customBudget}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-3 bg-neutral-50/50 border border-neutral-200/50 rounded-lg text-[10px] text-neutral-500 leading-relaxed font-sans">
                  <strong>{t.whyAskLabel}</strong> {t.whyAskText}
                </div>
                {errors.budgetRange && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.budgetRange}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-2">
              <button
                id="btn-step3-prev"
                onClick={handlePrev}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                {t.backBtn}
              </button>
              <motion.button
                id="btn-step3-next"
                onClick={handleNext}
                animate={formData.currentRevenue && formData.budgetRange ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-250 cursor-pointer ${
                  formData.currentRevenue && formData.budgetRange
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md ring-2 ring-emerald-400/25'
                    : 'bg-neutral-950 hover:bg-neutral-800'
                }`}
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: DELAY, CHANNELS AND GENERAL SUBMISSION */}
        {currentStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest block">
                {t.timeframeSubtitle}
              </span>
              <h2 className="font-sans text-2xl font-bold text-neutral-950">
                {t.timeframeTitle}
              </h2>
              <p className="text-sm text-neutral-500">
                {t.timeframeIntro}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Timeline select */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.timelineLabel}
                </label>
                <div className="space-y-2">
                  {Object.entries(labels[language].timeline).map(([key, label]) => {
                    const isSelected = formData.timeline === key;
                    return (
                      <motion.button
                        key={key}
                        id={`timeline-option-${key}`}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleChange('timeline', key)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-950 text-white border-neutral-950 font-semibold shadow-md'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{label}</span>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300'
                        }`}>
                          {isSelected && <Check className="h-2.5 w-2.5" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {errors.timeline && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.timeline}
                  </p>
                )}
              </div>

              {/* Marketing Channels (Multi-select) */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.channelsLabel} <span className="text-neutral-400 lowercase font-normal">({t.channelsOptional})</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {channelOptions.map(channel => {
                    const isChecked = formData.channels.includes(channel);
                    return (
                      <motion.button
                        key={channel}
                        id={`channel-${channel.replace(/\s+/g, '-')}`}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleChannel(channel)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-xs rounded-xl border transition-all cursor-pointer ${
                          isRtl ? 'text-right justify-start' : 'text-left justify-start'
                        } ${
                          isChecked 
                             ? 'bg-neutral-50 border-neutral-900 border-1 font-semibold text-neutral-900 shadow-xs' 
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-neutral-950 border-neutral-950 text-white' : 'border-neutral-300'
                        }`}>
                          {isChecked && <Check className="h-3 w-3" />}
                        </div>
                        <span>{channel}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Context notes (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 block">
                  {t.noteLabel} <span className="text-neutral-400 lowercase font-normal">({t.websiteOptional})</span>
                </label>
                <textarea
                  id="textarea-custom-note"
                  value={formData.customNote}
                  onChange={e => handleChange('customNote', e.target.value)}
                  placeholder={t.notePlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
                />
              </div>

              {/* Dynamic Summary Review Panel (As requested: "regarde ce que il as selectionner comme page puis il valide l envoi") */}
              <div className="mt-6 border border-neutral-200 bg-neutral-50/50 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div className="text-right flex-1" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                    <h4 className="font-sans text-xs sm:text-sm font-semibold text-neutral-900 leading-tight">
                      {isRtl ? 'ملخص مراجعة البيانات قبل الإرسال' : 'Récapitulatif de votre demande'}
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      {isRtl ? 'تأكد من صحة البيانات التي اخترتها في الصفحات السابقة :' : 'Vérifiez vos choix et coordonnées avant de valider l\'envoi :'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-neutral-700" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                  {/* Page 1 Coordonnées */}
                  <div className="space-y-1 bg-white p-2.5 border border-neutral-100 rounded-xl shadow-xs">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 font-bold block">
                      {isRtl ? 'الخطوة 1: هويتك الاتصال' : 'Étape 1 : Coordonnées'}
                    </span>
                    <p className="font-medium text-neutral-900 truncate"><strong>{isRtl ? 'الاسم : ' : 'Nom : '}</strong>{formData.fullName}</p>
                    <p className="font-sans text-neutral-500 truncate"><strong>{isRtl ? 'الهاتف : ' : 'Tél : '}</strong>{formData.phone}</p>
                    {formData.email && (
                      <p className="font-sans text-neutral-500 truncate"><strong>{isRtl ? 'البريد : ' : 'Email : '}</strong>{formData.email}</p>
                    )}
                  </div>

                  {/* Page 2 Entreprise & Objectifs */}
                  <div className="space-y-1 bg-white p-2.5 border border-neutral-100 rounded-xl shadow-xs">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 font-bold block">
                      {isRtl ? 'الخطوة 2: معلومات مشروعك' : 'Étape 2 : Votre Projet'}
                    </span>
                    <p className="font-medium text-neutral-900 truncate"><strong>{isRtl ? 'الشركة : ' : 'Structure : '}</strong>{formData.companyName}</p>
                    {formData.website && (
                      <p className="font-sans text-neutral-500 truncate text-[11px]">
                        <strong>{isRtl ? 'الرابط : ' : 'Lien : '}</strong>{formData.website}
                      </p>
                    )}
                    <p className="text-neutral-500 leading-normal text-[11px]">
                      <strong>{isRtl ? 'التحدي : ' : 'Objectif : '}</strong>
                      {(labels[language].mainGoal as any)[formData.mainGoal] || formData.mainGoal || '-'}
                    </p>
                  </div>

                  {/* Page 3 Profil Financier */}
                  <div className="space-y-1 bg-white p-2.5 border border-neutral-100 rounded-xl shadow-xs">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 font-bold block">
                      {isRtl ? 'الخطوة 3: الملف المالي' : 'Étape 3 : Budget'}
                    </span>
                    <p className="text-neutral-500 leading-normal text-[11px] truncate">
                      <strong>{isRtl ? 'الدخل الحالي : ' : 'Revenus : '}</strong>
                      {(labels[language].currentRevenue as any)[formData.currentRevenue] || formData.currentRevenue || '-'}
                    </p>
                    <p className="text-neutral-900 leading-normal text-[11px] font-medium truncate">
                      <strong>{isRtl ? 'الميزانية : ' : 'Budget : '}</strong>
                      {formData.budgetRange === 'custom' 
                        ? (formData.customBudget ? `Autre (${formData.customBudget} DA)` : (isRtl ? 'ميزانية مخصصة' : 'Budget personnalisé'))
                        : ((labels[language].budgetRange as any)[formData.budgetRange] || formData.budgetRange || '-')}
                    </p>
                  </div>

                  {/* Page 4 Lancement & Canaux (Active choices) */}
                  <div className="space-y-1 bg-white p-2.5 border border-neutral-100 rounded-xl shadow-xs">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 font-bold block">
                      {isRtl ? 'الخطوة 4: خطة الإطلاق' : 'Étape 4 : Lancement'}
                    </span>
                    <p className="text-neutral-900 font-medium text-[11px] truncate">
                      <strong>{isRtl ? 'موعد البدء : ' : 'Délai : '}</strong>
                      {(labels[language].timeline as any)[formData.timeline] || formData.timeline || '-'}
                    </p>
                    {formData.channels.length > 0 && (
                      <div className="text-[11px] text-neutral-500">
                        <strong>{isRtl ? 'القنوات : ' : 'Canaux : '}</strong>
                        <div className="flex flex-wrap gap-1 mt-0.5 max-h-[44px] overflow-y-auto">
                          {formData.channels.map(c => (
                            <span key={c} className="inline-block px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 text-[9px] leading-none">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-2">
                <button
                  id="btn-step4-prev"
                  type="button"
                  onClick={handlePrev}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  {t.backBtn}
                </button>
                <motion.button
                  id="btn-submit-lead"
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={formData.timeline ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all duration-200 cursor-pointer rounded-xl"
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{t.submitBtn}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 5: PERSONALIZED THANK YOU PAGE BASED ON CONVERSION STATUS */}
        {currentStep === 5 && generatedLead && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-8"
          >
            <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-bounce" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-neutral-600 font-semibold uppercase tracking-wider">
                {t.thanksSuccess}
              </span>
              <h1 className="font-sans text-3xl font-extrabold text-neutral-950 tracking-tight leading-none">
                {t.thanksTitle.replace('{name}', generatedLead.fullName.split(' ')[0])}
              </h1>
              <p className="text-sm text-neutral-600 max-w-sm mx-auto">
                {t.thanksIntro}
              </p>
            </div>

            {/* HIGH PRIORITY LEAD PANEL */}
            {generatedLead.priority === 'HIGH' && (
              <div className={`p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500 text-white tracking-wider uppercase font-sans">
                    {t.priorityHighTag}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                    {t.scoreLabel.replace('{score}', String(generatedLead.qualificationScore))}
                  </span>
                </div>
                <h3 className="font-sans text-base font-bold text-neutral-900">
                  {t.priorityHighTitle}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.priorityHighDesc.replace('{budget}', (labels[language].budgetRange as any)[generatedLead.budgetRange])}
                </p>
                <div className="border-t border-emerald-100 pt-3 space-y-2 mt-4">
                  <span className="text-[10px] font-semibold text-neutral-700 uppercase font-mono tracking-wider block">
                    {t.nextStepsLabel}
                  </span>
                  <ul className="text-xs text-neutral-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="h-4 w-4 rounded-full bg-emerald-200 flex items-center justify-center text-[10px] text-emerald-800 font-bold mt-0.5 shrink-0">1</span>
                      <span>{t.priorityHighStep1.replace('{website}', generatedLead.website || (isRtl ? 'غير متوفر' : 'non fourni'))}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-4 w-4 rounded-full bg-emerald-200 flex items-center justify-center text-[10px] text-emerald-800 font-bold mt-0.5 shrink-0">2</span>
                      <span>{t.priorityHighStep2.replace('{phone}', generatedLead.phone)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* MEDIUM PRIORITY LEAD PANEL */}
            {generatedLead.priority === 'MEDIUM' && (
              <div className={`p-6 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-amber-500 text-white tracking-wider uppercase font-sans">
                    {t.priorityMedTag}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-600">
                    {t.scoreLabel.replace('{score}', String(generatedLead.qualificationScore))}
                  </span>
                </div>
                <h3 className="font-sans text-base font-bold text-neutral-900">
                  {t.priorityMedTitle}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.priorityMedDesc.replace('{companyName}', generatedLead.companyName)}
                </p>
                <div className="border-t border-neutral-200 pt-3 space-y-2 mt-4">
                  <span className="text-[10px] font-semibold text-neutral-700 uppercase font-mono tracking-wider block">
                    {t.nextStepsLabel}
                  </span>
                  <ul className="text-xs text-neutral-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="h-4 w-4 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] text-neutral-800 font-bold mt-0.5 shrink-0">1</span>
                      <span>{t.priorityMedStep1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-4 w-4 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] text-emerald-800 font-bold mt-0.5 shrink-0">2</span>
                      <span>{t.priorityMedStep2.replace('{email}', generatedLead.email)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* LOW PRIORITY LEAD PANEL */}
            {generatedLead.priority === 'LOW' && (
              <div className={`p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-400 text-white tracking-wider uppercase font-sans">
                    {t.priorityLowTag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {t.scoreLabel.replace('{score}', String(generatedLead.qualificationScore))}
                  </span>
                </div>
                <h3 className="font-sans text-base font-bold text-neutral-900">
                  {t.priorityLowTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.priorityLowDesc}
                </p>
                <div className="border-t border-slate-200 pt-3 space-y-2 mt-4">
                  <span className="text-[10px] font-semibold text-neutral-700 uppercase font-mono tracking-wider block font-sans">
                    {isRtl ? 'التوجيه والإرشاد الذاتي :' : 'Prestation automatisée de conseils :'}
                  </span>
                  <p className="text-xs text-slate-600 leading-normal">
                    {t.priorityLowStep.replace('{email}', generatedLead.email)}
                  </p>
                </div>
              </div>
            )}

            {/* Premium action links to keep user motivated */}
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              {/* WhatsApp instant chat option - heavily preferred by Algerian leads for quick business trust */}
              <a 
                href={(() => {
                  const whatsappNum = "213550123456"; // Context-rich Algerian country code placement
                  const msg = language === 'ar'
                    ? `السلام عليكم، لقد أكملت للتو استبيان التقييم لمشروعي: *${generatedLead.companyName}*. أرغب في مناقشة تفاصيل انطلاق الحملة الإعلانية معكم.`
                    : `Bonjour, je viens de remplir le formulaire d'audit pour mon projet: *${generatedLead.companyName}*. J'aimerais discuter en direct de notre lancement publicitaire sur WhatsApp.`;
                  return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`;
                })()}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-md shadow-emerald-100 rounded-xl transition-all duration-200 cursor-pointer text-center"
              >
                <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.006c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{isRtl ? 'راسلنا مباشرة على واتساب' : 'Discuter sur WhatsApp'}</span>
              </a>

              <button 
                type="button"
                onClick={() => setCalendlyStepFeedback(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer"
              >
                <span>{t.calendlyBtn}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </button>

              <AnimatePresence>
                {calendlyStepFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] text-neutral-600 leading-relaxed font-sans ${isRtl ? 'text-right' : 'text-left'}`}
                  >
                    <span className="font-bold text-neutral-900 block mb-0.5">🗓️ {isRtl ? 'أتمتة ذكية متكاملة' : 'Intégration Interactive'}</span>
                    {isRtl 
                      ? `في بيئة الإنتاج الحقيقية، هذا الإجراء يفتح تقويم الحجوزات (مثل Calendly / Cal.com) مدمجاً ومملوءاً تلقائياً ببيانات العميل ${generatedLead.fullName}.`
                      : t.oneDayLabel}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                id="btn-re-submit"
                onClick={handleReset}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <span>{t.restartBtn}</span>
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

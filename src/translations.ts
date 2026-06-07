export type Language = 'fr' | 'ar';

export const translations = {
  fr: {
    // Welcome splash / greeting
    welcomeTitle: "Bonjour & Bienvenue",
    welcomeSubtitle: "Découvrons ensemble quel canal marketing propulsera votre acquisition client.",
    skipIntro: "Passer l'introduction",
    genQuestionnaire: "Génération du Questionnaire Intelligent...",
    logoText: "Λ",
    brandTag: "Apex Digital Growth",
    
    // Header/Navbar
    headerSubtitle: "Agence de Croissance Digitale (Alger & International)",
    viewDashboard: "Tableau de Bord",
    viewForm: "Formulaire",
    backstage: "Backstage",
    clientForm: "Formulaire Client",
    
    // Steps Indicator
    stepIndicator: "Étape {step} de 4 :",
    step1Title: "Vos coordonnées",
    step2Title: "Votre entreprise",
    step3Title: "Profil financier",
    step4Title: "Objectifs digitaux",

    // Step 0: Hook
    hookTitle: "Propulsez votre entreprise vers de nouveaux sommets en Algérie",
    hookPromo: "Nous analysons et optimisons chaque canal marketing selon les réalités de votre marché.",
    hookIntro: "Répondez à ce questionnaire rapide de 2 minutes pour recevoir directement notre diagnostic stratégique gratuit et entrer en contact avec un de nos experts.",
    startBtn: "Démarrer ma qualification",
    noCommitment: "100% Confidentiel — Analyse sous 4h",

    // Step 1: Contact Detail
    contactTitle: "Faisons connaissance 👋",
    contactIntro: "Entrez vos coordonnées. Nous vous recontacterons directement par appel ou WhatsApp.",
    fullNameLabel: "Nom Complet",
    fullNamePlaceholder: "ex. Amine Benmamar",
    fullNameRequired: "Le nom complet est obligatoire",
    emailLabel: "E-mail professionnel (si vous l'utilisez / optionnel)",
    emailPlaceholder: "ex. contact@monentreprise.com (ou laissez vide)",
    emailRequired: "L'adresse e-mail est facultative",
    emailInvalid: "Format d'adresse e-mail invalide",
    phoneLabel: "Numéro de Téléphone (Algérie)",
    phonePlaceholder: "ex. 05 50 12 34 56",
    phoneRequired: "Le numéro de téléphone est requis",
    phoneOnlyNumbers: "Le numéro de téléphone doit contenir uniquement des chiffres",
    phoneHelp: "Sert à vous recontacter instantanément par appel direct ou via WhatsApp",
    continueBtn: "Continuer",
    backBtn: "Retour",

    // Step 2: Company Info
    companyTitle: "Votre structure 📈",
    companySubtitle: "Ravi de vous rencontrer",
    companyNameLabel: "Nom de votre entreprise / projet",
    companyNameRequired: "Le nom de l'entreprise est obligatoire",
    companyNamePlaceholder: "ex. Apex Commerce",
    websiteLabel: "Adresse de votre site internet / page Facebook ou Instagram",
    websiteOptional: "optionnel",
    websitePlaceholder: "ex. instagram.com/mapage ou www.site.dz",
    goalLabel: "Quel est votre défi prioritaire aujourd'hui ?",
    goalRequired: "Veuillez sélectionner votre objectif principal",
    
    // Goals Options
    goalLeads: "Trouver plus de clients qualifiés (B2B / Services)",
    goalSales: "Multiplier les ventes en ligne (E-commerce / Livraison 58 Wilayas)",
    goalBrand: "Augmenter l'image de marque, notoriété & abonnés TikTok / Insta",
    goalWebsite: "Concevoir un site web professionnel et ultra-rapide",
    goalOther: "Autre défi de croissance",

    // Step 3: Financial Qualification
    financialTitle: "Profil & Qualification 📊",
    financialSubtitle: "Étude de votre budget de campagne",
    financialIntro: "Pour vous proposer un plan d'action réaliste et rentable, aidez-nous à situer votre budget.",
    revenueLabel: "Volume des Ventes / Chiffre d'Affaires Mensuel Actuel",
    revenueRequired: "Votre chiffre d'affaires actuel est nécessaire",
    budgetLabel: "Enveloppe Budget Publicitaire / Marketing Mensuelle Envisagée",
    budgetRequired: "Votre budget est requis",
    whyAskLabel: "Pourquoi demandons-nous cela ?",
    whyAskText: "La spécification d'un budget en Dinars (DA) ou en Euros nous permet de designer des campagnes publicitaires (Meta, TikTok ou Google) immédiatement profitables pour votre entreprise.",

    // Step 4: Timeframe & Channels
    timeframeTitle: "Lancement & Canaux🚀",
    timeframeSubtitle: "Dernière étape de qualification",
    timeframeIntro: "Quand souhaitez-vous démarrer et quels leviers vous intéressent ?",
    timelineLabel: "Délai de démarrage envisagé",
    timelineRequired: "Veuillez indiquer un délai de lancement",
    channelsLabel: "Sélectionnez les leviers d'intérêt",
    channelsOptional: "plusieurs choix possibles",
    noteLabel: "Autres informations importantes",
    notePlaceholder: "ex. J'ai déjà une page active, mais je manque de ventes ou de contenu créatif...",
    submitBtn: "Soumettre mon projet",

    // Step 5: Result / Thank You
    thanksSuccess: "Diagnostic stratégique transmis avec succès",
    thanksTitle: "Merci {name} !",
    thanksIntro: "Notre équipe analyse vos réponses. Voici l'évaluation en temps réel de votre projet :",
    scoreLabel: "Score d'adéquation : {score}/14",
    nextStepsLabel: "Étapes suivantes indispensables :",
    oneDayLabel: "Lien de redirection interactif WhatsApp ou Calendly.",

    // Priority Cards
    priorityHighTag: "🚀 Dossier Prioritaire : Fort Potentiel de Croissance",
    priorityHighTitle: "Prise en charge immédiate & Atelier Stratégique Offert",
    priorityHighDesc: "Votre budget publicitaire ({budget}) et votre plan d'action immédiat indiquent une excellente adéquation avec nos équipes.",
    priorityHighStep1: "Un de nos lead strategists basé à Alger étudie votre présence actuelle ({website}) sous 4 heures.",
    priorityHighStep2: "Nous allons vous appeler directement ou vous envoyer un message WhatsApp personnalisé sur le {phone} pour fixer notre atelier de stratégie.",

    priorityMedTag: "📈 Dossier Stratégique de Croissance",
    priorityMedTitle: "Étude d'opportunités publicitaires",
    priorityMedDesc: "Votre projet {companyName} présente un fort potentiel sur le marché algérien.",
    priorityMedStep1: "Analyse approfondie de votre projet sous 24h par notre équipe commerciale.",
    priorityMedStep2: "Envoi d'une pré-proposition claire avec plan d'action sur {email} ou par WhatsApp.",

    priorityLowTag: "💡 Recommandations & Kit de Démarrage",
    priorityLowTitle: "Optimisez d'abord vos fondamentaux",
    priorityLowDesc: "Au vu du budget publicitaire ou de l'état actuel des ventes, nous vous conseillons de consolider vos processus de vente ou de livraison d'abord.",
    priorityLowStep: "Nous vous envoyons immédiatement par e-mail à {email} un guide complet pour booster vos ventes e-commerce de manière organique.",

    // Interaction Buttons
    calendlyBtn: "Planifier un RDV direct Calendly",
    calendlyFeedback: "🗓️ Dans un scénario réel de production, ce bouton ouvre instantanément le calendrier de l'agence pré-rempli avec les coordonnées de la demande.",
    restartBtn: "Faire une autre simulation",

    // Trust elements down page
    trustTitle1: "Soutien Global",
    trustDesc1: "Multi-canaux : SEO, Google, Meta, TikTok",
    trustTitle2: "Haute Performance",
    trustDesc2: "Aucune niche restrictive imposée",
    trustTitle3: "Tri Instantané",
    trustDesc3: "Mise en relation sous 4 heures",
  },
  ar: {
    // Welcome splash / greeting
    welcomeTitle: "أهلاً وسهلاً بك 👋",
    welcomeSubtitle: "معاً، سنكتشف القناة التسويقية التي ستضاعف مبيعاتك وأرباحك في الجزائر.",
    skipIntro: "تخطي المقدمة",
    genQuestionnaire: "جاري إنشاء الاستبيان الذكي والمخصص لمشروعك...",
    logoText: "Λ",
    brandTag: "أبيكس لتسويق ونمو المشاريع",
    
    // Header/Navbar
    headerSubtitle: "وكالة النمو والتسويق الرقمي (الجزائر ودولياً)",
    viewDashboard: "لوحة التحكم",
    viewForm: "الاستبيان",
    backstage: "لوحة الإدارة",
    clientForm: "الاستمارة",

    // Steps Indicator
    stepIndicator: "الخطوة {step} من 4 :",
    step1Title: "بيانات الاتصال",
    step2Title: "تفاصيل مشروعك",
    step3Title: "الملف المالي والميزانية",
    step4Title: "أهدافك التسويقية",

    // Step 0: Hook
    hookTitle: "ضاعف مبيعات مشروعك في السوق الجزائري",
    hookPromo: "نحلل ونبني حملات إعلانية مربحة تناسب واقع ومجال عملك مئة بالمئة.",
    hookIntro: "أجب عن هذا الاستبيان البسيط في دقيقتين للحصول على دراسة مبدئية مجانية لمشروعك والتواصل المباشر مع خبراء فريقنا.",
    startBtn: "ابدأ التقييم والاستشارة مجاناً",
    noCommitment: "سرية تامة 100% — دراسة وتواصل في أقل من 4 ساعات",

    // Step 1: Contact Detail
    contactTitle: "يسعدنا التعرف عليك 👋",
    contactIntro: "أدخل معلومات الاتصال بك ليتواصل معك خبراؤنا مباشرة عبر الهاتف أو الواتساب.",
    fullNameLabel: "الاسم الكامل",
    fullNamePlaceholder: "مثال: أمين بن معمر",
    fullNameRequired: "الاسم الكامل مطلوب للتواصل",
    emailLabel: "البريد الإلكتروني (اختياري - إذا كنت تعمل به)",
    emailPlaceholder: "مثال: contact@mycompany.com (أو اتركه فارغاً)",
    emailRequired: "البريد الإلكتروني اختياري",
    emailInvalid: "صيغة البريد الإلكتروني غير صحيحة",
    phoneLabel: "رقم الهاتف (الجزائر)",
    phonePlaceholder: "مثال: 0550123456",
    phoneRequired: "رقم الهاتف ضروري لنتواصل معك فوراً",
    phoneOnlyNumbers: "يجب أن يحتوي رقم الهاتف على أرقام فقط",
    phoneHelp: "نستخدم هذا الرقم للاتصال بك هاتفياً أو لمراسلتك مباشرة عبر الواتساب لتوفير الوقت",
    continueBtn: "متابعة",
    backBtn: "رجوع",

    // Step 2: Company Info
    companyTitle: "تفاصيل مشروعك 📈",
    companySubtitle: "تشرفنا بك",
    companyNameLabel: "اسم مشروعك أو شركتك",
    companyNameRequired: "اسم المشروع أو الشركة مطلوب مئة بالمئة",
    companyNamePlaceholder: "مثال: أبيكس للتجارة",
    websiteLabel: "رابط موقعك، صفحة الفيسبوك أو الإنستغرام",
    websiteOptional: "اختياري",
    websitePlaceholder: "مثال: instagram.com/page أو صفحة فيسبوك",
    goalLabel: "ما هو التحدي الأهم لمشروعك حالياً ؟",
    goalRequired: "يرجى اختيار هدفك الرئيسي",

    // Goals Options
    goalLeads: "جلب المزيد من الزبائن والاتصالات المؤهلة (خدمات / B2B)",
    goalSales: "مضاعفة المبيعات والطلبات عبر الإنترنت (تجارة إلكترونية / توصيل 58 ولاية)",
    goalBrand: "تحسين صورة علامتك التجارية واكتساب آلاف المتابعين على تيك توك وإنستغرام",
    goalWebsite: "تصميم موقع إلكتروني احترافي قوي وسريع جداً لجلب الزبائن",
    goalOther: "هدف نمو وتوسع آخر لم يذكر",

    // Step 3: Financial Qualification
    financialTitle: "الملف المالي والتقييم 📊",
    financialSubtitle: "دراسة الميزانية الإعلانية المناسبة",
    financialIntro: "لتقديم خطة عمل ناجحة ومربحة لك، يرجى تزويدنا بالميزانية المرصودة.",
    revenueLabel: "حجم المبيعات الحالي أو الدخل الشهري التقريبي للمشروع",
    revenueRequired: "يرجى تحديد حجم الدخل الحالي للمشروع",
    budgetLabel: "الميزانية الإعلانية الشهرية المقترحة لحملاتك (ميتا، تيك توك أو جوجل)",
    budgetRequired: "يرجى اختيار ميزانيتك المرصودة",
    whyAskLabel: "لماذا نسألك عن هذا الميزانية ؟",
    whyAskText: "تحديد ميزانية تسويقية تقريبية بالدينار أو يورو يسمح لنا برسم وتصميم حملات إعلانية واقعية تضمن لك عائداً ممتازاً على استثمارك في السوق الجزائري.",

    // Step 4: Timeframe & Channels
    timeframeTitle: "موعد البدء والقنوات الإعلانية 🚀",
    timeframeSubtitle: "الخطوة الأخيرة من التقييم",
    timeframeIntro: "متى تريد البدء وما هي القنوات التي تثير اهتمامك ؟",
    timelineLabel: "موعد البدء المتوقع لإطلاق العمل",
    timelineRequired: "يرجى تحديد تاريخ البدء المتوقع لبدء العمل",
    channelsLabel: "اختر القنوات الإعلانية التي ترغب في تفعيلها",
    channelsOptional: "يمكنك اختيار خيارات متعددة",
    noteLabel: "تفاصيل أو ملاحظات إضافية تود إخبارنا بها",
    notePlaceholder: "مثال: لدينا صفحة إعلانية نشطة حالياً ولكن نعاني من نقص المبيعات أو المحتوى الإبداعي...",
    submitBtn: "إرسال طلبي ودراسته فوراً من طرف خبير",

    // Step 5: Result / Thank You
    thanksSuccess: "تم استلام معلومات مشروعك بنجاح تام",
    thanksTitle: "شكراً لك يا {name} !",
    thanksIntro: "يقوم فريقنا حالياً بدراسة مشروعك. إليك التقييم الأولي التفاعلي لطلبك :",
    scoreLabel: "درجة التوافق والملاءمة : {score}/14",
    nextStepsLabel: "الخطوات القادمة الضرورية لبدء العمل :",
    oneDayLabel: "رابط الحجز أو التواصل المباشر عبر الواتساب.",

    // Priority Cards
    priorityHighTag: "🚀 طلب عالي الأولوية: فرصة نمو ومبيعات ممتازة",
    priorityHighTitle: "تمت الموافقة على دراسة مجانية مخصصة لمشروعك",
    priorityHighDesc: "جاهزيتك للبدء الفوري والميزانية الإعلانية المرصودة البالغة {budget} تتميز بتوافق رائع مع خدماتنا.",
    priorityHighStep1: "سيقوم أحد كبار الخبراء لدينا في الجزائر بدراسة حضوركم الرقمي الحالي ({website}) وتقديم تقييم مجاني خلال 4 ساعات القادمة.",
    priorityHighStep2: "سنتصل بك هاتفياً بشكل مباشر أو نرسل لك رسالة خاصة عبر الواتساب على الرقم {phone} للاتفاق على الاستراتيجية الإعلانية المناسبة.",

    priorityMedTag: "📈 طلب ذو أهمية استراتيجية واعدة",
    priorityMedTitle: "مراجعة فرص الإعلانات والاستهداف الدقيق في السوق",
    priorityMedDesc: "يتمتع مشروعك {companyName} بفرص حقيقية ومذهلة للتوسع ومضاعفة حجم مبيعاته.",
    priorityMedStep1: "يقوم فريقنا بدراسة مشروعك بدقة وإعداد دراسة أولية خلال 24 ساعة كحد أقصى.",
    priorityMedStep2: "نقوم بإرسال مقترح العمل الأولي والمبسط لبريدك {email} أو مباشرة عبر الواتساب.",

    priorityLowTag: "💡 نصائح وأدوات تمكين في التجارة والتسويق",
    priorityLowTitle: "عزز أسس مشروعك وعملية البيع وتأكيد الطلبات أولاً",
    priorityLowDesc: "بناءً على ميزانيتك الحالية، ننصحك بالتركيز أولاً على تحسين صور المنتجات، سرعة الرد على الرسائل، وضمان خدمة توصيل موثوقة قبل تخصيص نفقات إعلانية كبيرة.",
    priorityLowStep: "لقد أرسلنا لك دليلاً شاملاً وحصرياً ومجاناً عبر بريدك {email} يوضح لك أفضل الطرق المجانية لزيادة مبيعاتك في الجزائر دون إعلانات مدفوعة.",

    // Interaction Buttons
    calendlyBtn: "جدولة تفاعلية على كاليدني Calendly",
    calendlyFeedback: "🗓️ في بيئة العمل الواقعية، يتيح لك هذا الزر فتح جدول مواعيد الوكالة فورياً مع ملء بياناتك تلقائياً لتبسيط التجربة.",
    restartBtn: "إجراء تقييم جديد لمبادرة أخرى",

    // Trust elements down page
    trustTitle1: "دعم دولي شامل",
    trustDesc1: "متعدد القنوات: SEO، حملات جوجل، ميتا وتيك توك",
    trustTitle2: "أداء فائق للجميع",
    trustDesc2: "لا نفرض مجالات عمل محددة أو قيوداً ضيقة",
    trustTitle3: "تصنيف وفرز فوري",
    trustDesc3: "رد وتواصل تفاعلي سريع خلال 4 ساعات فقط",
  }
};

import { LanguageCode } from '../types';

export interface ExtraCopy {
  publicNav: {
    login: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    risk: string;
    poweredBy: string;
    copyright: string;
  };
  loginExtra: {
    usernameOrEmail: string;
    forgotPassword: string;
    forgotTitle: string;
    forgotBody: string;
    noAccountPrompt: string;
    whatsappLabel: string;
    telegramLabel: string;
    contactNotConfigured: string;
    contactConfigureHint: string;
    openContactPage: string;
    setupBannerTitle: string;
    setupBannerBody: string;
    setupUsernameLabel: string;
    setupPasswordLabel: string;
    setupConfirmLabel: string;
    setupSubmit: string;
    setupMismatch: string;
    showcase: {
      badge: string;
      card1Title: string;
      card1Meta: string;
      card2Title: string;
      card2Meta: string;
      card3Title: string;
      card3Meta: string;
      statusLabel: string;
      statusValue: string;
    };
  };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLogin: string;
    ctaContact: string;
    pillarsTitle: string;
    pillars: { title: string; body: string }[];
    honestTitle: string;
    honestBody: string;
    honestItems: string[];
    faqTitle: string;
    faqs: { q: string; a: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    whatsappTitle: string;
    telegramTitle: string;
    emailTitle: string;
    supportTitle: string;
    supportBody: string;
    notConfiguredBadge: string;
    notConfiguredText: string;
    openChannel: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    sendButton: string;
    backendUnavailableNotice: string;
    faqTitle: string;
    faqs: { q: string; a: string }[];
  };
  legal: {
    updatedLabel: string;
    backToLogin: string;
    privacy: { title: string; intro: string; sections: { heading: string; body: string }[] };
    terms: { title: string; intro: string; sections: { heading: string; body: string }[] };
    risk: { title: string; intro: string; sections: { heading: string; body: string }[] };
  };
  dashboardNav: {
    aiAnalysis: string;
    openTrades: string;
    tradeHistory: string;
    riskManagement: string;
    binanceConnection: string;
    affiliate: string;
    support: string;
  };
  adminExtraNav: {
    riskMonitoring: string;
    binanceStatuses: string;
    affiliate: string;
    supportRequests: string;
    security: string;
  };
  overviewExtra: {
    activeBots: string;
    botStatus: string;
    riskLevel: string;
    marketIndicators: string;
    integrationUnavailable: string;
    connectExchangeHint: string;
  };
  botExtra: {
    paperTrading: string;
    realTrading: string;
    realTradingDisabledNote: string;
    pairLabel: string;
    riskLevelLabel: string;
    riskLevels: { CONSERVATIVE: string; BALANCED: string; AGGRESSIVE: string };
    stopLossPct: string;
    takeProfitPct: string;
    maxDailyLossPct: string;
    tradeAmountUsd: string;
    saveConfig: string;
    engineUnavailable: string;
  };
  aiAnalysis: {
    title: string;
    subtitle: string;
    pairLabel: string;
    timeframeLabel: string;
    analyzeBtn: string;
    analyzingTitle: string;
    analyzingSub: string;
    marketAnalysis: string;
    trendDirection: string;
    riskAnalysis: string;
    technicalIndicators: string;
    signalInterface: string;
    historyTitle: string;
    providerUnavailableTitle: string;
    providerUnavailableBody: string;
    emptyHistory: string;
  };
  riskPage: {
    title: string;
    subtitle: string;
    profileLabel: string;
    stopLossLabel: string;
    takeProfitLabel: string;
    maxDailyLossLabel: string;
    tradeSizeLabel: string;
    guardrailsTitle: string;
    guardrails: string[];
    saveRisk: string;
  };
  affiliatePage: {
    title: string;
    subtitle: string;
    referralCode: string;
    totalReferrals: string;
    activeReferrals: string;
    totalCommission: string;
    statusLabel: string;
    pendingTitle: string;
    pendingBody: string;
  };
  supportPage: {
    title: string;
    subtitle: string;
    newTicketTitle: string;
    subjectLabel: string;
    categoryLabel: string;
    categories: { general: string; technical: string; security: string; account: string };
    messageLabel: string;
    submitTicket: string;
    ticketSubmitted: string;
    ticketsListTitle: string;
    noTickets: string;
    statuses: { OPEN: string; IN_REVIEW: string; RESOLVED: string };
  };
  adminExtra: {
    riskTitle: string;
    binanceTitle: string;
    affiliateTitle: string;
    supportTitle: string;
    securityTitle: string;
    updateStatus: string;
    paperLocked: string;
    noTickets: string;
    contactSettingsTitle: string;
    whatsappUrlLabel: string;
    telegramUrlLabel: string;
    supportEmailLabel: string;
  };
  theme: {
    lightLabel: string;
    darkLabel: string;
    toggleLabel: string;
  };
  engineVisual: {
    title: string;
    demoBadge: string;
    scannerLabel: string;
    scannerMeta: string;
    riskLabel: string;
    riskMeta: string;
    aiFlowLabel: string;
    decisionLabel: string;
    subline: string;
    decisions: { long: string; short: string; hold: string };
  };
  pipeline: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { title: string; detail: string }[];
  };
  chart: {
    candlestickTitle: string;
    awaitingTitle: string;
    awaitingBody: string;
    openLabel: string;
    highLabel: string;
    lowLabel: string;
    closeLabel: string;
    volumeLabel: string;
    previewToggle: string;
    connectCta: string;
  };
}

export const EXTRA_COPY: Record<LanguageCode, ExtraCopy> = {
  az: {
    publicNav: {
      login: 'Daxil ol',
      about: 'Haqqımızda',
      contact: 'Əlaqə',
      privacy: 'Məxfilik Siyasəti',
      terms: 'İstifadə Şərtləri',
      risk: 'Risk Xəbərdarlığı',
      poweredBy: 'Powered by OXINVO',
      copyright: '© 2026 OXINVO. Bütün hüquqlar qorunur.',
    },
    loginExtra: {
      usernameOrEmail: 'İstifadəçi adı və ya e-poçt',
      forgotPassword: 'Şifrəni unutmusunuz?',
      forgotTitle: 'Şifrənin bərpası',
      forgotBody:
        'Təhlükəsizlik siyasətinə əsasən parol sıfırlanması yalnız səlahiyyətli platforma administratoru tərəfindən birdəfəlik təhlükəsiz şifrə ilə icra olunur.',
      noAccountPrompt: 'Hesabınız yoxdur? Bizimlə əlaqə saxlayın.',
      whatsappLabel: 'WhatsApp Dəstək',
      telegramLabel: 'Telegram Dəstək',
      contactNotConfigured: 'Rəsmi əlaqə kanalı hələ konfiqurasiya edilməyib.',
      contactConfigureHint:
        'Administrator təhlükəsizlik ayarlarından rəsmi WhatsApp və ya Telegram ünvanını əlavə etdikdən sonra bu düymə birbaşa keçid açacaq.',
      openContactPage: 'Əlaqə səhifəsinə keç',
      setupBannerTitle: 'İlk Administrator Quraşdırılması',
      setupBannerBody:
        'Bu mühitdə ilkin administrator şifrəsi təyin edilməyib. Giriş üçün güclü şifrə (min. 12 simvol, böyük/kiçik hərf, rəqəm, simvol) yaradın.',
      setupUsernameLabel: 'Administrator istifadəçi adı',
      setupPasswordLabel: 'Yeni administrator şifrəsi',
      setupConfirmLabel: 'Şifrəni təsdiqləyin',
      setupSubmit: 'Administratoru aktivləşdir',
      setupMismatch: 'Şifrələr uyğun gəlmir və ya təhlükəsizlik tələbinə cavab vermir.',
      showcase: {
        badge: 'OXINVO QUANT ENGINE',
        card1Title: 'Spot Bazar Kəşfiyyatı',
        card1Meta: 'Çoxcütlü likvidlik və struktur nəzarəti',
        card2Title: 'Risk Qoruyucu',
        card2Meta: 'Stop-Loss və günlük limit qaydaları',
        card3Title: 'Təhlükəsiz Arxitektura',
        card3Meta: 'Paper rejim aktiv · Real icra qorunur',
        statusLabel: 'Sistem Rejimi',
        statusValue: 'PAPER · Məlumat yoxlanılır',
      },
    },
    about: {
      eyebrow: 'OXINVO PLATFORMASI HAQQINDA',
      title: 'Sakit, intizamlı və təhlükəsiz kripto ticarət infrastrukturu.',
      subtitle:
        'OXINVO spot bazar monitorinqi, risk nəzarəti və süni intellekt yönümlü qərar dəstəyini vahid minimalist iş mühitində birləşdirir.',
      ctaLogin: 'Platformaya daxil ol',
      ctaContact: 'Bizimlə əlaqə',
      pillarsTitle: 'Əsas Arxitektura Prinsipləri',
      pillars: [
        {
          title: 'Təhlükəsizlik Birincidir',
          body: 'HttpOnly sessiyalar, CSRF qorunması, rol əsaslı giriş nəzarəti (RBAC) və çıxarış icazəsi olmayan API standartları.',
        },
        {
          title: 'İntizamlı Risk İdarəetməsi',
          body: 'Hər əməliyyat profili üçün Stop-Loss, Take-Profit və maksimum günlük zərər limitləri əvvəlcədən müəyyən edilir.',
        },
        {
          title: 'Şəffaf Rejim Ayrımı',
          body: 'Paper Trading sınaq mühiti ilə Real Trading icrası sərt şəkildə ayrılır; tam doğrulama olmadan real əməliyyat göndərilmir.',
        },
        {
          title: 'Modulyar Çoxdilli İnterfeys',
          body: 'Azərbaycan, İngilis, Türk və Rus dillərində tam sinxronlaşdırılmış sürətli veb interfeys.',
        },
      ],
      honestTitle: 'Cari Mərhələ və Şəffaflıq',
      honestBody:
        'OXINVO heç vaxt zəmanətli gəlir vəd etmir və qoşulmamış xidmətlər üzrə saxta nəticə göstərmir.',
      honestItems: [
        'İstifadəçi hesabları, rollar, sessiyalar və audit jurnalları server nəzarətindədir.',
        'Real birja icrası və canlı Telegram/AI açarları istehsal mühiti təsdiqlənənədək deaktiv saxlanılır.',
        'Bütün bazar göstəriciləri və analiz panelləri real provayder qoşulduqda aktivləşir.',
      ],
      faqTitle: 'Tez-tez Verilən Suallar',
      faqs: [
        {
          q: 'OXINVO gəlirə zəmanət verirmi?',
          a: 'Xeyr. Kriptovalyuta bazarları yüksək volatilliyə malikdir. Platforma yalnız analiz, monitorinq və risk qaydalarının tətbiqi üçün vasitədir.',
        },
        {
          q: 'Binance hesabımdan vəsait çıxarma icazəsi tələb olunurmu?',
          a: 'Xeyr. Yalnız oxuma və spot əməliyyat icazələri nəzərdə tutulur; vəsait çıxarışı (Withdrawal) həmişə qapalı qalmalıdır.',
        },
        {
          q: 'Real Trading niyə hazırda deaktivdir?',
          a: 'Canlı birja açarları, şifrələnmiş mühit yoxlamaları və icra modulları tam təsdiqlənənədək təhlükəsizlik məqsədilə real əməliyyatlar bloklanır.',
        },
        {
          q: 'Platformaya necə hesab əldə edə bilərəm?',
          a: 'Hesablar platforma administratoru tərəfindən fərdi abunəlik planı və birdəfəlik təhlükəsiz parol ilə yaradılır.',
        },
      ],
    },
    contact: {
      eyebrow: 'ƏLAQƏ VƏ DƏSTƏK',
      title: 'OXINVO komandası ilə əlaqə',
      subtitle:
        'Hesab açılışı, texniki dəstək və korporativ əməkdaşlıq üçün rəsmi kanallardan istifadə edin.',
      whatsappTitle: 'WhatsApp',
      telegramTitle: 'Telegram',
      emailTitle: 'E-poçt',
      supportTitle: 'Texniki Dəstək Masası',
      supportBody: 'Daxil olmuş istifadəçilər panel daxilindəki Dəstək bölməsindən birbaşa müraciət yarada bilərlər.',
      notConfiguredBadge: 'Konfiqurasiya gözlənilir',
      notConfiguredText: 'Bu kanal üçün rəsmi ünvan hələ sistem ayarlarında təyin edilməyib.',
      openChannel: 'Kanalı aç',
      formTitle: 'Mesaj göndərin',
      formSubtitle: 'Müraciətiniz müvafiq şöbəyə yönləndiriləcək.',
      nameLabel: 'Adınız',
      emailLabel: 'E-poçt ünvanınız',
      subjectLabel: 'Mövzu',
      messageLabel: 'Mesajınız',
      sendButton: 'Mesajı göndər',
      backendUnavailableNotice:
        'İctimai əlaqə poçt xidməti hələ serverə qoşulmayıb. Zəhmət olmasa sistemə daxil olaraq Dəstək bölməsindən müraciət edin və ya administrator ayarlarını tamamlayın.',
      faqTitle: 'Əlaqə Sualları',
      faqs: [
        {
          q: 'Hesab tələblərinə nə qədər müddətdə baxılır?',
          a: 'Administrator müraciətləri növbə qaydası ilə nəzərdən keçirir və aktivləşdirmə məlumatlarını təqdim edir.',
        },
        {
          q: 'Şifrəmi itirdikdə nə etməliyəm?',
          a: 'Platforma administratoruna müraciət edərək təhlükəsiz birdəfəlik şifrə sıfırlanması tələb edin.',
        },
      ],
    },
    legal: {
      updatedLabel: 'Son yenilənmə: 2026',
      backToLogin: 'Giriş ekranına qayıt',
      privacy: {
        title: 'Məxfilik Siyasəti',
        intro: 'OXINVO istifadəçi məlumatlarının məxfiliyinə və sessiya təhlükəsizliyinə ciddi əməl edir.',
        sections: [
          {
            heading: '1. Toplanan Məlumatlar',
            body: 'Yalnız hesab identifikatoru, rol, dil seçimi, sessiya metadata məlumatları və təhlükəsizlik audit qeydləri saxlanılır.',
          },
          {
            heading: '2. API Açarları və Çərəzlər',
            body: 'Sessiya tokenləri HttpOnly çərəzlərdə qorunur; API məxfi açarları heç vaxt brauzer yaddaşında saxlanılmır.',
          },
        ],
      },
      terms: {
        title: 'İstifadə Şərtləri',
        intro: 'OXINVO platformasına daxil olmaqla aşağıdakı istifadə qaydalarını qəbul etmiş olursunuz.',
        sections: [
          {
            heading: '1. Giriş və Hesab Məsuliyyəti',
            body: 'Hesab məlumatlarının məxfiliyinə görə istifadəçi məsuliyyət daşıyır. İlk girişdən sonra müvəqqəti şifrə dəyişdirilməlidir.',
          },
          {
            heading: '2. Zəmanətin Olmaması',
            body: 'OXINVO analitik və avtomatlaşdırma vasitəsidir; maliyyə məsləhəti və ya gəlir zəmanəti vermir.',
          },
        ],
      },
      risk: {
        title: 'Risk Xəbərdarlığı',
        intro: 'Kriptovalyuta bazarlarında ticarət yüksək maliyyə riski daşıyır.',
        sections: [
          {
            heading: '1. Bazar Volatilliyi',
            body: 'Qiymətlər qısa müddətdə kəskin dəyişə bilər. İtirməyi gözə ala bilməyəcəyiniz vəsaitlə əməliyyat etməyin.',
          },
          {
            heading: '2. Texniki Məhdudiyyətlər',
            body: 'Real Trading icrası tam server və birja təhlükəsizlik yoxlamaları bitmədən aktiv edilmir.',
          },
        ],
      },
    },
    dashboardNav: {
      aiAnalysis: 'AI Analiz',
      openTrades: 'Açıq əməliyyatlar',
      tradeHistory: 'Əməliyyat tarixçəsi',
      riskManagement: 'Risk idarəetməsi',
      binanceConnection: 'Binance bağlantısı',
      affiliate: 'Affiliate sistemi',
      support: 'Dəstək',
    },
    adminExtraNav: {
      riskMonitoring: 'Risk monitorinqi',
      binanceStatuses: 'Binance statusları',
      affiliate: 'Affiliate idarəetməsi',
      supportRequests: 'Dəstək müraciətləri',
      security: 'Təhlükəsizlik',
    },
    overviewExtra: {
      activeBots: 'Aktiv botlar',
      botStatus: 'Bot statusu',
      riskLevel: 'Risk səviyyəsi',
      marketIndicators: 'Bazar göstəriciləri',
      integrationUnavailable: 'Canlı birja bağlantısı hələ qurulmayıb.',
      connectExchangeHint: 'Real balans və canlı bazar göstəriciləri üçün Binance bağlantısı tələb olunur.',
    },
    botExtra: {
      paperTrading: 'Paper Trading',
      realTrading: 'Real Trading',
      realTradingDisabledNote:
        'Real Trading hazırda deaktivdir. Backend icra modulu və təhlükəsizlik yoxlamaları tamamlanmadan real əməliyyat göndərilmir.',
      pairLabel: 'Ticarət cütlüyü',
      riskLevelLabel: 'Risk səviyyəsi',
      riskLevels: { CONSERVATIVE: 'Mühafizəkar', BALANCED: 'Balanslı', AGGRESSIVE: 'Aqressiv' },
      stopLossPct: 'Stop Loss (%)',
      takeProfitPct: 'Take Profit (%)',
      maxDailyLossPct: 'Maksimum günlük zərər (%)',
      tradeAmountUsd: 'Əməliyyat məbləği (USDT)',
      saveConfig: 'Bot parametrlərini yadda saxla',
      engineUnavailable: 'Canlı bot mühərriki qoşulmayıb; parametrlər Paper profilində saxlanılır.',
    },
    aiAnalysis: {
      title: 'Oxinvo AI Analiz',
      subtitle: 'Kriptovalyuta cütlükləri üzrə strukturlaşdırılmış bazar, trend və risk qiymətləndirməsi.',
      pairLabel: 'Kriptovalyuta cütlüyü',
      timeframeLabel: 'Analiz müddəti',
      analyzeBtn: 'Analiz et',
      analyzingTitle: 'OXINVO AI mühərriki yoxlanılır...',
      analyzingSub: 'Bazar strukturu, likvidlik və provayder bağlantısı sorğulanır',
      marketAnalysis: 'Bazar analizi',
      trendDirection: 'Trend istiqaməti',
      riskAnalysis: 'Risk analizi',
      technicalIndicators: 'Texniki göstəricilər',
      signalInterface: 'Alış / Satış siqnalı',
      historyTitle: 'AI Analiz Tarixçəsi',
      providerUnavailableTitle: 'AI Analiz Provayderi Qoşulmayıb',
      providerUnavailableBody:
        'Saxta siqnallar və ya uydurma texniki analiz göstərilmir. Xarici AI provayderi backend mühitində aktivləşdirildikdə real bazar təhlili burada görünəcək.',
      emptyHistory: 'Hələ qeydə alınmış AI analizi yoxdur.',
    },
    riskPage: {
      title: 'Risk İdarəetməsi',
      subtitle: 'Hər əməliyyat və günlük itki üçün qoruyucu limitləri tənzimləyin.',
      profileLabel: 'Risk Profili',
      stopLossLabel: 'Standart Stop Loss',
      takeProfitLabel: 'Standart Take Profit',
      maxDailyLossLabel: 'Maksimum Günlük Zərər Limiti',
      tradeSizeLabel: 'Əməliyyat üzrə baza məbləğ ($)',
      guardrailsTitle: 'Aktiv Təhlükəsizlik Qaydaları',
      guardrails: [
        'Real Trading qlobal təhlükəsizlik kilidi ilə deaktiv edilib.',
        'Vəsait çıxarışı (Withdrawal) icazəsi olan API açarları qəbul edilmir.',
        'Günlük zərər limiti aşıldıqda yeni siqnallar dayandırılır.',
      ],
      saveRisk: 'Risk ayarlarını yadda saxla',
    },
    affiliatePage: {
      title: 'Affiliate Sistemi',
      subtitle: 'Dəvət kodu və tərəfdaşlıq statistikası.',
      referralCode: 'Sizin dəvət kodunuz',
      totalReferrals: 'Ümumi dəvətlər',
      activeReferrals: 'Aktiv istifadəçilər',
      totalCommission: 'Toplam komissiya',
      statusLabel: 'Modul statusu',
      pendingTitle: 'Affiliate Hesablaşma Modulu Gözlənilir',
      pendingBody:
        'Hazırda real ödəniş və referral hesablaşma xidməti aktiv deyil. Saxta komissiya rəqəmləri göstərilmir.',
    },
    supportPage: {
      title: 'Dəstək Mərkəzi',
      subtitle: 'Platforma komandasına təhlükəsiz sorğu göndərin və statusunu izləyin.',
      newTicketTitle: 'Yeni Dəstək Sorğusu',
      subjectLabel: 'Mövzu',
      categoryLabel: 'Kateqoriya',
      categories: { general: 'Ümumi', technical: 'Texniki', security: 'Təhlükəsizlik', account: 'Hesab' },
      messageLabel: 'Ətraflı təsvir',
      submitTicket: 'Sorğunu göndər',
      ticketSubmitted: 'Dəstək sorğunuz qeydə alındı.',
      ticketsListTitle: 'Müraciətlərim',
      noTickets: 'Hələ dəstək sorğunuz yoxdur.',
      statuses: { OPEN: 'Açıq', IN_REVIEW: 'Baxılır', RESOLVED: 'Həll olunub' },
    },
    adminExtra: {
      riskTitle: 'İstifadəçi Risk Monitorinqi',
      binanceTitle: 'Binance Bağlantı Statusları',
      affiliateTitle: 'Affiliate Sistem İdarəetməsi',
      supportTitle: 'Dəstək Müraciətləri',
      securityTitle: 'Təhlükəsizlik Ayarları',
      updateStatus: 'Statusu yenilə',
      paperLocked: 'PAPER rejim məcburidir · Real icra qapalıdır',
      noTickets: 'Dəstək müraciəti yoxdur.',
      contactSettingsTitle: 'İctimai Əlaqə Kanalları',
      whatsappUrlLabel: 'Rəsmi WhatsApp HTTPS linki',
      telegramUrlLabel: 'Rəsmi Telegram HTTPS linki',
      supportEmailLabel: 'Rəsmi Dəstək E-poçtu',
    },
    theme: {
      lightLabel: 'Açıq mövzu',
      darkLabel: 'Tünd mövzu',
      toggleLabel: 'Görünüş rejimini dəyişdir',
    },
    engineVisual: {
      title: 'OXINVO Trading Intelligence Engine',
      demoBadge: 'Demo Vizualizasiya',
      scannerLabel: 'Market Scanner',
      scannerMeta: 'Spot cütlüklər · Həcm & Likvidlik',
      riskLabel: 'Risk Management',
      riskMeta: 'Stop-Loss · Take-Profit · Günlük Limit',
      aiFlowLabel: 'AI Analiz Axını',
      decisionLabel: 'Qərar Mexanizmi',
      subline: 'Çoxmərhələli bazar skaneri, maşın öyrənməsi və qoruyucu risk nəzarətinin arxitektur nümayişi.',
      decisions: { long: 'LONG', short: 'SHORT', hold: 'HOLD' },
    },
    pipeline: {
      eyebrow: 'MÜHƏNDİSLİK ARXİTEKTURASI',
      title: 'Altı Mərhələli Ticarət Zəkası Axını',
      subtitle: 'Hər qərar strukturlaşdırılmış məlumat emalı və sərt risk filtrlərindən keçir.',
      steps: [
        { title: 'Market Data', detail: 'Spot qiymət, şam strukturu və dərinlik axını' },
        { title: 'Market Scanner', detail: 'Likvidlik, volatillik və həcm anomaliyası seçimi' },
        { title: 'Technical Analysis', detail: 'Trend xətləri, EMA kəsişmələri və impuls yoxlaması' },
        { title: 'Machine Learning', detail: 'Çoxfaktorlu bazar konteksti və etimad çəkisi' },
        { title: 'Risk Management', detail: 'Mövqe həcmi, Stop-Loss və günlük zərər qoruyucusu' },
        { title: 'Trading Decision', detail: 'LONG / SHORT / HOLD qərarının icra qapısına ötürülməsi' },
      ],
    },
    chart: {
      candlestickTitle: 'Şam Qrafiki (OHLC)',
      awaitingTitle: 'Canlı Birja Məlumatı Gözlənilir',
      awaitingBody: 'Real OHLC şam məlumatları yalnız Binance API bağlantısı aktivləşdirildikdə göstərilir. Saxta qiymət və ya uydurma gəlir yaradılmır.',
      openLabel: 'Açılış',
      highLabel: 'Yüksək',
      lowLabel: 'Aşağı',
      closeLabel: 'Bağlanış',
      volumeLabel: 'Həcm',
      previewToggle: 'Struktur Önizləmə (Demo)',
      connectCta: 'Bağlantılara keç',
    },
  },
  en: {
    publicNav: {
      login: 'Sign In',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      risk: 'Risk Disclosure',
      poweredBy: 'Powered by OXINVO',
      copyright: '© 2026 OXINVO. All rights reserved.',
    },
    loginExtra: {
      usernameOrEmail: 'Username or email',
      forgotPassword: 'Forgot password?',
      forgotTitle: 'Password Recovery',
      forgotBody:
        'Under platform security policy, password resets are issued strictly by an authorized administrator via a one-time generated credential.',
      noAccountPrompt: "Don't have an account? Contact us.",
      whatsappLabel: 'WhatsApp Support',
      telegramLabel: 'Telegram Support',
      contactNotConfigured: 'Official support channel is not configured yet.',
      contactConfigureHint:
        'Once an administrator adds the official WhatsApp or Telegram link in platform settings, this icon will open it directly.',
      openContactPage: 'Open Contact Page',
      setupBannerTitle: 'Initial Administrator Setup',
      setupBannerBody:
        'No initial administrator password is configured in this environment. Set a strong password (min 12 chars, upper, lower, number, symbol) to activate access.',
      setupUsernameLabel: 'Administrator username',
      setupPasswordLabel: 'New administrator password',
      setupConfirmLabel: 'Confirm password',
      setupSubmit: 'Activate Administrator',
      setupMismatch: 'Passwords must match and satisfy complexity requirements.',
      showcase: {
        badge: 'OXINVO QUANT ENGINE',
        card1Title: 'Spot Market Intelligence',
        card1Meta: 'Multi-pair liquidity and market structure monitoring',
        card2Title: 'Risk Guardrails',
        card2Meta: 'Stop-Loss and daily drawdown limits',
        card3Title: 'Protected Execution',
        card3Meta: 'Paper mode active · Live execution guarded',
        statusLabel: 'System Mode',
        statusValue: 'PAPER · Awaiting exchange link',
      },
    },
    about: {
      eyebrow: 'ABOUT OXINVO',
      title: 'Calm, disciplined, security-first crypto trading infrastructure.',
      subtitle:
        'OXINVO unifies spot market monitoring, portfolio risk controls, and AI-assisted decision workflows inside a minimalist workspace.',
      ctaLogin: 'Sign In to Workspace',
      ctaContact: 'Contact Us',
      pillarsTitle: 'Core Architecture Principles',
      pillars: [
        {
          title: 'Security by Default',
          body: 'HttpOnly session cookies, CSRF binding, role-based access control (RBAC), and withdrawal-disabled API policies.',
        },
        {
          title: 'Disciplined Risk Controls',
          body: 'Configurable Stop-Loss, Take-Profit, and maximum daily drawdown guards per workspace profile.',
        },
        {
          title: 'Strict Mode Isolation',
          body: 'Paper Trading simulation and Real Trading execution stay strictly isolated until all backend safety checks pass.',
        },
        {
          title: 'Four-Language Precision',
          body: 'Full synchronized localization across Azerbaijani, English, Turkish, and Russian.',
        },
      ],
      honestTitle: 'Current Scope & Transparency',
      honestBody: 'OXINVO never promises guaranteed profits and never displays fabricated exchange metrics.',
      honestItems: [
        'Accounts, roles, session security, and audit logs are enforced server-side.',
        'Live exchange execution and real AI/Telegram workers remain disabled until production keys are verified.',
        'Market scanners and AI reports display real provider status rather than synthetic signals.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Does OXINVO guarantee trading profits?',
          a: 'No. Cryptocurrency trading carries significant risk. OXINVO provides workflow structure, monitoring, and risk controls without profit guarantees.',
        },
        {
          q: 'Are withdrawal permissions required on Binance?',
          a: 'No. Only read and spot permissions are designed for use; withdrawal permissions must always remain disabled.',
        },
        {
          q: 'Why is Real Trading disabled right now?',
          a: 'Real order execution remains locked until exchange worker verification and production security checks are completed.',
        },
        {
          q: 'How do users obtain an account?',
          a: 'Accounts are provisioned by platform administrators with role permissions and one-time credentials.',
        },
      ],
    },
    contact: {
      eyebrow: 'CONTACT & SUPPORT',
      title: 'Reach the OXINVO team',
      subtitle: 'Use official channels for onboarding, technical support, or security inquiries.',
      whatsappTitle: 'WhatsApp',
      telegramTitle: 'Telegram',
      emailTitle: 'Email',
      supportTitle: 'Workspace Support Desk',
      supportBody: 'Signed-in users can submit and track support tickets directly from the Support section.',
      notConfiguredBadge: 'Pending configuration',
      notConfiguredText: 'An official contact address has not been configured in platform settings yet.',
      openChannel: 'Open channel',
      formTitle: 'Send a message',
      formSubtitle: 'Your inquiry will be routed to the appropriate team.',
      nameLabel: 'Your name',
      emailLabel: 'Email address',
      subjectLabel: 'Subject',
      messageLabel: 'Message',
      sendButton: 'Send message',
      backendUnavailableNotice:
        'The public contact delivery service is not connected yet. Please sign in to open a Support ticket or configure official channels in Admin Settings.',
      faqTitle: 'Contact FAQ',
      faqs: [
        {
          q: 'How are onboarding requests processed?',
          a: 'Administrators review workspace access requests and issue credentials securely.',
        },
        {
          q: 'What if I lose access to my account?',
          a: 'Request a one-time password reset from your platform administrator.',
        },
      ],
    },
    legal: {
      updatedLabel: 'Last updated: 2026',
      backToLogin: 'Back to Sign In',
      privacy: {
        title: 'Privacy Policy',
        intro: 'OXINVO handles account identifiers and session metadata under strict security controls.',
        sections: [
          {
            heading: '1. Data Scope',
            body: 'Only account metadata, language preference, active session fingerprints, and audit logs are stored.',
          },
          {
            heading: '2. Credentials & Cookies',
            body: 'Authentication relies on HttpOnly cookies and in-memory CSRF tokens. API secrets are never stored in browser storage.',
          },
        ],
      },
      terms: {
        title: 'Terms of Service',
        intro: 'By accessing OXINVO you agree to adhere to workspace security and usage policies.',
        sections: [
          {
            heading: '1. Account Security',
            body: 'Users must protect issued credentials and update temporary passwords upon first login.',
          },
          {
            heading: '2. No Financial Advice',
            body: 'OXINVO provides software tooling only and does not provide investment advice or guaranteed returns.',
          },
        ],
      },
      risk: {
        title: 'Risk Disclosure',
        intro: 'Digital asset markets involve substantial volatility and risk of capital loss.',
        sections: [
          {
            heading: '1. Market Risk',
            body: 'Prices can move rapidly. Never allocate funds you cannot afford to lose.',
          },
          {
            heading: '2. Execution Guardrails',
            body: 'Real Trading stays disabled until backend safety and exchange connectivity checks are finalized.',
          },
        ],
      },
    },
    dashboardNav: {
      aiAnalysis: 'AI Analysis',
      openTrades: 'Open Trades',
      tradeHistory: 'Trade History',
      riskManagement: 'Risk Management',
      binanceConnection: 'Binance Connection',
      affiliate: 'Affiliate System',
      support: 'Support',
    },
    adminExtraNav: {
      riskMonitoring: 'Risk Monitoring',
      binanceStatuses: 'Binance Statuses',
      affiliate: 'Affiliate System',
      supportRequests: 'Support Requests',
      security: 'Security Settings',
    },
    overviewExtra: {
      activeBots: 'Active Bots',
      botStatus: 'Bot Status',
      riskLevel: 'Risk Level',
      marketIndicators: 'Market Indicators',
      integrationUnavailable: 'Live exchange connection is not established yet.',
      connectExchangeHint: 'Connect Binance in Connections once exchange workers are enabled to view live balances.',
    },
    botExtra: {
      paperTrading: 'Paper Trading',
      realTrading: 'Real Trading',
      realTradingDisabledNote:
        'Real Trading is currently disabled. Live exchange orders are blocked until backend safety checks and integration are complete.',
      pairLabel: 'Trading Pair',
      riskLevelLabel: 'Risk Level',
      riskLevels: { CONSERVATIVE: 'Conservative', BALANCED: 'Balanced', AGGRESSIVE: 'Aggressive' },
      stopLossPct: 'Stop Loss (%)',
      takeProfitPct: 'Take Profit (%)',
      maxDailyLossPct: 'Max Daily Loss (%)',
      tradeAmountUsd: 'Order Amount (USDT)',
      saveConfig: 'Save Bot Configuration',
      engineUnavailable: 'Live bot worker is not connected; parameters are persisted to your Paper profile.',
    },
    aiAnalysis: {
      title: 'Oxinvo AI Analysis',
      subtitle: 'Structured market structure, trend, and risk assessment across spot pairs.',
      pairLabel: 'Cryptocurrency Pair',
      timeframeLabel: 'Timeframe',
      analyzeBtn: 'Analyze',
      analyzingTitle: 'Querying OXINVO AI Engine...',
      analyzingSub: 'Checking market context, liquidity filters, and provider readiness',
      marketAnalysis: 'Market Analysis',
      trendDirection: 'Trend Direction',
      riskAnalysis: 'Risk Analysis',
      technicalIndicators: 'Technical Indicators',
      signalInterface: 'Buy / Sell Signals',
      historyTitle: 'AI Analysis History',
      providerUnavailableTitle: 'AI Analysis Provider Not Connected',
      providerUnavailableBody:
        'OXINVO does not fabricate synthetic AI signals or indicator readings. Once an AI provider is wired in the backend, live structured analysis appears here.',
      emptyHistory: 'No AI analysis records yet.',
    },
    riskPage: {
      title: 'Risk Management',
      subtitle: 'Configure protective position and daily drawdown limits.',
      profileLabel: 'Risk Profile',
      stopLossLabel: 'Default Stop Loss',
      takeProfitLabel: 'Default Take Profit',
      maxDailyLossLabel: 'Max Daily Loss Limit',
      tradeSizeLabel: 'Base Position Size ($)',
      guardrailsTitle: 'Active Safety Guardrails',
      guardrails: [
        'Real Trading is locked globally behind backend safety verification.',
        'Exchange keys with withdrawal permissions are rejected.',
        'New entries pause automatically if the daily loss threshold is reached.',
      ],
      saveRisk: 'Save Risk Settings',
    },
    affiliatePage: {
      title: 'Affiliate System',
      subtitle: 'Partner referral code and transparent status.',
      referralCode: 'Your Referral Code',
      totalReferrals: 'Total Referrals',
      activeReferrals: 'Active Users',
      totalCommission: 'Total Commission',
      statusLabel: 'Module Status',
      pendingTitle: 'Affiliate Settlement Pending Activation',
      pendingBody:
        'Billing and referral settlement workers are not active yet. No synthetic commissions or referral balances are displayed.',
    },
    supportPage: {
      title: 'Support Desk',
      subtitle: 'Submit a secure support request to the platform operations team.',
      newTicketTitle: 'New Support Request',
      subjectLabel: 'Subject',
      categoryLabel: 'Category',
      categories: { general: 'General', technical: 'Technical', security: 'Security', account: 'Account' },
      messageLabel: 'Details',
      submitTicket: 'Submit Request',
      ticketSubmitted: 'Support request recorded.',
      ticketsListTitle: 'Your Requests',
      noTickets: 'No support requests yet.',
      statuses: { OPEN: 'Open', IN_REVIEW: 'In Review', RESOLVED: 'Resolved' },
    },
    adminExtra: {
      riskTitle: 'User Risk Monitoring',
      binanceTitle: 'Binance Connection Statuses',
      affiliateTitle: 'Affiliate Management',
      supportTitle: 'Support Requests',
      securityTitle: 'Security Settings',
      updateStatus: 'Update status',
      paperLocked: 'PAPER mode enforced · Real execution disabled',
      noTickets: 'No support requests yet.',
      contactSettingsTitle: 'Public Support Channels',
      whatsappUrlLabel: 'Official WhatsApp HTTPS URL',
      telegramUrlLabel: 'Official Telegram HTTPS URL',
      supportEmailLabel: 'Official Support Email',
    },
    theme: {
      lightLabel: 'Light mode',
      darkLabel: 'Dark mode',
      toggleLabel: 'Toggle light or dark theme',
    },
    engineVisual: {
      title: 'OXINVO Trading Intelligence Engine',
      demoBadge: 'Demo Visualization',
      scannerLabel: 'Market Scanner',
      scannerMeta: 'Spot pairs · Volume & Liquidity',
      riskLabel: 'Risk Management',
      riskMeta: 'Stop-Loss · Take-Profit · Daily Cap',
      aiFlowLabel: 'AI Analysis Flow',
      decisionLabel: 'Decision Engine',
      subline: 'Architectural showcase of multi-stage market scanning, machine inference, and automated risk guardrails.',
      decisions: { long: 'LONG', short: 'SHORT', hold: 'HOLD' },
    },
    pipeline: {
      eyebrow: 'ENGINE ARCHITECTURE',
      title: 'Six-Stage Trading Intelligence Pipeline',
      subtitle: 'Every evaluation flows sequentially from raw exchange telemetry through deterministic risk gates.',
      steps: [
        { title: 'Market Data', detail: 'Spot OHLC streams, volume, and order-book depth' },
        { title: 'Market Scanner', detail: 'Liquidity, breakout, and abnormal flow filtering' },
        { title: 'Technical Analysis', detail: 'Candlestick structure, EMA alignment, and momentum' },
        { title: 'Machine Learning', detail: 'Multi-factor context and regime probability scoring' },
        { title: 'Risk Management', detail: 'Position sizing, Stop-Loss, and daily drawdown cap' },
        { title: 'Trading Decision', detail: 'LONG / SHORT / HOLD routing to execution guardrails' },
      ],
    },
    chart: {
      candlestickTitle: 'Candlestick Chart (OHLC)',
      awaitingTitle: 'Awaiting Live Exchange Feed',
      awaitingBody: 'Real OHLC candlestick data appears only after Binance exchange integration is connected. Synthetic balances or profit numbers are never fabricated.',
      openLabel: 'Open',
      highLabel: 'High',
      lowLabel: 'Low',
      closeLabel: 'Close',
      volumeLabel: 'Volume',
      previewToggle: 'Structure Preview (Demo)',
      connectCta: 'Open Connections',
    },
  },
  tr: {
    publicNav: {
      login: 'Giriş Yap',
      about: 'Hakkımızda',
      contact: 'İletişim',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Şartları',
      risk: 'Risk Bildirimi',
      poweredBy: 'Powered by OXINVO',
      copyright: '© 2026 OXINVO. Tüm hakları saklıdır.',
    },
    loginExtra: {
      usernameOrEmail: 'Kullanıcı adı veya e-posta',
      forgotPassword: 'Şifrenizi mi unuttunuz?',
      forgotTitle: 'Şifre Kurtarma',
      forgotBody:
        'Güvenlik politikası gereği şifre sıfırlama işlemleri yalnızca yetkili platform yöneticisi tarafından tek kullanımlık şifre ile yapılır.',
      noAccountPrompt: 'Hesabınız yok mu? Bizimle iletişime geçin.',
      whatsappLabel: 'WhatsApp Destek',
      telegramLabel: 'Telegram Destek',
      contactNotConfigured: 'Resmi iletişim kanalı henüz yapılandırılmadı.',
      contactConfigureHint:
        'Yönetici platform ayarlarından resmi WhatsApp veya Telegram bağlantısını eklediğinde bu simge doğrudan açılacaktır.',
      openContactPage: 'İletişim Sayfasına Git',
      setupBannerTitle: 'İlk Yönetici Kurulumu',
      setupBannerBody:
        'Bu ortamda henüz yönetici şifresi tanımlanmadı. Erişimi etkinleştirmek için güçlü bir şifre (min. 12 karakter) belirleyin.',
      setupUsernameLabel: 'Yönetici kullanıcı adı',
      setupPasswordLabel: 'Yeni yönetici şifresi',
      setupConfirmLabel: 'Şifreyi doğrulayın',
      setupSubmit: 'Yöneticiyi Etkinleştir',
      setupMismatch: 'Şifreler eşleşmeli ve güvenlik kurallarına uymalıdır.',
      showcase: {
        badge: 'OXINVO QUANT ENGINE',
        card1Title: 'Spot Piyasa İstihbaratı',
        card1Meta: 'Çoklu parite likidite ve yapı izleme',
        card2Title: 'Risk Koruması',
        card2Meta: 'Stop-Loss ve günlük zarar limitleri',
        card3Title: 'Korumalı Mimari',
        card3Meta: 'Paper modu aktif · Gerçek işlem kilitli',
        statusLabel: 'Sistem Modu',
        statusValue: 'PAPER · Borsa bağlantısı bekleniyor',
      },
    },
    about: {
      eyebrow: 'OXINVO HAKKINDA',
      title: 'Sakin, disiplinli ve güvenlik odaklı kripto işlem altyapısı.',
      subtitle:
        'OXINVO; spot piyasa izleme, risk yönetimi ve yapay zekâ destekli karar panellerini minimalist bir çalışma alanında birleştirir.',
      ctaLogin: 'Platforma Giriş Yap',
      ctaContact: 'İletişime Geç',
      pillarsTitle: 'Temel Mimari İlkeler',
      pillars: [
        {
          title: 'Önce Güvenlik',
          body: 'HttpOnly oturum çerezleri, CSRF doğrulaması, rol bazlı erişim (RBAC) ve çekim yetkisi kapalı API standardı.',
        },
        {
          title: 'Disiplinli Risk Kontrolü',
          body: 'Her profil için Stop-Loss, Take-Profit ve günlük maksimum zarar sınırları önceden tanımlanır.',
        },
        {
          title: 'Sıkı Mod Ayrımı',
          body: 'Paper Trading ve Real Trading birbirinden izole edilir; tüm güvenlik doğrulamaları tamamlanmadan gerçek emir gönderilmez.',
        },
        {
          title: 'Dört Dilde Tam Uyum',
          body: 'Azerbaycanca, İngilizce, Türkçe ve Rusça dillerinde eksiksiz arayüz deneyimi.',
        },
      ],
      honestTitle: 'Mevcut Kapsam ve Şeffaflık',
      honestBody: 'OXINVO kesinlikle kâr garantisi vermez ve bağlı olmayan servisler için sahte veri üretmez.',
      honestItems: [
        'Kullanıcı hesapları, roller, oturumlar ve denetim kayıtları sunucu tarafında korunur.',
        'Canlı borsa emri ve harici AI/Telegram servisleri üretim anahtarları doğrulanana kadar kapalıdır.',
        'Piyasa tarayıcı ve analiz ekranları yalnızca gerçek sağlayıcı bağlandığında veri gösterir.',
      ],
      faqTitle: 'Sıkça Sorulan Sorular',
      faqs: [
        {
          q: 'OXINVO kazanç garantisi sunuyor mu?',
          a: 'Hayır. Kripto piyasaları yüksek risk taşır; platform analiz ve risk disiplini sağlayan bir araçtır.',
        },
        {
          q: 'Binance API anahtarında para çekme izni gerekir mi?',
          a: 'Hayır. Yalnızca okuma ve spot işlem izni kullanılır; para çekme izni daima kapalı olmalıdır.',
        },
        {
          q: 'Real Trading neden şu an kapalı?',
          a: 'Canlı emir altyapısı ve güvenlik doğrulamaları tamamlanmadan gerçek işlem başlatılmaz.',
        },
        {
          q: 'Hesap nasıl oluşturulur?',
          a: 'Hesaplar platform yöneticisi tarafından abonelik planı ve tek kullanımlık şifre ile tanımlanır.',
        },
      ],
    },
    contact: {
      eyebrow: 'İLETİŞİM VE DESTEK',
      title: 'OXINVO ekibiyle iletişime geçin',
      subtitle: 'Hesap açılışı, teknik destek ve güvenlik soruları için resmi kanalları kullanın.',
      whatsappTitle: 'WhatsApp',
      telegramTitle: 'Telegram',
      emailTitle: 'E-posta',
      supportTitle: 'Panel Destek Masası',
      supportBody: 'Giriş yapmış kullanıcılar Destek bölümünden doğrudan talep oluşturabilir.',
      notConfiguredBadge: 'Yapılandırma bekleniyor',
      notConfiguredText: 'Bu kanal için resmi iletişim adresi henüz sistem ayarlarında tanımlanmadı.',
      openChannel: 'Kanalı aç',
      formTitle: 'Mesaj gönderin',
      formSubtitle: 'Mesajınız ilgili ekibe yönlendirilecektir.',
      nameLabel: 'Adınız',
      emailLabel: 'E-posta adresiniz',
      subjectLabel: 'Konu',
      messageLabel: 'Mesajınız',
      sendButton: 'Mesajı Gönder',
      backendUnavailableNotice:
        'Herkese açık iletişim e-posta servisi henüz bağlı değil. Lütfen giriş yaparak Destek bölümünü kullanın veya yönetici ayarlarını tamamlayın.',
      faqTitle: 'İletişim SSS',
      faqs: [
        {
          q: 'Hesap talepleri ne kadar sürede incelenir?',
          a: 'Yöneticiler erişim taleplerini sırayla değerlendirir ve bilgileri güvenli şekilde iletir.',
        },
        {
          q: 'Şifremi unutursam ne yapmalıyım?',
          a: 'Platform yöneticinizden tek kullanımlık şifre sıfırlama talep edebilirsiniz.',
        },
      ],
    },
    legal: {
      updatedLabel: 'Son güncelleme: 2026',
      backToLogin: 'Girişe Dön',
      privacy: {
        title: 'Gizlilik Politikası',
        intro: 'OXINVO kullanıcı verilerini ve oturum güvenliğini sıkı kurallarla korur.',
        sections: [
          {
            heading: '1. Toplanan Veriler',
            body: 'Yalnızca hesap bilgileri, dil tercihi, oturum meta verileri ve güvenlik denetim kayıtları tutulur.',
          },
          {
            heading: '2. Çerezler ve Anahtarlar',
            body: 'Oturumlar HttpOnly çerezlerde saklanır; API gizli anahtarları tarayıcı belleğinde tutulmaz.',
          },
        ],
      },
      terms: {
        title: 'Kullanım Şartları',
        intro: 'OXINVO platformunu kullanarak aşağıdaki güvenlik ve kullanım kurallarını kabul etmiş olursunuz.',
        sections: [
          {
            heading: '1. Hesap Güvenliği',
            body: 'Kullanıcılar kimlik bilgilerini korumak ve ilk girişte geçici şifreyi değiştirmekle yükümlüdür.',
          },
          {
            heading: '2. Yatırım Tavsiyesi Değildir',
            body: 'Platform yazılım altyapısı sunar; finansal tavsiye veya getiri garantisi vermez.',
          },
        ],
      },
      risk: {
        title: 'Risk Bildirimi',
        intro: 'Kripto varlık piyasaları yüksek oynaklık ve sermaye kaybı riski içerir.',
        sections: [
          {
            heading: '1. Piyasa Oynaklığı',
            body: 'Fiyatlar hızla değişebilir. Kaybetmeyi göze alamayacağınız sermaye ile işlem yapmayın.',
          },
          {
            heading: '2. Teknik Korumalar',
            body: 'Real Trading, sunucu ve borsa güvenlik kontrolleri tamamlanana kadar devre dışıdır.',
          },
        ],
      },
    },
    dashboardNav: {
      aiAnalysis: 'AI Analiz',
      openTrades: 'Açık İşlemler',
      tradeHistory: 'İşlem Geçmişi',
      riskManagement: 'Risk Yönetimi',
      binanceConnection: 'Binance Bağlantısı',
      affiliate: 'Affiliate Sistemi',
      support: 'Destek',
    },
    adminExtraNav: {
      riskMonitoring: 'Risk İzleme',
      binanceStatuses: 'Binance Durumları',
      affiliate: 'Affiliate Yönetimi',
      supportRequests: 'Destek Talepleri',
      security: 'Güvenlik Ayarları',
    },
    overviewExtra: {
      activeBots: 'Aktif Botlar',
      botStatus: 'Bot Durumu',
      riskLevel: 'Risk Seviyesi',
      marketIndicators: 'Piyasa Göstergeleri',
      integrationUnavailable: 'Canlı borsa bağlantısı henüz kurulmadı.',
      connectExchangeHint: 'Gerçek bakiye ve canlı veriler için Binance bağlantısı gereklidir.',
    },
    botExtra: {
      paperTrading: 'Paper Trading',
      realTrading: 'Real Trading',
      realTradingDisabledNote:
        'Real Trading şu anda devre dışıdır. Arka uç güvenlik kontrolleri tamamlanmadan gerçek emir gönderilmez.',
      pairLabel: 'İşlem Çifti',
      riskLevelLabel: 'Risk Seviyesi',
      riskLevels: { CONSERVATIVE: 'Muhafazakâr', BALANCED: 'Dengeli', AGGRESSIVE: 'Agresif' },
      stopLossPct: 'Stop Loss (%)',
      takeProfitPct: 'Take Profit (%)',
      maxDailyLossPct: 'Maks. Günlük Zarar (%)',
      tradeAmountUsd: 'İşlem Tutarı (USDT)',
      saveConfig: 'Bot Ayarlarını Kaydet',
      engineUnavailable: 'Canlı bot motoru bağlı değil; ayarlar Paper profiline kaydedilir.',
    },
    aiAnalysis: {
      title: 'Oxinvo AI Analiz',
      subtitle: 'Spot pariteler için yapılandırılmış piyasa, trend ve risk değerlendirmesi.',
      pairLabel: 'Kripto Para Çifti',
      timeframeLabel: 'Analiz Süresi',
      analyzeBtn: 'Analiz Et',
      analyzingTitle: 'OXINVO AI Motoru Kontrol Ediliyor...',
      analyzingSub: 'Piyasa yapısı, likidite ve sağlayıcı bağlantısı sorgulanıyor',
      marketAnalysis: 'Piyasa Analizi',
      trendDirection: 'Trend Yönü',
      riskAnalysis: 'Risk Analizi',
      technicalIndicators: 'Teknik Göstergeler',
      signalInterface: 'Alım / Satım Sinyalleri',
      historyTitle: 'AI Analiz Geçmişi',
      providerUnavailableTitle: 'AI Analiz Sağlayıcısı Bağlı Değil',
      providerUnavailableBody:
        'Sahte sinyaller veya uydurma teknik analizler gösterilmez. Arka uçta AI sağlayıcısı etkinleştirildiğinde gerçek analiz burada yer alır.',
      emptyHistory: 'Henüz kayıtlı AI analizi yok.',
    },
    riskPage: {
      title: 'Risk Yönetimi',
      subtitle: 'İşlem başı ve günlük zarar koruma limitlerini yapılandırın.',
      profileLabel: 'Risk Profili',
      stopLossLabel: 'Varsayılan Stop Loss',
      takeProfitLabel: 'Varsayılan Take Profit',
      maxDailyLossLabel: 'Maksimum Günlük Zarar Limiti',
      tradeSizeLabel: 'Temel İşlem Tutarı ($)',
      guardrailsTitle: 'Aktif Güvenlik Kuralları',
      guardrails: [
        'Real Trading küresel güvenlik kilidiyle devre dışıdır.',
        'Para çekme yetkisi açık API anahtarları kabul edilmez.',
        'Günlük zarar sınırı aşılırsa yeni girişler durdurulur.',
      ],
      saveRisk: 'Risk Ayarlarını Kaydet',
    },
    affiliatePage: {
      title: 'Affiliate Sistemi',
      subtitle: 'Referans kodu ve şeffaf ortaklık durumu.',
      referralCode: 'Referans Kodunuz',
      totalReferrals: 'Toplam Davet',
      activeReferrals: 'Aktif Kullanıcılar',
      totalCommission: 'Toplam Komisyon',
      statusLabel: 'Modül Durumu',
      pendingTitle: 'Affiliate Hesaplama Modülü Beklemede',
      pendingBody:
        'Ödeme ve referans hesaplama servisleri henüz aktif değil. Sahte komisyon rakamları gösterilmez.',
    },
    supportPage: {
      title: 'Destek Merkezi',
      subtitle: 'Platform ekibine güvenli destek talebi gönderin.',
      newTicketTitle: 'Yeni Destek Talebi',
      subjectLabel: 'Konu',
      categoryLabel: 'Kategori',
      categories: { general: 'Genel', technical: 'Teknik', security: 'Güvenlik', account: 'Hesap' },
      messageLabel: 'Açıklama',
      submitTicket: 'Talebi Gönder',
      ticketSubmitted: 'Destek talebiniz kaydedildi.',
      ticketsListTitle: 'Taleplerim',
      noTickets: 'Henüz destek talebiniz yok.',
      statuses: { OPEN: 'Açık', IN_REVIEW: 'İnceleniyor', RESOLVED: 'Çözüldü' },
    },
    adminExtra: {
      riskTitle: 'Kullanıcı Risk İzleme',
      binanceTitle: 'Binance Bağlantı Durumları',
      affiliateTitle: 'Affiliate Yönetimi',
      supportTitle: 'Destek Talepleri',
      securityTitle: 'Güvenlik Ayarları',
      updateStatus: 'Durumu güncelle',
      paperLocked: 'PAPER modu zorunlu · Gerçek işlem kapalı',
      noTickets: 'Destek talebi yok.',
      contactSettingsTitle: 'Genel İletişim Kanalları',
      whatsappUrlLabel: 'Resmi WhatsApp HTTPS Linki',
      telegramUrlLabel: 'Resmi Telegram HTTPS Linki',
      supportEmailLabel: 'Resmi Destek E-postası',
    },
    theme: {
      lightLabel: 'Açık tema',
      darkLabel: 'Koyu tema',
      toggleLabel: 'Görünüm temasını değiştir',
    },
    engineVisual: {
      title: 'OXINVO Trading Intelligence Engine',
      demoBadge: 'Demo Görselleştirme',
      scannerLabel: 'Market Scanner',
      scannerMeta: 'Spot pariteler · Hacim & Likidite',
      riskLabel: 'Risk Management',
      riskMeta: 'Stop-Loss · Take-Profit · Günlük Limit',
      aiFlowLabel: 'AI Analiz Akışı',
      decisionLabel: 'Karar Mekanizması',
      subline: 'Çok aşamalı piyasa tarama, makine öğrenmesi ve koruyucu risk kontrolünün mimari gösterimi.',
      decisions: { long: 'LONG', short: 'SHORT', hold: 'HOLD' },
    },
    pipeline: {
      eyebrow: 'MOTOR MİMARİSİ',
      title: 'Altı Aşamalı İşlem Zekâsı Hattı',
      subtitle: 'Her değerlendirme yapılandırılmış veri işleme ve katı risk kapılarından geçer.',
      steps: [
        { title: 'Market Data', detail: 'Spot OHLC akışı, hacim ve emir defteri derinliği' },
        { title: 'Market Scanner', detail: 'Likidite, kırılım ve olağandışı hacim filtrelemesi' },
        { title: 'Technical Analysis', detail: 'Mum formasyonu, EMA uyumu ve momentum kontrolü' },
        { title: 'Machine Learning', detail: 'Çok faktörlü piyasa bağlamı ve olasılık ağırlığı' },
        { title: 'Risk Management', detail: 'Pozisyon boyutu, Stop-Loss ve günlük zarar sınırı' },
        { title: 'Trading Decision', detail: 'LONG / SHORT / HOLD kararının yürütme katmanına aktarımı' },
      ],
    },
    chart: {
      candlestickTitle: 'Mum Grafiği (OHLC)',
      awaitingTitle: 'Canlı Borsa Verisi Bekleniyor',
      awaitingBody: 'Gerçek OHLC mum verileri yalnızca Binance API bağlantısı etkinleştirildiğinde gösterilir. Sahte bakiye veya kâr rakamı üretilmez.',
      openLabel: 'Açılış',
      highLabel: 'Yüksek',
      lowLabel: 'Düşük',
      closeLabel: 'Kapanış',
      volumeLabel: 'Hacim',
      previewToggle: 'Yapı Önizleme (Demo)',
      connectCta: 'Bağlantılara Git',
    },
  },
  ru: {
    publicNav: {
      login: 'Войти',
      about: 'О нас',
      contact: 'Контакты',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      risk: 'Предупреждение о рисках',
      poweredBy: 'Powered by OXINVO',
      copyright: '© 2026 OXINVO. Все права защищены.',
    },
    loginExtra: {
      usernameOrEmail: 'Имя пользователя или эл. почта',
      forgotPassword: 'Забыли пароль?',
      forgotTitle: 'Восстановление пароля',
      forgotBody:
        'По политике безопасности сброс пароля выполняется только уполномоченным администратором с выдачей одноразового пароля.',
      noAccountPrompt: 'Нет аккаунта? Свяжитесь с нами.',
      whatsappLabel: 'Поддержка WhatsApp',
      telegramLabel: 'Поддержка Telegram',
      contactNotConfigured: 'Официальный канал связи еще не настроен.',
      contactConfigureHint:
        'После того как администратор укажет официальную ссылку WhatsApp или Telegram в настройках платформы, кнопка откроет ее напрямую.',
      openContactPage: 'Открыть страницу контактов',
      setupBannerTitle: 'Первичная настройка администратора',
      setupBannerBody:
        'Пароль администратора в этой среде еще не задан. Установите надежный пароль (минимум 12 символов, буквы разного регистра, цифра, спецсимвол).',
      setupUsernameLabel: 'Логин администратора',
      setupPasswordLabel: 'Новый пароль администратора',
      setupConfirmLabel: 'Подтвердите пароль',
      setupSubmit: 'Активировать администратора',
      setupMismatch: 'Пароли должны совпадать и соответствовать требованиям безопасности.',
      showcase: {
        badge: 'OXINVO QUANT ENGINE',
        card1Title: 'Спотовая аналитика',
        card1Meta: 'Мониторинг ликвидности и структуры рынка',
        card2Title: 'Контроль рисков',
        card2Meta: 'Stop-Loss и дневные лимиты просадки',
        card3Title: 'Защищенная архитектура',
        card3Meta: 'Режим Paper активен · Real отключен',
        statusLabel: 'Режим системы',
        statusValue: 'PAPER · Ожидание биржи',
      },
    },
    about: {
      eyebrow: 'О ПЛАТФОРМЕ OXINVO',
      title: 'Спокойная, дисциплинированная и безопасная крипто-инфраструктура.',
      subtitle:
        'OXINVO объединяет мониторинг спотового рынка, контроль рисков и ИИ-аналитику в минималистичном рабочем пространстве.',
      ctaLogin: 'Войти в кабинет',
      ctaContact: 'Связаться с нами',
      pillarsTitle: 'Принципы архитектуры',
      pillars: [
        {
          title: 'Безопасность в приоритете',
          body: 'HttpOnly-сессии, защита CSRF, ролевой контроль доступа (RBAC) и API без права вывода средств.',
        },
        {
          title: 'Строгий риск-менеджмент',
          body: 'Параметры Stop-Loss, Take-Profit и дневной лимит убытка задаются заранее для каждого профиля.',
        },
        {
          title: 'Четкое разделение режимов',
          body: 'Paper Trading и Real Trading полностью разделены; реальные ордера заблокированы до завершения всех проверок.',
        },
        {
          title: 'Четыре языка',
          body: 'Полная локализация интерфейса на азербайджанском, английском, турецком и русском языках.',
        },
      ],
      honestTitle: 'Текущий статус и прозрачность',
      honestBody: 'OXINVO не обещает гарантированную доходность и не показывает вымышленные показатели.',
      honestItems: [
        'Аккаунты, роли, сессии и журналы аудита контролируются на стороне сервера.',
        'Реальная торговля на бирже и внешние AI/Telegram модули отключены до верификации ключей.',
        'Панели анализа отображают фактический статус подключения провайдеров.',
      ],
      faqTitle: 'Частые вопросы',
      faqs: [
        {
          q: 'Гарантирует ли OXINVO прибыль?',
          a: 'Нет. Крипторынок сопряжен с высоким риском. Платформа является инструментом анализа и контроля рисков.',
        },
        {
          q: 'Нужны ли права на вывод средств в Binance API?',
          a: 'Нет. Используются только чтение и спотовая торговля; вывод средств всегда должен быть отключен.',
        },
        {
          q: 'Почему Real Trading сейчас отключен?',
          a: 'Реальное исполнение ордеров заблокировано до завершения всех проверок безопасности сервера.',
        },
        {
          q: 'Как получить доступ к платформе?',
          a: 'Аккаунты создаются администратором платформы с тарифным планом и временным паролем.',
        },
      ],
    },
    contact: {
      eyebrow: 'КОНТАКТЫ И ПОДДЕРЖКА',
      title: 'Связь с командой OXINVO',
      subtitle: 'Используйте официальные каналы для вопросов доступа, поддержки и безопасности.',
      whatsappTitle: 'WhatsApp',
      telegramTitle: 'Telegram',
      emailTitle: 'Эл. почта',
      supportTitle: 'Служба поддержки в кабинете',
      supportBody: 'Авторизованные пользователи могут создавать обращения напрямую в разделе «Поддержка».',
      notConfiguredBadge: 'Ожидает настройки',
      notConfiguredText: 'Официальный контакт для этого канала еще не задан в настройках системы.',
      openChannel: 'Открыть канал',
      formTitle: 'Отправить сообщение',
      formSubtitle: 'Обращение будет передано профильному специалисту.',
      nameLabel: 'Ваше имя',
      emailLabel: 'Электронная почта',
      subjectLabel: 'Тема',
      messageLabel: 'Сообщение',
      sendButton: 'Отправить',
      backendUnavailableNotice:
        'Публичный сервис отправки сообщений еще не подключен. Пожалуйста, войдите в кабинет и используйте раздел «Поддержка».',
      faqTitle: 'Вопросы по связи',
      faqs: [
        {
          q: 'Как обрабатываются заявки на доступ?',
          a: 'Администраторы проверяют запросы в порядке очереди и безопасно передают учетные данные.',
        },
        {
          q: 'Что делать при утере пароля?',
          a: 'Обратитесь к администратору платформы для выдачи одноразового пароля сброса.',
        },
      ],
    },
    legal: {
      updatedLabel: 'Обновлено: 2026',
      backToLogin: 'Вернуться ко входу',
      privacy: {
        title: 'Политика конфиденциальности',
        intro: 'OXINVO защищает данные учетных записей и метаданные сессий.',
        sections: [
          {
            heading: '1. Собираемые данные',
            body: 'Хранятся только идентификатор аккаунта, языковые настройки, активные сессии и журнал аудита.',
          },
          {
            heading: '2. Ключи и Cookies',
            body: 'Сессии защищены HttpOnly-cookie; секреты API никогда не сохраняются в хранилище браузера.',
          },
        ],
      },
      terms: {
        title: 'Условия использования',
        intro: 'Входя в OXINVO, вы соглашаетесь соблюдать правила безопасности платформы.',
        sections: [
          {
            heading: '1. Ответственность',
            body: 'Пользователь обязан хранить учетные данные в тайне и сменить временный пароль при первом входе.',
          },
          {
            heading: '2. Отказ от финансовых гарантий',
            body: 'OXINVO предоставляет программные инструменты и не дает инвестиционных рекомендаций.',
          },
        ],
      },
      risk: {
        title: 'Предупреждение о рисках',
        intro: 'Торговля цифровыми активами связана с высокой волатильностью и риском потери капитала.',
        sections: [
          {
            heading: '1. Рыночный риск',
            body: 'Котировки могут резко меняться. Используйте только капитал, потерю которого готовы принять.',
          },
          {
            heading: '2. Ограничения режима',
            body: 'Режим Real Trading отключен до завершения всех проверок биржевой интеграции.',
          },
        ],
      },
    },
    dashboardNav: {
      aiAnalysis: 'AI Анализ',
      openTrades: 'Открытые сделки',
      tradeHistory: 'История сделок',
      riskManagement: 'Риск-менеджмент',
      binanceConnection: 'Подключение Binance',
      affiliate: 'Партнерская программа',
      support: 'Поддержка',
    },
    adminExtraNav: {
      riskMonitoring: 'Мониторинг рисков',
      binanceStatuses: 'Статусы Binance',
      affiliate: 'Партнерская система',
      supportRequests: 'Заявки поддержки',
      security: 'Безопасность',
    },
    overviewExtra: {
      activeBots: 'Активные боты',
      botStatus: 'Статус бота',
      riskLevel: 'Уровень риска',
      marketIndicators: 'Индикаторы рынка',
      integrationUnavailable: 'Биржевое подключение еще не установлено.',
      connectExchangeHint: 'Для реального баланса и рыночных данных требуется подключение Binance.',
    },
    botExtra: {
      paperTrading: 'Paper Trading',
      realTrading: 'Real Trading',
      realTradingDisabledNote:
        'Real Trading сейчас отключен. Реальные ордера заблокированы до завершения проверок безопасности.',
      pairLabel: 'Торговая пара',
      riskLevelLabel: 'Уровень риска',
      riskLevels: { CONSERVATIVE: 'Консервативный', BALANCED: 'Сбалансированный', AGGRESSIVE: 'Агрессивный' },
      stopLossPct: 'Stop Loss (%)',
      takeProfitPct: 'Take Profit (%)',
      maxDailyLossPct: 'Макс. дневной убыток (%)',
      tradeAmountUsd: 'Сумма сделки (USDT)',
      saveConfig: 'Сохранить настройки бота',
      engineUnavailable: 'Живой воркер не подключен; параметры сохраняются в Paper-профиле.',
    },
    aiAnalysis: {
      title: 'Oxinvo AI Анализ',
      subtitle: 'Структурированный анализ рынка, трендов и рисков по спотовым парам.',
      pairLabel: 'Криптовалютная пара',
      timeframeLabel: 'Таймфрейм',
      analyzeBtn: 'Анализировать',
      analyzingTitle: 'Проверка OXINVO AI...',
      analyzingSub: 'Запрос структуры рынка, фильтров ликвидности и статуса провайдера',
      marketAnalysis: 'Анализ рынка',
      trendDirection: 'Направление тренда',
      riskAnalysis: 'Анализ рисков',
      technicalIndicators: 'Технические индикаторы',
      signalInterface: 'Сигналы Покупка / Продажа',
      historyTitle: 'История AI-анализа',
      providerUnavailableTitle: 'AI-провайдер не подключен',
      providerUnavailableBody:
        'OXINVO не генерирует фиктивные сигналы. После подключения внешнего AI-провайдера на сервере здесь появится реальный анализ.',
      emptyHistory: 'Записей AI-анализа пока нет.',
    },
    riskPage: {
      title: 'Риск-менеджмент',
      subtitle: 'Настройте защитные лимиты на сделку и дневную просадку.',
      profileLabel: 'Профиль риска',
      stopLossLabel: 'Базовый Stop Loss',
      takeProfitLabel: 'Базовый Take Profit',
      maxDailyLossLabel: 'Макс. дневной убыток',
      tradeSizeLabel: 'Базовый объем сделки ($)',
      guardrailsTitle: 'Активные защитные правила',
      guardrails: [
        'Режим Real Trading заблокирован глобальной защитой.',
        'API-ключи с правами вывода средств отклоняются.',
        'Новые входы останавливаются при достижении дневного лимита убытка.',
      ],
      saveRisk: 'Сохранить риск-профиль',
    },
    affiliatePage: {
      title: 'Партнерская программа',
      subtitle: 'Реферальный код и прозрачный статус модуля.',
      referralCode: 'Ваш реферальный код',
      totalReferrals: 'Всего приглашено',
      activeReferrals: 'Активные пользователи',
      totalCommission: 'Общая комиссия',
      statusLabel: 'Статус модуля',
      pendingTitle: 'Модуль начислений ожидает запуска',
      pendingBody: 'Платежный и реферальный сервисы еще не активированы. Вымышленные суммы не отображаются.',
    },
    supportPage: {
      title: 'Центр поддержки',
      subtitle: 'Отправьте запрос команде платформы и отслеживайте статус.',
      newTicketTitle: 'Новое обращение',
      subjectLabel: 'Тема',
      categoryLabel: 'Категория',
      categories: { general: 'Общие', technical: 'Технические', security: 'Безопасность', account: 'Аккаунт' },
      messageLabel: 'Описание',
      submitTicket: 'Отправить запрос',
      ticketSubmitted: 'Обращение зарегистрировано.',
      ticketsListTitle: 'Мои обращения',
      noTickets: 'Обращений пока нет.',
      statuses: { OPEN: 'Открыто', IN_REVIEW: 'На рассмотрении', RESOLVED: 'Решено' },
    },
    adminExtra: {
      riskTitle: 'Мониторинг рисков пользователей',
      binanceTitle: 'Статусы подключений Binance',
      affiliateTitle: 'Управление партнерской системой',
      supportTitle: 'Заявки в поддержку',
      securityTitle: 'Настройки безопасности',
      updateStatus: 'Обновить статус',
      paperLocked: 'Режим PAPER принудительно · Real отключен',
      noTickets: 'Заявок в поддержку нет.',
      contactSettingsTitle: 'Публичные каналы связи',
      whatsappUrlLabel: 'Официальная HTTPS-ссылка WhatsApp',
      telegramUrlLabel: 'Официальная HTTPS-ссылка Telegram',
      supportEmailLabel: 'Официальный Email поддержки',
    },
    theme: {
      lightLabel: 'Светлая тема',
      darkLabel: 'Темная тема',
      toggleLabel: 'Переключить светлую/темную тему',
    },
    engineVisual: {
      title: 'OXINVO Trading Intelligence Engine',
      demoBadge: 'Демо-визуализация',
      scannerLabel: 'Market Scanner',
      scannerMeta: 'Спотовые пары · Объем и ликвидность',
      riskLabel: 'Risk Management',
      riskMeta: 'Stop-Loss · Take-Profit · Дневной лимит',
      aiFlowLabel: 'Поток AI-анализа',
      decisionLabel: 'Механизм решений',
      subline: 'Архитектурная демонстрация многоэтапного сканера рынка, ML-оценки и контура риск-контроля.',
      decisions: { long: 'LONG', short: 'SHORT', hold: 'HOLD' },
    },
    pipeline: {
      eyebrow: 'АРХИТЕКТУРА ДВИЖКА',
      title: 'Шестиступенчатый конвейер торгового интеллекта',
      subtitle: 'Каждая оценка последовательно проходит от биржевой телеметрии до строгих фильтров риска.',
      steps: [
        { title: 'Market Data', detail: 'Потоки OHLC, объемы и глубина книги ордеров' },
        { title: 'Market Scanner', detail: 'Фильтрация ликвидности, пробоев и аномалий объема' },
        { title: 'Technical Analysis', detail: 'Свечная структура, линии EMA и импульс тренда' },
        { title: 'Machine Learning', detail: 'Многофакторный контекст и оценка вероятностей' },
        { title: 'Risk Management', detail: 'Размер позиции, Stop-Loss и дневной лимит просадки' },
        { title: 'Trading Decision', detail: 'Передача решения LONG / SHORT / HOLD в контур исполнения' },
      ],
    },
    chart: {
      candlestickTitle: 'Свечной график (OHLC)',
      awaitingTitle: 'Ожидание данных биржи',
      awaitingBody: 'Реальные свечи OHLC отображаются только после подключения Binance API. Вымышленные балансы и прибыль не формируются.',
      openLabel: 'Открытие',
      highLabel: 'Макс.',
      lowLabel: 'Мин.',
      closeLabel: 'Закрытие',
      volumeLabel: 'Объем',
      previewToggle: 'Предпросмотр структуры (Демо)',
      connectCta: 'Перейти к подключениям',
    },
  },
};

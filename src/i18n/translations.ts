import { BotStatus, LanguageCode, SubscriptionPlan, TradingDecision, UserStatus } from '../types';

export interface TranslationDictionary {
  tagline: string;
  demoTag: string;
  auth: {
    title: string;
    subtitle: string;
    username: string;
    password: string;
    rememberMe: string;
    signIn: string;
    signingIn: string;
    contactAdmin: string;
    adminTitle: string;
    adminBody: string;
    telegramDesk: string;
    close: string;
    heroTitle: string;
    heroSubtitle: string;
    invalidError: string;
    inactiveError: string;
  };
  nav: {
    overview: string;
    aiBot: string;
    markets: string;
    trades: string;
    portfolio: string;
    analytics: string;
    connections: string;
    settings: string;
    notifications: string;
    help: string;
    adminPanel: string;
    logout: string;
    collapse: string;
    expand: string;
    profile: string;
  };
  adminNav: {
    overview: string;
    users: string;
    activity: string;
    analytics: string;
    subscriptions: string;
    aiProviders: string;
    systemHealth: string;
    notifications: string;
    auditLogs: string;
    settings: string;
    backToUser: string;
    adminBadge: string;
  };
  overview: {
    title: string;
    totalBalance: string;
    totalProfit: string;
    todayProfit: string;
    activeTrades: string;
    portfolioChart: string;
    recentTrades: string;
    detectedOpportunities: string;
    viewAll: string;
    score: string;
  };
  aiBot: {
    title: string;
    status: string;
    running: string;
    paused: string;
    stopped: string;
    start: string;
    pause: string;
    stop: string;
    assetsScanned: string;
    opportunitiesDetected: string;
    activeTrades: string;
    todayPnl: string;
    activityFeed: string;
    advancedSettings: string;
    advancedTitle: string;
    strategyLabel: string;
    strategies: {
      adaptive: string;
      breakout: string;
      reversion: string;
      impulse: string;
    };
    recentSignals: string;
    decision: string;
    riskNote: string;
  };
  markets: {
    title: string;
    searchPlaceholder: string;
    categories: {
      all: string;
      trending: string;
      newlyListed: string;
      highVolume: string;
      unusualVolume: string;
      highMomentum: string;
      highVolatility: string;
      potentialBreakout: string;
      aiOpportunities: string;
    };
    asset: string;
    price: string;
    change24h: string;
    volume24h: string;
    score: string;
    signal: string;
    details: string;
    liquidity: string;
    momentum: string;
    imbalance: string;
    news: string;
    social: string;
    aiSummary: string;
    empty: string;
  };
  trades: {
    title: string;
    activeTab: string;
    historyTab: string;
    pair: string;
    entry: string;
    current: string;
    exit: string;
    amount: string;
    pnl: string;
    duration: string;
    strategy: string;
    status: string;
    dateFilter: string;
    allPairs: string;
    allResults: string;
    winsOnly: string;
    lossesOnly: string;
    openReason: string;
    closeReason: string;
    fees: string;
    quantity: string;
    openedAt: string;
    closedAt: string;
    tradeDetails: string;
    empty: string;
    activeCount: string;
    winRate: string;
    netPnl: string;
  };
  portfolio: {
    title: string;
    totalValue: string;
    availableCash: string;
    inTrades: string;
    allocation: string;
    holdings: string;
    asset: string;
    balance: string;
    valueUsd: string;
    share: string;
  };
  analytics: {
    title: string;
    winRate: string;
    profitFactor: string;
    avgDuration: string;
    totalTrades: string;
    pnlByDay: string;
    strategyBreakdown: string;
    tradesCount: string;
    netReturn: string;
  };
  connections: {
    title: string;
    binanceTab: string;
    telegramTab: string;
    binanceTitle: string;
    telegramTitle: string;
    connected: string;
    notConnected: string;
    apiKey: string;
    apiSecret: string;
    testConnection: string;
    saveKeys: string;
    disconnect: string;
    disconnectTitle: string;
    disconnectBody: string;
    permissionsCheck: string;
    spotEnabled: string;
    readEnabled: string;
    withdrawalsDisabled: string;
    spotBalances: string;
    lastSync: string;
    connectSteps: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    telegramBot: string;
    yourHandle: string;
    linkCode: string;
    copyCode: string;
    newCode: string;
    sendTest: string;
    unlink: string;
    expiresIn: string;
    alertsTitle: string;
    alerts: {
      buyExecuted: string;
      sellExecuted: string;
      profitNotification: string;
      lossNotification: string;
      balanceUpdate: string;
      aiOpportunityDetected: string;
      botStarted: string;
      botStopped: string;
      connectionErrors: string;
      dailyTradingSummary: string;
    };
  };
  account: {
    settingsTitle: string;
    notificationsTitle: string;
    helpTitle: string;
    language: string;
    defaultStrategy: string;
    maxAllocation: string;
    stopLossLimit: string;
    saveChanges: string;
    markAllRead: string;
    all: string;
    unread: string;
    noNotifications: string;
    accountSummary: string;
    plan: string;
    expires: string;
    faqTitle: string;
    faq1Q: string;
    faq1A: string;
    faq2Q: string;
    faq2A: string;
    faq3Q: string;
    faq3A: string;
    contactSupport: string;
  };
  admin: {
    overviewTitle: string;
    totalUsers: string;
    activeUsers: string;
    runningBots: string;
    volume24h: string;
    recentActions: string;
    usersTitle: string;
    createUser: string;
    searchUsers: string;
    allPlans: string;
    allStatuses: string;
    user: string;
    plan: string;
    status: string;
    expires: string;
    balance: string;
    pnl: string;
    actions: string;
    viewUser: string;
    resetPassword: string;
    suspend: string;
    activate: string;
    delete: string;
    deleteConfirm: string;
    createUserModal: {
      title: string;
      username: string;
      fullName: string;
      plan: string;
      expiresAt: string;
      notes: string;
      generatedPassword: string;
      regenerate: string;
      copy: string;
      create: string;
      passwordNote: string;
    };
    userDetail: {
      back: string;
      editPlan: string;
      saveUser: string;
      botControl: string;
      connections: string;
      binance: string;
      telegram: string;
      userTrades: string;
      newTempPassword: string;
    };
    activityTitle: string;
    analyticsTitle: string;
    subscriptionsTitle: string;
    maxBots: string;
    maxPairs: string;
    aiAccess: string;
    aiProvidersTitle: string;
    model: string;
    requests24h: string;
    latency: string;
    estCost: string;
    healthTitle: string;
    cpu: string;
    memory: string;
    uptime: string;
    wsStreams: string;
    queue: string;
    database: string;
    worker: string;
    notificationsTitle: string;
    broadcastTitle: string;
    messageTitle: string;
    messageBody: string;
    sendBroadcast: string;
    auditTitle: string;
    actor: string;
    action: string;
    target: string;
    ip: string;
    settingsTitle: string;
    maintenanceMode: string;
    allowTrialSignups: string;
    enforceWithdrawalCheck: string;
    defaultLatencyCap: string;
  };
  statusLabels: {
    active: string;
    suspended: string;
    expired: string;
    running: string;
    paused: string;
    stopped: string;
    closed: string;
    buy: string;
    wait: string;
    sell: string;
    online: string;
    standby: string;
    degraded: string;
    healthy: string;
    trial: string;
    standard: string;
    professional: string;
    custom: string;
  };
  common: {
    save: string;
    cancel: string;
    confirm: string;
    close: string;
    clear: string;
    view: string;
    edit: string;
    page: string;
    copied: string;
    updated: string;
    noData: string;
    justNow: string;
  };
  demoActivity: Record<string, { title: string; detail: string; timestamp: string }>;
  demoNotifications: Record<string, { title: string; message: string; timestamp: string }>;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    tagline: 'Intelligence Behind Every Trade',
    demoTag: 'Demo',
    auth: {
      title: 'Welcome back',
      subtitle: 'Sign in to your OXINVO workspace',
      username: 'Username',
      password: 'Password',
      rememberMe: 'Remember me',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      contactAdmin: 'Need access? Contact administrator',
      adminTitle: 'Request Platform Access',
      adminBody: 'OXINVO accounts are provisioned by your platform administrator with secure credentials and plan limits.',
      telegramDesk: 'Contact your platform administrator.',
      close: 'Close',
      heroTitle: 'Calm, intelligent spot trading.',
      heroSubtitle: 'Real-time market analysis and automated execution, simplified.',
      invalidError: 'Invalid username or password.',
      inactiveError: 'Your account is currently inactive. Contact an administrator.',
    },
    nav: {
      overview: 'Overview',
      aiBot: 'AI Bot',
      markets: 'Markets',
      trades: 'Trades',
      portfolio: 'Portfolio',
      analytics: 'Analytics',
      connections: 'Connections',
      settings: 'Settings',
      notifications: 'Notifications',
      help: 'Help',
      adminPanel: 'Admin Panel',
      logout: 'Log out',
      collapse: 'Collapse',
      expand: 'Expand',
      profile: 'Profile',
    },
    adminNav: {
      overview: 'Overview',
      users: 'Users',
      activity: 'Trading Activity',
      analytics: 'Analytics',
      subscriptions: 'Subscriptions',
      aiProviders: 'AI Providers',
      systemHealth: 'System Health',
      notifications: 'Notifications',
      auditLogs: 'Audit Logs',
      settings: 'Settings',
      backToUser: 'Back to App',
      adminBadge: 'Admin',
    },
    overview: {
      title: 'Overview',
      totalBalance: 'Total Balance',
      totalProfit: 'Total Profit',
      todayProfit: "Today's Profit",
      activeTrades: 'Active Trades',
      portfolioChart: 'Portfolio Performance',
      recentTrades: 'Recent Trades',
      detectedOpportunities: 'Detected Opportunities',
      viewAll: 'View all',
      score: 'Score',
    },
    aiBot: {
      title: 'AI Bot',
      status: 'Status',
      running: 'Running',
      paused: 'Paused',
      stopped: 'Stopped',
      start: 'Start',
      pause: 'Pause',
      stop: 'Stop',
      assetsScanned: 'Assets Scanned',
      opportunitiesDetected: 'Opportunities',
      activeTrades: 'Active Trades',
      todayPnl: "Today's P&L",
      activityFeed: 'Live Activity',
      advancedSettings: 'Advanced Settings',
      advancedTitle: 'Advanced Bot Settings',
      strategyLabel: 'Trading Strategy',
      strategies: {
        adaptive: 'Adaptive Momentum',
        breakout: 'Breakout Volume Surge',
        reversion: 'Mean Reversion',
        impulse: 'Liquidity Impulse',
      },
      recentSignals: 'Recent AI Signals',
      decision: 'Decision',
      riskNote: 'Risk Evaluation',
    },
    markets: {
      title: 'Markets',
      searchPlaceholder: 'Search pair or asset...',
      categories: {
        all: 'All',
        trending: 'Trending',
        newlyListed: 'New',
        highVolume: 'High Volume',
        unusualVolume: 'Volume Spike',
        highMomentum: 'Momentum',
        highVolatility: 'Volatile',
        potentialBreakout: 'Breakout',
        aiOpportunities: 'AI Picks',
      },
      asset: 'Asset',
      price: 'Price',
      change24h: '24h',
      volume24h: 'Volume',
      score: 'Score',
      signal: 'Signal',
      details: 'Market Details',
      liquidity: 'Liquidity',
      momentum: 'Momentum',
      imbalance: 'Order Flow',
      news: 'News',
      social: 'Social',
      aiSummary: 'AI Summary',
      empty: 'No matching assets found.',
    },
    trades: {
      title: 'Trades',
      activeTab: 'Active',
      historyTab: 'History',
      pair: 'Pair',
      entry: 'Entry',
      current: 'Current',
      exit: 'Exit',
      amount: 'Amount',
      pnl: 'Profit / Loss',
      duration: 'Duration',
      strategy: 'Strategy',
      status: 'Status',
      dateFilter: 'Date',
      allPairs: 'All pairs',
      allResults: 'All results',
      winsOnly: 'Profitable',
      lossesOnly: 'Losses',
      openReason: 'Entry Reason',
      closeReason: 'Exit Reason',
      fees: 'Fees',
      quantity: 'Quantity',
      openedAt: 'Opened',
      closedAt: 'Closed',
      tradeDetails: 'Trade Details',
      empty: 'No trades match these filters.',
      activeCount: 'Open Positions',
      winRate: 'Win Rate',
      netPnl: 'Net Profit',
    },
    portfolio: {
      title: 'Portfolio',
      totalValue: 'Total Value',
      availableCash: 'Available USDT',
      inTrades: 'In Active Trades',
      allocation: 'Allocation',
      holdings: 'Spot Balances',
      asset: 'Asset',
      balance: 'Balance',
      valueUsd: 'Value',
      share: 'Share',
    },
    analytics: {
      title: 'Analytics',
      winRate: 'Win Rate',
      profitFactor: 'Profit Factor',
      avgDuration: 'Avg. Duration',
      totalTrades: 'Total Trades',
      pnlByDay: 'Daily Profit & Loss',
      strategyBreakdown: 'By Strategy',
      tradesCount: 'Trades',
      netReturn: 'Net Return',
    },
    connections: {
      title: 'Connections',
      binanceTab: 'Binance',
      telegramTab: 'Telegram',
      binanceTitle: 'Binance Spot Account',
      telegramTitle: 'Telegram Alerts',
      connected: 'Connected',
      notConnected: 'Disconnected',
      apiKey: 'API Key',
      apiSecret: 'API Secret',
      testConnection: 'Test Connection',
      saveKeys: 'Connect Account',
      disconnect: 'Disconnect',
      disconnectTitle: 'Disconnect Binance?',
      disconnectBody: 'Pause automated spot monitoring until you reconnect your API keys.',
      permissionsCheck: 'Security Checks',
      spotEnabled: 'Spot Trading Enabled',
      readEnabled: 'Read Balance Enabled',
      withdrawalsDisabled: 'Withdrawals Disabled',
      spotBalances: 'Synced Balances',
      lastSync: 'Last sync',
      connectSteps: 'Quick Setup Guide',
      step1: 'Open API Management in Binance',
      step2: 'Create a new System-Generated API key',
      step3: 'Enable Read & Spot Trading only',
      step4: 'Keep Withdrawals strictly disabled',
      step5: 'Paste keys here and test connection',
      telegramBot: 'Bot Handle',
      yourHandle: 'Linked Account',
      linkCode: 'One-Time Link Code',
      copyCode: 'Copy Code',
      newCode: 'New Code',
      sendTest: 'Send Test Alert',
      unlink: 'Unlink',
      expiresIn: 'Expires in',
      alertsTitle: 'Alert Preferences',
      alerts: {
        buyExecuted: 'Buy Executed',
        sellExecuted: 'Sell Executed',
        profitNotification: 'Profit Closed',
        lossNotification: 'Loss Closed',
        balanceUpdate: 'Balance Updates',
        aiOpportunityDetected: 'AI Opportunities',
        botStarted: 'Bot Started',
        botStopped: 'Bot Stopped',
        connectionErrors: 'Connection Alerts',
        dailyTradingSummary: 'Daily Summary',
      },
    },
    account: {
      settingsTitle: 'Settings',
      notificationsTitle: 'Notifications',
      helpTitle: 'Help & Guide',
      language: 'Language',
      defaultStrategy: 'Default Strategy',
      maxAllocation: 'Max Allocation per Trade',
      stopLossLimit: 'Stop-Loss Guard',
      saveChanges: 'Save Changes',
      markAllRead: 'Mark all read',
      all: 'All',
      unread: 'Unread',
      noNotifications: 'No notifications yet.',
      accountSummary: 'Account',
      plan: 'Plan',
      expires: 'Valid Until',
      faqTitle: 'Frequently Asked Questions',
      faq1Q: 'Does OXINVO require withdrawal access on Binance?',
      faq1A: 'No. Only read-only balance and spot order permissions are ever used. Withdrawals must stay disabled.',
      faq2Q: 'Are live trades executed in this preview?',
      faq2A: 'No. Trading execution is not implemented. Account data comes from the server; exchange data is not connected.',
      faq3Q: 'How do I receive instant alerts on Telegram?',
      faq3A: 'Telegram integration is not available yet.',
      contactSupport: 'Contact your administrator for support.',
    },
    admin: {
      overviewTitle: 'Platform Overview',
      totalUsers: 'Total Users',
      activeUsers: 'Active Accounts',
      runningBots: 'Running Bots',
      volume24h: 'Trading Volume (24h)',
      recentActions: 'Recent Admin Activity',
      usersTitle: 'Users',
      createUser: 'New User',
      searchUsers: 'Search username or name...',
      allPlans: 'All plans',
      allStatuses: 'All statuses',
      user: 'User',
      plan: 'Plan',
      status: 'Status',
      expires: 'Expires',
      balance: 'Balance',
      pnl: 'Total P&L',
      actions: 'Actions',
      viewUser: 'Manage',
      resetPassword: 'Reset Password',
      suspend: 'Suspend',
      activate: 'Activate',
      delete: 'Delete',
      deleteConfirm: 'Remove this user account from the workspace?',
      createUserModal: {
        title: 'Create User Account',
        username: 'Username',
        fullName: 'Full Name',
        plan: 'Plan',
        expiresAt: 'Expiration Date',
        notes: 'Notes',
        generatedPassword: 'Generated Password',
        regenerate: 'Regenerate',
        copy: 'Copy',
        create: 'Create Account',
        passwordNote: 'Share this password securely with the user on first login.',
      },
      userDetail: {
        back: 'Back to Users',
        editPlan: 'Subscription & Access',
        saveUser: 'Save Changes',
        botControl: 'Bot Control',
        connections: 'Integrations',
        binance: 'Binance',
        telegram: 'Telegram',
        userTrades: 'Recent User Trades',
        newTempPassword: 'New Password Issued',
      },
      activityTitle: 'Platform Trading Activity',
      analyticsTitle: 'Platform Analytics',
      subscriptionsTitle: 'Subscription Plans',
      maxBots: 'Max Bots',
      maxPairs: 'Max Pairs',
      aiAccess: 'AI Access',
      aiProvidersTitle: 'AI Providers',
      model: 'Model',
      requests24h: 'Requests (24h)',
      latency: 'Latency',
      estCost: 'Est. Cost',
      healthTitle: 'System Health',
      cpu: 'CPU Load',
      memory: 'Memory',
      uptime: 'Uptime',
      wsStreams: 'Live Streams',
      queue: 'AI Queue',
      database: 'Database',
      worker: 'Worker',
      notificationsTitle: 'Broadcast Alerts',
      broadcastTitle: 'Send Platform Notice',
      messageTitle: 'Title',
      messageBody: 'Message',
      sendBroadcast: 'Send Broadcast',
      auditTitle: 'Audit Logs',
      actor: 'Actor',
      action: 'Action',
      target: 'Target',
      ip: 'IP Address',
      settingsTitle: 'System Settings',
      maintenanceMode: 'Maintenance Mode',
      allowTrialSignups: 'Allow Trial Accounts',
      enforceWithdrawalCheck: 'Require Disabled Withdrawals',
      defaultLatencyCap: 'Max Data Latency (ms)',
    },
    statusLabels: {
      active: 'Active',
      suspended: 'Suspended',
      expired: 'Expired',
      running: 'Running',
      paused: 'Paused',
      stopped: 'Stopped',
      closed: 'Closed',
      buy: 'BUY',
      wait: 'WAIT',
      sell: 'SELL',
      online: 'Online',
      standby: 'Standby',
      degraded: 'Degraded',
      healthy: 'Healthy',
      trial: 'Trial',
      standard: 'Standard',
      professional: 'Professional',
      custom: 'Custom',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      clear: 'Clear',
      view: 'View',
      edit: 'Edit',
      page: 'Page',
      copied: 'Copied',
      updated: 'Updated',
      noData: 'No data available',
      justNow: 'Just now',
    },
    demoActivity: {
      'act-1': {
        title: 'AI Opportunity Detected · ENA/USDT',
        detail: 'Score 88 · +215% volume surge with positive sentiment.',
        timestamp: '2m ago',
      },
      'act-2': {
        title: 'Telegram Alert Sent',
        detail: 'Notification delivered for SOL/USDT (+2.2%).',
        timestamp: '14m ago',
      },
      'act-3': {
        title: 'Position Opened · ENA/USDT',
        detail: 'Entry $0.728 · $950.00 · Liquidity Impulse.',
        timestamp: '1h ago',
      },
      'act-4': {
        title: 'Binance Spot Synced',
        detail: 'Read & Spot permissions verified. Withdrawals disabled.',
        timestamp: '3h ago',
      },
      'act-5': {
        title: 'Position Closed · TAO/USDT',
        detail: 'Realized +$121.85 (+5.80%) via Adaptive Momentum.',
        timestamp: '8h ago',
      },
    },
    demoNotifications: {
      'ntf-1': {
        title: 'Position Opened: ENA/USDT',
        message: 'Liquidity Impulse opened a $950.00 spot entry at $0.7280.',
        timestamp: '10:30 UTC',
      },
      'ntf-2': {
        title: 'High Alignment Signal: PENDLE/USDT',
        message: 'Volume spike reached +172% with bullish context (Score 86).',
        timestamp: '09:48 UTC',
      },
      'ntf-3': {
        title: 'Binance Security Audit Passed',
        message: 'Confirmed withdrawal permissions remain disabled.',
        timestamp: '08:00 UTC',
      },
      'ntf-4': {
        title: 'Daily Summary Ready',
        message: 'Net 24h simulated P&L: +$217.15 across 5 positions.',
        timestamp: 'Yesterday',
      },
    },
  },
  az: {
    tagline: 'Hər Əməliyyatın Arxasındakı Zəka',
    demoTag: 'Demo',
    auth: {
      title: 'Xoş gəldiniz',
      subtitle: 'OXINVO hesabınıza daxil olun',
      username: 'İstifadəçi adı',
      password: 'Şifrə',
      rememberMe: 'Məni xatırla',
      signIn: 'Daxil ol',
      signingIn: 'Daxil olunur...',
      contactAdmin: 'Giriş lazımdır? Administratorla əlaqə saxlayın',
      adminTitle: 'Platformaya Giriş Tələbi',
      adminBody: 'OXINVO hesabları administrator tərəfindən təhlükəsiz şifrə və paket limitləri ilə yaradılır.',
      telegramDesk: 'Platforma administratorunuzla əlaqə saxlayın.',
      close: 'Bağla',
      heroTitle: 'Sadə və ağıllı spot ticarət.',
      heroSubtitle: 'Real vaxt bazar analizi və avtomatlaşdırılmış icra, sadə interfeysdə.',
      invalidError: 'İstifadəçi adı və ya şifrə yanlışdır.',
      inactiveError: 'Hesabınız aktiv deyil. Administratorla əlaqə saxlayın.',
    },
    nav: {
      overview: 'İcmal',
      aiBot: 'AI Bot',
      markets: 'Bazarlar',
      trades: 'Əməliyyatlar',
      portfolio: 'Portfel',
      analytics: 'Analitika',
      connections: 'Bağlantılar',
      settings: 'Ayarlar',
      notifications: 'Bildirişlər',
      help: 'Kömək',
      adminPanel: 'Admin Paneli',
      logout: 'Çıxış',
      collapse: 'Yığ',
      expand: 'Genişləndir',
      profile: 'Profil',
    },
    adminNav: {
      overview: 'İcmal',
      users: 'İstifadəçilər',
      activity: 'Ticarət Fəaliyyəti',
      analytics: 'Analitika',
      subscriptions: 'Abunəliklər',
      aiProviders: 'AI Provayderlər',
      systemHealth: 'Sistem Sağlamlığı',
      notifications: 'Bildirişlər',
      auditLogs: 'Audit Jurnalı',
      settings: 'Ayarlar',
      backToUser: 'Tətbiqə qayıt',
      adminBadge: 'Admin',
    },
    overview: {
      title: 'İcmal',
      totalBalance: 'Ümumi Balans',
      totalProfit: 'Ümumi Mənfəət',
      todayProfit: 'Bugünkü Mənfəət',
      activeTrades: 'Aktiv Əməliyyatlar',
      portfolioChart: 'Portfel Dinamikası',
      recentTrades: 'Son Əməliyyatlar',
      detectedOpportunities: 'Aşkarlanan Fürsətlər',
      viewAll: 'Hamısı',
      score: 'Bal',
    },
    aiBot: {
      title: 'AI Bot',
      status: 'Status',
      running: 'İşləyir',
      paused: 'Fasilədədir',
      stopped: 'Dayandırılıb',
      start: 'Başlat',
      pause: 'Fasilə',
      stop: 'Dayandır',
      assetsScanned: 'Skan Edilən Aktivlər',
      opportunitiesDetected: 'Fürsətlər',
      activeTrades: 'Aktiv Əməliyyatlar',
      todayPnl: 'Bugünkü Nəticə',
      activityFeed: 'Canlı Fəaliyyət',
      advancedSettings: 'Ətraflı Ayarlar',
      advancedTitle: 'Ətraflı Bot Ayarları',
      strategyLabel: 'Ticarət Strategiyası',
      strategies: {
        adaptive: 'Adaptiv Momentum',
        breakout: 'Həcm Qırılması',
        reversion: 'Ortalamaya Qayıdış',
        impulse: 'Likvidlik İmpulsu',
      },
      recentSignals: 'Son AI Siqnalları',
      decision: 'Qərar',
      riskNote: 'Risk Qiymətləndirməsi',
    },
    markets: {
      title: 'Bazarlar',
      searchPlaceholder: 'Cütlük və ya aktiv axtar...',
      categories: {
        all: 'Hamısı',
        trending: 'Trend',
        newlyListed: 'Yeni',
        highVolume: 'Yüksək Həcm',
        unusualVolume: 'Həcm Sıçrayışı',
        highMomentum: 'Momentum',
        highVolatility: 'Volatil',
        potentialBreakout: 'Qırılma',
        aiOpportunities: 'AI Seçimləri',
      },
      asset: 'Aktiv',
      price: 'Qiymət',
      change24h: '24s',
      volume24h: 'Həcm',
      score: 'Bal',
      signal: 'Siqnal',
      details: 'Bazar Təfərrüatları',
      liquidity: 'Likvidlik',
      momentum: 'Momentum',
      imbalance: 'Sifariş Axını',
      news: 'Xəbərlər',
      social: 'Sosial',
      aiSummary: 'AI Xülasəsi',
      empty: 'Uyğun aktiv tapılmadı.',
    },
    trades: {
      title: 'Əməliyyatlar',
      activeTab: 'Aktiv',
      historyTab: 'Tarixçə',
      pair: 'Cütlük',
      entry: 'Giriş',
      current: 'Cari',
      exit: 'Çıxış',
      amount: 'Məbləğ',
      pnl: 'Mənfəət / Zərər',
      duration: 'Müddət',
      strategy: 'Strategiya',
      status: 'Status',
      dateFilter: 'Tarix',
      allPairs: 'Bütün cütlüklər',
      allResults: 'Bütün nəticələr',
      winsOnly: 'Mənfəətli',
      lossesOnly: 'Zərərli',
      openReason: 'Giriş Səbəbi',
      closeReason: 'Çıxış Səbəbi',
      fees: 'Komissiya',
      quantity: 'Miqdar',
      openedAt: 'Açılıb',
      closedAt: 'Bağlanıb',
      tradeDetails: 'Əməliyyat Təfərrüatı',
      empty: 'Bu filtrə uyğun əməliyyat yoxdur.',
      activeCount: 'Açıq Mövqelər',
      winRate: 'Uğur Faizi',
      netPnl: 'Xalis Mənfəət',
    },
    portfolio: {
      title: 'Portfel',
      totalValue: 'Ümumi Dəyər',
      availableCash: 'Mövcud USDT',
      inTrades: 'Aktiv Əməliyyatlarda',
      allocation: 'Bölgü',
      holdings: 'Spot Balanslar',
      asset: 'Aktiv',
      balance: 'Balans',
      valueUsd: 'Dəyər',
      share: 'Pay',
    },
    analytics: {
      title: 'Analitika',
      winRate: 'Uğur Faizi',
      profitFactor: 'Mənfəət Əmsalı',
      avgDuration: 'Orta Müddət',
      totalTrades: 'Ümumi Əməliyyat',
      pnlByDay: 'Günlük Mənfəət və Zərər',
      strategyBreakdown: 'Strategiyaya Görə',
      tradesCount: 'Əməliyyat',
      netReturn: 'Xalis Gəlir',
    },
    connections: {
      title: 'Bağlantılar',
      binanceTab: 'Binance',
      telegramTab: 'Telegram',
      binanceTitle: 'Binance Spot Hesabı',
      telegramTitle: 'Telegram Bildirişləri',
      connected: 'Qoşulub',
      notConnected: 'Qoşulmayıb',
      apiKey: 'API Açarı',
      apiSecret: 'Məxfi Açar',
      testConnection: 'Bağlantını Yoxla',
      saveKeys: 'Hesabı Qoş',
      disconnect: 'Ayır',
      disconnectTitle: 'Binance ayrılsın?',
      disconnectBody: 'API açarlarınızı yenidən qoşana qədər avtomatik spot izləmə dayandırılacaq.',
      permissionsCheck: 'Təhlükəsizlik Yoxlaması',
      spotEnabled: 'Spot Ticarət Aktivdir',
      readEnabled: 'Balans Oxuma Aktivdir',
      withdrawalsDisabled: 'Çıxarış Deaktivdir',
      spotBalances: 'Balanslar',
      lastSync: 'Son sinxronizasiya',
      connectSteps: 'Qısa Quraşdırma Bələdçisi',
      step1: 'Binance hesabında API İdarəetməsini açın',
      step2: 'Yeni sistem tərəfindən yaradılan API açarı yaradın',
      step3: 'Yalnız Oxuma və Spot Ticarət icazələrini seçin',
      step4: 'Vəsait çıxarışı icazəsini bağlı saxlayın',
      step5: 'Açarları daxil edin və bağlantını yoxlayın',
      telegramBot: 'Bot Ünvanı',
      yourHandle: 'Qoşulmuş Hesab',
      linkCode: 'Birdəfəlik Bağlantı Kodu',
      copyCode: 'Kodu Kopyala',
      newCode: 'Yeni Kod',
      sendTest: 'Test Bildirişi Göndər',
      unlink: 'Bağlantını Kəs',
      expiresIn: 'Bitmə vaxtı',
      alertsTitle: 'Bildiriş Seçimləri',
      alerts: {
        buyExecuted: 'Alış İcra Edildi',
        sellExecuted: 'Satış İcra Edildi',
        profitNotification: 'Mənfəət Bildirişi',
        lossNotification: 'Zərər Bildirişi',
        balanceUpdate: 'Balans Yeniləməsi',
        aiOpportunityDetected: 'AI Fürsətləri',
        botStarted: 'Bot Başladıldı',
        botStopped: 'Bot Dayandırıldı',
        connectionErrors: 'Bağlantı Xəbərdarlıqları',
        dailyTradingSummary: 'Günlük Xülasə',
      },
    },
    account: {
      settingsTitle: 'Ayarlar',
      notificationsTitle: 'Bildirişlər',
      helpTitle: 'Kömək və Bələdçi',
      language: 'Dil',
      defaultStrategy: 'Əsas Strategiya',
      maxAllocation: 'Əməliyyat Üzrə Maksimum Pay',
      stopLossLimit: 'Zərər Dayandırma Limiti',
      saveChanges: 'Yadda Saxla',
      markAllRead: 'Hamısını oxunmuş et',
      all: 'Hamısı',
      unread: 'Oxunmamış',
      noNotifications: 'Hələ bildiriş yoxdur.',
      accountSummary: 'Hesab',
      plan: 'Paket',
      expires: 'Bitmə Tarixi',
      faqTitle: 'Tez-tez Verilən Suallar',
      faq1Q: 'OXINVO Binance hesabından pul çıxarma icazəsi tələb edirmi?',
      faq1A: 'Xeyr. Yalnız balans oxuma və spot əməliyyat icazələri istifadə olunur. Çıxarış icazəsi bağlı qalmalıdır.',
      faq2Q: 'Bu önizləmədə real ticarət icra olunurmu?',
      faq2A: 'Xeyr. Trading icrası hələ hazırlanmayıb. Hesab məlumatları serverdən gəlir; birja məlumatları qoşulmayıb.',
      faq3Q: 'Telegram bildirişlərini necə aktivləşdirə bilərəm?',
      faq3A: 'Telegram inteqrasiyası hələ aktiv deyil.',
      contactSupport: 'Dəstək üçün administratorunuzla əlaqə saxlayın.',
    },
    admin: {
      overviewTitle: 'Platforma İcmalı',
      totalUsers: 'Ümumi İstifadəçilər',
      activeUsers: 'Aktiv Hesablar',
      runningBots: 'İşləyən Botlar',
      volume24h: 'Ticarət həcmi (24s)',
      recentActions: 'Son Admin Fəaliyyəti',
      usersTitle: 'İstifadəçilər',
      createUser: 'Yeni İstifadəçi',
      searchUsers: 'Ad və ya istifadəçi adı axtar...',
      allPlans: 'Bütün paketlər',
      allStatuses: 'Bütün statuslar',
      user: 'İstifadəçi',
      plan: 'Paket',
      status: 'Status',
      expires: 'Bitmə',
      balance: 'Balans',
      pnl: 'Ümumi Mənfəət',
      actions: 'Əməliyyatlar',
      viewUser: 'İdarə et',
      resetPassword: 'Şifrəni Sıfırla',
      suspend: 'Dayandır',
      activate: 'Aktivləşdir',
      delete: 'Sil',
      deleteConfirm: 'Bu istifadəçi hesabı sistemdən silinsin?',
      createUserModal: {
        title: 'İstifadəçi Hesabı Yarat',
        username: 'İstifadəçi adı',
        fullName: 'Tam Ad',
        plan: 'Paket',
        expiresAt: 'Bitmə Tarixi',
        notes: 'Qeydlər',
        generatedPassword: 'Yaradılmış Şifrə',
        regenerate: 'Yenilə',
        copy: 'Kopyala',
        create: 'Hesab Yarat',
        passwordNote: 'Bu şifrəni ilk giriş üçün istifadəçiyə təhlükəsiz şəkildə ötürün.',
      },
      userDetail: {
        back: 'İstifadəçilərə qayıt',
        editPlan: 'Abunəlik və Giriş',
        saveUser: 'Dəyişiklikləri Saxla',
        botControl: 'Bot İdarəetməsi',
        connections: 'İnteqrasiyalar',
        binance: 'Binance',
        telegram: 'Telegram',
        userTrades: 'İstifadəçinin Son Əməliyyatları',
        newTempPassword: 'Yeni Şifrə Yaradıldı',
      },
      activityTitle: 'Platforma Ticarət Fəaliyyəti',
      analyticsTitle: 'Platforma Analitikası',
      subscriptionsTitle: 'Abunəlik Paketləri',
      maxBots: 'Maks. Bot',
      maxPairs: 'Maks. Cütlük',
      aiAccess: 'AI Girişi',
      aiProvidersTitle: 'AI Provayderləri',
      model: 'Model',
      requests24h: 'Sorğular (24s)',
      latency: 'Gecikmə',
      estCost: 'Təxmini Xərc',
      healthTitle: 'Sistem Sağlamlığı',
      cpu: 'CPU Yükü',
      memory: 'Yaddaş',
      uptime: 'İşləmə Müddəti',
      wsStreams: 'Canlı Axınlar',
      queue: 'AI Növbəsi',
      database: 'Verilənlər Bazası',
      worker: 'İşçi Xidməti',
      notificationsTitle: 'Kütləvi Bildirişlər',
      broadcastTitle: 'Platforma Bildirişi Göndər',
      messageTitle: 'Başlıq',
      messageBody: 'Mesaj',
      sendBroadcast: 'Göndər',
      auditTitle: 'Audit Jurnalı',
      actor: 'İcraçı',
      action: 'Əməliyyat',
      target: 'Hədəf',
      ip: 'IP Ünvanı',
      settingsTitle: 'Sistem Ayarları',
      maintenanceMode: 'Texniki Baxım Rejimi',
      allowTrialSignups: 'Sınaq Hesablarına İcazə',
      enforceWithdrawalCheck: 'Çıxarış Qadağasını Tələb Et',
      defaultLatencyCap: 'Maksimum Gecikmə (ms)',
    },
    statusLabels: {
      active: 'Aktiv',
      suspended: 'Dayandırılıb',
      expired: 'Müddəti bitib',
      running: 'İşləyir',
      paused: 'Fasilədədir',
      stopped: 'Dayandırılıb',
      closed: 'Bağlanıb',
      buy: 'AL',
      wait: 'GÖZLƏ',
      sell: 'SAT',
      online: 'Onlayn',
      standby: 'Gözləmədə',
      degraded: 'Zəifləyib',
      healthy: 'Sağlam',
      trial: 'Sınaq',
      standard: 'Standart',
      professional: 'Peşəkar',
      custom: 'Xüsusi',
    },
    common: {
      save: 'Yadda saxla',
      cancel: 'Ləğv et',
      confirm: 'Təsdiqlə',
      close: 'Bağla',
      clear: 'Təmizlə',
      view: 'Bax',
      edit: 'Düzəliş',
      page: 'Səhifə',
      copied: 'Kopyalandı',
      updated: 'Yeniləndi',
      noData: 'Məlumat yoxdur',
      justNow: 'İndi',
    },
    demoActivity: {
      'act-1': {
        title: 'AI Fürsəti Aşkarlandı · ENA/USDT',
        detail: 'Bal 88 · +215% həcm artımı və müsbət bazar əhvalı.',
        timestamp: '2 dəq əvvəl',
      },
      'act-2': {
        title: 'Telegram Bildirişi Göndərildi',
        detail: 'SOL/USDT (+2.2%) üzrə bildiriş çatdırıldı.',
        timestamp: '14 dəq əvvəl',
      },
      'act-3': {
        title: 'Mövqe Açıldı · ENA/USDT',
        detail: 'Giriş $0.728 · $950.00 · Likvidlik İmpulsu.',
        timestamp: '1 saat əvvəl',
      },
      'act-4': {
        title: 'Binance Spot Sinxronizasiya Edildi',
        detail: 'Oxuma və Spot icazələri təsdiqləndi. Çıxarış bağlıdır.',
        timestamp: '3 saat əvvəl',
      },
      'act-5': {
        title: 'Mövqe Bağlandı · TAO/USDT',
        detail: 'Adaptiv Momentum ilə +$121.85 (+5.80%) qazanc.',
        timestamp: '8 saat əvvəl',
      },
    },
    demoNotifications: {
      'ntf-1': {
        title: 'Mövqe Açıldı: ENA/USDT',
        message: 'Likvidlik İmpulsu $0.7280 qiymətindən $950.00 giriş açdı.',
        timestamp: '10:30 UTC',
      },
      'ntf-2': {
        title: 'Güclü Siqnal: PENDLE/USDT',
        message: 'Həcm +172% yüksəldi, müsbət kontekst (Bal 86).',
        timestamp: '09:48 UTC',
      },
      'ntf-3': {
        title: 'Binance Təhlükəsizlik Yoxlaması Uğurlu',
        message: 'Vəsait çıxarışı icazəsinin bağlı olduğu təsdiqləndi.',
        timestamp: '08:00 UTC',
      },
      'ntf-4': {
        title: 'Günlük Xülasə Hazırdır',
        message: 'Son 24s xalis nəticə: +$217.15 (5 əməliyyat üzrə).',
        timestamp: 'Dünən',
      },
    },
  },
  tr: {
    tagline: 'Her İşlemin Arkasındaki Zeka',
    demoTag: 'Demo',
    auth: {
      title: 'Tekrar hoş geldiniz',
      subtitle: 'OXINVO hesabınıza giriş yapın',
      username: 'Kullanıcı adı',
      password: 'Şifre',
      rememberMe: 'Beni hatırla',
      signIn: 'Giriş Yap',
      signingIn: 'Giriş yapılıyor...',
      contactAdmin: 'Erişim gerekiyor mu? Yöneticiyle iletişime geçin',
      adminTitle: 'Platform Erişimi Talep Et',
      adminBody: 'OXINVO hesapları yöneticiniz tarafından güvenli kimlik bilgileri ve paket limitleriyle tanımlanır.',
      telegramDesk: 'Platform yöneticinizle iletişime geçin.',
      close: 'Kapat',
      heroTitle: 'Sade ve akıllı spot işlemler.',
      heroSubtitle: 'Gerçek zamanlı piyasa analizi ve otomatik işlem yönetimi tek bir net arayüzde.',
      invalidError: 'Kullanıcı adı veya şifre hatalı.',
      inactiveError: 'Hesabınız şu anda aktif değil. Yönetici ile görüşün.',
    },
    nav: {
      overview: 'Genel Bakış',
      aiBot: 'AI Bot',
      markets: 'Piyasalar',
      trades: 'İşlemler',
      portfolio: 'Portföy',
      analytics: 'Analitik',
      connections: 'Bağlantılar',
      settings: 'Ayarlar',
      notifications: 'Bildirimler',
      help: 'Yardım',
      adminPanel: 'Yönetim Paneli',
      logout: 'Çıkış Yap',
      collapse: 'Daralt',
      expand: 'Genişlet',
      profile: 'Profil',
    },
    adminNav: {
      overview: 'Genel Bakış',
      users: 'Kullanıcılar',
      activity: 'İşlem Akışı',
      analytics: 'Analitik',
      subscriptions: 'Abonelikler',
      aiProviders: 'AI Sağlayıcıları',
      systemHealth: 'Sistem Sağlığı',
      notifications: 'Bildirimler',
      auditLogs: 'Denetim Kayıtları',
      settings: 'Ayarlar',
      backToUser: 'Uygulamaya Dön',
      adminBadge: 'Yönetici',
    },
    overview: {
      title: 'Genel Bakış',
      totalBalance: 'Toplam Bakiye',
      totalProfit: 'Toplam Kâr',
      todayProfit: 'Bugünkü Kâr',
      activeTrades: 'Aktif İşlemler',
      portfolioChart: 'Portföy Performansı',
      recentTrades: 'Son İşlemler',
      detectedOpportunities: 'Tespit Edilen Fırsatlar',
      viewAll: 'Tümünü gör',
      score: 'Puan',
    },
    aiBot: {
      title: 'AI Bot',
      status: 'Durum',
      running: 'Çalışıyor',
      paused: 'Duraklatıldı',
      stopped: 'Durduruldu',
      start: 'Başlat',
      pause: 'Duraklat',
      stop: 'Durdur',
      assetsScanned: 'Taranan Varlıklar',
      opportunitiesDetected: 'Fırsatlar',
      activeTrades: 'Aktif İşlemler',
      todayPnl: 'Bugünkü Kâr/Zarar',
      activityFeed: 'Canlı Akış',
      advancedSettings: 'Gelişmiş Ayarlar',
      advancedTitle: 'Gelişmiş Bot Ayarları',
      strategyLabel: 'İşlem Stratejisi',
      strategies: {
        adaptive: 'Uyarlanabilir Momentum',
        breakout: 'Hacim Kırılımı',
        reversion: 'Ortalamaya Dönüş',
        impulse: 'Likidite İmpulsu',
      },
      recentSignals: 'Son AI Sinyalleri',
      decision: 'Karar',
      riskNote: 'Risk Değerlendirmesi',
    },
    markets: {
      title: 'Piyasalar',
      searchPlaceholder: 'Çift veya varlık ara...',
      categories: {
        all: 'Tümü',
        trending: 'Trend',
        newlyListed: 'Yeni',
        highVolume: 'Yüksek Hacim',
        unusualVolume: 'Hacim Artışı',
        highMomentum: 'Momentum',
        highVolatility: 'Volatil',
        potentialBreakout: 'Kırılım',
        aiOpportunities: 'AI Seçimleri',
      },
      asset: 'Varlık',
      price: 'Fiyat',
      change24h: '24s',
      volume24h: 'Hacim',
      score: 'Puan',
      signal: 'Sinyal',
      details: 'Piyasa Detayları',
      liquidity: 'Likidite',
      momentum: 'Momentum',
      imbalance: 'Emir Akışı',
      news: 'Haberler',
      social: 'Sosyal',
      aiSummary: 'AI Özeti',
      empty: 'Eşleşen varlık bulunamadı.',
    },
    trades: {
      title: 'İşlemler',
      activeTab: 'Aktif',
      historyTab: 'Geçmiş',
      pair: 'Çift',
      entry: 'Giriş',
      current: 'Güncel',
      exit: 'Çıkış',
      amount: 'Tutar',
      pnl: 'Kâr / Zarar',
      duration: 'Süre',
      strategy: 'Strateji',
      status: 'Durum',
      dateFilter: 'Tarih',
      allPairs: 'Tüm çiftler',
      allResults: 'Tüm sonuçlar',
      winsOnly: 'Kârlı',
      lossesOnly: 'Zararlı',
      openReason: 'Giriş Nedeni',
      closeReason: 'Çıkış Nedeni',
      fees: 'Ücretler',
      quantity: 'Miktar',
      openedAt: 'Açılış',
      closedAt: 'Kapanış',
      tradeDetails: 'İşlem Detayları',
      empty: 'Bu filtrelere uygun işlem bulunamadı.',
      activeCount: 'Açık Pozisyonlar',
      winRate: 'Başarı Oranı',
      netPnl: 'Net Kâr',
    },
    portfolio: {
      title: 'Portföy',
      totalValue: 'Toplam Değer',
      availableCash: 'Kullanılabilir USDT',
      inTrades: 'Aktif İşlemlerde',
      allocation: 'Dağılım',
      holdings: 'Spot Bakiyeler',
      asset: 'Varlık',
      balance: 'Bakiye',
      valueUsd: 'Değer',
      share: 'Pay',
    },
    analytics: {
      title: 'Analitik',
      winRate: 'Başarı Oranı',
      profitFactor: 'Kâr Faktörü',
      avgDuration: 'Ort. Süre',
      totalTrades: 'Toplam İşlem',
      pnlByDay: 'Günlük Kâr ve Zarar',
      strategyBreakdown: 'Stratejiye Göre',
      tradesCount: 'İşlem',
      netReturn: 'Net Getiri',
    },
    connections: {
      title: 'Bağlantılar',
      binanceTab: 'Binance',
      telegramTab: 'Telegram',
      binanceTitle: 'Binance Spot Hesabı',
      telegramTitle: 'Telegram Bildirimleri',
      connected: 'Bağlı',
      notConnected: 'Bağlı Değil',
      apiKey: 'API Anahtarı',
      apiSecret: 'Gizli Anahtar',
      testConnection: 'Bağlantıyı Test Et',
      saveKeys: 'Hesabı Bağla',
      disconnect: 'Bağlantıyı Kes',
      disconnectTitle: 'Binance bağlantısı kesilsin mi?',
      disconnectBody: 'API anahtarlarınızı yeniden bağlayana kadar otomatik izleme duraklatılır.',
      permissionsCheck: 'Güvenlik Kontrolleri',
      spotEnabled: 'Spot İşlem Açık',
      readEnabled: 'Bakiye Okuma Açık',
      withdrawalsDisabled: 'Çekim Kapalı',
      spotBalances: 'Bakiyeler',
      lastSync: 'Son eşitleme',
      connectSteps: 'Hızlı Kurulum Rehberi',
      step1: 'Binance hesabında API Yönetimi sayfasını açın',
      step2: 'Sistem tarafından oluşturulan yeni bir API anahtarı oluşturun',
      step3: 'Yalnızca Okuma ve Spot İşlem izinlerini açın',
      step4: 'Para çekme iznini kesinlikle kapalı tutun',
      step5: 'Anahtarları buraya yapıştırıp bağlantıyı test edin',
      telegramBot: 'Bot Adı',
      yourHandle: 'Bağlı Hesap',
      linkCode: 'Tek Kullanımlık Kod',
      copyCode: 'Kodu Kopyala',
      newCode: 'Yeni Kod',
      sendTest: 'Test Bildirimi Gönder',
      unlink: 'Bağlantıyı Kaldır',
      expiresIn: 'Kalan süre',
      alertsTitle: 'Bildirim Tercihleri',
      alerts: {
        buyExecuted: 'Alış Gerçekleşti',
        sellExecuted: 'Satış Gerçekleşti',
        profitNotification: 'Kâr Bildirimi',
        lossNotification: 'Zarar Bildirimi',
        balanceUpdate: 'Bakiye Güncellemeleri',
        aiOpportunityDetected: 'AI Fırsatları',
        botStarted: 'Bot Başlatıldı',
        botStopped: 'Bot Durduruldu',
        connectionErrors: 'Bağlantı Uyarıları',
        dailyTradingSummary: 'Günlük Özet',
      },
    },
    account: {
      settingsTitle: 'Ayarlar',
      notificationsTitle: 'Bildirimler',
      helpTitle: 'Yardım ve Rehber',
      language: 'Dil',
      defaultStrategy: 'Varsayılan Strateji',
      maxAllocation: 'İşlem Başına Maks. Pay',
      stopLossLimit: 'Zarar Durdur Limiti',
      saveChanges: 'Değişiklikleri Kaydet',
      markAllRead: 'Tümünü okundu işaretle',
      all: 'Tümü',
      unread: 'Okunmamış',
      noNotifications: 'Henüz bildirim yok.',
      accountSummary: 'Hesap',
      plan: 'Paket',
      expires: 'Geçerlilik',
      faqTitle: 'Sıkça Sorulan Sorular',
      faq1Q: 'OXINVO Binance üzerinde para çekme izni gerektirir mi?',
      faq1A: 'Hayır. Yalnızca salt okunur bakiye ve spot emir izinleri kullanılır. Para çekme kapalı kalmalıdır.',
      faq2Q: 'Bu önizlemede gerçek işlemler yapılıyor mu?',
      faq2A: 'Hayır. İşlem yürütme henüz hazır değil. Hesap verileri sunucudan gelir; borsa verileri bağlı değil.',
      faq3Q: 'Telegram bildirimlerini nasıl açarım?',
      faq3A: 'Telegram entegrasyonu henüz etkin değil.',
      contactSupport: 'Destek için yöneticinizle iletişime geçin.',
    },
    admin: {
      overviewTitle: 'Platform Özeti',
      totalUsers: 'Toplam Kullanıcı',
      activeUsers: 'Aktif Hesaplar',
      runningBots: 'Çalışan Botlar',
      volume24h: 'İşlem hacmi (24s)',
      recentActions: 'Son Yönetici İşlemleri',
      usersTitle: 'Kullanıcılar',
      createUser: 'Yeni Kullanıcı',
      searchUsers: 'Kullanıcı adı veya isim ara...',
      allPlans: 'Tüm paketler',
      allStatuses: 'Tüm durumlar',
      user: 'Kullanıcı',
      plan: 'Paket',
      status: 'Durum',
      expires: 'Bitiş',
      balance: 'Bakiye',
      pnl: 'Toplam Kâr/Zarar',
      actions: 'İşlemler',
      viewUser: 'Yönet',
      resetPassword: 'Şifre Sıfırla',
      suspend: 'Askıya Al',
      activate: 'Etkinleştir',
      delete: 'Sil',
      deleteConfirm: 'Bu kullanıcı hesabı çalışma alanından kaldırılsın mı?',
      createUserModal: {
        title: 'Kullanıcı Hesabı Oluştur',
        username: 'Kullanıcı adı',
        fullName: 'Ad Soyad',
        plan: 'Paket',
        expiresAt: 'Bitiş Tarihi',
        notes: 'Notlar',
        generatedPassword: 'Oluşturulan Şifre',
        regenerate: 'Yenile',
        copy: 'Kopyala',
        create: 'Hesap Oluştur',
        passwordNote: 'İlk giriş için bu şifreyi kullanıcıyla güvenli bir şekilde paylaşın.',
      },
      userDetail: {
        back: 'Kullanıcılara Dön',
        editPlan: 'Abonelik ve Erişim',
        saveUser: 'Kaydet',
        botControl: 'Bot Kontrolü',
        connections: 'Bağlantılar',
        binance: 'Binance',
        telegram: 'Telegram',
        userTrades: 'Son Kullanıcı İşlemleri',
        newTempPassword: 'Yeni Şifre Oluşturuldu',
      },
      activityTitle: 'Platform İşlem Akışı',
      analyticsTitle: 'Platform Analitiği',
      subscriptionsTitle: 'Abonelik Paketleri',
      maxBots: 'Maks. Bot',
      maxPairs: 'Maks. Çift',
      aiAccess: 'AI Erişimi',
      aiProvidersTitle: 'AI Sağlayıcıları',
      model: 'Model',
      requests24h: 'İstekler (24s)',
      latency: 'Gecikme',
      estCost: 'Tahmini Maliyet',
      healthTitle: 'Sistem Sağlığı',
      cpu: 'CPU Yükü',
      memory: 'Bellek',
      uptime: 'Çalışma Süresi',
      wsStreams: 'Canlı Akışlar',
      queue: 'AI Kuyruğu',
      database: 'Veritabanı',
      worker: 'İşleyici',
      notificationsTitle: 'Toplu Bildirimler',
      broadcastTitle: 'Platform Duyurusu Gönder',
      messageTitle: 'Başlık',
      messageBody: 'Mesaj',
      sendBroadcast: 'Gönder',
      auditTitle: 'Denetim Kayıtları',
      actor: 'İşlem Yapan',
      action: 'İşlem',
      target: 'Hedef',
      ip: 'IP Adresi',
      settingsTitle: 'Sistem Ayarları',
      maintenanceMode: 'Bakım Modu',
      allowTrialSignups: 'Deneme Hesaplarına İzin Ver',
      enforceWithdrawalCheck: 'Çekim Kısıtlamasını Zorunlu Kıl',
      defaultLatencyCap: 'Maks. Veri Gecikmesi (ms)',
    },
    statusLabels: {
      active: 'Aktif',
      suspended: 'Askıda',
      expired: 'Süresi Dolmuş',
      running: 'Çalışıyor',
      paused: 'Duraklatıldı',
      stopped: 'Durduruldu',
      closed: 'Kapalı',
      buy: 'AL',
      wait: 'BEKLE',
      sell: 'SAT',
      online: 'Çevrimiçi',
      standby: 'Hazırda',
      degraded: 'Yavaş',
      healthy: 'Sağlıklı',
      trial: 'Deneme',
      standard: 'Standart',
      professional: 'Profesyonel',
      custom: 'Özel',
    },
    common: {
      save: 'Kaydet',
      cancel: 'İptal',
      confirm: 'Onayla',
      close: 'Kapat',
      clear: 'Temizle',
      view: 'Görüntüle',
      edit: 'Düzenle',
      page: 'Sayfa',
      copied: 'Kopyalandı',
      updated: 'Güncellendi',
      noData: 'Veri yok',
      justNow: 'Şimdi',
    },
    demoActivity: {
      'act-1': {
        title: 'AI Fırsatı Tespit Edildi · ENA/USDT',
        detail: 'Puan 88 · +%215 hacim artışı ve pozitif piyasa duyarlılığı.',
        timestamp: '2 dk önce',
      },
      'act-2': {
        title: 'Telegram Bildirimi Gönderildi',
        detail: 'SOL/USDT (+%2.2) için bildirim iletildi.',
        timestamp: '14 dk önce',
      },
      'act-3': {
        title: 'Pozisyon Açıldı · ENA/USDT',
        detail: 'Giriş $0.728 · $950.00 · Likidite İmpulsu.',
        timestamp: '1 sa önce',
      },
      'act-4': {
        title: 'Binance Spot Eşitlendi',
        detail: 'Okuma ve Spot izinleri doğrulandı. Çekim kapalı.',
        timestamp: '3 sa önce',
      },
      'act-5': {
        title: 'Pozisyon Kapatıldı · TAO/USDT',
        detail: 'Uyarlanabilir Momentum ile +$121.85 (+%5.80) kâr.',
        timestamp: '8 sa önce',
      },
    },
    demoNotifications: {
      'ntf-1': {
        title: 'Pozisyon Açıldı: ENA/USDT',
        message: 'Likidite İmpulsu $0.7280 fiyatından $950.00 giriş açtı.',
        timestamp: '10:30 UTC',
      },
      'ntf-2': {
        title: 'Yüksek Uyum Sinyali: PENDLE/USDT',
        message: 'Hacim +%172 arttı, pozitif bağlam (Puan 86).',
        timestamp: '09:48 UTC',
      },
      'ntf-3': {
        title: 'Binance Güvenlik Kontrolü Başarılı',
        message: 'Çekim izninin kapalı olduğu doğrulandı.',
        timestamp: '08:00 UTC',
      },
      'ntf-4': {
        title: 'Günlük Özet Hazır',
        message: 'Son 24s net sonuç: +$217.15 (5 işlem).',
        timestamp: 'Dün',
      },
    },
  },
  ru: {
    tagline: 'Интеллект за каждой сделкой',
    demoTag: 'Демо',
    auth: {
      title: 'С возвращением',
      subtitle: 'Войдите в свой аккаунт OXINVO',
      username: 'Логин',
      password: 'Пароль',
      rememberMe: 'Запомнить меня',
      signIn: 'Войти',
      signingIn: 'Выполняется вход...',
      contactAdmin: 'Нужен доступ? Свяжитесь с администратором',
      adminTitle: 'Запрос доступа к платформе',
      adminBody: 'Учетные записи OXINVO создаются администратором с безопасным паролем и лимитами тарифа.',
      telegramDesk: 'Свяжитесь с администратором платформы.',
      close: 'Закрыть',
      heroTitle: 'Спокойный и умный спот-трейдинг.',
      heroSubtitle: 'Анализ рынка в реальном времени и автоматическое исполнение в простом интерфейсе.',
      invalidError: 'Неверный логин или пароль.',
      inactiveError: 'Ваш аккаунт неактивен. Обратитесь к администратору.',
    },
    nav: {
      overview: 'Обзор',
      aiBot: 'AI Бот',
      markets: 'Рынки',
      trades: 'Сделки',
      portfolio: 'Портфель',
      analytics: 'Аналитика',
      connections: 'Подключения',
      settings: 'Настройки',
      notifications: 'Уведомления',
      help: 'Помощь',
      adminPanel: 'Админ-панель',
      logout: 'Выйти',
      collapse: 'Свернуть',
      expand: 'Развернуть',
      profile: 'Профиль',
    },
    adminNav: {
      overview: 'Обзор',
      users: 'Пользователи',
      activity: 'Торговая активность',
      analytics: 'Аналитика',
      subscriptions: 'Подписки',
      aiProviders: 'AI Провайдеры',
      systemHealth: 'Состояние системы',
      notifications: 'Уведомления',
      auditLogs: 'Журнал аудита',
      settings: 'Настройки',
      backToUser: 'В приложение',
      adminBadge: 'Админ',
    },
    overview: {
      title: 'Обзор',
      totalBalance: 'Общий баланс',
      totalProfit: 'Общая прибыль',
      todayProfit: 'Прибыль за сегодня',
      activeTrades: 'Активные сделки',
      portfolioChart: 'Динамика портфеля',
      recentTrades: 'Недавние сделки',
      detectedOpportunities: 'Найденные возможности',
      viewAll: 'Все',
      score: 'Балл',
    },
    aiBot: {
      title: 'AI Бот',
      status: 'Статус',
      running: 'Работает',
      paused: 'Пауза',
      stopped: 'Остановлен',
      start: 'Запустить',
      pause: 'Пауза',
      stop: 'Остановить',
      assetsScanned: 'Проверено активов',
      opportunitiesDetected: 'Возможности',
      activeTrades: 'Активные сделки',
      todayPnl: 'Итог за сегодня',
      activityFeed: 'Живая лента',
      advancedSettings: 'Расширенные настройки',
      advancedTitle: 'Расширенные настройки бота',
      strategyLabel: 'Торговая стратегия',
      strategies: {
        adaptive: 'Адаптивный импульс',
        breakout: 'Пробой объёма',
        reversion: 'Возврат к среднему',
        impulse: 'Импульс ликвидности',
      },
      recentSignals: 'Последние AI-сигналы',
      decision: 'Решение',
      riskNote: 'Оценка риска',
    },
    markets: {
      title: 'Рынки',
      searchPlaceholder: 'Поиск пары или актива...',
      categories: {
        all: 'Все',
        trending: 'В тренде',
        newlyListed: 'Новые',
        highVolume: 'Высокий объём',
        unusualVolume: 'Всплеск объёма',
        highMomentum: 'Импульс',
        highVolatility: 'Волатильные',
        potentialBreakout: 'Пробой',
        aiOpportunities: 'Выбор AI',
      },
      asset: 'Актив',
      price: 'Цена',
      change24h: '24ч',
      volume24h: 'Объём',
      score: 'Балл',
      signal: 'Сигнал',
      details: 'Детали актива',
      liquidity: 'Ликвидность',
      momentum: 'Импульс',
      imbalance: 'Поток ордеров',
      news: 'Новости',
      social: 'Соцсети',
      aiSummary: 'Резюме AI',
      empty: 'Подходящие активы не найдены.',
    },
    trades: {
      title: 'Сделки',
      activeTab: 'Активные',
      historyTab: 'История',
      pair: 'Пара',
      entry: 'Вход',
      current: 'Текущая',
      exit: 'Выход',
      amount: 'Сумма',
      pnl: 'Прибыль / Убыток',
      duration: 'Длительность',
      strategy: 'Стратегия',
      status: 'Статус',
      dateFilter: 'Дата',
      allPairs: 'Все пары',
      allResults: 'Все результаты',
      winsOnly: 'Прибыльные',
      lossesOnly: 'Убыточные',
      openReason: 'Причина входа',
      closeReason: 'Причина выхода',
      fees: 'Комиссия',
      quantity: 'Количество',
      openedAt: 'Открыта',
      closedAt: 'Закрыта',
      tradeDetails: 'Детали сделки',
      empty: 'Нет сделок по выбранным фильтрам.',
      activeCount: 'Открытые позиции',
      winRate: 'Винрейт',
      netPnl: 'Чистая прибыль',
    },
    portfolio: {
      title: 'Портфель',
      totalValue: 'Общая стоимость',
      availableCash: 'Доступно USDT',
      inTrades: 'В активных сделках',
      allocation: 'Распределение',
      holdings: 'Спотовые балансы',
      asset: 'Актив',
      balance: 'Баланс',
      valueUsd: 'Стоимость',
      share: 'Доля',
    },
    analytics: {
      title: 'Аналитика',
      winRate: 'Винрейт',
      profitFactor: 'Профит-фактор',
      avgDuration: 'Среднее время',
      totalTrades: 'Всего сделок',
      pnlByDay: 'Прибыль и убыток по дням',
      strategyBreakdown: 'По стратегиям',
      tradesCount: 'Сделки',
      netReturn: 'Чистый доход',
    },
    connections: {
      title: 'Подключения',
      binanceTab: 'Binance',
      telegramTab: 'Telegram',
      binanceTitle: 'Спотовый аккаунт Binance',
      telegramTitle: 'Уведомления Telegram',
      connected: 'Подключено',
      notConnected: 'Не подключено',
      apiKey: 'API-ключ',
      apiSecret: 'Секретный ключ',
      testConnection: 'Проверить связь',
      saveKeys: 'Подключить аккаунт',
      disconnect: 'Отключить',
      disconnectTitle: 'Отключить Binance?',
      disconnectBody: 'Автоматический мониторинг будет приостановлен до повторного подключения ключей.',
      permissionsCheck: 'Проверка безопасности',
      spotEnabled: 'Спот-торговля включена',
      readEnabled: 'Чтение баланса включено',
      withdrawalsDisabled: 'Вывод средств отключён',
      spotBalances: 'Балансы',
      lastSync: 'Последняя синхронизация',
      connectSteps: 'Быстрая настройка',
      step1: 'Откройте управление API в Binance',
      step2: 'Создайте системный API-ключ',
      step3: 'Разрешите только чтение и спот-торговлю',
      step4: 'Оставьте вывод средств полностью отключённым',
      step5: 'Вставьте ключи здесь и проверьте подключение',
      telegramBot: 'Адрес бота',
      yourHandle: 'Привязанный аккаунт',
      linkCode: 'Одноразовый код',
      copyCode: 'Скопировать код',
      newCode: 'Новый код',
      sendTest: 'Отправить тест',
      unlink: 'Отвязать',
      expiresIn: 'Истекает через',
      alertsTitle: 'Настройки уведомлений',
      alerts: {
        buyExecuted: 'Покупка выполнена',
        sellExecuted: 'Продажа выполнена',
        profitNotification: 'Уведомление о прибыли',
        lossNotification: 'Уведомление об убытке',
        balanceUpdate: 'Обновление баланса',
        aiOpportunityDetected: 'AI возможности',
        botStarted: 'Бот запущен',
        botStopped: 'Бот остановлен',
        connectionErrors: 'Ошибки подключения',
        dailyTradingSummary: 'Ежедневный отчёт',
      },
    },
    account: {
      settingsTitle: 'Настройки',
      notificationsTitle: 'Уведомления',
      helpTitle: 'Помощь и гид',
      language: 'Язык',
      defaultStrategy: 'Стратегия по умолчанию',
      maxAllocation: 'Макс. доля на сделку',
      stopLossLimit: 'Лимит стоп-лосса',
      saveChanges: 'Сохранить',
      markAllRead: 'Отметить всё прочитанным',
      all: 'Все',
      unread: 'Непрочитанные',
      noNotifications: 'Уведомлений пока нет.',
      accountSummary: 'Аккаунт',
      plan: 'Тариф',
      expires: 'Действует до',
      faqTitle: 'Частые вопросы',
      faq1Q: 'Требует ли OXINVO доступ к выводу средств на Binance?',
      faq1A: 'Нет. Используются только права чтения баланса и спотовых ордеров. Вывод должен быть отключён.',
      faq2Q: 'Совершаются ли реальные сделки в этой версии?',
      faq2A: 'Нет. Исполнение сделок пока недоступно. Данные аккаунта поступают с сервера; биржа не подключена.',
      faq3Q: 'Как подключить мгновенные уведомления в Telegram?',
      faq3A: 'Интеграция Telegram пока недоступна.',
      contactSupport: 'Для поддержки обратитесь к администратору.',
    },
    admin: {
      overviewTitle: 'Обзор платформы',
      totalUsers: 'Пользователи',
      activeUsers: 'Активные аккаунты',
      runningBots: 'Активные боты',
      volume24h: 'Торговый объём (24ч)',
      recentActions: 'Последние действия админа',
      usersTitle: 'Пользователи',
      createUser: 'Новый пользователь',
      searchUsers: 'Поиск по логину или имени...',
      allPlans: 'Все тарифы',
      allStatuses: 'Все статусы',
      user: 'Пользователь',
      plan: 'Тариф',
      status: 'Статус',
      expires: 'Истекает',
      balance: 'Баланс',
      pnl: 'Общий P&L',
      actions: 'Действия',
      viewUser: 'Управление',
      resetPassword: 'Сброс пароля',
      suspend: 'Заблокировать',
      activate: 'Активировать',
      delete: 'Удалить',
      deleteConfirm: 'Удалить этот аккаунт из системы?',
      createUserModal: {
        title: 'Создать пользователя',
        username: 'Логин',
        fullName: 'Полное имя',
        plan: 'Тариф',
        expiresAt: 'Дата окончания',
        notes: 'Заметки',
        generatedPassword: 'Сгенерированный пароль',
        regenerate: 'Обновить',
        copy: 'Копировать',
        create: 'Создать аккаунт',
        passwordNote: 'Передайте этот пароль пользователю по защищённому каналу.',
      },
      userDetail: {
        back: 'К списку пользователей',
        editPlan: 'Подписка и доступ',
        saveUser: 'Сохранить',
        botControl: 'Управление ботом',
        connections: 'Интеграции',
        binance: 'Binance',
        telegram: 'Telegram',
        userTrades: 'Последние сделки пользователя',
        newTempPassword: 'Создан новый пароль',
      },
      activityTitle: 'Торговая активность платформы',
      analyticsTitle: 'Аналитика платформы',
      subscriptionsTitle: 'Тарифные планы',
      maxBots: 'Макс. ботов',
      maxPairs: 'Макс. пар',
      aiAccess: 'Доступ к AI',
      aiProvidersTitle: 'AI Провайдеры',
      model: 'Модель',
      requests24h: 'Запросы (24ч)',
      latency: 'Задержка',
      estCost: 'Оценка затрат',
      healthTitle: 'Состояние системы',
      cpu: 'Нагрузка CPU',
      memory: 'Память',
      uptime: 'Время работы',
      wsStreams: 'Живые потоки',
      queue: 'Очередь AI',
      database: 'База данных',
      worker: 'Обработчик',
      notificationsTitle: 'Рассылка уведомлений',
      broadcastTitle: 'Отправить объявление',
      messageTitle: 'Заголовок',
      messageBody: 'Сообщение',
      sendBroadcast: 'Отправить',
      auditTitle: 'Журнал аудита',
      actor: 'Инициатор',
      action: 'Действие',
      target: 'Объект',
      ip: 'IP-адрес',
      settingsTitle: 'Настройки системы',
      maintenanceMode: 'Режим обслуживания',
      allowTrialSignups: 'Разрешить пробные аккаунты',
      enforceWithdrawalCheck: 'Требовать запрет вывода',
      defaultLatencyCap: 'Макс. задержка данных (мс)',
    },
    statusLabels: {
      active: 'Активен',
      suspended: 'Приостановлен',
      expired: 'Истёк',
      running: 'Работает',
      paused: 'Пауза',
      stopped: 'Остановлен',
      closed: 'Закрыта',
      buy: 'ПОКУПКА',
      wait: 'ОЖИДАНИЕ',
      sell: 'ПРОДАЖА',
      online: 'Онлайн',
      standby: 'Резерв',
      degraded: 'Снижен',
      healthy: 'В норме',
      trial: 'Пробный',
      standard: 'Стандарт',
      professional: 'Профессиональный',
      custom: 'Индивидуальный',
    },
    common: {
      save: 'Сохранить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      close: 'Закрыть',
      clear: 'Очистить',
      view: 'Открыть',
      edit: 'Изменить',
      page: 'Стр.',
      copied: 'Скопировано',
      updated: 'Обновлено',
      noData: 'Нет данных',
      justNow: 'Только что',
    },
    demoActivity: {
      'act-1': {
        title: 'Найдена AI-возможность · ENA/USDT',
        detail: 'Балл 88 · Всплеск объёма +215% и позитивный фон.',
        timestamp: '2 мин назад',
      },
      'act-2': {
        title: 'Уведомление Telegram отправлено',
        detail: 'Сигнал по SOL/USDT (+2.2%) доставлен.',
        timestamp: '14 мин назад',
      },
      'act-3': {
        title: 'Открыта позиция · ENA/USDT',
        detail: 'Вход $0.728 · $950.00 · Импульс ликвидности.',
        timestamp: '1 ч назад',
      },
      'act-4': {
        title: 'Баланс Binance синхронизирован',
        detail: 'Права чтения и спота проверены. Вывод отключён.',
        timestamp: '3 ч назад',
      },
      'act-5': {
        title: 'Закрыта позиция · TAO/USDT',
        detail: 'Прибыль +$121.85 (+5.80%) по стратегии импульса.',
        timestamp: '8 ч назад',
      },
    },
    demoNotifications: {
      'ntf-1': {
        title: 'Открыта позиция: ENA/USDT',
        message: 'Импульс ликвидности открыл вход $950.00 по $0.7280.',
        timestamp: '10:30 UTC',
      },
      'ntf-2': {
        title: 'Сильный сигнал: PENDLE/USDT',
        message: 'Рост объёма +172% при позитивном фоне (Балл 86).',
        timestamp: '09:48 UTC',
      },
      'ntf-3': {
        title: 'Проверка безопасности Binance пройдена',
        message: 'Подтверждено, что вывод средств отключён.',
        timestamp: '08:00 UTC',
      },
      'ntf-4': {
        title: 'Ежедневный отчёт готов',
        message: 'Итог за 24ч: +$217.15 по 5 позициям.',
        timestamp: 'Вчера',
      },
    },
  },
};

export function translateUserStatus(status: UserStatus, t: TranslationDictionary): string {
  return t.statusLabels[status];
}

export function translateBotStatus(status: BotStatus, t: TranslationDictionary): string {
  return t.statusLabels[status];
}

export function translateDecision(decision: TradingDecision, t: TranslationDictionary): string {
  if (decision === 'BUY') return t.statusLabels.buy;
  if (decision === 'SELL') return t.statusLabels.sell;
  return t.statusLabels.wait;
}

export function translatePlan(plan: SubscriptionPlan, t: TranslationDictionary): string {
  return t.statusLabels[plan];
}

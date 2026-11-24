import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[OXINVO SEO] dist/index.html not found. Run `npm run build:frontend` first.');
  process.exit(1);
}

const ORIGIN = 'https://oxinvo.com';
const LANGUAGES = ['az', 'en', 'tr', 'ru'];
const ROUTES = ['home', 'about', 'contact', 'privacy', 'terms', 'risk'];

const SEO_DATA = {
  az: {
    locale: 'az_AZ',
    home: {
      title: 'OXINVO — Ticarət Platformasına Giriş',
      description:
        'OXINVO hesabınıza daxil olun. Spot kriptovalyuta bazarının monitorinqi, risk idarəetməsi və AI yönümlü ticarət platforması.',
    },
    about: {
      title: 'Haqqımızda — OXINVO',
      description:
        'OXINVO platformasının təhlükəsizlik arxitekturası, risk nəzarəti prinsipləri və spot bazar monitorinq imkanları haqqında ətraflı məlumat.',
      faq: [
        {
          q: 'OXINVO gəlirə zəmanət verirmi?',
          a: 'Xeyr. Kriptovalyuta bazarları yüksək volatilliyə malikdir. Platforma yalnız analiz, monitorinq və risk qaydalarının tətbiqi üçün vasitədir.',
        },
        {
          q: 'Binance hesabımdan vəsait çıxarma icazəsi tələb olunurmu?',
          a: 'Xeyr. Yalnız oxuma və spot əməliyyat icazələri nəzərdə tutulur; vəsait çıxarışı həmişə qapalı qalmalıdır.',
        },
      ],
    },
    contact: {
      title: 'Əlaqə — OXINVO',
      description:
        'OXINVO dəstək komandası ilə rəsmi kanallar vasitəsilə əlaqə saxlayın.',
    },
    privacy: {
      title: 'Məxfilik Siyasəti — OXINVO',
      description: 'OXINVO istifadəçi məlumatlarının qorunması, sessiya təhlükəsizliyi və məxfilik prinsipləri.',
    },
    terms: {
      title: 'İstifadə Şərtləri — OXINVO',
      description: 'OXINVO platformasından istifadə qaydaları, hesab məsuliyyəti və xidmət şərtləri.',
    },
    risk: {
      title: 'Risk Xəbərdarlığı — OXINVO',
      description: 'Rəqəmsal aktiv bazarlarında ticarət riskləri və təhlükəsizlik məhdudiyyətləri barədə rəsmi bildiriş.',
    },
  },
  en: {
    locale: 'en_US',
    home: {
      title: 'OXINVO — Sign In to Your Trading Workspace',
      description:
        'Sign in to OXINVO. Security-first spot cryptocurrency market monitoring, risk management, and AI-assisted workflow platform.',
    },
    about: {
      title: 'About OXINVO — Crypto Trading & Risk Architecture',
      description:
        'Learn about OXINVO platform architecture, RBAC security standards, risk guardrails, and transparent spot trading infrastructure.',
      faq: [
        {
          q: 'Does OXINVO guarantee trading profits?',
          a: 'No. Cryptocurrency trading carries significant risk. OXINVO provides workflow structure, monitoring, and risk controls without profit guarantees.',
        },
        {
          q: 'Are withdrawal permissions required on Binance?',
          a: 'No. Only read and spot permissions are designed for use; withdrawal permissions must always remain disabled.',
        },
      ],
    },
    contact: {
      title: 'Contact — OXINVO',
      description: 'Reach the OXINVO operations and support team through official support channels.',
    },
    privacy: {
      title: 'Privacy Policy — OXINVO',
      description: 'How OXINVO protects account identifiers, session cookies, and API credentials.',
    },
    terms: {
      title: 'Terms of Service — OXINVO',
      description: 'OXINVO workspace usage terms, account security responsibilities, and platform disclosures.',
    },
    risk: {
      title: 'Risk Disclosure — OXINVO',
      description: 'Important risk disclosure regarding cryptocurrency volatility and execution guardrails.',
    },
  },
  tr: {
    locale: 'tr_TR',
    home: {
      title: 'OXINVO — İşlem Platformuna Giriş',
      description:
        'OXINVO hesabınıza giriş yapın. Güvenlik odaklı spot kripto piyasa izleme, risk yönetimi ve yapay zekâ destekli işlem altyapısı.',
    },
    about: {
      title: 'Hakkımızda — OXINVO',
      description:
        'OXINVO platformunun güvenlik mimarisi, risk kontrol kuralları ve şeffaf spot piyasa altyapısı hakkında bilgi edinin.',
      faq: [
        {
          q: 'OXINVO kazanç garantisi sunuyor mu?',
          a: 'Hayır. Kripto piyasaları yüksek risk taşır; platform analiz ve risk disiplini sağlayan bir araçtır.',
        },
        {
          q: 'Binance API anahtarında para çekme izni gerekir mi?',
          a: 'Hayır. Yalnızca okuma ve spot işlem izni kullanılır; para çekme izni daima kapalı olmalıdır.',
        },
      ],
    },
    contact: {
      title: 'İletişim — OXINVO',
      description: 'Hesap erişimi ve teknik destek için OXINVO ekibiyle resmi kanallardan iletişime geçin.',
    },
    privacy: {
      title: 'Gizlilik Politikası — OXINVO',
      description: 'OXINVO hesap verileri, oturum çerezleri ve API gizlilik politikası.',
    },
    terms: {
      title: 'Kullanım Şartları — OXINVO',
      description: 'OXINVO platformu kullanım kuralları ve hesap güvenliği koşulları.',
    },
    risk: {
      title: 'Risk Bildirimi — OXINVO',
      description: 'Kripto varlık piyasalarındaki oynaklık ve işlem sınırları hakkında risk bildirimi.',
    },
  },
  ru: {
    locale: 'ru_RU',
    home: {
      title: 'OXINVO — Вход в торговую платформу',
      description:
        'Войдите в аккаунт OXINVO. Защищенная платформа для мониторинга спотового крипторынка, риск-менеджмента и ИИ-аналитики.',
    },
    about: {
      title: 'О платформе OXINVO',
      description:
        'Узнайте о принципах безопасности, риск-менеджменте и архитектуре спотовой торговой инфраструктуры OXINVO.',
      faq: [
        {
          q: 'Гарантирует ли OXINVO прибыль?',
          a: 'Нет. Крипторынок сопряжен с высоким риском. Платформа является инструментом анализа и контроля рисков.',
        },
        {
          q: 'Нужны ли права на вывод средств в Binance API?',
          a: 'Нет. Используются только чтение и спотовая торговля; вывод средств всегда должен быть отключен.',
        },
      ],
    },
    contact: {
      title: 'Контакты — OXINVO',
      description: 'Свяжитесь со службой поддержки и командой OXINVO по официальным каналам.',
    },
    privacy: {
      title: 'Политика конфиденциальности — OXINVO',
      description: 'Политика защиты данных учетных записей и сессий платформы OXINVO.',
    },
    terms: {
      title: 'Условия использования — OXINVO',
      description: 'Правила использования платформы OXINVO и требования безопасности.',
    },
    risk: {
      title: 'Предупреждение о рисках — OXINVO',
      description: 'Информация о рыночной волатильности цифровых активов и защитных ограничениях.',
    },
  },
};

function routePathFor(lang, route, includeLangPrefix = true) {
  const seg = route === 'home' ? '' : `/${route}`;
  return includeLangPrefix ? `/${lang}${seg}` : seg || '/';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHeadInjection(lang, route, canonicalUrl) {
  const entry = SEO_DATA[lang][route];
  const alternateLinks = LANGUAGES.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${ORIGIN}${routePathFor(l, route)}" />`,
  ).join('\n');
  const xDefault = `    <link rel="alternate" hreflang="x-default" href="${ORIGIN}${routePathFor('az', route)}" />`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'OXINVO',
        url: ORIGIN,
      },
      {
        '@type': 'WebPage',
        name: entry.title,
        description: entry.description,
        url: canonicalUrl,
        inLanguage: lang,
      },
      ...(entry.faq
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: entry.faq.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return [
    `    <link rel="canonical" href="${canonicalUrl}" />`,
    alternateLinks,
    xDefault,
    `    <meta property="og:locale" content="${SEO_DATA[lang].locale}" />`,
    `    <meta property="og:url" content="${canonicalUrl}" />`,
    `    <meta name="twitter:title" content="${escapeHtml(entry.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(entry.description)}" />`,
    `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].join('\n');
}

function renderHtml(template, lang, route, useRootCanonical = false) {
  const entry = SEO_DATA[lang][route];
  const canonicalUrl = `${ORIGIN}${routePathFor(lang, route, !useRootCanonical)}`;
  const injection = buildHeadInjection(lang, route, canonicalUrl);

  let html = template;
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(entry.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(entry.description)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(entry.title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(entry.description)}" />`,
  );
  html = html.replace('</head>', `${injection}\n  </head>`);
  return html;
}

const template = fs.readFileSync(templatePath, 'utf8');
let generatedCount = 0;
const sitemapUrls = [];

// Generate 4 languages × 6 routes = 24 static localized SEO pages
for (const lang of LANGUAGES) {
  for (const route of ROUTES) {
    const relPath = route === 'home' ? path.join(lang, 'index.html') : path.join(lang, route, 'index.html');
    const outPath = path.join(distDir, relPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, renderHtml(template, lang, route, false), 'utf8');
    generatedCount++;

    const alternates = LANGUAGES.map(
      (altLang) =>
        `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${ORIGIN}${routePathFor(altLang, route)}" />`,
    ).join('\n');
    sitemapUrls.push(
      `  <url>\n    <loc>${ORIGIN}${routePathFor(lang, route)}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${routePathFor('az', route)}" />\n  </url>`,
    );
  }
}

// Also generate clean root-level aliases defaulting to Azerbaijani ('az')
for (const route of ROUTES) {
  if (route === 'home') {
    fs.writeFileSync(templatePath, renderHtml(template, 'az', 'home', true), 'utf8');
  } else {
    const outPath = path.join(distDir, route, 'index.html');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, renderHtml(template, 'az', route, true), 'utf8');
  }
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

const robotsTxt = `User-agent: *
Allow: /
Allow: /az/
Allow: /en/
Allow: /tr/
Allow: /ru/
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /risk
Disallow: /api/

Sitemap: ${ORIGIN}/sitemap.xml
`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');

console.log(`[OXINVO SEO] Generated ${generatedCount} localized public HTML pages (4 languages × 6 routes), sitemap.xml, and robots.txt.`);

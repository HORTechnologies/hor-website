import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.developers': 'Developers',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',

    // Hero
    'hero.title': 'NEXUS TECH',
    'hero.subtitle': 'Building the future of digital experiences',
    'hero.description': 'We craft premium software solutions that transform ideas into extraordinary digital products. Websites, mobile apps, games, and intelligent systems.',
    'hero.explore': 'Explore Our Work',
    'hero.contact': 'Start a Project',

    // Projects
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Innovative solutions we\'ve delivered',
    'projects.viewProject': 'View Project',

    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive digital solutions',
    'services.web': 'Web Development',
    'services.web.desc': 'Modern, responsive websites built with cutting-edge technologies.',
    'services.mobile': 'Mobile Applications',
    'services.mobile.desc': 'Native and cross-platform mobile experiences.',
    'services.ui': 'UI/UX Design',
    'services.ui.desc': 'Beautiful interfaces that users love.',
    'services.games': 'Game Development',
    'services.games.desc': 'Engaging games across all platforms.',
    'services.software': 'Software Systems',
    'services.software.desc': 'Custom enterprise solutions and systems.',

    // Developers
    'developers.title': 'Meet Our Team',
    'developers.subtitle': 'The minds behind the innovation',

    // Articles
    'articles.title': 'Latest Insights',
    'articles.subtitle': 'Thoughts on technology and design',
    'articles.readMore': 'Read Article',

    // Clients
    'clients.title': 'Trusted By',
    'clients.subtitle': 'Companies that believe in our vision',

    // Footer
    'footer.tagline': 'Building the future, one line of code at a time.',
    'footer.copyright': '© 2026 Nexus Tech. All rights reserved.',

    // Project titles
    'project.ecommerce': 'E-Commerce Platform',
    'project.ecommerce.desc': 'A seamless shopping experience with AI-powered recommendations.',
    'project.fintech': 'FinTech Dashboard',
    'project.fintech.desc': 'Real-time analytics and portfolio management system.',
    'project.health': 'Health Tracker',
    'project.health.desc': 'Comprehensive health monitoring mobile application.',
    'project.gaming': 'Galaxy Quest',
    'project.gaming.desc': 'An immersive 3D space exploration game.',
    'project.saas': 'SaaS Platform',
    'project.saas.desc': 'Cloud-based project management solution.',
    'project.ai': 'AI Assistant',
    'project.ai.desc': 'Intelligent virtual assistant with natural language processing.',

    // Article titles
    'article.ai': 'The Future of AI in Web Development',
    'article.ai.category': 'Technology',
    'article.ux': 'Designing for the Next Generation',
    'article.ux.category': 'Design',
    'article.cloud': 'Cloud-Native Architecture Best Practices',
    'article.cloud.category': 'Architecture',

    // Reading time
    'read.time': 'min read',

    // Tags
    'tag.react': 'React',
    'tag.node': 'Node.js',
    'tag.python': 'Python',
    'tag.ai': 'AI/ML',
    'tag.cloud': 'Cloud',
    'tag.mobile': 'Mobile',
    'tag.game': 'Game',
    'tag.unity': 'Unity',
    'tag.swift': 'Swift',
    'tag.figma': 'Figma',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.projects': 'المشاريع',
    'nav.developers': 'المطورون',
    'nav.articles': 'المقالات',
    'nav.contact': 'اتصل بنا',
    'nav.getStarted': 'ابدأ الآن',

    // Hero
    'hero.title': 'نيكسس تك',
    'hero.subtitle': 'نبني مستقبل التجارب الرقمية',
    'hero.description': 'نصمم حلول برمجية فاخرة تحوّل الأفكار إلى منتجات رقمية استثنائية. مواقع إلكترونية، تطبيقات جوال، ألعاب، وأنظمة ذكية.',
    'hero.explore': 'استكشف أعمالنا',
    'hero.contact': 'ابدأ مشروعك',

    // Projects
    'projects.title': 'مشاريع مميزة',
    'projects.subtitle': 'حلول مبتكرة قدمناها',
    'projects.viewProject': 'عرض المشروع',

    // Services
    'services.title': 'خدماتنا',
    'services.subtitle': 'حلول رقمية شاملة',
    'services.web': 'تطوير الويب',
    'services.web.desc': 'مواقع إلكترونية عصرية ومتجاوبة مبنية بأحدث التقنيات.',
    'services.mobile': 'تطبيقات الجوال',
    'services.mobile.desc': 'تجارب تطبيقات جوال أصلية وعابرة للمنصات.',
    'services.ui': 'تصميم UI/UX',
    'services.ui.desc': 'واجهات جميلة يحبها المستخدمون.',
    'services.games': 'تطوير الألعاب',
    'services.games.desc': 'ألعاب جذابة على جميع المنصات.',
    'services.software': 'الأنظمة البرمجية',
    'services.software.desc': 'حلول مؤسسية وأنظمة مخصصة.',

    // Developers
    'developers.title': 'تعرف على فريقنا',
    'developers.subtitle': 'العقول المبدعة وراء الابتكار',

    // Articles
    'articles.title': 'آخر الرؤى',
    'articles.subtitle': 'أفكار حول التكنولوجيا والتصميم',
    'articles.readMore': 'اقرأ المقال',

    // Clients
    'clients.title': 'يثق بنا',
    'clients.subtitle': 'شركات تؤمن برؤيتنا',

    // Footer
    'footer.tagline': 'نبني المستقبل، سطراً من الشيفرة في كل مرة.',
    'footer.copyright': '© 2026 نيكسيس تك. جميع الحقوق محفوظة.',

    // Project titles
    'project.ecommerce': 'منصة التجارة الإلكترونية',
    'project.ecommerce.desc': 'تجربة تسوق سلسة مع توصيات مدعومة بالذكاء الاصطناعي.',
    'project.fintech': 'لوحة Fintech',
    'project.fintech.desc': 'نظام تحليلات فورية وإدارة محفظة.',
    'project.health': 'متتبع الصحة',
    'project.health.desc': 'تطبيق جوال شامل لرصد الصحة.',
    'project.gaming': 'مهمة المجرة',
    'project.gaming.desc': 'لعبة استكشاف فضاء ثلاثية الأبعاد غامرة.',
    'project.saas': 'منصة SaaS',
    'project.saas.desc': 'حل إدارة مشاريع قائم على السحابة.',
    'project.ai': 'مساعد ذكي',
    'project.ai.desc': 'مساعد افتراضي ذكي بمعالجة اللغة الطبيعية.',

    // Article titles
    'article.ai': 'مستقبل الذكاء الاصطناعي في تطوير الويب',
    'article.ai.category': 'التكنولوجيا',
    'article.ux': 'التصميم للجيل القادم',
    'article.ux.category': 'التصميم',
    'article.cloud': 'أفضل ممارسات البنية السحابية',
    'article.cloud.category': 'البنية',

    // Reading time
    'read.time': 'دقيقة للقراءة',

    // Tags
    'tag.react': 'React',
    'tag.node': 'Node.js',
    'tag.python': 'Python',
    'tag.ai': 'AI/ML',
    'tag.cloud': 'Cloud',
    'tag.mobile': 'Mobile',
    'tag.game': 'Game',
    'tag.unity': 'Unity',
    'tag.swift': 'Swift',
    'tag.figma': 'Figma',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

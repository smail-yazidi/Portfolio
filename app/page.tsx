"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { useRouter } from "next/navigation";

import Loading from "@/components/LoadingAdmin";
import {
  Send,
  Star,
  Menu,
  X,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  LanguagesIcon,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  Link,
  Search,
} from "lucide-react"
import * as LucideIcons from "lucide-react";

const translations = {
  fr: {
    // Header
    home: "Accueil",
    services: "Services",
    experience: "Parcours",
    skills: "Compétences",
    projects: "Projets",
    about: "À Propos",
    contact: "Contact",
    hireMe: "Me Contacter",
    viewJourney: "Voir Mon CV",

    // Services
    servicesTitle: "Services",

    // Experience & Education Timeline
    journeyTitle: "Parcours Professionnel & Éducatif",

    // Skills
    skillsTitle: "Mes Compétences",

    // Projects
    myProjects: "Mes Projets",

    // About
    aboutTitle: "À Propos de Moi",
    interests:"Centres d'Intérêt",
    
    // Footer
    rightsReserved: "Tous droits réservés",
  },
  en: {
    // Header
    home: "Home",
    services: "Services",
    experience: "Journey",
    skills: "Skills",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    hireMe: "Hire Me",
    interests:"Interests",
    viewJourney: "View My CV",

    // Services
    servicesTitle: "Services",
  
    // Experience & Education Timeline
    journeyTitle: "Work Experience & Education Timeline",
 
    // Skills
    skillsTitle: "My Skills",

    // Projects
    myProjects: "My Projects",
   
    aboutTitle: "About Me",
    // Footer
    rightsReserved: "All rights reserved",
  },
  ar: {
    // Header
    home: "الرئيسية",
    services: "الخدمات",
    experience: "المسيرة المهنية",
    skills: "المهارات",
    projects: "المشاريع",
    about: "عنّي",
    contact: "التواصل",
    hireMe: "وظفني",
    interests: "الاهتمامات",
    viewJourney: "عرض سيرتي الذاتية",

    // Services
    servicesTitle: "الخدمات",

    // Experience & Education Timeline
    journeyTitle: "المسيرة المهنية والتعليمية",

    // Skills
    skillsTitle: "مهاراتي",

    // Projects
    myProjects: "مشاريعي",

    aboutTitle: "نبذة عني",
    // Footer
    rightsReserved: "جميع الحقوق محفوظة",
  }
}
const baseMockData = {
  username: { fr: "Jean Dupont", en: "John Doe", ar: "جون دو" },
  hero: { /* ... initial local hero data ... */ },
  services: { servicesList: [] },
  education: { education: [], experience: [] },
  skills: { skills: [] },
  projects: { projects: [] },
  about: { aboutDescription: {}, personalInfo: [], languages: {}, interests: [] },
  contact: { contactTitle: {}, contactDescription: {}, contactInfo: [], contactButton: {} },
  photoUrl: ""
};


export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [visitors, setVisitors] = useState<number | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false)
const [mockData, setMockData] = useState(baseMockData);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const router = useRouter();
 const [loading, setLoading] = useState(true);

const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState<any[]>([]);



  // check daily limit on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const storedData = JSON.parse(localStorage.getItem("messageLimit")) || {};
    if (storedData.date === today && storedData.count >= 8) {
      setIsLimitReached(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- email check ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // --- daily limit check ---
    const today = new Date().toDateString();
    const storedData = JSON.parse(localStorage.getItem("messageLimit")) || {};
    let { date, count } = storedData;

    if (date !== today) {
      date = today;
      count = 0;
    }

    if (count >= 8) {
      setIsLimitReached(true);
      alert("You can only send 8 messages per day. hhhhhhhhhhhhhhhhhhhh");
      return;
    }

    setIsSendingMessage(true);
    setIsMessageSent(false);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // update localStorage
        localStorage.setItem(
          "messageLimit",
          JSON.stringify({ date: today, count: count + 1 })
        );

        if (count + 1 >= 8) {
          setIsLimitReached(true);
        }

        setIsMessageSent(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
   
    } finally {
      setIsSendingMessage(false);
    }
  };


useEffect(() => {
  const trackVisit = async () => {
    try {
      // ✅ Load fingerprint
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;

      // ✅ Get IP & country
      let ipData = {};
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) ipData = await res.json();
      } catch (err) {
      
      }

      // ✅ If fingerprint or IP is missing, skip
      if (!visitorId || !ipData.ip) {
      
        return;
      }

      // ✅ Detect device
      const userAgent = navigator.userAgent;
      const device = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";

      // ✅ Prepare data
      const visitorData = {
        fingerprint: visitorId,
        ip: ipData.ip,
        country: ipData.country_name || "",
        userAgent,
        device,
        language: navigator.language,
      };

      // ✅ Send to API with API Key header
      const res = await fetch("/api/track-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "",
        },
        body: JSON.stringify(visitorData),
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.success) setVisitors(data.totalVisitors);
    } catch (err) {
    
    }
  };

  trackVisit();
}, []);




   const [currentLang, setCurrentLang] = useState<"fr" | "en" | "ar">(() => {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('language');
        return saved !== null ? saved as "fr" | "en" | "ar" : "fr";
      }
      return "fr";
    });

  const t = translations[currentLang]
    const [isDarkMode, setIsDarkMode] = useState(() => {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('darkMode');
        return saved !== null ? JSON.parse(saved) : false;
      }
      return false;
    });
  
  
  


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }
  useEffect(() => {
    sessionStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    sessionStorage.setItem('language', currentLang);
    document.documentElement.lang = currentLang;
    // Set RTL direction for Arabic
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Modify your theme toggle function to persist the setting
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    sessionStorage.setItem('darkMode', JSON.stringify(newMode));
  };
 
 // Modify your language change function to persist the setting
  const changeLanguage = (lang: "fr" | "en" | "ar") => {
    setCurrentLang(lang);
    setIsLangMenuOpen(false);
    sessionStorage.setItem('language', lang);
  };


useEffect(() => {
  if (!searchTerm) {
    setSearchResults([]);

    return;
  }

  const term = searchTerm.toLowerCase();
  const results: any[] = [];

  // Search in projects
  mockData.projects.projects.forEach(project => {
    if (
      project.title?.[currentLang]?.toLowerCase().includes(term) ||
      project.description?.[currentLang]?.toLowerCase().includes(term)
    ) {
      results.push({ type: "Project", item: project });
    }
  });

  // Search in skills
  mockData.skills.skills.forEach(category => {
    category.items.forEach(skill => {
      if (
        skill.name?.[currentLang]?.toLowerCase().includes(term) ||
        skill.examples?.some(ex => ex?.[currentLang]?.toLowerCase().includes(term))
      ) {
        results.push({ type: "Skill", item: skill });
      }
    });
  });

  // Search in experience / education
  [...mockData.education.education, ...mockData.education.experience].forEach(event => {
    if (
      event.title?.[currentLang]?.toLowerCase().includes(term) ||
      event.institution?.[currentLang]?.toLowerCase().includes(term) ||
      event.description?.[currentLang]?.toLowerCase().includes(term)
    ) {
      results.push({ type: "Experience", item: event });
    }
  });

  // Search in About Me description
  if (
    mockData.about.aboutDescription?.[currentLang]?.toLowerCase().includes(term)
  ) {
    results.push({ type: "About", item: { description: mockData.about.aboutDescription } });
  }

  // Search in personal info
  mockData.about.personalInfo.forEach(info => {
    if (
      info.label?.[currentLang]?.toLowerCase().includes(term) ||
      info.value?.[currentLang]?.toLowerCase().includes(term)
    ) {
      results.push({ type: "PersonalInfo", item: info });
    }
  });

  // Search in languages
  mockData.about.languages.list.forEach(lang => {
    if (
      lang.name?.[currentLang]?.toLowerCase().includes(term) ||
      (lang.level && lang.level.toLowerCase().includes(term))
    ) {
      results.push({ type: "Language", item: lang });
    }
  });

  // Search in interests
  mockData.about.interests.forEach(interest => {
    if (
      interest.name?.[currentLang]?.toLowerCase().includes(term)
    ) {
      results.push({ type: "Interest", item: interest });
    }
  });

  // Search in Contact
  const contact = mockData.contact;
  if (
    contact.contactTitle?.[currentLang]?.toLowerCase().includes(term) ||
    contact.contactDescription?.[currentLang]?.toLowerCase().includes(term) ||
    contact.contactInfo?.some(info => info.label?.[currentLang]?.toLowerCase().includes(term) || info.value?.toLowerCase().includes(term))
  ) {
    results.push({ type: "Contact", item: contact });
  }

  // Search in Services
  mockData.services.servicesList.forEach(service => {
    if (
      service.title?.[currentLang]?.toLowerCase().includes(term) ||
      service.description?.[currentLang]?.toLowerCase().includes(term)
    ) {
      results.push({ type: "Service", item: service });
    }
  });

  setSearchResults(results);
}, [searchTerm, currentLang]);






  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "experience", "skills", "projects", "about", "contact"]
      const scrollPosition = window.scrollY + 110

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])




 useEffect(() => {
  const fetchAllData = async () => {
    try {
      const endpoints = {
        photo: "/api/photo",
        hero: "/api/hero",
        username: "/api/username",
        about: "/api/about_me",
        contact: "/api/contact",
        services: "/api/services",
        education: "/api/education",
        skills: "/api/skills",
        projects: "/api/projets"
      };

      // Fetch all endpoints in parallel
      const results = await Promise.all(
        Object.entries(endpoints).map(async ([key, url]) => {
          try {
            const res = await fetch(url, {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
              }
            });

            if (!res.ok) throw new Error(`${url} failed`);
            const data = await res.json();
            return { key, data };
          } catch (err) {
            console.error(`Error fetching ${key}:`, err);
            return { key, data: null }; // fallback
          }
        })
      );

      // Build new mockData from base + API
      let updatedData = { ...baseMockData };

      results.forEach(({ key, data }) => {
        if (!data) return; // skip failed fetches
        switch (key) {
          case "photo":
            updatedData = { ...updatedData, photoUrl: data.url };
            break;
          case "hero":
            updatedData = { ...updatedData, hero: data };
            break;
          case "username":
            updatedData = { ...updatedData, username: data };
            break;
          case "about":
            updatedData = { ...updatedData, about: data };
            break;
          case "contact":
            updatedData = { ...updatedData, contact: data };
            break;
          case "services":
            updatedData = { ...updatedData, services: data };
            break;
          case "education":
            updatedData = { ...updatedData, education: data };
            break;
          case "skills":
            updatedData = { ...updatedData, skills: data };
            break;
          case "projects":
            updatedData = { ...updatedData, projects: data };
            break;
          default:
            break;
        }
      });

      setMockData(updatedData);
    } catch (err) {
      console.error("Error fetching all data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".language-menu")) {
        setIsLangMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const languageOptions = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
  ]

  const navItems = [
   { id: "skills", label: t.skills },
    { id: "experience", label: t.experience },
    { id: "projects", label: t.projects },
    { id: "about", label: t.about },
       { id: "services", label: t.services },
    { id: "contact", label: t.contact },
  ];

  const getIcon = (iconName?: string) => {
    if (!iconName) return null; 
    const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    return LucideIcons[pascalCase] || null; 
  };

  // Theme classes
 const themeClasses = {
  background: isDarkMode ? 'bg-black' : 'bg-[#f5f5dc]',
  surface: isDarkMode ? 'bg-black/40' : 'bg-white/40',
  surfaceSolid: isDarkMode ? 'bg-black' : 'bg-white',
  text: isDarkMode ? 'text-white' : 'text-gray-900',
  textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
accent: isDarkMode ? 'text-[#00BFFF]' : 'text-[#0A2647]',
accentBg: isDarkMode ? 'bg-[#3A6EA5]' : 'bg-[#0A2647]',
accentBorder: isDarkMode ? 'border-[#3A6EA5]' : 'border-[#0A2647]',

 glassDark: isDarkMode
  ? 'bg-black/40  border border-white/20 shadow-xl' 
  : 'bg-white/40  border border-black/20 shadow-xl',
shadow: 'shadow-xl',
};

  if (loading) return <Loading/>;
  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses.background} ${themeClasses.text} ${currentLang === 'ar' ? 'font-arabic' : ''}`} style={{ direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 ${themeClasses.glassDark}  backdrop-blur-lg ${themeClasses.shadow} transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 ">
            {/* Logo */}
            <div className="flex-shrink-0">

<div className={`${themeClasses.glassDark}  backdrop-blur-lg ${isDarkMode ? 'text-white' : 'text-[#0A2647]'} border border-white/20 min-w-[30px] w-10 h-10  hover:${themeClasses.accent} rounded-full transition-all duration-300 sm:hover:scale-105
 flex items-center justify-center text-2xl font-bold sm:hidden`}>
  {/* Show first English letter, uppercased */}
<span>
  {
    (
      mockData.username[currentLang]
        .trim() // remove leading/trailing spaces
        .charAt(0) // first character
        || 'L' // fallback
    ).toUpperCase()
  }
</span>

</div>

  {/* Full username for larger screens */}
  <div className={`hidden sm:block text-xl font-bold ${   isDarkMode ? 'text-white' : 'text-[#0A2647]'}  `}>
    <span>{mockData.username[currentLang].toUpperCase()}</span>
  </div>
</div>


            {/* Desktop Navigation */}
            <nav className="hidden xl:flex space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-2xl transition-all duration-300 sm:hover:scale-105
 ${
                    activeSection === item.id
                      ? `${themeClasses.accentBg} text-white ${themeClasses.shadow}`
                      : `${themeClasses.text} hover:${themeClasses.accent}`
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

        {/* Desktop Controls */}
<div
  className={`hidden xl:flex items-center ${
    currentLang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
  }`}
>
  {/* Language Selector */}
  <div className="relative language-menu">
    <Button
      variant="outline"
      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
      className={`${themeClasses.glassDark} backdrop-blur-lg border-white/20 ${themeClasses.text} hover:${themeClasses.accent} rounded-2xl transition-all duration-300 sm:hover:scale-105`}
    >
      <span>{currentLang.toUpperCase()}</span>
      <ChevronDown
        className={`ml-2 h-4 w-4 transition-transform duration-300 ${
          isLangMenuOpen ? "rotate-180" : ""
        }`}
      />
    </Button>

    {isLangMenuOpen && (
      <div
        className={`absolute top-full right-0 mt-2 ${themeClasses.glassDark} backdrop-blur-lg rounded-2xl ${themeClasses.shadow} border border-white/10 min-w-[150px] z-50 transition-all duration-300 animate-in slide-in-from-top-2`}
      >
        {languageOptions.map((option) => (
          <button
            key={option.code}
            onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
            className={`w-full px-4 py-3 text-left  rounded-2xl transition-all duration-300 flex items-center ${
              currentLang === "ar" ? "space-x-reverse space-x-3" : "space-x-3"
            }`}
          >
            <span className="text-lg">{option.flag}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>

  {/* Theme Toggle */}
  <Button
    variant="outline"
    onClick={toggleTheme}
    className={`${themeClasses.glassDark} backdrop-blur-lg border-white/20 ${themeClasses.text} hover:${themeClasses.accent} rounded-2xl transition-all duration-300 sm:hover:scale-105`}
  >
    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </Button>

  {/* Search Toggle */}
  <Button
    variant="outline"
 onClick={() => {
  setIsSearchOpen(!isSearchOpen);
  setSearchTerm("");
}}

    className={`${themeClasses.glassDark} backdrop-blur-lg border-white/20 ${themeClasses.text} hover:${themeClasses.accent} rounded-2xl transition-all duration-300 sm:hover:scale-105`}
  >
    {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
  </Button>

  {/* Hire Me Button */}
  <Button
    onClick={() => scrollToSection("contact")}
    className={`${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl px-6 py-2 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105`}
  >
    {t.hireMe}
  </Button>
</div>

{/* Mobile & Tablet Controls */}
<div
  className={`xl:hidden flex items-center ${
    currentLang === "ar" ? "space-x-reverse space-x-2 sm:space-x-2 md:space-x-3" : "space-x-2 sm:space-x-2 md:space-x-3"
  }`}
>
  {/* Theme Toggle */}
  <Button
    variant="outline"
    onClick={toggleTheme}
    className={`${themeClasses.glassDark} backdrop-blur-lg border-white/20 ${themeClasses.text} rounded-xl sm:rounded-2xl px-2 py-1 sm:px-3 sm:py-2`}
  >
    {isDarkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
  </Button>

  {/* Language Menu */}
  <div className="relative language-menu">
    <Button
      variant="outline"
      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
      className={`${themeClasses.glassDark} backdrop-blur-lg border-white/20 ${themeClasses.text} rounded-xl sm:rounded-2xl px-2 py-1 sm:px-3 sm:py-2`}
    >
      <span className="text-xs sm:text-sm">{currentLang.toUpperCase()}</span>
      <ChevronDown
        className={`ml-1 h-3 w-3 sm:h-4 sm:w-4 ${isLangMenuOpen ? 'rotate-180' : ''} transition-transform duration-300`}
      />
    </Button>

    {isLangMenuOpen && (
      <div
        className={`absolute top-full right-0 mt-1 sm:mt-2 ${themeClasses.glassDark} backdrop-blur-lg rounded-xl sm:rounded-2xl ${themeClasses.shadow} border border-white/10 min-w-[100px] sm:min-w-[120px] z-50`}
      >
        {languageOptions.map((option) => (
          <button
            key={option.code}
            onClick={() => changeLanguage(option.code as "fr" | "en" | "ar")}
            className={`w-full px-2 py-1 sm:px-3 sm:py-2 text-left  rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center ${
              currentLang === "ar" ? "space-x-reverse space-x-1 sm:space-x-2" : "space-x-1 sm:space-x-2"
            } text-xs sm:text-sm`}
          >
            <span>{option.flag}</span>
            <span>{option.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    )}
  </div>

  {/* Search Button */}
  <Button
    variant="outline"
    onClick={() => {setIsSearchOpen(!isSearchOpen);setIsMenuOpen(false); setSearchTerm("");}}
    className={`${themeClasses.glassDark} backdrop-blur-lg border-white/20 ${themeClasses.text} rounded-xl sm:rounded-2xl px-2 py-1 sm:px-3 sm:py-2`}
  >
    {isSearchOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Search className="h-4 w-4 sm:h-5 sm:w-5" />}
  </Button>

  {/* Menu Toggle */}
  <button
    onClick={() => {setIsMenuOpen(!isMenuOpen);setIsSearchOpen(false); setSearchTerm("");}}
    className={`${themeClasses.text} hover:${themeClasses.accent} transition-colors duration-300`}
  >
    {isMenuOpen ? <X className="h-6 w-6 sm:h-6 sm:w-6" /> : <Menu className="h-6 w-6 sm:h-6 sm:w-6" />}
  </button>
</div>


          </div>

{/* Mobile Menu */}
{isMenuOpen && (
  <div
    className={`xl:hidden ${themeClasses.glassDark} backdrop-blur-lg rounded-2xl mb-4 p-4 ${themeClasses.shadow} transition-all duration-300 animate-in slide-in-from-top-2`}
    dir={currentLang === "ar" ? "rtl" : "ltr"} // set direction
  >
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`px-4 py-3 rounded-2xl transition-all duration-300 ${
            currentLang === "ar" ? "text-right" : "text-left"
          } ${
            activeSection === item.id
              ? `${themeClasses.accentBg} text-white`
              : `${themeClasses.text} hover:${themeClasses.accentBg} hover-text:${themeClasses.accentBg}`
          }`}
        >
          {item.label}
        </button>
      ))}
      <div className="pt-2">
        <Button
          onClick={() => scrollToSection("contact")}
          className={`w-full ${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl`}
        >
          {t.hireMe}
        </Button>
      </div>
    </nav>
  </div>
)}


          {/* Search Bar */}
          {isSearchOpen && (
          <div className={`${themeClasses.glassDark} backdrop-blur-lg rounded-2xl mb-4 p-4 ${themeClasses.shadow} transition-all duration-300 animate-in slide-in-from-top-2`}>
  <div className="relative">
    <input
      type="text"
      placeholder={
        currentLang === "fr" ? "Rechercher..." :
        currentLang === "en" ? "Search..." :
        "البحث..."
      }
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={`w-full px-4 py-3 ${themeClasses.glassDark} border border-white/20 rounded-2xl ${themeClasses.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A2647] transition-all duration-300`}
    />
    {searchTerm && (
      <button
        onClick={() => setSearchTerm("")}
        aria-label="Clear search"
        className={`absolute top-1/2 -translate-y-1/2 ${currentLang === "ar" ? "left-3" : "right-3"} ${themeClasses.textMuted} hover:${themeClasses.accent} transition-colors duration-300`}
      >
        <X size={18} />
      </button>
    )}
  </div>
</div>

          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className={`pt-32 pb-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in  duration-1000">
              {mockData.hero.specialist?.[currentLang] && (
             <div
  className={`inline-flex items-center ${
    currentLang === "ar" ? "space-x-reverse space-x-2" : "space-x-2"
  } ${themeClasses.glassDark} px-4 py-2 rounded-2xl ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105`}
>
  <Star className={`h-5 w-5 ${themeClasses.accent}`} />
  <span className={`${themeClasses.textMuted} font-medium`}>
    {mockData.hero.specialist[currentLang]}
  </span>
</div>

              )}

              {mockData.hero.heroTitle?.[currentLang] && (
                <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${themeClasses.text} transition-all duration-500`}>
                  {mockData.hero.heroTitle[currentLang]}
                </h1>
              )}

              {mockData.hero.heroDescription?.[currentLang] && (
                <p className={`text-lg md:text-xl ${themeClasses.textMuted} max-w-2xl leading-relaxed font-sans`}>
                  {mockData.hero.heroDescription[currentLang]}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
            <Button
       onClick={() => router.push("/cv")}
      className={`${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl px-8 py-3 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105 text-lg`}
    >
      {t.viewJourney}
    </Button>

            {mockData.hero.heroButtons?.map((button, index) => {
  const Icon = getIcon(button.icon);
  const isExternal = button.link?.startsWith("http");

  return (
    <Button
      key={index}
      variant="outline"
      asChild // 👈 allows Button to wrap an <a>
      className={`${themeClasses.glassDark} border-white/20 ${themeClasses.text} hover:${themeClasses.accentBg} rounded-2xl px-8 py-3 transition-all duration-300 sm:hover:scale-105 text-lg`}
    >
      <a
        href={button.link || "#"}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : ""}
      >
        {Icon && <Icon className="mr-2 h-5 w-5 inline-block" />}
        {button.text?.[currentLang]}
      </a>
    </Button>
  );
})}

              </div>
            </div>

         <div className="flex justify-center lg:justify-end lg:animate-in lg:slide-in-from-right duration-1000">
  <div className={`relative ${themeClasses.glassDark} rounded-2xl p-4 sm:p-6 md:p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
`}>
    <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-2xl overflow-hidden">
      <Image
        src={mockData.photoUrl || "https://woxgxzelncuqwury.public.blob.vercel-storage.com/free.png"}
        alt="Profile photo"
        width={400}
        height={400}
        priority
        className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-[#0A2647]/20 to-transparent`}></div>
    </div>
  </div>
</div>

          </div>
        </div>
      </section>


{/* Skills Section */}
<section id="skills" className={`py-20 ${themeClasses.background}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2
      className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}
    >
      {t.skillsTitle}
      <span
        className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}
      ></span>
    </h2>

    {/* One container for all categories */}
                    <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105  space-y-12
`}>  {mockData.skills.skills.map((category, catIndex) => {
        const CategoryIcon = getIcon(category.skillicon);

        return (
          <div key={`cat-${catIndex}`}>
            {/* Category Title */}
            <h3
              className={`text-2xl font-semibold mb-8 ${themeClasses.text} flex items-center`}
            >
              {CategoryIcon && (
                <CategoryIcon
                  className={`h-6 w-6 ${themeClasses.accent} ${
                    currentLang === "ar" ? "ml-3" : "mr-3"
                  }`}
                />
              )}
              {category.title?.[currentLang]}
            </h3>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.items.map((skill, skillIndex) => {
                const SkillIcon = getIcon(skill.icon);

                return (
                  <Card
                    key={`cat-${catIndex}-skill-${skillIndex}`}
                    className={`${themeClasses.glassDark} border-white/10 rounded-2xl transition-all duration-300 sm:hover:scale-105 hover:shadow-lg group${themeClasses.glassDark}${themeClasses.shadow} `}
                  >
                    <CardContent className="p-6 text-center">
                      {SkillIcon && (
                        <SkillIcon
                          className={`h-8 w-8 mx-auto ${themeClasses.accent} mb-4 group-hover:scale-110 transition-transform duration-300`}
                        />
                      )}

                      {/* Skill name with scrolling if too long */}
                      <h4
                        className={`relative overflow-hidden whitespace-nowrap text-lg font-semibold mb-3 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}
                      >
                        <span className="inline-block animate-marquee sm:animate-none">
                          {skill.name?.[currentLang]}
                        </span>
                      </h4>

                      {skill.examples?.length > 0 && (
                        <ul
                          className={`space-y-1 ${themeClasses.textMuted} text-sm text-left`}
                        >
                          {skill.examples.map((ex, exIndex) => (
                            <li
                              key={`cat-${catIndex}-skill-${skillIndex}-ex-${exIndex}`}
                              className="flex items-center"
                            >
                              <span
                                className={`w-2 h-2 ${themeClasses.accentBg} rounded-full ${
                                  currentLang === "ar" ? "ml-2" : "mr-2"
                                }`}
                              ></span>
                              {ex?.[currentLang]}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>
      {/* Experience Section */}
      <section id="experience" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
            {t.journeyTitle}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education */}
            <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
`}>
             <h3 className={`text-2xl font-semibold mb-8 ${themeClasses.text} flex items-center`}>
  <GraduationCap
    className={`h-6 w-6 ${themeClasses.accent} ${
      currentLang === "ar" ? "ml-3" : "mr-3"
    }`}
  />
  {currentLang === "fr"
    ? "Formation"
    : currentLang === "en"
    ? "Education"
    : "التعليم"}
</h3>

              <div className="space-y-8">
                {mockData.education.education.slice().reverse().map((event, index) => (
   <div
  key={index}
  className={`relative ${
    currentLang === "ar" 
      ? "pr-8 border-r-2"   // RTL: الخط على اليمين
      : "pl-8 border-l-2"   // LTR: الخط على اليسار
  } ${
    isDarkMode
      ? "border-white/30"
      : "border-[#0A2647]/30"
  }`}
>

                 <div
    className={`absolute top-0 w-4 h-4 ${themeClasses.accentBg} rounded-full 
      ${currentLang === "ar" ? "-right-2" : "-left-2"}`}
  ></div>
  <div
    className={`absolute top-1 w-2 h-2 bg-white rounded-full 
      ${currentLang === "ar" ? "-right-1" : "-left-1"}`}
  ></div>
                    <p className={`text-sm ${themeClasses.accent} font-semibold mb-2`}>
                      {event.year?.[currentLang]}
                    </p>
                    <h4 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>
                      {event.title?.[currentLang]}
                    </h4>
                    <p className={`${themeClasses.textMuted} mb-2`}>
                      {event.institution?.[currentLang]}
                    </p>
                    {event.description && (
                      <p className={`${themeClasses.textMuted} text-sm`}>
                        {event.description?.[currentLang]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
`}>
              <h3 className={`text-2xl font-semibold mb-8 ${themeClasses.text} flex items-center`}>
  <Briefcase
    className={`h-6 w-6 ${themeClasses.accent} ${
      currentLang === "ar" ? "ml-3" : "mr-3"
    }`}
  />
  {currentLang === "fr"
    ? "Expérience"
    : currentLang === "en"
    ? "Experience"
    : "الخبرة"}
</h3>

              <div className="space-y-8">
                {mockData.education.experience.slice().reverse().map((event, index) => (
            <div
  key={index}
  className={`relative ${
    currentLang === "ar" 
      ? "pr-8 border-r-2"   // RTL: الخط على اليمين
      : "pl-8 border-l-2"   // LTR: الخط على اليسار
  } ${
    isDarkMode
      ? "border-white/30"
      : "border-[#0A2647]/30"
  }`}
>

                 <div
    className={`absolute top-0 w-4 h-4 ${themeClasses.accentBg} rounded-full 
      ${currentLang === "ar" ? "-right-2" : "-left-2"}`}
  ></div>
  <div
    className={`absolute top-1 w-2 h-2 bg-white rounded-full 
      ${currentLang === "ar" ? "-right-1" : "-left-1"}`}
  ></div>
            
                    <div className="flex items-center gap-3 mb-2">
                      <p className={`text-sm ${themeClasses.accent} font-semibold`}>
                        {event.year?.[currentLang]}
                      </p>
                      {event.duration && (
                        <Badge className={`${themeClasses.accentBg} text-white text-xs`}>
                          {event.duration}
                        </Badge>
                      )}
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>
                      {event.title?.[currentLang]}
                    </h4>
                    <p className={`${themeClasses.textMuted} mb-2`}>
                      {event.institution?.[currentLang]}
                    </p>
                    {event.description && (
                      <p className={`${themeClasses.textMuted} text-sm`}>
                        {event.description?.[currentLang]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* Projects Section */}
      <section id="projects" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
            {t.myProjects}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {mockData.projects.projects.slice().reverse().map((project: any) => (
              <Card
                key={project._id}
                className={` rounded-2xl overflow-hidden ${themeClasses.accent}   transition-all duration-300 sm:hover:scale-105
 hover:shadow-2xl group ${themeClasses.glassDark}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title?.[currentLang] || 'Project'}
                    width={800}
                    height={450}
                    className="object-cover w-full h-full transition-transform duration-500 sm:group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>

                <CardContent className="p-8">
                  <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}>
                    {project.title?.[currentLang]}
                  </h3>
                  <p className={`${themeClasses.textMuted} mb-6 leading-relaxed`}>
                    {project.description?.[currentLang]}
                  </p>

                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech: string, techIndex: number) => (
                        <Badge
                          key={techIndex}
                          className={`${themeClasses.glassDark} ${themeClasses.textMuted} border border-white/20 hover:${themeClasses.accentBg} hover:text-white transition-all duration-300`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {project.button && (
                    <div>
                      <Button
                        onClick={() => window.open(project.button.link, "_blank")}
                        className={`${themeClasses.accentBg} hover:bg-[#0A2647]/90 text-white rounded-2xl transition-all duration-300 sm:hover:scale-105
`}
                      >
                        <Link className="mr-2 h-4 w-4" />
                        {project.button.label?.[currentLang] || 'View Project'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
    {t.aboutTitle}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
`}>
             <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${themeClasses.text}`}>
                {mockData.username?.[currentLang]}
          
              </h2> 

              <p className={`${themeClasses.textMuted} text-lg leading-relaxed mb-8`}>
                {mockData.about.aboutDescription?.[currentLang]}
              </p>

              <div className="space-y-6">
                {mockData.about.personalInfo?.map((info, index) => {
                  const IconComponent = getIcon(info.icon);
                  return (
                 <div
  key={index}
  className={`flex items-center ${
    currentLang === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
  }`}
>
  {IconComponent && (
    <div className={`${themeClasses.accentBg} p-3 rounded-2xl`}>
      <IconComponent className="h-5 w-5 text-white" />
    </div>
  )}
  <div>
    <p className={`font-medium ${themeClasses.text}`}>
      {info.label?.[currentLang]}
    </p>
    <p className={`${themeClasses.textMuted}`}>
      {info.value?.[currentLang]}
    </p>
  </div>
</div>

                  );
                })}
              </div>
            </div>

            <div className="space-y-8">
              {/* Languages */}
              <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
`}>
            <h3 className={`text-2xl font-semibold mb-6 ${themeClasses.text} flex items-center`}>
  <LanguagesIcon
    className={`h-6 w-6 ${themeClasses.accent} ${
      currentLang === "ar" ? "ml-3" : "mr-3"
    }`}
  />
  {mockData.about.languages?.title?.[currentLang]}
</h3>

                <div className="space-y-4">
            {mockData.about.languages?.list?.map((lang, index) => {
  const levelKey = lang.level.toLowerCase(); 
  const levelText = mockData.about.languages?.levels?.[levelKey]?.[currentLang] || '';

  
  const levelPercentages = {
    a1: 10,
    a2: 30,
    b1: 50,
    b2: 70,
    c1: 85,
    c2: 95,
    native: 100
  };

  const levelPercentage = levelPercentages[levelKey] || 0;

  return (
    <div key={index} className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className={`font-medium ${themeClasses.text}`}>
          {lang.name?.[currentLang]}
        </span>
        <span className={`text-sm ${themeClasses.textMuted}`}>
          {levelText}
        </span>
      </div>
      <div className={`h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${themeClasses.accentBg} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${levelPercentage}%` }}
        ></div>
      </div>
    </div>
  );
})}

                </div>
              </div>

              {/* Interests */}
              <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
`}>
  
  
  <h3 className={`text-2xl font-semibold mb-6 ${themeClasses.text} flex items-center`}>
  <Heart
    className={`h-6 w-6 ${themeClasses.accent} ${
      currentLang === "ar" ? "ml-3" : "mr-3"
    }`}
  />
  {t.interests}
</h3>

                <div className="flex flex-wrap gap-3">
                  {mockData.about.interests?.map((interest, index) => {
                    const IconComponent = getIcon(interest.icon);
                    return (
                    <Badge
  key={index}
  className={`${themeClasses.glassDark} ${themeClasses.text} border border-white/20 px-4 py-2 rounded-2xl hover:${themeClasses.accentBg} transition-all duration-300 sm:hover:scale-105
`}
>
  {IconComponent && (
    <IconComponent
      className={`h-4 w-4 ${
        currentLang === "ar" ? "ml-2" : "mr-2"
      }`}
    />
  )}
  {interest.name?.[currentLang]}
</Badge>

                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    {/* Services Section */}
      <section id="services" className={`py-20 ${themeClasses.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${themeClasses.text}`}>
            {t.servicesTitle}
            <span className={`block w-20 h-1 ${themeClasses.accentBg} mx-auto mt-4 rounded-full`}></span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockData.services.servicesList.map((service, index) => {
              const title = service.title?.[currentLang];
              const description = service.description?.[currentLang];

              return (
                <Card
                  key={index}
                  className={`${themeClasses.glassDark} border-white/10 rounded-2xl ${themeClasses.shadow} ${themeClasses.glassDark} transition-all duration-300 sm:hover:scale-105
 hover:shadow-2xl group`}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-6xl font-bold ${themeClasses.accent} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}>
                        0{index + 1}
                      </span>
                      <ArrowUpRight className={`h-6 w-6 ${themeClasses.accent} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}>
                      {title}
                    </h3>
                    {description && (
                      <p className={`${themeClasses.textMuted} leading-relaxed`}>
                        {description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
   {/* Contact Section */}
<section id="contact" className={`py-20 ${themeClasses.background}`}>
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${themeClasses.text}`}>
      {mockData.contact.contactTitle?.[currentLang]}
    </h2>
    <p className={`text-lg ${themeClasses.textMuted} mb-12 max-w-2xl mx-auto`}>
      {mockData.contact.contactDescription?.[currentLang]}
    </p>

    {/* Contact Info Cards */}
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {mockData.contact.contactInfo?.map((info, index) => {
        const IconComponent = getIcon(info.icon);
        return (
          <div
            key={index}
            className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
 group`}
          >
            <div
              className={`${themeClasses.accentBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
            </div>
            <h3
              className={`text-xl font-semibold mb-4 ${themeClasses.text} group-hover:${themeClasses.accent} transition-colors duration-300`}
            >
              {info.label?.[currentLang]}
            </h3>
            <p className={`${themeClasses.textMuted}`}>
              {info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : "_self"}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : ""}
                  className={`hover:${themeClasses.accent} transition-colors duration-300`}
                >
                  {typeof info.value === "object"
                    ? info.value[currentLang]
                    : info.value}
                </a>
              ) : typeof info.value === "object" ? (
                info.value[currentLang]
              ) : (
                info.value
              )}
            </p>
          </div>
        );
      })}
    </div>   {/* Button */}
<a
  href={mockData.contact.contactButton?.link || "#contact-form"}
  className={`inline-flex items-center ${themeClasses.accentBg} hover:opacity-90 text-white px-8 py-4 rounded-2xl ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105 text-lg font-semibold`}
>
  <Send
    className={`h-5 w-5 ${
      currentLang === "ar" ? "ml-3" : "mr-3"
    }`}
  />
  {mockData.contact.contactButton?.startProject?.[currentLang]}
</a>

 <br /><br /><br />
  {/* Contact Form */}
  
  <div className={`${themeClasses.glassDark} rounded-2xl p-8 ${themeClasses.shadow} transition-all duration-300 sm:hover:scale-105
`}>
  <h3 className={`text-2xl font-bold mb-8 text-center ${themeClasses.text}`}> 
  {currentLang === "en"
    ? "Contact Me"
    : currentLang === "fr"
    ? "Contactez-moi"
    : "اتصل بي"}
</h3>

<form
  id="contact-form"
  className="space-y-6 text-left relative"
  onSubmit={handleSubmit}
>
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder={
      currentLang === "en"
        ? "Your name"
        : currentLang === "fr"
        ? "Votre nom"
        : "اسمك"
    }
    className={`w-full px-4 py-3 rounded-xl border ${
      isDarkMode
        ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
        : "bg-white text-black border-gray-300 placeholder-gray-500"
    }`}
    required
    disabled={isLimitReached}
  />

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder={
      currentLang === "en"
        ? "Your email"
        : currentLang === "fr"
        ? "Votre email"
        : "بريدك الإلكتروني"
    }
    className={`w-full px-4 py-3 rounded-xl border ${
      isDarkMode
        ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
        : "bg-white text-black border-gray-300 placeholder-gray-500"
    }`}
    required
    disabled={isLimitReached}
  />

  <textarea
    name="message"
    rows={5}
    value={formData.message}
    onChange={handleChange}
    placeholder={
      currentLang === "en"
        ? "Write your message..."
        : currentLang === "fr"
        ? "Écrivez votre message..."
        : "اكتب رسالتك..."
    }
    className={`w-full px-4 py-3 rounded-xl border ${
      isDarkMode
        ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
        : "bg-white text-black border-gray-300 placeholder-gray-500"
    }`}
    required
    disabled={isLimitReached}
  ></textarea>

  <button
    type="submit"
    disabled={isSendingMessage || isLimitReached}
    className={`w-full flex justify-center items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold ${
      isLimitReached
        ? "bg-gray-400 cursor-not-allowed"
        : `${themeClasses.accentBg} hover:opacity-90 text-white`
    }`}
  >
    {isLimitReached
      ? currentLang === "en"
        ? "Try later"
        : currentLang === "fr"
        ? "Réessayez plus tard"
        : "حاول لاحقًا"
      : isSendingMessage
      ? currentLang === "en"
        ? "Sending..."
        : currentLang === "fr"
        ? "Envoi..."
        : "جارٍ الإرسال..."
      : currentLang === "en"
      ? "Send Message"
      : currentLang === "fr"
      ? "Envoyer le message"
      : "إرسال الرسالة"}
  </button>
{isMessageSent && (
  <p
    className={`font-semibold mt-2 p-2 rounded border transition-colors duration-300 ${
      currentLang === "ar" ? "text-right" : "text-left"
    } ${isDarkMode 
        ? "bg-green-800 text-green-400 border-green-600" 
        : "bg-green-100 text-green-600 border-green-300"
      }`}
    dir={currentLang === "ar" ? "rtl" : "ltr"}
  >
    {currentLang === "en"
      ? "Message sent successfully!"
      : currentLang === "fr"
      ? "Message envoyé avec succès !"
      : "تم إرسال الرسالة بنجاح!"}
  </p>
)}

</form>


</div>

 
  </div>
</section>

      {/* Footer */}
      <footer className={`${themeClasses.glassDark} border-t border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
          <span
  className={`text-2xl font-bold ${
    isDarkMode ? 'text-white' : 'text-[#0A2647]'
  }`}
>



                © 2025 {mockData.username?.[currentLang]}
              </span>
            </div>
            <p className={`${themeClasses.textMuted}`}>{t.rightsReserved}</p>
          </div>
        </div>
      </footer>


{searchTerm && (
  <div
    className="fixed top-40 inset-x-0 z-40 backdrop-blur overflow-auto py-8"
    style={{ maxHeight: "calc(100vh - 4rem)" }} // adjust 4rem if your header height is different
  >
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`${themeClasses.glassDark} p-8 rounded-3xl shadow-xl`}>
        <h2 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${themeClasses.text}`}>
          {currentLang === "en"
            ? "Search Results"
            : currentLang === "fr"
            ? "Résultats de recherche"
            : "نتائج البحث"}
        </h2>

        {searchResults.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className={`${themeClasses.glassDark} p-6 rounded-2xl ${themeClasses.shadow} transition-all duration-300`}
              >
                <p className="font-semibold mb-2">{result.type}</p>

                {/* Title / Name */}
                <h3 className={`${themeClasses.text} font-medium mb-2`}>
                  {result.type === "Skill" && result.item.name?.[currentLang]}
                  {result.type === "Project" && result.item.title?.[currentLang]}
                  {result.type === "Experience" && result.item.title?.[currentLang]}
                  {result.type === "Service" && result.item.title?.[currentLang]}
                  {result.type === "About" && currentLang && "About Me"}
                  {result.type === "PersonalInfo" && result.item.label?.[currentLang]}
                  {result.type === "Language" && result.item.name?.[currentLang]}
                  {result.type === "Interest" && result.item.name?.[currentLang]}
                  {result.type === "Contact" && result.item.contactTitle?.[currentLang]}
                </h3>

                {/* Description / Details */}
                {result.type === "Skill" && result.item.examples?.length > 0 && (
                  <ul className={`${themeClasses.textMuted} text-sm mt-1 list-disc list-inside`}>
                    {result.item.examples.map((ex, i) => (
                      <li key={i}>{ex?.[currentLang]}</li>
                    ))}
                  </ul>
                )}

                {result.type === "Experience" && (
                  <>
                    {result.item.institution && (
                      <p className={`${themeClasses.textMuted} text-sm`}>
                        {result.item.institution?.[currentLang]}
                      </p>
                    )}
                    {result.item.description && (
                      <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                        {result.item.description?.[currentLang]}
                      </p>
                    )}
                  </>
                )}

                {result.type === "Project" && result.item.description && (
                  <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                    {result.item.description?.[currentLang]}
                  </p>
                )}

                {result.type === "Service" && result.item.description && (
                  <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                    {result.item.description?.[currentLang]}
                  </p>
                )}

                {result.type === "About" && result.item.description && (
                  <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                    {result.item.description?.[currentLang]}
                  </p>
                )}

                {result.type === "PersonalInfo" && (
                  <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                    {result.item.value?.[currentLang]}
                  </p>
                )}

                {result.type === "Language" && (
                  <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                    Level: {mockData.about.languages.levels[result.item.level]?.[currentLang] || result.item.level}
                  </p>
                )}

                {result.type === "Interest" && (
                  <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                    {result.item.name?.[currentLang]}
                  </p>
                )}

                {result.type === "Contact" && (
                  <>
                    {result.item.contactDescription && (
                      <p className={`${themeClasses.textMuted} text-sm mt-1`}>
                        {result.item.contactDescription?.[currentLang]}
                      </p>
                    )}
                    {result.item.contactInfo?.map((info, i) => (
                      <p key={i} className={`${themeClasses.textMuted} text-sm`}>
                        {info.label?.[currentLang]}: {info.value}
                      </p>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center ${themeClasses.textMuted}`}>
            {currentLang === "en"
              ? "No results found."
              : currentLang === "fr"
              ? "Aucun résultat trouvé."
              : "لم يتم العثور على نتائج."}
          </p>
        )}
        <br /><br /><br /><br /><br />
      </div>
    </div>
  </div>
)}




      
    </div>
    
  )
}
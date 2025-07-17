"use client"
import Head from 'next/head';
import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import {
  Mail,
  Phone,
  MapPin,
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
  Globe,
  ChevronDown,
  Code,
  Database,
  LayoutGrid,
  Users,
  MapPinIcon,
  Github,
  Link,
  Search,
} from "lucide-react"

// Translation data for Smail Yazidi
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

    // Hero
    specialist: "Développeur Web Full Stack",
    heroTitle: "Transformez vos idées en applications web puissantes",
    heroDescription:
      "Je suis une personne dynamique et ambitieuse avec des compétences en développement web et applications web. Diplômé en développement web full-stack et formé au Centre Azrou pour le Développement Communautaire, je cherche à utiliser mes compétences et à faire partie d'une équipe motivée.",
    viewJourney: "Voir Mon Parcours",

    // Services
    servicesTitle: "Services",
    service1Title: "Développement Web",
    service1Desc: "Conception et développement d'applications web robustes et évolutives, du front-end au back-end.",
    service2Title: "Applications Mobiles",
    service2Desc:
      "Création d'applications mobiles performantes et intuitives pour iOS et Android, avec des expériences utilisateur fluides.",
    service3Title: "Gestion de Projets Web",
    service3Desc:
      "Organisation et direction de projets web, assurant une livraison efficace et la satisfaction du client.",

    // Experience & Education Timeline
    journeyTitle: "Parcours Professionnel & Éducatif",
    internshipIT: "Stage en Informatique",
    alAkhawaynUniversity: "Al Akhawayn University",
    ifrane: "Ifrane",
    internshipITDesc: "Stage pratique en informatique et développement web.",
    itWebDev: "Informatique et Développement Web",
    centreAzrou: "Centre Azrou pour le développement communautaire",
    itWebDevDesc: "Formation en Informatique et Développement Web.",
    internshipWebDev: "Stage en Développement Web",
    communeSidiMokhfi: "Commune de Sidi Mokhfi",
    sidiMokhfi: "Sidi Mokhfi",
    internshipWebDevDesc: "Application des compétences en développement web et contribution à une équipe dynamique.",
    diplomaFullStack: "Diplôme en Développement Digital Web Full Stack",
    istaIfrane: "Institut Spécialisé de Technologie Appliquée Ifrane (OFPPT)",
    diplomaFullStackDesc: "Formation complète en développement web full stack.",
    baccalaureate: "Baccalauréat en Sciences de la Vie et de la Terre",
    lyceeSidiElMakhfi: "Lycée Qualifiant Sidi El Makhfi",
    baccalaureateDesc: "Diplôme de fin d'études secondaires.",

    // Skills
    skillsTitle: "Mes Compétences",
    programmingLanguages: "Langages de Programmation",
    backendLanguage: "Langage Backend",
    scriptingLanguage: "Langage de Scripting",
    backendRuntime: "Environnement d'exécution Backend",
    frameworksLibraries: "Frameworks et Bibliothèques",
    phpFramework: "Framework PHP",
    frontendFramework: "Framework Frontend",
    cssFramework: "Framework CSS",
    databases: "Bases de Données",
    relationalDatabase: "Base de Données Relationnelle",
    nosqlDatabase: "Base de Données NoSQL",
    otherTechnicalSkills: "Autres Compétences Techniques",
    technicalAnalysis: "Analyse Technique",
    understandingSystemsNeeds: "Compréhension des systèmes et des besoins",
    webAppDevelopment: "Développement d'Applications Web",
    buildingFunctionalWebApps: "Construction d'applications web fonctionnelles",
    webProjectManagement: "Gestion de Projets Web",
    organizingLeadingWebProjects: "Organisation et direction de projets web",
    versionControlGit: "Contrôle de Version : Git",
    managingCodeVersions: "Gestion des versions de code",
    softSkills: "Compétences Non Techniques",
    teamwork: "Travail d'Équipe",
    workingWellWithOthers: "Bien travailler avec les autres",
    effectiveCommunication: "Communication Efficace",
    sharingIdeasClearly: "Partager des idées clairement",
    problemSolving: "Résolution de Problèmes",
    findingSmartSolutions: "Trouver des solutions intelligentes",
    timeManagement: "Gestion du Temps",
    usingTimeWisely: "Utiliser le temps judicieusement",
    adaptability: "Adaptabilité",
    adjustingToChange: "S'adapter au changement",
    criticalThinking: "Pensée Critique",
    analyzingReasoning: "Analyser et raisonner",
    creativity: "Créativité",
    thinkingOutsideTheBox: "Penser différemment",
    initiative: "Initiative",
    takingActionIndependently: "Agir de manière indépendante",

    // Projects
    myProjects: "Mes Projets",
    animovTitle: "Animov",
    animovDesc:
      "AniMov est une plateforme pour suivre, noter et discuter de films, séries, livres, mangas et animes — créez des listes de visionnage, de lecture, de favoris et partagez vos pensées avec vos amis.",
    tableManagementTitle: "Système de Gestion de Table",
    tableManagementDesc:
      "Un système d'affichage numérique en temps réel développé pour le département CLE de l'Université Al Akhawayn. Il aide les étudiants à identifier rapidement leurs tuteurs et tables assignés grâce à une interface intuitive et photo-supportée.",
    github: "GitHub",
    live: "Live",

    // About
    aboutTitle: "À Propos de Moi",
    aboutDescription:
      "Jeune professionnel passionné par le développement web, je développe mes compétences avec une approche moderne et innovante, cherchant à contribuer à des projets stimulants.",
    age: "Âge",
    location: "Localisation",
    status: "Statut",
    nationality: "Nationalité",
    years: "21 ans",
    locationValue: "IFRANE, MOROC",
    single: "Célibataire",
    moroccan: "Marocaine",
    languages: "Langues",
    interests: "Centres d'Intérêt",
    sport: "🏃 Sport",
    travel: "✈️ Voyage",
    coding: "💻 Codage",
    // Remove: reading: "📚 Lecture",

    // Language levels
    native: "Maternelle",
    good: "Bien",
    average: "Moyen",

    // Contact
    contactTitle: "Travaillons Ensemble",
    contactDescription:
      "Prêt à donner vie à votre projet ? Contactez-moi pour discuter de vos besoins et découvrir comment nous pouvons collaborer.",
    email: "Email",
    phone: "Téléphone",
    startProject: "Commencer un Projet",

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

    // Hero
    specialist: "Full Stack Web Developer",
    heroTitle: "Transform your ideas into powerful web applications",
    heroDescription:
      "I'm a dynamic and ambitious person with skills in web development and web applications. I have a diploma in full-stack web development and trained at the Centre Azrou for Community Development. I'm looking to use my skills and be part of a motivated team.",
    viewJourney: "View My Journey",

    // Services
    servicesTitle: "Services",
    service1Title: "Web Development",
    service1Desc: "Design and development of robust and scalable web applications, from front-end to back-end.",
    service2Title: "Mobile Applications",
    service2Desc:
      "Creation of high-performance and intuitive mobile applications for iOS and Android, with fluid user experiences.",
    service3Title: "Web Project Management",
    service3Desc: "Organization and leadership of web projects, ensuring efficient delivery and client satisfaction.",

    // Experience & Education Timeline
    journeyTitle: "Work Experience & Education Timeline",
    internshipIT: "Web Development Internship",
    alAkhawaynUniversity: "Al Akhawayn University",
    ifrane: "Ifrane",
    internshipITDesc: "Practical internship in web development.",
    itWebDev: "Web Development",
    centreAzrou: "Centre Azrou for Community Development",
    itWebDevDesc: "Training in Web Development.",
    internshipWebDev: "Web Development Internship",
    communeSidiMokhfi: "Commune de Sidi Mokhfi",
    sidiMokhfi: "Sidi Mokhfi",
    internshipWebDevDesc: "Application of web development skills and contribution to a dynamic team.",
    diplomaFullStack: "Full Stack Digital Web Development Diploma",
    istaIfrane: "Specialized Institute of Applied Technology Ifrane (OFPPT)",
    diplomaFullStackDesc: "Comprehensive training in full stack web development.",
    baccalaureate: "Baccalaureate in Life and Earth Sciences",
    lyceeSidiElMakhfi: "Qualifying High School Sidi El Makhfi",
    baccalaureateDesc: "High school diploma.",

    // Skills
    skillsTitle: "My Skills",
    programmingLanguages: "Programming Languages",
    backendLanguage: "Backend Language",
    scriptingLanguage: "Scripting Language",
    backendRuntime: "Backend Runtime",
    frameworksLibraries: "Frameworks and Libraries",
    phpFramework: "PHP Framework",
    frontendFramework: "Frontend Framework",
    cssFramework: "CSS Framework",
    databases: "Databases",
    relationalDatabase: "Relational Database",
    nosqlDatabase: "NoSQL Database",
    otherTechnicalSkills: "Other Technical Skills",
    technicalAnalysis: "Technical Analysis",
    understandingSystemsNeeds: "Understanding systems and needs",
    webAppDevelopment: "Web Application Development",
    buildingFunctionalWebApps: "Building functional web apps",
    webProjectManagement: "Web Project Management",
    organizingLeadingWebProjects: "Organizing and leading web projects",
    versionControlGit: "Version Control: Git",
    managingCodeVersions: "Managing code versions",
    softSkills: "Soft Skills",
    teamwork: "Teamwork",
    workingWellWithOthers: "Working well with others",
    effectiveCommunication: "Effective Communication",
    sharingIdeasClearly: "Sharing ideas clearly",
    problemSolving: "Problem Solving",
    findingSmartSolutions: "Finding smart solutions",
    timeManagement: "Time Management",
    usingTimeWisely: "Using Time wisely",
    adaptability: "Adaptability",
    adjustingToChange: "Adjusting to change",
    criticalThinking: "Critical Thinking",
    analyzingReasoning: "Analyzing and reasoning",
    creativity: "Creativity",
    thinkingOutsideTheBox: "Thinking outside the box",
    initiative: "Initiative",
    takingActionIndependently: "Taking action independently",

    // Projects
    myProjects: "My Projects",
    animovTitle: "Animov",
    animovDesc:
      "AniMov a platform to track, rate, and discuss movies, series, books, manga, and anime — create watchlists, read lists, favorites, and share your thoughts with friends.",
    tableManagementTitle: "Table Management System",
    tableManagementDesc:
      "A real-time digital display system developed for the CLE department at Akhawayn University. It helps students quickly identify their assigned tutors and tables using an intuitive, photo-supported interface.",
    github: "GitHub",
    live: "Live",

    // About
    aboutTitle: "About Me",
    aboutDescription:
      "Young professional passionate about web development, I develop my skills with a modern and innovative approach, seeking to contribute to challenging projects.",
    age: "Age",
    location: "Location",
    status: "Status",
    nationality: "Nationality",
    years: "21 years",
    locationValue: "IFRANE, MOROCCO",
    single: "Single",
    moroccan: "Moroccan",
    languages: "Languages",
    interests: "Interests",
    sport: "🏃 Sports",
    travel: "✈️ Travel",
    coding: "💻 Coding",
    // Remove: reading: "📚 Reading",

    // Language levels
    native: "Native",
    good: "Good",
    average: "Average",

    // Contact
    contactTitle: "Let's Work Together",
    contactDescription:
      "Ready to bring your project to life? Contact me to discuss your needs and discover how we can collaborate.",
    email: "Email",
    phone: "Phone",
    startProject: "Start a Project",

    // Footer
    rightsReserved: "All rights reserved",
  },
}

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentLang, setCurrentLang] = useState<"en" | "fr">("en")
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const t = translations[currentLang]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const changeLanguage = (lang: "fr" | "en") => {
    setCurrentLang(lang)
    setIsLangMenuOpen(false)
  }

  useEffect(() => {
    document.documentElement.lang = currentLang
    document.documentElement.dir = currentLang === "fr" ? "ltr" : "ltr" // Assuming French is LTR, Arabic would be RTL
  }, [currentLang])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "experience", "skills", "projects", "about", "contact"]
      const scrollPosition = window.scrollY + 100

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

  // Close language menu when clicking outside
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

  const navItems = [
    { id: "services", label: t.services },
    { id: "experience", label: t.experience },
    { id: "skills", label: t.skills },
    { id: "projects", label: t.projects },
    { id: "about", label: t.about },
    { id: "contact", label: t.contact },
  ]

  const languageOptions = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ]

  // Theme classes
  const themeClasses = {
    bg: isDarkMode ? "bg-[#0a0a0a]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-500" : "text-gray-500",
    cardBg: isDarkMode ? "bg-[#111111]" : "bg-white",
    cardBorder: isDarkMode ? "border-gray-800" : "border-gray-200",
    headerBg: isDarkMode ? "bg-[#0a0a0a]/95" : "bg-white/95",
    headerBorder: isDarkMode ? "border-gray-800" : "border-gray-200",
    sectionBg: isDarkMode ? "bg-[#111111]" : "bg-gray-50",
    dropdownBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
    accentGold: "rgb(var(--portfolio-gold))",
    accentGoldHover: "rgb(var(--portfolio-gold-hover))",
    accentGoldForeground: "rgb(var(--portfolio-gold-foreground))",
    accentRed: "var(--portfolio-red)", // Using the new CSS variable
    accentRedForeground: "var(--portfolio-red-foreground)",
  }
 const educationEvents = useMemo(
    () => [
        {
        year: "2024 - 2025",
        title: t.itWebDev, // Informatique et Développement Web
        institution: t.centreAzrou, // Centre Azrou pour le développement communautaire
        location: "",
        description: t.itWebDevDesc, // Formation en Informatique et Développement Web.
      },
        {
        year: "2022 - 2024",
        title: t.diplomaFullStack, // Diplôme en Développement Digital Web Full Stack
        institution: t.istaIfrane, // Institut Spécialisé de Technologie Appliquée Ifrane (OFPPT)
        location: "",
        description: t.diplomaFullStackDesc, // Formation complète en développement web full stack.
      },
      {
        year: "2021",
        title: t.baccalaureate, // Baccalauréat en Sciences de la Vie et de la Terre
        institution: t.lyceeSidiElMakhfi, // Lycée Qualifiant Sidi El Makhfi
        location: "",
        description: t.baccalaureateDesc, // Diplôme de fin d'études secondaires
      },
    
    
    ],
    [t],
  )

  const experienceEvents = useMemo(
    () => [
 
      {
        year: "10 juin 2025 au 10 juillet 2025",
        duration: t.oneMonth, // 1 mois
        title: t.internshipIT, // Stage en Informatique
        institution: t.alAkhawaynUniversity, // Al Akhawayn University
        location: t.ifrane, // Ifrane
        description: [t.internshipITDesc], // Stage pratique en informatique et développement web.
      },
           {
        year: "11 mars 2024 au 11 avril 2024",
        duration: t.oneMonth, // 1 mois
        title: t.internshipWebDev, // Stage en Développement Web
        institution: t.communeSidiMokhfi, // Commune de Sidi Mokhfi
        location: t.sidiMokhfi, // Sidi Mokhfi
        description: [t.internshipWebDevDesc], // Application des compétences en développement web et contribution à une équipe dynamique.
      },
    ],
    [t],
  )
  const skillsData = useMemo(
    () => ({
      programmingLanguages: [
        { name: "PHP", desc: t.backendLanguage, icon: Code },
        { name: "Python", desc: t.scriptingLanguage, icon: Code },
        { name: "JavaScript", desc: t.scriptingLanguage, icon: Code },
        { name: "Node.js", desc: t.backendRuntime, icon: Code },
      ],
      frameworksLibraries: [
        { name: "Laravel", desc: t.phpFramework, icon: LayoutGrid },
        { name: "React.js", desc: t.frontendFramework, icon: LayoutGrid },
        { name: "Bootstrap", desc: t.cssFramework, icon: LayoutGrid },
      ],
      databases: [
        { name: "MySQL", desc: t.relationalDatabase, icon: Database },
        { name: "MongoDB", desc: t.nosqlDatabase, icon: Database },
      ],
      otherTechnicalSkills: [
        { name: t.technicalAnalysis, desc: t.understandingSystemsNeeds, icon: Star },
        { name: t.webAppDevelopment, desc: t.buildingFunctionalWebApps, icon: Star },
        { name: t.webProjectManagement, desc: t.organizingLeadingWebProjects, icon: Star },
        { name: t.versionControlGit, desc: t.managingCodeVersions, icon: Star },
      ],
      softSkills: [
        { name: t.teamwork, desc: t.workingWellWithOthers, icon: Users },
        { name: t.effectiveCommunication, desc: t.sharingIdeasClearly, icon: Users },
        { name: t.problemSolving, desc: t.findingSmartSolutions, icon: Users },
        { name: t.timeManagement, desc: t.usingTimeWisely, icon: Users },
        { name: t.adaptability, desc: t.adjustingToChange, icon: Users },
        { name: t.criticalThinking, desc: t.analyzingReasoning, icon: Users },
        { name: t.creativity, desc: t.thinkingOutsideTheBox, icon: Users },
        { name: "Initiative", desc: t.takingActionIndependently, icon: Users },
      ],
    }),
    [t],
  )

 const projectsData = useMemo(
  () => [
    {
      title: t.animovTitle,
      description: t.animovDesc,
      images: [
        "/images/animov/1.png",
        "/images/animov/2.png",
        "/images/animov/3.png"
      ],
      tech: ["Next.js", "Node.js", "Atlas MongoDB", "Tailwind"],
      github: "#",
      live: "#",
    },
    {
      title: t.tableManagementTitle,
      description: t.tableManagementDesc,
      images: [
        "/images/table-management/2.png",
       
      ],
      tech: ["Next.js", "Node.js", "Atlas MongoDB", "Tailwind"],
      github: "#",
      live: "#",
    },
  ],
  [t]
);


// AutoRotatingImage component (define this outside your Projects section)
const AutoRotatingImage = ({ src, alt, totalImages, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    if (totalImages <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % totalImages);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [totalImages]);
  
  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={350}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};
  const filteredServices = useMemo(() => {
    if (!searchTerm)
      return [
        { title: t.service1Title, desc: t.service1Desc },
        { title: t.service2Title, desc: t.service2Desc },
        { title: t.service3Title, desc: t.service3Desc },
      ]
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return [
      { title: t.service1Title, desc: t.service1Desc },
      { title: t.service2Title, desc: t.service2Desc },
      { title: t.service3Title, desc: t.service3Desc },
    ].filter(
      (service) =>
        service.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.desc.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [searchTerm, t])


  const filteredEducationEvents = useMemo(() => {
    if (!searchTerm) return educationEvents
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return educationEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        event.institution.toLowerCase().includes(lowerCaseSearchTerm) ||
        event.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        (event.location && event.location.toLowerCase().includes(lowerCaseSearchTerm)) ||
        event.year.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [searchTerm, educationEvents])

  const filteredExperienceEvents = useMemo(() => {
    if (!searchTerm) return experienceEvents
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return experienceEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        event.institution.toLowerCase().includes(lowerCaseSearchTerm) ||
        (Array.isArray(event.description)
          ? event.description.some((desc) => desc.toLowerCase().includes(lowerCaseSearchTerm))
          : event.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (event.location && event.location.toLowerCase().includes(lowerCaseSearchTerm)) ||
        event.year.toLowerCase().includes(lowerCaseSearchTerm) ||
        (event.duration && event.duration.toLowerCase().includes(lowerCaseSearchTerm)),
    )
  }, [searchTerm, experienceEvents])

  const filteredSkillsData = useMemo(() => {
    if (!searchTerm) return skillsData
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const filterCategory = (category: any[]) =>
      category.filter(
        (skill) =>
          skill.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          skill.desc.toLowerCase().includes(lowerCaseSearchTerm),
      )

    return {
      programmingLanguages: filterCategory(skillsData.programmingLanguages),
      frameworksLibraries: filterCategory(skillsData.frameworksLibraries),
      databases: filterCategory(skillsData.databases),
      otherTechnicalSkills: filterCategory(skillsData.otherTechnicalSkills),
      softSkills: filterCategory(skillsData.softSkills),
    }
  }, [searchTerm, skillsData])

  const filteredProjectsData = useMemo(() => {
    if (!searchTerm) return projectsData
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return projectsData.filter(
      (project) =>
        project.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        project.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        project.tech.some((tech) => tech.toLowerCase().includes(lowerCaseSearchTerm)),
    )
  }, [searchTerm, projectsData])

  return (
    
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark" : ""} ${themeClasses.bg} ${themeClasses.text}`}
    >
      {/* Header */}
<header
  className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.headerBg} backdrop-blur-md border-b ${themeClasses.headerBorder} shadow-sm`}
>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 ${
            isDarkMode ? "bg-white" : "bg-gray-900"
          } rounded-full flex items-center justify-center`}
        >
          <span
            className={`${
              isDarkMode ? "text-black" : "text-white"
            } font-bold text-lg`}
          >
            S
          </span>
        </div>
        <span className="text-xl font-medium">Smail Yazidi</span>
      </div>

    <>
  <style jsx>{`
    .custom-nav-spacing > *:not(:last-child) {
      margin-right: 20px;
    }

    @media (min-width: 1990px) {
      .custom-nav-spacing > *:not(:last-child) {
        margin-right: 48px;
      }
    }
  `}</style>

  {/* Desktop Navigation */}
  <nav className="hidden lg:flex items-center custom-nav-spacing">
    {navItems.map((item) => (
      <button
        key={item.id}
        onClick={() => scrollToSection(item.id)}
        className={`text-sm font-medium transition-colors hover:text-[rgb(var(--portfolio-gold))] ${
          activeSection === item.id
            ? "text-[rgb(var(--portfolio-gold))]"
            : themeClasses.textSecondary
        }`}
      >
        {item.label}
      </button>
    ))}
  </nav>
</>


      {/* Desktop Controls */}
      <div className="hidden lg:flex items-center space-x-3">
        {/* Language Dropdown */}
        <div className="relative language-menu">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className={`p-2 ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            } flex items-center gap-2`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium">{currentLang.toUpperCase()}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                isLangMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>

          {isLangMenuOpen && (
            <div
              className={`absolute top-full right-0 mt-2 ${themeClasses.dropdownBg} ${themeClasses.dropdownBorder} border rounded-lg shadow-lg py-2 min-w-[140px] z-50`}
            >
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => changeLanguage(option.code as "fr" | "en")}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 ${
                    currentLang === option.code
                      ? "text-[rgb(var(--portfolio-gold))]"
                      : themeClasses.text
                  }`}
                >
                  <span>{option.flag}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Search Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
        >
          {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </Button>

        {/* Hire Me Button */}
        <Button
          className={`${
            isDarkMode
              ? "bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black"
              : "bg-gray-900 hover:bg-gray-800 text-white"
          } font-medium px-6 py-2 rounded-full`}
          onClick={() => scrollToSection("contact")}
        >
          {t.hireMe}
        </Button>
      </div>

      {/* Mobile Controls */}
      <div className="flex lg:hidden items-center space-x-2">
        <div className="relative language-menu">
          <Button variant="ghost" size="sm" onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2">
            <Globe className="w-4 h-4" />
          </Button>

          {isLangMenuOpen && (
            <div
              className={`absolute top-full right-0 mt-2 ${themeClasses.dropdownBg} ${themeClasses.dropdownBorder} border rounded-lg shadow-lg py-2 min-w-[120px] z-50`}
            >
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => changeLanguage(option.code as "fr" | "en")}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                    currentLang === option.code
                      ? "text-[rgb(var(--portfolio-gold))]"
                      : themeClasses.text
                  }`}
                >
                  <span className="text-xs">{option.flag}</span>
                  <span className="text-xs">{option.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Search Toggle for Mobile */}
        <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2">
          {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
        </Button>

        <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className={`lg:hidden py-6 border-t ${themeClasses.headerBorder}`}>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-left px-4 py-2 text-sm font-medium transition-colors hover:text-[rgb(var(--portfolio-gold))] ${
                activeSection === item.id
                  ? `text-[rgb(var(--portfolio-gold))] ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-100"
                    }`
                  : themeClasses.textSecondary
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="px-4 pt-4">
 
            <Button
              className={`w-full ${
                isDarkMode
                    ? "bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black"
              : "bg-gray-900 hover:bg-gray-800 text-white"
              } font-medium py-2 rounded-full`}
              onClick={() => scrollToSection("contact")}
            >
              {t.hireMe}
            </Button>
          </div>
        </nav>
      </div>
    )}

{/* Search Input */}
{isSearchOpen && (
  <div
    className={`relative z-50 top-full left-0 right-0 py-4 px-4 sm:px-6 lg:px-8 ${themeClasses.headerBg} border-t ${themeClasses.headerBorder} shadow-md`}
  >
    <div className="relative">
      <input
        type="text"
        placeholder={currentLang === "fr" ? "Rechercher..." : "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full p-3 pr-10 rounded-md ${
          isDarkMode
            ? "bg-gray-800 text-white border border-gray-700"
            : "bg-gray-100 text-gray-900 border border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-[rgb(var(--portfolio-gold))]`}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
          aria-label="Clear search"
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
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Star className="w-5 h-5 text-[rgb(var(--portfolio-gold))] fill-current" />
                <span className={`${themeClasses.textSecondary} text-sm font-medium`}>{t.specialist}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">{t.heroTitle}</h1>

              <p
                className={`${themeClasses.textSecondary} text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0`}
              >
                {t.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
  className="bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-gray-900 font-medium px-8 py-3 rounded-full"
  onClick={() => scrollToSection("experience")}
>
  {t.viewJourney}
</Button>

           <Button
  variant="ghost"
  className={`${isDarkMode
    ? "text-white border-gray-700 hover:border-[rgb(184,148,31)] hover:text-[rgb(184,148,31)] hover:bg-transparent"
    : "text-gray-900 border-gray-300 hover:border-[rgb(184,148,31)] hover:text-[rgb(184,148,31)] hover:bg-transparent"
  } font-medium px-8 py-3 rounded-full border`}
>
  <Mail className="w-4 h-4 mr-2" />
  smail.yazidi.work@gmail.com
</Button>

              </div>
            </div>

            {/* Right Content - Profile Image */}
            <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative">
                <div
                  className={`w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-100 to-gray-200"} flex items-center justify-center overflow-hidden border-2 border-[rgb(var(--portfolio-gold))]`}
                >
                  <Image
                    src="/images/profile.png"
                    alt="Smail Yazidi"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
            {t.servicesTitle}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service, index) => (
              <Card
                key={index}
                className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-6 sm:p-8 hover:border-[rgb(var(--portfolio-gold))] transition-colors group shadow-lg`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <span className={`${themeClasses.textMuted} text-sm`}>0{index + 1}</span>
                    <ArrowUpRight
                      className={`w-5 h-5 ${themeClasses.textMuted} group-hover:text-[rgb(var(--portfolio-gold))] transition-colors`}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">{service.title}</h3>
                  <p className={`${themeClasses.textSecondary} text-sm sm:text-base leading-relaxed`}>{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Experience & Education Timeline Section */}
      <section id="experience" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}>
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
            {t.journeyTitle}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-8">
            {/* Formation Column */}
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {currentLang === "fr" ? "Formation" : "Education"}
              </h3>
              <div className="space-y-8 relative">
                {filteredEducationEvents.map((event, index) => (
                  <div key={index} className="relative pl-6">
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-0.5 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
                    ></div>
                    <div
                      className={`absolute -left-2 top-0 w-4 h-4 rounded-full bg-[rgb(var(--portfolio-gold))]`}
                    ></div>
                    <p className={`${themeClasses.textSecondary} font-medium text-sm mb-1`}>{event.year}</p>
                    <h4 className="text-base sm:text-lg font-medium mb-1">{event.title}</h4>
                    <p className={`${themeClasses.textSecondary} text-sm mb-1`}>{event.institution}</p>
                    {event.description && (
                      <p className={`${themeClasses.textMuted} text-xs mt-2`}>{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Column */}
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {currentLang === "fr" ? "Expérience" : "Experience"}
              </h3>
              <div className="space-y-8 relative">
                {filteredExperienceEvents.map((event, index) => (
                  <div key={index} className="relative pl-6">
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-0.5 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
                    ></div>
                    <div
                      className={`absolute -left-2 top-0 w-4 h-4 rounded-full bg-[rgb(var(--portfolio-gold))]`}
                    ></div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`${themeClasses.textSecondary} font-medium text-sm`}>{event.year}</p>
                      {event.duration && (
                        <Badge className="bg-[rgb(var(--portfolio-gold))] text-[rgb(var(--portfolio-gold-foreground))] text-xs">
                          {event.duration}
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-base sm:text-lg font-medium mb-1">{event.title}</h4>
                    <p className={`${themeClasses.textSecondary} text-sm mb-1`}>{event.institution}</p>
                    {Array.isArray(event.description) ? (
                      <ul className={`${themeClasses.textMuted} text-xs mt-2 list-disc pl-4`}>
                        {event.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`${themeClasses.textMuted} text-xs mt-2`}>{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Skills Section */}
      <section id="skills" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
            {t.skillsTitle}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
          </h2>

          <div className="space-y-10 sm:space-y-12">
            {/* Programming Languages */}
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {t.programmingLanguages}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredSkillsData.programmingLanguages.map((skill, index) => (
                  <Card
                    key={index}
                    className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-5 sm:p-6 text-center transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
                  >
                    <CardContent className="p-0 flex flex-col items-center">
                      <skill.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[rgb(var(--portfolio-gold))] mb-2 sm:mb-3" />
                      <h4 className="font-medium text-base sm:text-lg mb-1">{skill.name}</h4>
                      <p className={`${themeClasses.textMuted} text-xs sm:text-sm`}>{skill.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Frameworks and Libraries */}
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {t.frameworksLibraries}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredSkillsData.frameworksLibraries.map((skill, index) => (
                  <Card
                    key={index}
                    className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-5 sm:p-6 text-center transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
                  >
                    <CardContent className="p-0 flex flex-col items-center">
                      <skill.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[rgb(var(--portfolio-gold))] mb-2 sm:mb-3" />
                      <h4 className="font-medium text-base sm:text-lg mb-1">{skill.name}</h4>
                      <p className={`${themeClasses.textMuted} text-xs sm:text-sm`}>{skill.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {t.databases}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredSkillsData.databases.map((skill, index) => (
                  <Card
                    key={index}
                    className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-5 sm:p-6 text-center transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
                  >
                    <CardContent className="p-0 flex flex-col items-center">
                      <skill.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[rgb(var(--portfolio-gold))] mb-2 sm:mb-3" />
                      <h4 className="font-medium text-base sm:text-lg mb-1">{skill.name}</h4>
                      <p className={`${themeClasses.textMuted} text-xs sm:text-sm`}>{skill.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Other Technical Skills */}
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {t.otherTechnicalSkills}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredSkillsData.otherTechnicalSkills.map((skill, index) => (
                  <Card
                    key={index}
                    className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-5 sm:p-6 text-center transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
                  >
                    <CardContent className="p-0 flex flex-col items-center">
                      <skill.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[rgb(var(--portfolio-gold))] mb-2 sm:mb-3" />
                      <h4 className="font-medium text-base sm:text-lg mb-1">{skill.name}</h4>
                      <p className={`${themeClasses.textMuted} text-xs sm:text-sm`}>{skill.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 flex items-center gap-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                {t.softSkills}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredSkillsData.softSkills.map((skill, index) => (
                  <Card
                    key={index}
                    className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-5 sm:p-6 text-center transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
                  >
                    <CardContent className="p-0 flex flex-col items-center">
                      <skill.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[rgb(var(--portfolio-gold))] mb-2 sm:mb-3" />
                      <h4 className="font-medium text-base sm:text-lg mb-1">{skill.name}</h4>
                      <p className={`${themeClasses.textMuted} text-xs sm:text-sm`}>{skill.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Projects Section */}
<section
  id="projects"
  className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}
>
  <div className="container mx-auto max-w-7xl">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12 sm:mb-16 relative pb-4">
      {t.myProjects}
      <span className="absolute bottom-0 left-0 w-20 h-1 bg-[rgb(var(--portfolio-gold))]"></span>
    </h2>

    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
      {filteredProjectsData.map((project, index) => (
        <Card
          key={index}
          className={`${themeClasses.cardBg} ${themeClasses.cardBorder} overflow-hidden transition-all duration-300 hover:border-[rgb(var(--portfolio-gold))] hover:shadow-lg`}
        >
          {/* Images container with auto-rotating images */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            {project.images && project.images.length > 0 ? (
              project.images.map((imgSrc, imgIndex) => (
                <AutoRotatingImage
                  key={imgIndex}
                  src={imgSrc}
                  alt={`${project.title} screenshot ${imgIndex + 1}`}
                  totalImages={project.images.length}
                  index={imgIndex}
                />
              ))
            ) : (
              <Image
                src="/placeholder.svg"
                alt={project.title}
                width={800}
                height={800}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
              {project.title}
            </h3>
            <p
              className={`${themeClasses.textSecondary} text-sm sm:text-base leading-relaxed mb-4 sm:mb-6`}
            >
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {project.tech.map((tech, techIndex) => (
                <Badge
                  key={techIndex}
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-gray-100 text-gray-900 border-gray-300"
                  } border px-3 py-1 text-xs`}
                >
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Button
                variant="outline"
                className={`${
                  isDarkMode
                    ? "border-gray-700 text-white hover:bg-gray-800"
                    : "border-gray-300 text-gray-900 hover:bg-gray-100"
                } flex items-center gap-2 text-sm sm:text-base`}
                onClick={() => window.open(project.github, "_blank")}
                disabled={project.github === "#"}
              >
                <Github className="w-4 h-4" />
                {t.github}
              </Button>
              <Button
                variant="outline"
                className={`${
                  isDarkMode
                    ? "border-gray-700 text-white hover:bg-gray-800"
                    : "border-gray-300 text-gray-900 hover:bg-gray-100"
                } flex items-center gap-2 text-sm sm:text-base`}
                onClick={() => window.open(project.live, "_blank")}
                disabled={project.live === "#"}
              >
                <Link className="w-4 h-4" />
                {t.live}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 sm:mb-8">{t.aboutTitle}</h2>
              <p className={`${themeClasses.textSecondary} text-base sm:text-lg leading-relaxed mb-6 sm:mb-8`}>
                {t.aboutDescription}
              </p>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <p className={`${themeClasses.textMuted} text-xs sm:text-sm mb-1`}>{t.age}</p>
                  <p className="font-medium text-sm sm:text-base">{t.years}</p>
                </div>
                <div>
                  <p className={`${themeClasses.textMuted} text-xs sm:text-sm mb-1`}>{t.location}</p>
                  <p className="font-medium text-sm sm:text-base">{t.locationValue}</p>
                </div>
                <div>
                  <p className={`${themeClasses.textMuted} text-xs sm:text-sm mb-1`}>{t.status}</p>
                  <p className="font-medium text-sm sm:text-base">{t.single}</p>
                </div>
                <div>
                  <p className={`${themeClasses.textMuted} text-xs sm:text-sm mb-1`}>{t.nationality}</p>
                  <p className="font-medium text-sm sm:text-base">{t.moroccan}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Languages */}
              <div>
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center gap-3">
                  <LanguagesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                  {t.languages}
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { lang: "Tamazight", level: t.native, width: "100%" },
                    { lang: currentLang === "fr" ? "Arabe" : "Arabic", level: t.good, width: "85%" },
                    { lang: currentLang === "fr" ? "Français" : "French", level: t.average, width: "60%" },
                    { lang: currentLang === "fr" ? "Anglais" : "English", level: t.average, width: "60%" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <span className="font-medium text-sm sm:text-base">{item.lang}</span>
                        <span className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>{item.level}</span>
                      </div>
                      <div className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} rounded-full h-1`}>
                        <div
                          className="bg-[rgb(var(--portfolio-gold))] h-1 rounded-full transition-all duration-1000"
                          style={{ width: item.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center gap-3">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--portfolio-gold))]" />
                  {t.interests}
                </h3>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Badge
                    className={`${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"} border px-3 sm:px-4 py-1 sm:py-2 text-sm`}
                  >
                    {t.sport}
                  </Badge>
                  <Badge
                    className={`${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"} border px-3 sm:px-4 py-1 sm:py-2 text-sm`}
                  >
                    {t.travel}
                  </Badge>
                  <Badge
                    className={`${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"} border px-3 sm:px-4 py-1 sm:py-2 text-sm`}
                  >
                    {t.coding}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg}`}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 sm:mb-8">{t.contactTitle}</h2>
          <p className={`${themeClasses.textSecondary} text-base sm:text-lg mb-10 sm:mb-12 max-w-2xl mx-auto`}>
            {t.contactDescription}
          </p>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[rgb(var(--portfolio-gold))] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
               <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-black" />


              </div>
              <h3 className="font-medium text-base sm:text-lg mb-1 sm:mb-2">{t.email}</h3>
              <p className={`${themeClasses.textSecondary} text-sm sm:text-base`}>smail.yazidi.work@gmail.com</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[rgb(var(--portfolio-gold))] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
               <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-black" />

          </div>
              <h3 className="font-medium text-base sm:text-lg mb-1 sm:mb-2">{t.phone}</h3>
              <p className={`${themeClasses.textSecondary} text-sm sm:text-base`}>0719270155</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[rgb(var(--portfolio-gold))] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
       <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-black" />   </div>
              <h3 className="font-medium text-base sm:text-lg mb-1 sm:mb-2">{t.location}</h3>
              <p className={`${themeClasses.textSecondary} text-sm sm:text-base`}>{t.locationValue}</p>
            </div>
          </div>

<Button className="bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black font-medium px-8 py-3 rounded-full text-base sm:text-lg">
  <Mail className="w-5 h-5 mr-2 text-black" />
  {t.startProject}
</Button>

        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t ${themeClasses.headerBorder}`}>
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div
                className={`w-8 h-8 ${isDarkMode ? "bg-white" : "bg-gray-900"} rounded-full flex items-center justify-center`}
              >
                <span className={`${isDarkMode ? "text-black" : "text-white"} font-bold text-sm`}>S</span>
              </div>
              <span className={themeClasses.textSecondary}>© 2025 Smail Yazidi</span>
            </div>
            <p className={`${themeClasses.textMuted} text-xs sm:text-sm`}>{t.rightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

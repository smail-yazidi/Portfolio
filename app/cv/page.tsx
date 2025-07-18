"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, ChevronLeft, Sun, Moon, Loader2 } from "lucide-react"
import { cvContent } from "@/components/cv-content"
import { useRouter } from "next/navigation"

export default function CvPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode, consistent with home page
  const [isDownloading, setIsDownloading] = useState(false)
  const content = cvContent[language]

  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    const pdfFileName = `smail_yazidi_cv_${language}.pdf`
    const link = document.createElement("a")
    link.href = `/${pdfFileName}` // Path to the PDF in the public folder
    link.download = pdfFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // Simulate a short delay for download, as actual download might be instant
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDownloading(false)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    // Apply dark/light mode class to the root HTML element
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Theme classes, consistent with app/page.tsx
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

  return (
    <div
      className={`flex flex-col items-center p-4 min-h-screen ${isDarkMode ? "dark" : ""} ${themeClasses.bg} ${themeClasses.text}`}
    >
      <div className="flex flex-row flex-wrap items-center justify-between w-full max-w-4xl gap-4 mb-6 no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} flex items-center gap-2`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{language === "fr" ? "Retour" : "Back"}</span>
        </Button>
   <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={(value: "fr" | "en") => setLanguage(value)}>
            <SelectTrigger
              className={`min-w-[120px] w-auto ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"}`}
            >
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className={`${themeClasses.dropdownBg} ${themeClasses.dropdownBorder}`}>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

       

          <Button
            onClick={handleDownloadPdf}
            className={`${
              isDarkMode
                ? "bg-[rgb(var(--portfolio-gold))] hover:bg-[rgb(var(--portfolio-gold-hover))] text-black"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            } font-medium px-6 py-2 rounded-full`}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "fr" ? "Téléchargement..." : "Downloading..."}
              </>
            ) : (
              content.downloadCv
            )}
          </Button>
        </div>
      </div>

      {/* Responsive container for screen, A4 dimensions applied only for print via CSS */}
      <div
        className={`cv-a4-page ${themeClasses.cardBg} shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col ${themeClasses.text} md:max-w-[794px] md:h-[1123px]`}
      >
        {/* Header Section */}
        <div className="bg-gray-900 text-white p-8 flex items-center justify-between">
          <div className="flex items-center">
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white mr-4 sm:mr-6">
  <Image
    src="/images/profile.jpg"
    alt={content.name}
    width={96}
    height={96}
    className="object-cover"
  />
</div>

            <div>
              <h1 className="text-2xl font-bold uppercase">{content.name}</h1>
              <p className="text-xl mt-1">{content.title}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-grow flex-col md:flex-row">
          {/* Left Column (Sidebar) */}
          <div
            className={`w-full md:w-1/3 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} p-4 md:p-8 border-r ${themeClasses.cardBorder}`}
          >
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.contact}
              </h2>
              <div className="flex flex-col">
                <div className="flex items-center flex-wrap mb-2">
                  <Phone className={`w-4 h-4 mr-2 ${themeClasses.textMuted} shrink-0`} />
                  <span className="flex-1 min-w-0">{content.phone}</span>
                </div>
                <div className="flex items-center flex-wrap mb-2">
                  <Mail className={`w-4 h-4 mr-2 ${themeClasses.textMuted} shrink-0`} />
                  <span className="flex-1 min-w-0">{content.email}</span>
                </div>
                <div className="flex items-start flex-wrap mb-2">
                  <MapPin className={`w-4 h-4 mr-2 mt-1 ${themeClasses.textMuted} shrink-0`} />
                  <span className="flex-1 min-w-0">{content.location}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.languages}
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  {content.arabic}: {content.langMotherTongue}
                </li>
                <li>
                  {content.amazigh}: {content.langMotherTongue}
                </li>
                <li>
                  {content.french}: {content.langMedium}
                </li>
                <li>
                  {content.english}: {content.langMedium}
                </li>
              </ul>
            </div>

            {/* Skills */}
            <div className="mb-6 text-sm leading-tight">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-2 uppercase border-b pb-1 ${themeClasses.cardBorder}`}
              >
                {content.skills}
              </h2>
              <h3 className="font-medium mb-0.5">{content.programmingLanguages}</h3>
              <div className="grid grid-cols-2 gap-x-4 mb-2">
                <ul className="list-disc list-inside space-y-0.5">
                  <li>PHP</li>
                  <li>Python</li>
                </ul>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>JavaScript</li>
                  <li>Node.js</li>
                </ul>
              </div>
              <h3 className="font-medium mb-0.5">{content.frameworksLibraries}</h3>
              <div className="grid grid-cols-2 gap-x-4 mb-2">
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Laravel</li>
                </ul>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>React.js</li>
                  <li>Bootstrap</li>
                </ul>
              </div>
              <h3 className="font-medium mb-0.5">{content.databases}</h3>
              <div className="grid grid-cols-2 gap-x-4 mb-2">
                <ul className="list-disc list-inside space-y-0.5">
                  <li>MySQL</li>
                </ul>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>MongoDB</li>
                </ul>
              </div>
              <h3 className="font-medium mb-0.5">{content.otherTechnicalSkills}</h3>
              <div className="grid grid-cols-2 gap-x-4 mb-2">
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Technical Analysis</li>
                  <li>Web Application Development</li>
                </ul>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Web Project Management</li>
                  <li>Version Control: Git</li>
                </ul>
              </div>
              <h3 className="font-medium mb-0.5">{content.softSkills}</h3>
              <div className="grid grid-cols-2 gap-x-4">
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Teamwork</li>
                  <li>Effective Communication</li>
                  <li>Problem Solving</li>
                  <li>Time Management</li>
                </ul>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Adaptability</li>
                  <li>Critical Thinking</li>
                  <li>Creativity</li>
                  <li>Initiative</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (Main Content) */}
          <div className={`w-full md:w-2/3 p-4 md:p-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}  ${themeClasses.cardBg}`}>
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.aboutMe}
              </h2>
              <p className={`text-sm leading-relaxed ${themeClasses.textSecondary}`}>{content.aboutMeText}</p>
            </div>

            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.education}
              </h2>
              <div className={`mb-4 pb-4 border-b ${themeClasses.cardBorder} last:border-b-0`}>
                <h3 className={`font-semibold text-base ${themeClasses.text}`}>{content.webDev}</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{content.centreAzrou}</p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>2024 - 2025</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-1`}>{content.webDevTraining}</p>
              </div>
              <div className={`mb-4 pb-4 border-b ${themeClasses.cardBorder} last:border-b-0`}>
                <h3 className={`font-semibold text-base ${themeClasses.text}`}>{content.fullStackDiploma}</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{content.istaIfrane}</p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>2022 - 2024</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-1`}>{content.fullStackTraining}</p>
              </div>
              <div>
                <h3 className={`font-semibold text-base ${themeClasses.text}`}>{content.baccalaureate}</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{content.lyceeSidiMakhfi}</p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>2021</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-1`}>{content.highSchoolDiploma}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.experience}
              </h2>
              <div className={`mb-4 pb-4 border-b ${themeClasses.cardBorder} last:border-b-0`}>
                <h3 className={`font-semibold text-base ${themeClasses.text}`}>{content.webDevInternship}</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{content.alAkhawayn}</p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>10 juin 2025 au 10 juillet 2025</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-1`}>{content.practicalInternship}</p>
              </div>
              <div>
                <h3 className={`font-semibold text-base ${themeClasses.text}`}>{content.webDevInternship}</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{content.communeSidiMokhfi}</p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>11 mars 2024 au 11 avril 2024</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-1`}>{content.applicationSkills}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

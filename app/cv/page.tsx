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
              className={`min-w-[135px] w-auto ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"}`}
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
        className={`cv-a4-page ${themeClasses.cardBg} shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col ${themeClasses.text} md:max-w-[794px]`}
      >
        {/* Header Section */}
        <div className="bg-gray-900 text-white p-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white mr-4 sm:mr-6">
              <Image src="/images/profile.jpg" alt={content.name} width={96} height={96} className="object-cover" />
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
            className={`w-full md:w-1/2 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} p-4 md:p-8 border-r ${themeClasses.cardBorder}`}
          >
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.headings.contact}
              </h2>
              <div className="flex flex-col">
                <div className="flex items-center flex-wrap mb-2">
                  <Phone className={`w-4 h-4 mr-2 ${themeClasses.textMuted} shrink-0`} />
                  <span className="flex-1 min-w-0">{content.contact.phone}</span>
                </div>
                <div className="flex items-center flex-wrap mb-2">
                  <Mail className={`w-4 h-4 mr-2 ${themeClasses.textMuted} shrink-0`} />
                  <span className="flex-1 min-w-0">{content.contact.email}</span>
                </div>
                <div className="flex items-start flex-wrap mb-2">
                  <MapPin className={`w-4 h-4 mr-2 mt-1 ${themeClasses.textMuted} shrink-0`} />
                  <span className="flex-1 min-w-0">{content.contact.location}</span>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.headings.languages}
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(content.languages).map(([lang, proficiency]) => (
                  <li key={lang}>
                    {lang}: {proficiency}
                  </li>
                ))}
              </ul>
            </div>
            {/* Skills */}
            <div className="mb-6 text-sm leading-tight">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-2 uppercase border-b pb-1 ${themeClasses.cardBorder}`}
              >
                {content.headings.skills}
              </h2>
              <h3 className="font-semibold  mb-0.5">{content.headings.programmingLanguages}</h3>
              <ul className="list-disc list-inside space-y-0.5 mb-2">
                {content.skills.programmingLanguages.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <h3 className="font-semibold mb-0.5">{content.headings.frameworks}</h3>
              <ul className="list-disc list-inside space-y-0.5 mb-2">
                {content.skills.frameworks.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <h3 className="font-semibold  mb-0.5">{content.headings.databases}</h3>
              <ul className="list-disc list-inside space-y-0.5 mb-2">
                {content.skills.databases.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <h3 className="font-semibold  mb-0.5">{content.headings.otherTechnicalSkills}</h3>
              <ul className="list-disc list-inside space-y-0.5 mb-2">
                {content.skills.other.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <h3 className="font-semibold  mb-0.5">{content.headings.softSkills}</h3>
              <ul className="list-disc list-inside space-y-0.5">
                {content.skills.softSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right Column (Main Content) */}
          <div
            className={`w-full md:w-2/3 p-4 md:p-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}  ${themeClasses.cardBg}`}
          >
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.headings.aboutMe}
              </h2>
              <p className={`text-sm leading-relaxed ${themeClasses.textSecondary}`}>{content.aboutMe}</p>
            </div>
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.headings.education}
              </h2>
              {content.education.map((edu, index) => (
                <div
                  key={index}
                  className={`mb-4 pb-4 border-b ${themeClasses.cardBorder} ${index === content.education.length - 1 ? "last:border-b-0" : ""}`}
                >
                  <h3 className={`font-semibold text-base ${themeClasses.text}`}>{edu.title}</h3>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>{edu.institution}</p>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>{edu.date}</p>
                  <p className={`text-sm ${themeClasses.textMuted} mt-1`}>{edu.description}</p>
                </div>
              ))}
            </div>
            <div className="mb-8">
              <h2
                className={`text-lg font-semibold ${themeClasses.textSecondary} mb-3 uppercase border-b pb-2 ${themeClasses.cardBorder}`}
              >
                {content.headings.experience}
              </h2>
              {content.experience.map((exp, index) => (
                <div
                  key={index}
                  className={`mb-4 pb-4 border-b ${themeClasses.cardBorder} ${index === content.experience.length - 1 ? "last:border-b-0" : ""}`}
                >
                  <h3 className={`font-semibold text-base ${themeClasses.text}`}>{exp.title}</h3>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>{exp.company}</p>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>{exp.date}</p>
                  <p className={`text-sm ${themeClasses.textMuted} mt-1`}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

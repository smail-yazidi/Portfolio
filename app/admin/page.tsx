"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"

type HeroButton = {
  text: { fr: string; en: string; ar: string };
  link: string;
  icon: string;
};

type HeroData = {
  specialist: { fr: string; en: string; ar: string };
  heroTitle: { fr: string; en: string; ar: string };
  heroDescription: { fr: string; en: string; ar: string };
  heroButtons: HeroButton[];
};

// Create a default hero data structure
const defaultHero: HeroData = {
  specialist: { fr: "", en: "", ar: "" },
  heroTitle: { fr: "", en: "", ar: "" },
  heroDescription: { fr: "", en: "", ar: "" },
  heroButtons: [],
};

export default function HeroAdminPage() {
  const [hero, setHero] = useState<HeroData>(defaultHero);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const [username, setUsername] = useState({
  fr: "",
  en: "",
  ar: ""
});




  const [iconSearch, setIconSearch] = useState("");
  const [activeIconPickerIndex, setActiveIconPickerIndex] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    username: false,
    specialist: false,
    title: false,
    description: false,
    buttons: false
  });
  const { toast } = useToast();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

const fetchData = async () => {
  setLoading(true);
  try {
    // Fetch hero data
    const heroRes = await fetch("/api/hero", {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
      }
    });
    if (!heroRes.ok) throw new Error("Failed to fetch hero data");
    const heroData = await heroRes.json();
    setHero(heroData);

  } catch (err: any) {
    setError(err.message);
    // Fallback to default structure
    setHero(defaultHero);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const fetchUsername = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/username", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
        }
      });
      if (!res.ok) throw new Error("Failed to fetch username data");
      const data = await res.json();

      setUsername({
        fr: data.fr || "",
        en: data.en || "",
        ar: data.ar || ""
      });

    } catch (err) {
      console.error("Error fetching username data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchUsername();
}, []);

const saveHero = async () => {
  saveUsername(); // حفظ اسم المستخدم أولاً
  try {
    const res = await fetch("/api/hero", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
      },
      body: JSON.stringify(hero),
    });

    if (!res.ok) throw new Error("Failed to save hero content");

    toast({
      title: "Success",
      description: "Hero content saved successfully!",
      className: "bg-green-500 text-white border-none",
    });

    fetchData(); // إعادة جلب البيانات بعد الحفظ
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Something went wrong!",
      className: "bg-red-500 text-white border-none",
    });
  }
};


const saveUsername = async () => {
  try {
    const res = await fetch("/api/username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
      },
      body: JSON.stringify({ 
        name: {
          fr: username.fr.trim(),
          en: username.en.trim(),
          ar: username.ar.trim()
        }
      }),
    });

    if (!res.ok) throw new Error("Failed to save username");

    toast({
      title: "Success",
      description: "Username saved successfully!",
      className: "bg-green-500 text-white border-none",
    });

    fetchData(); // إعادة جلب البيانات بعد الحفظ
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Something went wrong!",
      className: "bg-red-500 text-white border-none",
    });
  }
};




  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (field: string, lang: "fr" | "en" | "ar", value: string) => {
    setHero(prev => ({ 
      ...prev, 
      [field]: { 
        ...prev[field as keyof HeroData], 
        [lang]: value 
      } 
    }));
  };

  const handleButtonChange = (index: number, field: "text" | "link" | "icon", value: any, lang?: "fr" | "en" | "ar") => {
    setHero(prev => {
      const updatedButtons = [...prev.heroButtons];
      if (field === "text" && lang) {
        updatedButtons[index].text[lang] = value;
      } else {
        updatedButtons[index][field] = value;
      }
      return { ...prev, heroButtons: updatedButtons };
    });
  };

  const addButton = () => {
    setHero(prev => ({
      ...prev,
      heroButtons: [...prev.heroButtons, { text: { fr: "", en: "", ar: "" }, link: "", icon: "ArrowRight" }],
    }));
  };

  const removeButton = (index: number) => {
    setHero(prev => ({
      ...prev,
      heroButtons: prev.heroButtons.filter((_, i) => i !== index),
    }));
  };

  const filteredIcons = Object.keys(LucideIcons)
    .filter(iconName => 
      iconName.toLowerCase().includes(iconSearch.toLowerCase()) && 
      iconName !== "default" && 
      iconName !== "createLucideIcon"
    )
    .slice(0, 50);

  const renderIcon = (iconName: string, size = 20) => {
    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
      return <LucideIcons.ArrowRight size={size} />;
    }
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return <IconComponent size={size} />;
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {/* Username Management Accordion */}
 <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
  <button
    onClick={() => toggleSection("username")}
    className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  >
    <div className="flex items-center gap-2">
      <LucideIcons.User size={20} className="text-gray-600 dark:text-gray-300" />
      <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Username</h2>
    </div>
    <LucideIcons.ChevronDown 
      size={20} 
      className={`text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.username ? 'rotate-180' : ''}`}
    />
  </button>
  
  {expandedSections.username && (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <input
            type="text"
            value={username.fr}
            placeholder="Username (French)"
            onChange={(e) => setUsername({...username, fr: e.target.value})}
            className="border border-gray-300 dark:border-gray-600 p-2 pl-9 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <span className="absolute left-2.5 top-3 text-gray-400 text-sm">FR</span>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={username.en}
            placeholder="Username (English)"
            onChange={(e) => setUsername({...username, en: e.target.value})}
            className="border border-gray-300 dark:border-gray-600 p-2 pl-9 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <span className="absolute left-2.5 top-3 text-gray-400 text-sm">EN</span>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={username.ar}
            placeholder="Username (Arabic)"
            onChange={(e) => setUsername({...username, ar: e.target.value})}
            className="border border-gray-300 dark:border-gray-600 p-2 pl-9 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <span className="absolute left-2.5 top-3 text-gray-400 text-sm">AR</span>
        </div>
      </div>
      
      <button
        onClick={saveUsername}
        disabled={!username.fr.trim() && !username.en.trim() && !username.ar.trim()}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-auto justify-center"
      >
        <LucideIcons.Save size={16} />
        Save All
      </button>
    </div>
  )}
</div>

      {/* Hero Content Accordions */}
      <div className="space-y-4">
        {/* Specialist Accordion */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("specialist")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-2">
              <LucideIcons.BadgeInfo size={20} className="text-gray-600 dark:text-gray-300" />
              <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Specialist</h2>
            </div>
            <LucideIcons.ChevronDown 
              size={20} 
              className={`text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.specialist ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.specialist && (
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French version</label>
                  <input
                    type="text"
                    value={hero.specialist.fr}
                    placeholder="French version"
                    onChange={(e) => handleInputChange("specialist", "fr", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English version</label>
                  <input
                    type="text"
                    value={hero.specialist.en}
                    placeholder="English version"
                    onChange={(e) => handleInputChange("specialist", "en", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Arabic version</label>
                  <input
                    type="text"
                    value={hero.specialist.ar}
                    placeholder="Arabic version"
                    onChange={(e) => handleInputChange("specialist", "ar", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Title Accordion */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("title")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-2">
              <LucideIcons.Type size={20} className="text-gray-600 dark:text-gray-300" />
              <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Title</h2>
            </div>
            <LucideIcons.ChevronDown 
              size={20} 
              className={`text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.title ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.title && (
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French title</label>
                  <input
                    type="text"
                    value={hero.heroTitle.fr}
                    placeholder="French title"
                    onChange={(e) => handleInputChange("heroTitle", "fr", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English title</label>
                  <input
                    type="text"
                    value={hero.heroTitle.en}
                    placeholder="English title"
                    onChange={(e) => handleInputChange("heroTitle", "en", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Arabic title</label>
                  <input
                    type="text"
                    value={hero.heroTitle.ar}
                    placeholder="Arabic title"
                    onChange={(e) => handleInputChange("heroTitle", "ar", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description Accordion */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("description")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-2">
              <LucideIcons.AlignLeft size={20} className="text-gray-600 dark:text-gray-300" />
              <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Description</h2>
            </div>
            <LucideIcons.ChevronDown 
              size={20} 
              className={`text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.description ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.description && (
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French description</label>
                  <textarea
                    value={hero.heroDescription.fr}
                    placeholder="French description"
                    onChange={(e) => handleInputChange("heroDescription", "fr", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English description</label>
                  <textarea
                    value={hero.heroDescription.en}
                    placeholder="English description"
                    onChange={(e) => handleInputChange("heroDescription", "en", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Arabic description</label>
                  <textarea
                    value={hero.heroDescription.ar}
                    placeholder="Arabic description"
                    onChange={(e) => handleInputChange("heroDescription", "ar", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons Accordion */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("buttons")}
            className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-2">
              <LucideIcons.MousePointerClick size={20} className="text-gray-600 dark:text-gray-300" />
              <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Buttons</h2>
               <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
      {hero.heroButtons.length} Buttons
    </span>
            </div>
            <LucideIcons.ChevronDown 
              size={20} 
              className={`text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.buttons ? 'rotate-180' : ''}`}
            />  
          </button>
          
          {expandedSections.buttons && (
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4 mb-4">
                {hero.heroButtons.map((btn, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French text</label>
                        <input
                          type="text"
                          value={btn.text.fr}
                          placeholder="French text"
                          onChange={(e) => handleButtonChange(index, "text", e.target.value, "fr")}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English text</label>
                        <input
                          type="text"
                          value={btn.text.en}
                          placeholder="English text"
                          onChange={(e) => handleButtonChange(index, "text", e.target.value, "en")}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Arabic text</label>
                        <input
                          type="text"
                          value={btn.text.ar}
                          placeholder="Arabic text"
                          onChange={(e) => handleButtonChange(index, "text", e.target.value, "ar")}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button link</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={btn.link}
                            placeholder="Button link"
                            onChange={(e) => handleButtonChange(index, "link", e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Icon</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setActiveIconPickerIndex(activeIconPickerIndex === index ? null : index)}
                            className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {renderIcon(btn.icon, 16)}
                              <span>{btn.icon || "Select icon"}</span>
                            </div>
                            <LucideIcons.ChevronDown size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {activeIconPickerIndex === index && (
                      <div className="mb-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                        <div className="relative mb-2">
                          <input
                            type="text"
                            value={iconSearch}
                            onChange={(e) => setIconSearch(e.target.value)}
                            placeholder="Search icons..."
                            className="border border-gray-300 dark:border-gray-600 p-2 pl-9 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          />
                          <LucideIcons.Search className="absolute left-2.5 top-3 text-gray-400" size={16} />
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2">
                          {filteredIcons.map(iconName => (
                            <button
                              key={iconName}
                              onClick={() => {
                                handleButtonChange(index, "icon", iconName);
                                setActiveIconPickerIndex(null);
                                setIconSearch("");
                              }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded flex flex-col items-center justify-center"
                              title={iconName}
                            >
                              {renderIcon(iconName, 20)}
                              <span className="text-xs mt-1 truncate w-full">{iconName}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => removeButton(index)}
                      className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      <LucideIcons.Trash2 size={16} />
                      Remove Button
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addButton}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <LucideIcons.Plus size={16} />
                Add Button
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={saveHero }
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            <LucideIcons.Save size={18} />
            Save All Content
          </button>
        </div>
      </div>
    </div>
  );
}
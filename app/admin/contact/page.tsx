"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"

interface ContactInfoItem {
  icon: string;
  label: { fr: string; en: string; ar: string };
  value: string | { fr: string; en: string; ar: string };
  link: string;
}

interface ContactData {
  contactTitle: { fr: string; en: string; ar: string };
  contactDescription: { fr: string; en: string; ar: string };
  contactInfo: ContactInfoItem[];
  contactButton: {
    startProject: { fr: string; en: string; ar: string };
    link: string;
  };
}

const defaultContactData: ContactData = {
  contactTitle: { fr: "", en: "", ar: "" },
  contactDescription: { fr: "", en: "", ar: "" },
  contactInfo: [],
  contactButton: {
    startProject: { fr: "", en: "", ar: "" },
    link: ""
  }
};

const Accordion = ({ 
  title, 
  children,
  isOpen,
  onToggle 
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {title}
          </span>
        </div>
        <LucideIcons.ChevronDown 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          size={18} 
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ContactAdminPage() {
  const [contact, setContact] = useState<ContactData>(defaultContactData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast()
  // Icon picker state
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [iconSearch, setIconSearch] = useState("");
  // Accordion state
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    title: false,
    description: false,
    methods: false,
    button: false
  });

  const filteredIcons = Object.keys(LucideIcons)
    .filter(iconName => 
      iconName.toLowerCase().includes(iconSearch.toLowerCase()) && 
      iconName !== "default" && 
      iconName !== "createLucideIcon"
    )
    .slice(0, 50);

  const renderIcon = (iconName: string, size = 20) => {
    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
      return <LucideIcons.Mail size={size} />;
    }
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return <IconComponent size={size} />;
  };

 useEffect(() => {
  async function fetchContact() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
        }
      });

      if (!res.ok) throw new Error("Failed to fetch contact data");

      const data = await res.json();
      setContact(data || defaultContactData);
    } catch (err) {
      console.error("Failed to fetch contact:", err);
      setError("Failed to load contact data");
      setContact(defaultContactData);
    } finally {
      setLoading(false);
    }
  }

  fetchContact();
}, []);


  const handleInputChange = (
    section: string,
    indexOrKey: string | number,
    field: string,
    value: string
  ) => {
    setContact((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (section === "contactTitle" || section === "contactDescription") {
        (newData[section] as any)[indexOrKey as string] = value;
      } 
      else if (section === "contactButton") {
        if (field === "startProject") {
          (newData.contactButton.startProject as any)[indexOrKey as string] = value;
        } else {
          (newData.contactButton as any)[field] = value;
        }
      }
      else if (section === "contactInfo") {
        const i = indexOrKey as number;
        const path = field.split(".");
        if (path.length === 2) {
          (newData.contactInfo[i] as any)[path[0]][path[1]] = value;
        } else {
          (newData.contactInfo[i] as any)[field] = value;
        }
      }
      
      return newData;
    });
  };

  const handleAddContactInfo = () => {
    setContact(prev => ({
      ...prev,
      contactInfo: [
        ...prev.contactInfo,
        {
          icon: "mail",
          label: { fr: "", en: "", ar: "" },
          value: "",
          link: ""
        }
      ]
    }));
    // Expand the newly added item
    setExpandedItems(prev => [...prev, contact.contactInfo.length]);
  };

  const handleRemoveContactInfo = (index: number) => {
    setContact(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== index)
    }));
    // Remove from expanded items if present
    setExpandedItems(prev => prev.filter(i => i !== index));
  };

  const toggleAccordion = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

 const handleSave = async () => {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""  // 🔹 أضف المفتاح هنا
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error("Failed to save");
    }

    toast({
      title: "Success",
      description: "Saved successfully!!",
      className: "bg-green-500 text-white border-none",
    });
  } catch (err: any) {
    toast({
      title: "Error",
      description: err?.message || "Something went wrong!",
      className: "bg-red-500 text-white border-none",
    });
  }
};


  if (loading) return <Loading />;
  if (error) return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <LucideIcons.AlertCircle size={20} className="text-red-500" />
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.Mail size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Contact Information
        </h1>
      </div>

      {/* Contact Title Accordion */}
      <Accordion
        title={
          <div className="flex items-center gap-2">
            <LucideIcons.Type size={20} className="text-gray-600 dark:text-gray-300" />
            <span>Contact Title</span>
          </div>
        }
        isOpen={expandedSections.title}
        onToggle={() => toggleSection("title")}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French Title</label>
            <input
              type="text"
              value={contact.contactTitle.fr}
              onChange={(e) => handleInputChange("contactTitle", "fr", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Titre en français"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English Title</label>
            <input
              type="text"
              value={contact.contactTitle.en}
              onChange={(e) => handleInputChange("contactTitle", "en", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Title in English"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Arabic Title</label>
            <input
              type="text"
              value={contact.contactTitle.ar}
              onChange={(e) => handleInputChange("contactTitle", "ar", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="العنوان بالعربية"
              dir="rtl"
            />
          </div>
        </div>
      </Accordion>

      {/* Contact Description Accordion */}
      <Accordion
        title={
          <div className="flex items-center gap-2">
            <LucideIcons.FileText size={20} className="text-gray-600 dark:text-gray-300" />
            <span>Contact Description</span>
          </div>
        }
        isOpen={expandedSections.description}
        onToggle={() => toggleSection("description")}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French Description</label>
            <textarea
              value={contact.contactDescription.fr}
              onChange={(e) => handleInputChange("contactDescription", "fr", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px]"
              placeholder="Description en français"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English Description</label>
            <textarea
              value={contact.contactDescription.en}
              onChange={(e) => handleInputChange("contactDescription", "en", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px]"
              placeholder="Description in English"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Arabic Description</label>
            <textarea
              value={contact.contactDescription.ar}
              onChange={(e) => handleInputChange("contactDescription", "ar", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px]"
              placeholder="الوصف بالعربية"
              dir="rtl"
            />
          </div>
        </div>
      </Accordion>

      {/* Contact Information Accordion */}
      <Accordion
        title={
          <div className="flex items-center gap-2">
            <span>Contact Methods</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              {contact.contactInfo.length} Methods
            </span>
          </div>
        }
        isOpen={expandedSections.methods}
        onToggle={() => toggleSection("methods")}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.Contact size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Contact Methods</h2>
          </div>
          <button
            onClick={handleAddContactInfo}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add
          </button>
        </div>
        
        {contact.contactInfo.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <LucideIcons.ContactRound size={24} className="mx-auto mb-2" />
            No contact methods added yet
          </div>
        ) : (
          <div className="space-y-3">
            {contact.contactInfo.map((info, idx) => (
              <Accordion
                key={idx}
                title={`Contact Method #${idx + 1} - ${info.label.en || info.label.fr || info.label.ar || "No label"}`}
                isOpen={expandedItems.includes(idx)}
                onToggle={() => toggleAccordion(idx)}
              >
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleRemoveContactInfo(idx)}
                      className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                    >
                      <LucideIcons.Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                  
                  {/* Icon Selection */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Icon</label>
                    <button 
                      type="button"
                      onClick={() => setShowIconPicker(showIconPicker === idx ? null : idx)}
                      className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {renderIcon(info.icon, 16)}
                        <span>{info.icon || "Select icon"}</span>
                      </div>
                      <LucideIcons.ChevronDown size={16} />
                    </button>
                    
                    {showIconPicker === idx && (
                      <div className="mt-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
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
                              type="button"
                              onClick={() => {
                                handleInputChange("contactInfo", idx, "icon", iconName);
                                setShowIconPicker(null);
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
                  </div>
                  
                  {/* Labels */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (FR)</label>
                      <input
                        type="text"
                        value={info.label.fr}
                        onChange={(e) => handleInputChange("contactInfo", idx, "label.fr", e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Libellé en français"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (EN)</label>
                      <input
                        type="text"
                        value={info.label.en}
                        onChange={(e) => handleInputChange("contactInfo", idx, "label.en", e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Label in English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (AR)</label>
                      <input
                        type="text"
                        value={info.label.ar}
                        onChange={(e) => handleInputChange("contactInfo", idx, "label.ar", e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="التسمية بالعربية"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  
                  {/* Value and Link */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Value</label>
                      <input
                        type="text"
                        value={typeof info.value === 'string' ? info.value : ''}
                        onChange={(e) => handleInputChange("contactInfo", idx, "value", e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Contact value (email, phone, etc.)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Link</label>
                      <input
                        type="text"
                        value={info.link}
                        onChange={(e) => handleInputChange("contactInfo", idx, "link", e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="mailto:, tel:, https://"
                      />
                    </div>
                  </div>
                </div>
              </Accordion>
            ))}
          </div>
        )}
      </Accordion>

      {/* Contact Button Accordion */}
      <Accordion
        title={
          <div className="flex items-center gap-2">
            <LucideIcons.MousePointerClick size={20} className="text-gray-600 dark:text-gray-300" />
            <span>Contact Button</span>
          </div>
        }
        isOpen={expandedSections.button}
        onToggle={() => toggleSection("button")}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button Text (FR)</label>
            <input
              type="text"
              value={contact.contactButton.startProject.fr}
              onChange={(e) => handleInputChange("contactButton", "fr", "startProject", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Texte du bouton en français"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button Text (EN)</label>
            <input
              type="text"
              value={contact.contactButton.startProject.en}
              onChange={(e) => handleInputChange("contactButton", "en", "startProject", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Button text in English"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button Text (AR)</label>
            <input
              type="text"
              value={contact.contactButton.startProject.ar}
              onChange={(e) => handleInputChange("contactButton", "ar", "startProject", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="نص الزر بالعربية"
              dir="rtl"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button Link</label>
          <input
            type="text"
            value={contact.contactButton.link}
            onChange={(e) => handleInputChange("contactButton", "", "link", e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Button destination URL"
          />
        </div>

        {/* Button Preview */}
        {(contact.contactButton.startProject.fr || contact.contactButton.startProject.en || contact.contactButton.startProject.ar) && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Button Preview:</span>
            <div className="flex flex-wrap gap-2">
              {contact.contactButton.startProject.en && (
                <div className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                  <LucideIcons.Send size={16} />
                  <span>EN: {contact.contactButton.startProject.en}</span>
                </div>
              )}
              {contact.contactButton.startProject.fr && (
                <div className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  <LucideIcons.Send size={16} />
                  <span>FR: {contact.contactButton.startProject.fr}</span>
                </div>
              )}
              {contact.contactButton.startProject.ar && (
                <div className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg" dir="rtl">
                  <span>AR: {contact.contactButton.startProject.ar}</span>
                  <LucideIcons.Send size={16} />
                </div>
              )}
            </div>
          </div>
        )}
      </Accordion>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LucideIcons.Save size={18} />
          Save Contact Information
        </button>
      </div>
    </div>
  );
}
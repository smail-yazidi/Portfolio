"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/LoadingAdmin";
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"

type LocalizedText = { fr: string; en: string; ar: string };

type SkillItem = {
  name: LocalizedText;
  examples: LocalizedText[];
  icon: string;
};

type SkillCategory = {
  skillicon: string;
  title: LocalizedText;
  items: SkillItem[];
};

type SkillsData = {
  skillsTitle: LocalizedText;
  skills: SkillCategory[];
};

export default function SkillsAdminPage() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast()

  // Accordion state - tracks which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Icon picker state
  const [showIconPicker, setShowIconPicker] = useState<{type: 'category' | 'item', categoryIndex: number, itemIndex?: number} | null>(null);
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = Object.keys(LucideIcons)
    .filter(iconName => 
      iconName.toLowerCase().includes(iconSearch.toLowerCase()) && 
      iconName !== "default" && 
      iconName !== "createLucideIcon"
    )
    .slice(0, 50);

  const renderIcon = (iconName: string, size = 20) => {
    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
      return <LucideIcons.Code size={size} />;
    }
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return <IconComponent size={size} />;
  };

  const toggleCategory = (categoryIndex: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryIndex)) {
      newExpanded.delete(categoryIndex);
    } else {
      newExpanded.add(categoryIndex);
    }
    setExpandedCategories(newExpanded);
  };

const fetchSkills = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/skills", {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
      }
    });
    if (!res.ok) throw new Error("Failed to fetch skills data");
    const json = await res.json();
    setData(json);
  } catch (err: any) {
    setError(err.message);
    // Fallback to empty structure
    setData({
      skillsTitle: { fr: "", en: "", ar: "" },
      skills: []
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (
    categoryIndex: number | null,
    itemIndex: number | null,
    field: keyof LocalizedText | "examples" | "skillicon" | "skillsTitle" | "icon",
    langOrExampleIndex: "fr" | "en" | "ar" | number | { exampleIndex: number; lang: "fr" | "en" | "ar" },
    value: string
  ) => {
    if (!data) return;

    const newData = { ...data };

    // Update skillsTitle (top-level)
    if (categoryIndex === null && field === "skillsTitle" && typeof langOrExampleIndex === "string") {
      newData.skillsTitle[langOrExampleIndex] = value;
    } 
    // Update category-level title or skillicon
    else if (categoryIndex !== null && itemIndex === null) {
      const category = newData.skills[categoryIndex];
      if (field === "skillicon") category.skillicon = value;
      else if (field === "title" && typeof langOrExampleIndex === "string") {
        category.title[langOrExampleIndex] = value;
      }
    } 
    // Update item-level fields
    else if (categoryIndex !== null && itemIndex !== null) {
      const item = newData.skills[categoryIndex].items[itemIndex];

      if (field === "name" && typeof langOrExampleIndex === "string") {
        item.name[langOrExampleIndex] = value;
      } 
      else if (field === "examples") {
        // langOrExampleIndex can be a number (index) or object { exampleIndex, lang }
        if (typeof langOrExampleIndex === "number") {
          // Handle single string examples (legacy format)
          if (typeof item.examples[langOrExampleIndex] === "string") {
            // Convert to object format
            const oldValue = item.examples[langOrExampleIndex] as unknown as string;
            item.examples[langOrExampleIndex] = { fr: oldValue, en: oldValue, ar: "" };
          } else {
            // Handle object format
            const example = item.examples[langOrExampleIndex] as LocalizedText;
            // This case shouldn't happen with the new format
          }
        } 
        else if (
          typeof langOrExampleIndex === "object" &&
          "exampleIndex" in langOrExampleIndex &&
          "lang" in langOrExampleIndex
        ) {
          const { exampleIndex, lang } = langOrExampleIndex;
          // Ensure the example exists and is in the correct format
          if (!item.examples[exampleIndex] || typeof item.examples[exampleIndex] === "string") {
            item.examples[exampleIndex] = { fr: "", en: "", ar: "" };
          }
          (item.examples[exampleIndex] as LocalizedText)[lang] = value;
        }
      } 
      else if (field === "icon") {
        item.icon = value;
      }
    }

    setData(newData);
  };

  const addCategory = () => {
    if (!data) return;
    const newCategory: SkillCategory = { 
      skillicon: "folder", 
      title: { fr: "", en: "", ar: "" }, 
      items: [] 
    };
    const newCategoryIndex = data.skills.length;
    setData({ ...data, skills: [...data.skills, newCategory] });
    // Auto-expand the new category
    setExpandedCategories(prev => new Set([...prev, newCategoryIndex]));
  };

  const removeCategory = (index: number) => {
    if (!data) return;
    const updated = data.skills.filter((_, i) => i !== index);
    setData({ ...data, skills: updated });
    // Remove from expanded set
    const newExpanded = new Set(expandedCategories);
    newExpanded.delete(index);
    // Adjust indices for categories that come after the removed one
    const adjustedExpanded = new Set();
    newExpanded.forEach(idx => {
      if (idx < index) {
        adjustedExpanded.add(idx);
      } else if (idx > index) {
        adjustedExpanded.add(idx - 1);
      }
    });
    setExpandedCategories(adjustedExpanded);
  };

  const addItem = (categoryIndex: number) => {
    if (!data) return;
    const newItem: SkillItem = { 
      name: { fr: "", en: "", ar: "" }, 
      examples: [], 
      icon: "code" 
    };
    const updated = [...data.skills];
    updated[categoryIndex].items.push(newItem);
    setData({ ...data, skills: updated });
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    if (!data) return;
    const updated = [...data.skills];
    updated[categoryIndex].items = updated[categoryIndex].items.filter((_, i) => i !== itemIndex);
    setData({ ...data, skills: updated });
  };

  const addExample = (categoryIndex: number, itemIndex: number) => {
    if (!data) return;
    const updated = [...data.skills];
    updated[categoryIndex].items[itemIndex].examples.push({ fr: "", en: "", ar: "" });
    setData({ ...data, skills: updated });
  };

  const removeExample = (categoryIndex: number, itemIndex: number, exampleIndex: number) => {
    if (!data) return;
    const updated = [...data.skills];
    updated[categoryIndex].items[itemIndex].examples = updated[categoryIndex].items[itemIndex].examples.filter((_, i) => i !== exampleIndex);
    setData({ ...data, skills: updated });
  };

const saveData = async () => {
  if (!data) return;
  try {
 
    const res = await fetch("/api/skills", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.error || "Failed to save skills data");
    }
    
    const result = await res.json();

  
    toast({
      title: "Success",
      description: "Saved successfully!!",
      className: "bg-green-500 text-white border-none",
    });
    fetchSkills();
  } catch (err: any) {
    console.error("Save error:", err);
    toast({
      title: "Error",
      description: err?.message || "Something went wrong!",
      className: "bg-red-500 text-white border-none",
    });
  }
};


  if (loading) return <Loading />;
  if (error) return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <LucideIcons.AlertCircle size={20} className="text-red-500" />
          <span className="text-red-600 dark:text-red-400">Error: {error}</span>
        </div>
      </div>
    </div>
  );
  if (!data) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.Zap size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Skills 
        </h1>
      </div>
{/* 
   
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Type size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Skills Section Title</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title (FR)</label>
            <input
              type="text"
              value={data.skillsTitle.fr}
              onChange={(e) => handleChange(null, null, "skillsTitle", "fr", e.target.value)}
              placeholder="Titre des compétences"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title (EN)</label>
            <input
              type="text"
              value={data.skillsTitle.en}
              onChange={(e) => handleChange(null, null, "skillsTitle", "en", e.target.value)}
              placeholder="Skills title"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title (AR)</label>
            <input
              type="text"
              value={data.skillsTitle.ar}
              onChange={(e) => handleChange(null, null, "skillsTitle", "ar", e.target.value)}
              placeholder="عنوان المهارات"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div> */}
 

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.FolderTree size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Skill Categories</h2>
          </div>
          <button
            onClick={addCategory}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add Category
          </button>
        </div>

        {data.skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <LucideIcons.FolderX size={24} className="mx-auto mb-2" />
            No skill categories added yet
          </div>
        ) : (
          <div className="space-y-3">
            {data.skills.map((category, catIdx) => {
              const isExpanded = expandedCategories.has(catIdx);
              
              return (
                <div key={catIdx} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 overflow-hidden">
                  {/* Accordion Header - Always Visible */}
                  <div 
                    className="bg-gray-100 dark:bg-gray-600 px-4 py-3 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                    onClick={() => toggleCategory(catIdx)}
                  >
          <div className="flex justify-between items-center">
  <div className="flex items-center gap-3">
    {renderIcon(category.skillicon, 20)}
    <div className="flex flex-col gap-1">
      {/* Title */}
      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
        {/* Phone (<640px) */}
        <span className="block sm:hidden">
          {category.title.en
            ? category.title.en.length > 4
              ? category.title.en.slice(0, 4) + ".."
              : category.title.en
            : `Category ${catIdx + 1}`}
        </span>

        {/* Tablet (≥640px and <1024px) */}
        <span className="hidden sm:block lg:hidden">
          {category.title.en
            ? category.title.en.length > 40
              ? category.title.en.slice(0, 40) + "..."
              : category.title.en
            : `Category ${catIdx + 1}`}
        </span>

        {/* PC (≥1024px) */}
        <span className="hidden lg:block">
          {category.title.en
            ? category.title.en.length > 60
              ? category.title.en.slice(0, 60) + "..."
              : category.title.en
            : `Category ${catIdx + 1}`}
        </span>
      </h3>
    </div>

    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
      {category.items.length} skills
    </span>
  </div>

  <div className="flex items-center gap-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        removeCategory(catIdx);
      }}
      className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-600 transition"
    >
      <LucideIcons.Trash2 size={12} />
      Remove
    </button>
    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
      <LucideIcons.ChevronDown size={20} className="text-gray-600 dark:text-gray-300" />
    </div>
  </div>
</div>

                  </div>

                  {/* Accordion Content - Expandable */}
                  <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-4 space-y-4">
                      {/* Category Icon */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category Icon</label>
                        <button 
                          type="button"
                          onClick={() => setShowIconPicker(
                            showIconPicker?.type === 'category' && showIconPicker?.categoryIndex === catIdx 
                              ? null 
                              : {type: 'category', categoryIndex: catIdx}
                          )}
                          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {renderIcon(category.skillicon, 16)}
                            <span>{category.skillicon || "Select icon"}</span>
                          </div>
                          <LucideIcons.ChevronDown size={16} />
                        </button>
                        
                        {showIconPicker?.type === 'category' && showIconPicker?.categoryIndex === catIdx && (
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
                                    handleChange(catIdx, null, "skillicon", 0, iconName);
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

                      {/* Category Title */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category Title (FR)</label>
                          <input
                            type="text"
                            value={category.title.fr}
                            onChange={(e) => handleChange(catIdx, null, "title", "fr", e.target.value)}
                            placeholder="Titre de la catégorie"
                            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category Title (EN)</label>
                          <input
                            type="text"
                            value={category.title.en}
                            onChange={(e) => handleChange(catIdx, null, "title", "en", e.target.value)}
                            placeholder="Category title"
                            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category Title (AR)</label>
                          <input
                            type="text"
                            value={category.title.ar}
                            onChange={(e) => handleChange(catIdx, null, "title", "ar", e.target.value)}
                            placeholder="عنوان الفئة"
                            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Skill Items */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <LucideIcons.List size={16} />
                            Skills in this category
                          </h4>
                          <button
                            onClick={() => addItem(catIdx)}
                            className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
                          >
                            <LucideIcons.Plus size={12} />
                            Add Skill
                          </button>
                        </div>

                        {category.items.length === 0 ? (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <LucideIcons.Package size={16} className="mx-auto mb-1" />
                            <span className="text-sm">No skills in this category yet</span>
                          </div>
                        ) : (
                          category.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="border border-gray-200 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                  {renderIcon(item.icon, 16)}
                                  <span className="font-medium text-gray-700 dark:text-gray-200">
                                    Skill {itemIdx + 1}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeItem(catIdx, itemIdx)}
                                  className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                                >
                                  <LucideIcons.X size={12} />
                                  Remove
                                </button>
                              </div>

                              {/* Item Icon */}
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Skill Icon</label>
                                <button 
                                  type="button"
                                  onClick={() => setShowIconPicker(
                                    showIconPicker?.type === 'item' && 
                                    showIconPicker?.categoryIndex === catIdx && 
                                    showIconPicker?.itemIndex === itemIdx
                                      ? null 
                                      : {type: 'item', categoryIndex: catIdx, itemIndex: itemIdx}
                                  )}
                                  className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    {renderIcon(item.icon, 16)}
                                    <span>{item.icon || "Select icon"}</span>
                                  </div>
                                  <LucideIcons.ChevronDown size={16} />
                                </button>
                                
                                {showIconPicker?.type === 'item' && 
                                 showIconPicker?.categoryIndex === catIdx && 
                                 showIconPicker?.itemIndex === itemIdx && (
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
                                            handleChange(catIdx, itemIdx, "icon", 0, iconName);
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

                              {/* Item Name */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Skill Name (FR)</label>
                                  <input
                                    type="text"
                                    value={item.name.fr}
                                    onChange={(e) => handleChange(catIdx, itemIdx, "name", "fr", e.target.value)}
                                    placeholder="Nom de la compétence"
                                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Skill Name (EN)</label>
                                  <input
                                    type="text"
                                    value={item.name.en}
                                    onChange={(e) => handleChange(catIdx, itemIdx, "name", "en", e.target.value)}
                                    placeholder="Skill name"
                                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Skill Name (AR)</label>
                                  <input
                                    type="text"
                                    value={item.name.ar}
                                    onChange={(e) => handleChange(catIdx, itemIdx, "name", "ar", e.target.value)}
                                    placeholder="اسم المهارة"
                                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                  />
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                                  <button
                                    onClick={() => addExample(catIdx, itemIdx)}
                                    className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition"
                                  >
                                    <LucideIcons.Plus size={12} />
                                    Add Description
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  {item.examples.map((example, exIdx) => (
                                    <div key={exIdx} className="flex flex-col gap-2 w-full">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                                        <input
                                          type="text"
                                          value={typeof example === "string" ? example : example.fr}
                                          onChange={(e) =>
                                            handleChange(catIdx, itemIdx, "examples", { exampleIndex: exIdx, lang: "fr" }, e.target.value)
                                          }
                                          placeholder={`Description ${exIdx + 1} (FR)`}
                                          className="border p-2 rounded-lg bg-white text-gray-800"
                                        />
                                        <input
                                          type="text"
                                          value={typeof example === "string" ? example : example.en}
                                          onChange={(e) =>
                                            handleChange(catIdx, itemIdx, "examples", { exampleIndex: exIdx, lang: "en" }, e.target.value)
                                          }
                                          placeholder={`Description ${exIdx + 1} (EN)`}
                                          className="border p-2 rounded-lg bg-white text-gray-800"
                                        />
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={typeof example === "string" ? "" : example.ar}
                                            onChange={(e) =>
                                              handleChange(catIdx, itemIdx, "examples", { exampleIndex: exIdx, lang: "ar" }, e.target.value)
                                            }
                                            placeholder={`Description ${exIdx + 1} (AR)`}
                                            className="border p-2 rounded-lg flex-1 bg-white text-gray-800"
                                          />
                                          <button
                                            onClick={() => removeExample(catIdx, itemIdx, exIdx)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex-shrink-0"
                                          >
                                            <LucideIcons.X size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {item.examples.length === 0 && (
                                    <div className="text-sm text-gray-500 italic">No Description added yet</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={saveData}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LucideIcons.Save size={18} />
          Save Skills Data
        </button>
      </div>
    </div>
  );
}
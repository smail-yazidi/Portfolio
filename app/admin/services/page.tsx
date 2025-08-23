"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"

type Service = {
  title: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
};

type ServicesData = {
  servicesList: Service[];
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const { toast } = useToast()

const fetchServices = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/services", {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "" // 🔹 حماية API
      }
    });

    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();
    setServices(data);
  } catch (err: any) {
    setError(err.message);
    // Fallback to empty structure
    setServices({ servicesList: [] });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchServices();
  }, []);

  const toggleAccordion = (index: number) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedServices(newExpanded);
  };

  const handleServiceChange = (index: number, field: "title" | "description", lang: "fr" | "en" | "ar", value: string) => {
    if (!services) return;
    const updatedList = [...services.servicesList];
    updatedList[index][field][lang] = value;
    setServices({ servicesList: updatedList });
  };

  const addService = () => {
    if (!services) return;
    const newIndex = services.servicesList.length;
    setServices({
      servicesList: [
        ...services.servicesList,
        { title: { fr: "", en: "", ar: "" }, description: { fr: "", en: "", ar: "" } },
      ],
    });
    // Automatically expand the new service
    setExpandedServices(prev => new Set([...prev, newIndex]));
  };

  const removeService = (index: number) => {
    if (!services) return;
    const updatedList = services.servicesList.filter((_, i) => i !== index);
    setServices({ servicesList: updatedList });
    
    // Update expanded services indices
    const newExpanded = new Set<number>();
    expandedServices.forEach(expandedIndex => {
      if (expandedIndex < index) {
        newExpanded.add(expandedIndex);
      } else if (expandedIndex > index) {
        newExpanded.add(expandedIndex - 1);
      }
    });
    setExpandedServices(newExpanded);
  };

const saveServices = async () => {
  if (!services) return;

  try {
    const res = await fetch("/api/services", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "" // 🔹 حماية API
      },
      body: JSON.stringify(services),
    });

    if (!res.ok) throw new Error("Failed to save services");

    toast({
      title: "Success",
      description: "Saved successfully!!",
      className: "bg-green-500 text-white border-none",
    });

    await fetchServices();
  } catch (err: any) {
    toast({
      title: "Error",
      description: err?.message || "Something went wrong!",
      className: "bg-red-500 text-white border-none",
    });
  }
};


  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!services) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.Settings size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Services
        </h1>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.List size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Services List</h2>
        {/*     <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              {services.servicesList.length} Services
            </span> */}
          </div>
          <button 
            onClick={addService}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add Service
          </button>
        </div>

        {services.servicesList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <LucideIcons.Info size={24} className="mx-auto mb-2" />
            No services added yet
          </div>
        ) : (
          <div className="space-y-3">
            {services.servicesList.map((service, index) => {
              const isExpanded = expandedServices.has(index);
              const hasContent = service.title.fr || service.title.en || service.title.ar || service.description.fr || service.description.en || service.description.ar;
              const displayTitle = service.title.en || service.title.fr || service.title.ar || `Service ${index + 1}`;
              
              return (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 overflow-hidden">
                  {/* Accordion Header */}
                  <div 
                    onClick={() => toggleAccordion(index)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <LucideIcons.Circle size={12} className="text-blue-500 flex-shrink-0" />
                      <h3 className="font-medium text-lg text-gray-700 dark:text-white">
                        {/* Phone (<640px) */}
                        <span className="block sm:hidden">
                          {hasContent
                            ? displayTitle.length > 8
                              ? displayTitle.slice(0, 8) + "..."
                              : displayTitle
                            : `Service ${index + 1}`}
                        </span>

                        {/* Tablet (≥640px and <1024px) */}
                        <span className="hidden sm:block lg:hidden">
                          {hasContent
                            ? displayTitle.length > 40
                              ? displayTitle.slice(0, 40) + "..."
                              : displayTitle
                            : `Service ${index + 1}`}
                        </span>

                        {/* PC (≥1024px) */}
                        <span className="hidden lg:block">
                          {hasContent
                            ? displayTitle.length > 60
                              ? displayTitle.slice(0, 60) + "..."
                              : displayTitle
                            : `Service ${index + 1}`}
                        </span>
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeService(index);
                        }}
                        className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                      >
                        <LucideIcons.Trash2 size={14} />
                        Remove
                      </button>
                      
                      <LucideIcons.ChevronDown 
                        size={20} 
                        className={`text-gray-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Accordion Content */}
                  <div className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}>
                    <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-600">
                      {/* Titles Section */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                          <LucideIcons.Type size={16} />
                          Service Titles
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <LucideIcons.Globe size={14} className="inline mr-1" />
                              Title (FR)
                            </label>
                            <input
                              type="text"
                              value={service.title.fr}
                              placeholder="Titre du service en français"
                              onChange={(e) => handleServiceChange(index, "title", "fr", e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <LucideIcons.Globe size={14} className="inline mr-1" />
                              Title (EN)
                            </label>
                            <input
                              type="text"
                              value={service.title.en}
                              placeholder="Service title in English"
                              onChange={(e) => handleServiceChange(index, "title", "en", e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <LucideIcons.Globe size={14} className="inline mr-1" />
                              Title (AR)
                            </label>
                            <input
                              type="text"
                              value={service.title.ar}
                              placeholder="عنوان الخدمة بالعربية"
                              onChange={(e) => handleServiceChange(index, "title", "ar", e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              dir="rtl"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Descriptions Section */}
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                          <LucideIcons.FileText size={16} />
                          Service Descriptions
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <LucideIcons.FileText size={14} className="inline mr-1" />
                              Description (FR)
                            </label>
                            <textarea
                              value={service.description.fr}
                              placeholder="Description du service en français"
                              onChange={(e) => handleServiceChange(index, "description", "fr", e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <LucideIcons.FileText size={14} className="inline mr-1" />
                              Description (EN)
                            </label>
                            <textarea
                              value={service.description.en}
                              placeholder="Service description in English"
                              onChange={(e) => handleServiceChange(index, "description", "en", e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <LucideIcons.FileText size={14} className="inline mr-1" />
                              Description (AR)
                            </label>
                            <textarea
                              value={service.description.ar}
                              placeholder="وصف الخدمة بالعربية"
                              onChange={(e) => handleServiceChange(index, "description", "ar", e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              dir="rtl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={saveServices}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LucideIcons.Save size={18} />
          Save Services
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"

export default function AdminCvPage() {
  const router = useRouter();
  const [cvFiles, setCvFiles] = useState<{ fr?: File; en?: File }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [cvUrls, setCvUrls] = useState<{ fr?: string; en?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<{ fr?: number; en?: number }>({});
 const { toast } = useToast()

// Fetch existing CV URLs
useEffect(() => {
  const fetchCvUrls = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cv", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
        }
      });

      if (!res.ok) throw new Error("Failed to fetch CVs");

      const data = await res.json();
      setCvUrls(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load existing CVs");
    } finally {
      setLoading(false);
    }
  };

  fetchCvUrls();
}, []);


  const handleFileChange = (lang: "fr" | "en", file: File | null) => {
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setError(`Please select a PDF file for ${lang.toUpperCase()} CV`);
        return;
      }
      
      // Validate file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError(`File size too large. Please select a file smaller than 10MB for ${lang.toUpperCase()} CV`);
        return;
      }
    }

    setCvFiles(prev => ({ ...prev, [lang]: file || undefined }));
    setError(null);
  };

  const handleRemoveFile = (lang: "fr" | "en") => {
    setCvFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[lang];
      return newFiles;
    });
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'CV File';
  };

const handleUpload = async () => {
  if (!cvFiles.fr && !cvFiles.en) {
    setError("Please select at least one PDF file to upload");
    return;
  }

  setIsUploading(true);
  setError(null);
  setUploadProgress({});

  try {
    const formData = new FormData();
    if (cvFiles.fr) formData.append("fr", cvFiles.fr);
    if (cvFiles.en) formData.append("en", cvFiles.en);

    const res = await fetch("/api/cv", {
      method: "PUT",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update CVs");
    }

    const data = await res.json();
    setCvUrls(data);
    setCvFiles({}); // Clear selected files after successful upload
    setError(null); // Clear any previous error
  } catch (err: any) {
    console.error("Upload error:", err);
    setError(err.message);
  } finally {
    setIsUploading(false);
    setUploadProgress({});
  }
};


  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.FileText size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          CV 
        </h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <LucideIcons.AlertCircle size={20} className="text-red-500" />
              <span className="text-red-600 dark:text-red-400">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <LucideIcons.Upload size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Upload New CVs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* French CV Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <LucideIcons.Flag size={16} className="text-blue-500" />
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                French CV (PDF only)
              </label>
            </div>
            
            <div className="relative">
              <input
                type="file"
                id="fr-cv-upload"
                accept="application/pdf"
                onChange={(e) => handleFileChange("fr", e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="fr-cv-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <LucideIcons.Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> French CV
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
                </div>
              </label>
            </div>

            {cvFiles.fr && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <LucideIcons.FileText size={16} className="text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {cvFiles.fr.name}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {formatFileSize(cvFiles.fr.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile("fr")}
                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                >
                  <LucideIcons.X size={16} className="text-blue-500" />
                </button>
              </div>
            )}
          </div>

          {/* English CV Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <LucideIcons.Flag size={16} className="text-green-500" />
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                English CV (PDF only)
              </label>
            </div>
            
            <div className="relative">
              <input
                type="file"
                id="en-cv-upload"
                accept="application/pdf"
                onChange={(e) => handleFileChange("en", e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="en-cv-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <LucideIcons.Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> English CV
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
                </div>
              </label>
            </div>

            {cvFiles.en && (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <LucideIcons.FileText size={16} className="text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      {cvFiles.en.name}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {formatFileSize(cvFiles.en.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile("en")}
                  className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                >
                  <LucideIcons.X size={16} className="text-green-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={isUploading || (!cvFiles.fr && !cvFiles.en)}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <LucideIcons.Loader2 size={18} className="animate-spin" />
                Uploading CVs...
              </>
            ) : (
              <>
                <LucideIcons.Upload size={18} />
                Upload CVs
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current CVs Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <LucideIcons.Archive size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Current CVs</h2>
        </div>

        {!cvUrls.fr && !cvUrls.en ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <LucideIcons.FileX size={24} className="mx-auto mb-2" />
            <p>No CVs uploaded yet</p>
            <p className="text-sm">Upload your first CV files above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* French CV */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <LucideIcons.Flag size={16} className="text-blue-500" />
                <h3 className="font-medium text-gray-700 dark:text-gray-200">French CV</h3>
              </div>
              
              {cvUrls.fr ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <LucideIcons.FileText size={16} className="text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {getFileName(cvUrls.fr)}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Available for download
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(cvUrls.fr!)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      <LucideIcons.Eye size={14} />
                      Preview
                    </button>
                    <a
                      href={cvUrls.fr}
                      download
                      className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-600 transition"
                    >
                      <LucideIcons.Download size={14} />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <LucideIcons.FileX size={20} className="mx-auto mb-1" />
                  <p className="text-sm">No French CV uploaded</p>
                </div>
              )}
            </div>

            {/* English CV */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <LucideIcons.Flag size={16} className="text-green-500" />
                <h3 className="font-medium text-gray-700 dark:text-gray-200">English CV</h3>
              </div>
              
              {cvUrls.en ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <LucideIcons.FileText size={16} className="text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        {getFileName(cvUrls.en)}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Available for download
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(cvUrls.en!)}
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                    >
                      <LucideIcons.Eye size={14} />
                      Preview
                    </button>
                    <a
                      href={cvUrls.en}
                      download
                      className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-600 transition"
                    >
                      <LucideIcons.Download size={14} />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <LucideIcons.FileX size={20} className="mx-auto mb-1" />
                  <p className="text-sm">No English CV uploaded</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
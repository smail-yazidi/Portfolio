"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"

export default function AdminPhotoPage() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
 const { toast } = useToast()

 
 // Fetch existing photo URL
useEffect(() => {
  const fetchPhotoUrl = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photo", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "" // 🔹 أضف المفتاح هنا
        }
      });

      if (!res.ok) throw new Error("Failed to fetch photo");

      const data = await res.json();
      setPhotoUrl(data.url || null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load existing photo");
    } finally {
      setLoading(false);
    }
  };
  fetchPhotoUrl();
}, []);


  const handleFileChange = (file: File | null) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPG, PNG, or WebP)");
        return;
      }
      
      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File size too large. Please select an image smaller than 5MB");
        return;
      }
    }

    setPhotoFile(file);
    setError(null);
  };

  const handleRemoveFile = () => {
    setPhotoFile(null);
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
    return url.split('/').pop() || 'Profile Photo';
  };

const handleUpload = async () => {
  if (!photoFile) {
    setError("Please select an image file to upload");
    return;
  }

  setIsUploading(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append("photo", photoFile);

    const res = await fetch("/api/photo", {
      method: "PUT",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || "" // 🔹 أضف المفتاح هنا
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update photo");
    }

    const data = await res.json();
    setPhotoUrl(data.url);
    setPhotoFile(null); // Clear selected file after successful upload

    // Show success message
    setError(null);

  } catch (err: any) {
    console.error("Upload error:", err);
    setError(err.message);
  } finally {
    setIsUploading(false);
  }
};


  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.Camera size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Profile Photo
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
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Upload New Photo</h2>
        </div>

        <div className="max-w-md mx-auto">
          {/* Photo Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <LucideIcons.Image size={16} className="text-purple-500" />
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Profile Photo (JPG, PNG, WebP only)
              </label>
            </div>
            
            <div className="relative">
              <input
                type="file"
                id="photo-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <LucideIcons.Camera className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> profile photo
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or WebP (MAX. 5MB)
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Recommended: Square aspect ratio
                  </p>
                </div>
              </label>
            </div>

            {photoFile && (
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2">
                  <LucideIcons.Image size={16} className="text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {photoFile.name}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {formatFileSize(photoFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800 rounded"
                >
                  <LucideIcons.X size={16} className="text-purple-500" />
                </button>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading || !photoFile}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <LucideIcons.Loader2 size={18} className="animate-spin" />
                  Uploading Photo...
                </>
              ) : (
                <>
                  <LucideIcons.Upload size={18} />
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Current Photo Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <LucideIcons.Archive size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Current Photo</h2>
        </div>

        {!photoUrl ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <LucideIcons.ImageOff size={24} className="mx-auto mb-2" />
            <p>No profile photo uploaded yet</p>
            <p className="text-sm">Upload your first photo above</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <LucideIcons.User size={16} className="text-purple-500" />
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Profile Photo</h3>
              </div>
              
              <div className="space-y-4">
                {/* Photo Preview */}
                <div className="flex justify-center">
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                    <img
                      src={photoUrl}
                      alt="Profile photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* File Info */}
                <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <LucideIcons.Image size={16} className="text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {getFileName(photoUrl)}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      Available for viewing
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handlePreview(photoUrl)}
                    className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-600 transition"
                  >
                    <LucideIcons.Eye size={14} />
                    Preview
                  </button>
                  <a
                    href={photoUrl}
                    download
                    className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-600 transition"
                  >
                    <LucideIcons.Download size={14} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
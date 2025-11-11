"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Image as ImageIcon, Smile, AtSign } from "lucide-react";
import { postData } from "@/lib/strapi/strapiData";

export default function CreatePostPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Store actual File objects
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 3000;

  // Get user info from localStorage
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");

  React.useEffect(() => {
    try {
      const userStr = localStorage.getItem("fomo_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const name = user?.username || "User";
        setUserName(name);
        setUserInitials(
          name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        );
      }
    } catch (err) {
      console.error("Failed to get user data:", err);
    }
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMessage(text);
    setCharCount(text.length);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("Files selected:", files);

    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      console.log("Files array:", filesArray);

      // Store the actual File objects
      setImageFiles((prev) => [...prev, ...filesArray]);

      // Create preview URLs
      filesArray.forEach((file, index) => {
        console.log(
          `Reading file ${index + 1}:`,
          file.name,
          file.size,
          file.type
        );
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log(`File ${index + 1} loaded`);
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.onerror = (error) => {
          console.error(`Error reading file ${file.name}:`, error);
        };
        reader.readAsDataURL(file);
      });
    } else {
      console.log("No files selected");
    }

    // Reset the input so the same file can be selected again if needed
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const uploadImages = async (token: string): Promise<number[]> => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    const uploadedImageIds: number[] = [];

    console.log(
      `Starting upload of ${imageFiles.length} images to ${BACKEND_URL}/api/upload`
    );

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      console.log(
        `Uploading image ${i + 1}/${imageFiles.length}:`,
        file.name,
        file.size,
        file.type
      );

      const formData = new FormData();
      formData.append("files", file);

      try {
        const uploadResponse = await fetch(`${BACKEND_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        console.log(
          `Upload response status for ${file.name}:`,
          uploadResponse.status
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`Upload failed for ${file.name}:`, errorText);
          throw new Error(
            `Failed to upload image ${file.name}: ${uploadResponse.status} - ${errorText}`
          );
        }

        const uploadedFiles = await uploadResponse.json();
        console.log(`Upload successful for ${file.name}:`, uploadedFiles);

        if (uploadedFiles && uploadedFiles.length > 0) {
          uploadedImageIds.push(uploadedFiles[0].id);
          console.log(`Image ID for ${file.name}:`, uploadedFiles[0].id);
        } else {
          console.warn(`No files returned in upload response for ${file.name}`);
        }
      } catch (error) {
        console.error(`Error uploading image ${file.name}:`, error);
        throw error;
      }
    }

    console.log("All images uploaded. IDs:", uploadedImageIds);
    return uploadedImageIds;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please write something before posting!");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("fomo_token");

      if (!token) {
        alert("You must be logged in to create a post");
        setIsSubmitting(false);
        router.push("/auth/login");
        return;
      }

      // Get current user info for the post
      const userStr = localStorage.getItem("fomo_user");
      let userId = null;
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user?.documentId || user?.id;
      }

      // Upload images first if there are any
      let uploadedImageIds: number[] = [];
      if (imageFiles.length > 0) {
        console.log(`Attempting to upload ${imageFiles.length} images...`);
        try {
          uploadedImageIds = await uploadImages(token);
          console.log("Successfully uploaded images. IDs:", uploadedImageIds);
        } catch (error) {
          console.error("Image upload failed:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          alert(`Failed to upload images: ${errorMessage}`);
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log("No images to upload");
      }

      // Create the post with uploaded image IDs
      const postPayload = {
        data: {
          description: message,
          user: {
            connect: [userId],
          },
          // Connect uploaded images to the post
          ...(uploadedImageIds.length > 0 && {
            images: {
              connect: uploadedImageIds,
            },
          }),
        },
      };

      console.log(
        "Creating post with payload:",
        JSON.stringify(postPayload, null, 2)
      );

      const response = await postData(token, "posts", postPayload);

      if (response?.error) {
        console.error("Error creating post:", response.error);
        alert(
          `Failed to create post: ${response.error.message || "Unknown error"}`
        );
        setIsSubmitting(false);
        return;
      }

      console.log("Post created successfully:", response);
      alert("Post created successfully!");
      router.push("/students");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating your post. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (message.trim() || images.length > 0) {
      const confirm = window.confirm(
        "Are you sure you want to discard this post?"
      );
      if (confirm) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
            <p className="text-gray-600 mt-1">
              Share your thoughts with your network
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Author Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-lg">
                  {userInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-500">Posting to everyone</p>
                </div>
              </div>
            </div>

            {/* Text Area */}
            <div className="p-6">
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="What's on your mind?"
                className="w-full min-h-[200px] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none text-lg"
                maxLength={maxChars}
              />

              {/* Character Count */}
              <div className="flex justify-end mt-2">
                <span
                  className={`text-sm ${
                    charCount > maxChars * 0.9
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {charCount} / {maxChars}
                </span>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6">
                  <div
                    className={`grid gap-3 ${
                      images.length === 1
                        ? "grid-cols-1"
                        : images.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                    }`}
                  >
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-gray-900 bg-opacity-70 hover:bg-opacity-90 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </label>
                <button
                  type="button"
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <AtSign className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isSubmitting
                    ? imageFiles.length > 0
                      ? "Uploading images..."
                      : "Posting..."
                    : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Posting Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Share your achievements, projects, and learning experiences
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Use clear and professional language</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Add images to make your post more engaging</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Tag relevant people to increase visibility</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

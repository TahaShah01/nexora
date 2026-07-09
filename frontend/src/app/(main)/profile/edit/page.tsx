"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/shared/protected-route";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { getErrorMessage } from "@/lib/api/client";
import { uploadImageToCloudinary } from "@/lib/api/uploads.api";
import { updateProfile as updateProfileRequest } from "@/lib/api/users.api";
import { profileEditFormSchema, type ProfileEditFormValues } from "@/lib/validators/profile.schema";

const SOCIAL_FIELDS = ["website", "linkedin", "github", "twitter", "instagram"] as const;

function EditProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profileData } = useProfile(user?.username ?? "");
  const profile = profileData?.user;

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormValues>({ resolver: zodResolver(profileEditFormSchema) });

  useEffect(() => {
    if (!profile) return;
    setAvatarUrl(profile.avatarUrl);
    setCoverImageUrl(profile.coverImageUrl);
    setPortfolioImages(profile.portfolioImages || []);
    
    reset({
      name: profile.name,
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      phone: profile.contact?.phone ?? "",
      skills: profile.skills.join(", "),
      website: profile.socialLinks.find((l) => l.platform === "website")?.url ?? "",
      linkedin: profile.socialLinks.find((l) => l.platform === "linkedin")?.url ?? "",
      github: profile.socialLinks.find((l) => l.platform === "github")?.url ?? "",
      twitter: profile.socialLinks.find((l) => l.platform === "twitter")?.url ?? "",
      instagram: profile.socialLinks.find((l) => l.platform === "instagram")?.url ?? "",
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile", user?.username] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push(`/profile/${user?.username}`);
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't update your profile")),
  });

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file, "nexora/avatars");
      setAvatarUrl(url);
    } catch {
      toast.error("Couldn't upload that image");
    } finally {
      setUploading(false);
    }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImageToCloudinary(file, "nexora/covers");
      setCoverImageUrl(url);
    } catch {
      toast.error("Couldn't upload cover image");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handlePortfolioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPortfolio(true);
    try {
      const url = await uploadImageToCloudinary(file, "nexora/portfolio");
      setPortfolioImages((prev) => [...prev, url]);
    } catch {
      toast.error("Couldn't upload portfolio image");
    } finally {
      setUploadingPortfolio(false);
    }
  }

  function removePortfolioImage(index: number) {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
  }

  function onSubmit(values: ProfileEditFormValues) {
    const socialLinks = SOCIAL_FIELDS.filter((platform) => values[platform]).map((platform) => ({
      platform,
      url: values[platform] as string,
    }));

    mutation.mutate({
      name: values.name,
      bio: values.bio || undefined,
      location: values.location || undefined,
      avatarUrl,
      coverImageUrl,
      portfolioImages,
      contact: values.phone ? { phone: values.phone } : undefined,
      skills: values.skills
        ? values.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      socialLinks,
    });
  }

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-text-primary">Edit profile</h1>

      {/* Cover Image */}
      <div>
        <Label>Cover Image</Label>
        <div className="mt-2 flex flex-col items-center justify-center rounded-card border border-dashed border-border p-6 bg-surface">
          {coverImageUrl ? (
            <div className="relative w-full h-40 rounded-md overflow-hidden">
              <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-paper/80"
                onClick={() => setCoverImageUrl(undefined)}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-text-muted mb-2" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={uploadingCover}
                onClick={() => coverInputRef.current?.click()}
              >
                Upload Cover
              </Button>
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Avatar src={avatarUrl} name={user.name} size="xl" />
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" /> Change photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" error={errors.name?.message} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={4}
          placeholder="Tell people what you do"
          error={errors.bio?.message}
          {...register("bio")}
        />
        {errors.bio && <p className="mt-1 text-xs text-danger">{errors.bio.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="City, Country" {...register("location")} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>

      <div>
        <Label htmlFor="skills">Skills</Label>
        <Input id="skills" placeholder="React, Next.js, Node.js, UI/UX" {...register("skills")} />
        <p className="mt-1 text-xs text-text-muted">Comma-separated.</p>
      </div>

      {/* Portfolio Gallery */}
      <div>
        <Label>Portfolio Gallery</Label>
        <p className="text-xs text-text-muted mb-3">Upload images of your past work (max 20).</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {portfolioImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-surface border border-border">
              <img src={img} alt="Portfolio" className="w-full h-full object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 rounded-full bg-danger text-ink p-1 shadow-sm opacity-80 hover:opacity-100"
                onClick={() => removePortfolioImage(idx)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {portfolioImages.length < 20 && (
            <button
              type="button"
              className="flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-border bg-surface text-text-muted hover:bg-elevated transition-colors"
              onClick={() => portfolioInputRef.current?.click()}
            >
              {uploadingPortfolio ? <span className="animate-spin text-primary rounded-full border-2 border-primary border-t-transparent h-5 w-5" /> : <ImageIcon className="h-6 w-6" />}
            </button>
          )}
        </div>
        <input
          ref={portfolioInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePortfolioChange}
        />
      </div>

      <div>
        <Label>Social links</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Website URL" error={errors.website?.message} {...register("website")} />
          <Input placeholder="LinkedIn URL" error={errors.linkedin?.message} {...register("linkedin")} />
          <Input placeholder="GitHub URL" error={errors.github?.message} {...register("github")} />
          <Input placeholder="Twitter URL" error={errors.twitter?.message} {...register("twitter")} />
          <Input placeholder="Instagram URL" error={errors.instagram?.message} {...register("instagram")} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileForm />
    </ProtectedRoute>
  );
}

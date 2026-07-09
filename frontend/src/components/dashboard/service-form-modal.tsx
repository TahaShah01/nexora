"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useServiceCategories } from "@/hooks/use-service-categories";
import { useCreateService, useUpdateService } from "@/hooks/use-service-mutations";
import { uploadToCloudinary } from "@/lib/api/uploads.api";
import type { ServicePackageInput } from "@/lib/api/services.api";
import type { Service, ServiceCategory } from "@/types/service";

const EMPTY_PACKAGE: ServicePackageInput = { name: "", price: 0, deliveryDays: 1, features: [] };

export function ServiceFormModal({
  open,
  onClose,
  service,
}: {
  open: boolean;
  onClose: () => void;
  service?: Service;
}) {
  const { data: categories = [] } = useServiceCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [packages, setPackages] = useState<ServicePackageInput[]>([{ ...EMPTY_PACKAGE }]);

  useEffect(() => {
    if (!open) return;
    setTitle(service?.title ?? "");
    setDescription(service?.description ?? "");
    setCategory(typeof service?.category === "object" ? (service.category as ServiceCategory).id : "");
    setLocation(service?.location ?? "");
    setImages(service?.images ?? []);
    setPackages(
      service?.packages && service.packages.length > 0
        ? service.packages.map((p) => ({ ...p }))
        : [{ ...EMPTY_PACKAGE }]
    );
  }, [open, service]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "nexora/services", "image");
      setImages((prev) => [...prev, url]);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function updatePackage(index: number, patch: Partial<ServicePackageInput>) {
    setPackages((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function addPackage() {
    if (packages.length >= 5) return;
    setPackages((prev) => [...prev, { ...EMPTY_PACKAGE }]);
  }

  function removePackage(index: number) {
    setPackages((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Add at least one image");
      return;
    }
    if (packages.some((p) => !p.name || p.price <= 0)) {
      toast.error("Every package needs a name and a price greater than 0");
      return;
    }

    const payload = { title, description, category, images, location: location || undefined, packages };

    if (service) {
      updateService.mutate({ slug: service.slug, payload }, { onSuccess: onClose });
    } else {
      createService.mutate(payload, { onSuccess: onClose });
    }
  }

  const isPending = createService.isPending || updateService.isPending;

  return (
    <Modal open={open} onClose={onClose} title={service ? "Edit Service" : "New Service"} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div>
          <Label htmlFor="s-title">Title</Label>
          <Input id="s-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="s-desc">Description</Label>
          <Textarea
            id="s-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="s-category">Category</Label>
            <Select id="s-category" required value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="s-location">Location</Label>
            <Input
              id="s-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote, or City, Country"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Packages</Label>
            {packages.length < 5 && (
              <button
                type="button"
                onClick={addPackage}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
              >
                <Plus className="h-3.5 w-3.5" /> Add package
              </button>
            )}
          </div>
          <div className="space-y-3">
            {packages.map((pkg, i) => (
              <div key={i} className="rounded-input border border-border p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_100px_100px_auto]">
                  <Input
                    placeholder="Package name (e.g. Basic)"
                    required
                    value={pkg.name}
                    onChange={(e) => updatePackage(i, { name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    required
                    min="0"
                    step="0.01"
                    value={pkg.price || ""}
                    onChange={(e) => updatePackage(i, { price: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="Days"
                    required
                    min="1"
                    value={pkg.deliveryDays || ""}
                    onChange={(e) => updatePackage(i, { deliveryDays: Number(e.target.value) })}
                  />
                  {packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePackage(i)}
                      aria-label="Remove package"
                      className="flex items-center justify-center rounded-input px-2 text-text-muted hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <FeaturesInput
                  value={pkg.features}
                  onChange={(features) => updatePackage(i, { features })}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Images</Label>
          <div className="flex flex-wrap gap-2">
            {images.map((img) => (
              <div key={img} className="relative h-16 w-16 overflow-hidden rounded-input border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary Cloudinary thumbnail preview */}
                <img src={img} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((i) => i !== img))}
                  className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-bl bg-danger text-[10px] text-ink"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-input border border-dashed border-border text-xs text-text-muted hover:border-primary">
              {uploading ? "..." : "+ Add"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {service ? "Save Changes" : "Create Service"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * Uncontrolled-ish features input: displays raw text while the user is typing,
 * only commits the parsed array to the parent on blur or Enter key. This allows
 * typing "Fast delivery, 24h support" without the cursor jumping when a comma is typed.
 */
function FeaturesInput({ value, onChange }: { value: string[]; onChange: (features: string[]) => void }) {
  const [raw, setRaw] = useState(value.join(", "));
  const [focused, setFocused] = useState(false);

  // When parent resets the form, sync the raw value
  if (!focused && raw !== value.join(", ")) {
    setRaw(value.join(", "));
  }

  function commit(text: string) {
    const parsed = text.split(",").map((f) => f.trim()).filter(Boolean);
    onChange(parsed);
  }

  return (
    <Input
      className="mt-2"
      placeholder="Features, comma-separated (e.g. Fast delivery, 24h support)"
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { setFocused(false); commit(e.target.value); }}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(raw); } }}
    />
  );
}

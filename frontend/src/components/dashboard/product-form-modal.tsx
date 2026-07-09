"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-product-mutations";
import { uploadToCloudinary } from "@/lib/api/uploads.api";
import type { Category, Product, ProductCondition } from "@/types/product";

const CONDITIONS: ProductCondition[] = ["new", "like_new", "used", "refurbished"];

export function ProductFormModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product;
}) {
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [condition, setCondition] = useState<ProductCondition>("new");
  const [location, setLocation] = useState("");
  const [stock, setStock] = useState("1");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setTitle(product?.title ?? "");
    setDescription(product?.description ?? "");
    setCategory(typeof product?.category === "object" ? (product.category as Category).id : "");
    setPrice(product ? String(product.price) : "");
    setCompareAtPrice(product?.compareAtPrice ? String(product.compareAtPrice) : "");
    setCondition(product?.condition ?? "new");
    setLocation(product?.location ?? "");
    setStock(product ? String(product.stock) : "1");
    setImages(product?.images ?? []);
  }, [open, product]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "nexora/products", "image");
      setImages((prev) => [...prev, url]);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Add at least one image");
      return;
    }

    const payload = {
      title,
      description,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      condition,
      images,
      location: location || undefined,
      stock: Number(stock),
    };

    if (product) {
      updateProduct.mutate({ slug: product.slug, payload }, { onSuccess: onClose });
    } else {
      createProduct.mutate(payload, { onSuccess: onClose });
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit Product" : "New Product"} className="max-w-xl">
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div>
          <Label htmlFor="p-title">Title</Label>
          <Input id="p-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="p-desc">Description</Label>
          <Textarea
            id="p-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="p-category">Category</Label>
            <Select id="p-category" required value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="p-condition">Condition</Label>
            <Select
              id="p-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition)}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="p-price">Price ($)</Label>
            <Input
              id="p-price"
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="p-compare">Compare-at price</Label>
            <Input
              id="p-compare"
              type="number"
              min="0"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="p-stock">Stock</Label>
            <Input id="p-stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="p-location">Location</Label>
          <Input
            id="p-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
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
            {product ? "Save Changes" : "Create Listing"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

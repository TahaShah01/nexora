"use client";

import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "@/lib/api/admin.api";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [type, setType] = useState<"product" | "service">("product");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [type]);

  async function fetchCategories() {
    setLoading(true);
    try {
      const data = await getCategories(type);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createCategory({ type, name, slug, icon, order });
      setName("");
      setSlug("");
      setIcon("");
      setOrder(0);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id, type);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
          <div className="flex bg-surface rounded-btn border border-border p-1">
            <button
              onClick={() => setType("product")}
              className={`px-4 py-1 text-sm font-medium rounded-sm transition-colors ${type === "product" ? "bg-primary text-ink shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
            >
              Product
            </button>
            <button
              onClick={() => setType("service")}
              className={`px-4 py-1 text-sm font-medium rounded-sm transition-colors ${type === "service" ? "bg-primary text-ink shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
            >
              Service
            </button>
          </div>
        </div>

        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto rounded-card border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-surface text-text-primary">
                <tr>
                  <th className="px-4 py-3 font-medium">Icon</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-elevated/50 transition-colors">
                    <td className="px-4 py-3 text-lg">{cat.icon}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{cat.name}</td>
                    <td className="px-4 py-3 text-text-muted">{cat.slug}</td>
                    <td className="px-4 py-3">{cat.order}</td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" onClick={() => handleDelete(cat._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <div className="rounded-card border border-border bg-card p-6 sticky top-24">
          <h2 className="text-lg font-bold text-text-primary mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Electronics" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g. electronics" />
            </div>
            <div>
              <Label>Icon (Emoji/String)</Label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. 💻" />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} required />
            </div>
            <Button type="submit" className="w-full">Create Category</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

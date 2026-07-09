"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteProduct } from "@/hooks/use-product-mutations";
import { useProducts } from "@/hooks/use-products";
import { useDeleteService } from "@/hooks/use-service-mutations";
import { useServices } from "@/hooks/use-services";
import type { Product } from "@/types/product";
import type { Service } from "@/types/service";

// Code-split: these two forms carry the Cloudinary upload logic and only
// render for a seller/provider actively creating or editing a listing —
// no reason to ship them in the initial dashboard bundle for every user.
const ProductFormModal = dynamic(
  () => import("@/components/dashboard/product-form-modal").then((m) => m.ProductFormModal),
  { ssr: false }
);
const ServiceFormModal = dynamic(
  () => import("@/components/dashboard/service-form-modal").then((m) => m.ServiceFormModal),
  { ssr: false }
);

export default function ListingsPage() {
  const { user } = useAuth();
  const { data: productsData, isLoading: productsLoading } = useProducts({ seller: user?.username, limit: 50 });
  const { data: servicesData, isLoading: servicesLoading } = useServices({ provider: user?.username, limit: 50 });
  const deleteProduct = useDeleteProduct();
  const deleteService = useDeleteService();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();

  const productColumns: ColumnDef<Product, unknown>[] = [
    {
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-input bg-elevated">
            {row.original.images[0] && <Image src={row.original.images[0]} alt="" fill className="object-cover" />}
          </div>
          <span className="truncate font-medium">{row.original.title}</span>
        </div>
      ),
    },
    { header: "Price", cell: ({ row }) => `$${row.original.price.toFixed(2)}` },
    {
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "default"}>{row.original.status}</Badge>
      ),
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(row.original);
              setProductModalOpen(true);
            }}
            aria-label="Edit"
            className="text-text-muted hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => confirm(`Delete "${row.original.title}"?`) && deleteProduct.mutate(row.original.slug)}
            aria-label="Delete"
            className="text-text-muted hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const serviceColumns: ColumnDef<Service, unknown>[] = [
    {
      header: "Service",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-input bg-elevated">
            {row.original.images[0] && <Image src={row.original.images[0]} alt="" fill className="object-cover" />}
          </div>
          <span className="truncate font-medium">{row.original.title}</span>
        </div>
      ),
    },
    { header: "Starting at", cell: ({ row }) => `$${row.original.startingPrice.toFixed(2)}` },
    {
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "default"}>{row.original.status}</Badge>
      ),
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingService(row.original);
              setServiceModalOpen(true);
            }}
            aria-label="Edit"
            className="text-text-muted hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => confirm(`Delete "${row.original.title}"?`) && deleteService.mutate(row.original.slug)}
            aria-label="Delete"
            className="text-text-muted hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-text-primary">Listings</h1>

      <Tabs defaultValue={user?.role === "provider" && user?.role !== "admin" ? "services" : "products"}>
        <TabsList>
          {(user?.role === "seller" || user?.role === "admin") && (
            <TabsTrigger value="products">Products</TabsTrigger>
          )}
          {(user?.role === "provider" || user?.role === "admin") && (
            <TabsTrigger value="services">Services</TabsTrigger>
          )}
        </TabsList>

        {(user?.role === "seller" || user?.role === "admin") && (
        <TabsContent value="products">
          <div className="mb-3 flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditingProduct(undefined);
                setProductModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> New Product
            </Button>
          </div>
          <DataTable
            columns={productColumns}
            data={productsData?.items ?? []}
            isLoading={productsLoading}
            emptyMessage="You haven't listed any products yet."
          />
        </TabsContent>
        )}

        {(user?.role === "provider" || user?.role === "admin") && (
        <TabsContent value="services">
          <div className="mb-3 flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditingService(undefined);
                setServiceModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> New Service
            </Button>
          </div>
          <DataTable
            columns={serviceColumns}
            data={servicesData?.items ?? []}
            isLoading={servicesLoading}
            emptyMessage="You haven't listed any services yet."
          />
        </TabsContent>
        )}
      </Tabs>

      <ProductFormModal open={productModalOpen} onClose={() => setProductModalOpen(false)} product={editingProduct} />
      <ServiceFormModal open={serviceModalOpen} onClose={() => setServiceModalOpen(false)} service={editingService} />
    </div>
  );
}

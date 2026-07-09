"use client";

import { useEffect, useState } from "react";
import { getListings, updateListingStatus } from "@/lib/api/admin.api";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [type, setType] = useState<"product" | "service">("product");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, [type]);

  async function fetchListings() {
    setLoading(true);
    try {
      const data = await getListings(type, 1, 100);
      setListings(data.items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: "active" | "archived") {
    try {
      await updateListingStatus(id, type, status);
      fetchListings();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Listing Moderation</h1>
        <div className="flex bg-surface rounded-btn border border-border p-1">
          <button
            onClick={() => setType("product")}
            className={`px-4 py-1 text-sm font-medium rounded-sm transition-colors ${type === "product" ? "bg-primary text-ink shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
          >
            Products
          </button>
          <button
            onClick={() => setType("service")}
            className={`px-4 py-1 text-sm font-medium rounded-sm transition-colors ${type === "service" ? "bg-primary text-ink shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
          >
            Services
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
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">{type === "product" ? "Seller" : "Provider"}</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((listing) => (
                <tr key={listing._id} className="hover:bg-elevated/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{listing.title}</td>
                  <td className="px-4 py-3">{type === "product" ? listing.seller?.name : listing.provider?.name}</td>
                  <td className="px-4 py-3">${listing.price ?? listing.startingPrice}</td>
                  <td className="px-4 py-3">
                    <Badge variant={listing.status === "active" ? "success" : "warning"}>
                      {listing.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {listing.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(listing._id, "archived")}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(listing._id, "active")}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

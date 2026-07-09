"use client";

import { useEffect, useState } from "react";
import { getUsers, updateUserStatus, updateUserRole, updateUserVerification } from "@/lib/api/admin.api";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await getUsers(1, 100);
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: "active" | "suspended" | "deleted") {
    try {
      await updateUserStatus(id, status);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleRoleChange(id: string, role: string) {
    try {
      await updateUserRole(id, role);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleVerificationChange(id: string, status: "unverified" | "pending" | "verified") {
    try {
      await updateUserVerification(id, status);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">User Management</h1>
      
      <div className="overflow-x-auto rounded-card border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm text-text-secondary">
          <thead className="bg-surface text-text-primary">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Verification</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-elevated/50 transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="h-8 py-1 text-xs"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={user.verificationStatus}
                    onChange={(e) => handleVerificationChange(user._id, e.target.value as any)}
                    className="h-8 py-1 text-xs"
                  >
                    <option value="unverified">Unverified</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.accountStatus === "active" ? "success" : "danger"}>
                    {user.accountStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {user.accountStatus === "active" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(user._id, "suspended")}
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(user._id, "active")}
                    >
                      Activate
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

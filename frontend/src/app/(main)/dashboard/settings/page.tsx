"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useChangePassword } from "@/hooks/use-change-password";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
        },
      }
    );
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-text-muted">Name: </span>
            <span className="text-text-primary">{user?.name}</span>
          </p>
          <p>
            <span className="text-text-muted">Email: </span>
            <span className="text-text-primary">{user?.email}</span>
          </p>
          <p>
            <span className="text-text-muted">Username: </span>
            <span className="text-text-primary">@{user?.username}</span>
          </p>
          <p>
            <span className="text-text-muted">Role: </span>
            <span className="capitalize text-text-primary">{user?.role}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button type="submit" isLoading={changePassword.isPending}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

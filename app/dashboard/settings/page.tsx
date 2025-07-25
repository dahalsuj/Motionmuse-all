"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    workspaceName: user?.workspaceName || "",
    email: user?.email || "",
    userType: user?.userType || "",
    plan: user?.plan || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setForm({
      name: user?.name || "",
      workspaceName: user?.workspaceName || "",
      email: user?.email || "",
      userType: user?.userType || "",
      plan: user?.plan || "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      await updateUserProfile({
        name: form.name,
        workspaceName: form.workspaceName,
      });
      setMessage("Profile updated!");
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Workspace Name</label>
            <input
              name="workspaceName"
              value={form.workspaceName}
              onChange={handleChange}
              className="input w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              disabled
              className="input w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">User Type</label>
            <input
              name="userType"
              value={form.userType}
              disabled
              className="input w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">Plan</label>
            <input
              name="plan"
              value={form.plan}
              disabled
              className="input w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          {message && <div className="mt-2 text-green-600">{message}</div>}
        </form>
      </Card>
    </div>
  );
} 
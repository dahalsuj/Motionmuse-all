"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Member {
  id: string;
  name: string;
  email: string;
  role?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ManageUsersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [team, setTeam] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get current user email from auth
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUserEmail(data.user.email);
        }
      });

    fetch("/api/team")
      .then(res => res.json())
      .then(data => {
        setTeam(data.team);
        setMembers(data.team?.members || []);
        setLoading(false);
      });
  }, []);

  // Check if current user is admin
  const isAdmin = members.find(member => member.email === currentUserEmail)?.role === "Admin";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");
    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setInviteLoading(true);
    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    setInviteLoading(false);
    if (res.ok) {
      setSuccess("Invitation sent!");
      setInviteEmail("");
      // Optionally refresh members
      const data = await res.json();
      setMembers(data.team?.members || members);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to invite user");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-40 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-muted/50 py-10">
      <Card className="w-full max-w-2xl border-logo-blue/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-navy">Manage Team Users</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{success}</div>}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-lg text-navy">Team Members</h3>
            <div className="divide-y rounded border border-muted bg-background">
              {members.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">No team members yet.</div>
              )}
              {members.map(member => (
                <div key={member.id} className="flex justify-between items-center py-3 px-4">
                  <div>
                    <div className="font-medium text-navy">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${member.role === "Admin" ? "bg-logo-blue/10 text-logo-blue font-semibold" : "bg-muted text-navy"}`}>{member.role || "Member"}</span>
                </div>
              ))}
            </div>
          </div>
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-gradient-to-r from-logo-blue to-logo-green hover:from-logo-blue/90 hover:to-logo-green/90 text-white w-full mb-2">Invite Members</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Invite a New Team Member</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the email address of the person you want to invite. They will receive an invitation email.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <Label htmlFor="invite-email" className="text-navy">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="mt-2 border-navy/20 focus-visible:ring-logo-blue"
                      required
                    />
                    {emailError && <div className="text-xs text-red-600 mt-1">{emailError}</div>}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button type="submit" disabled={inviteLoading} className="bg-gradient-to-r from-logo-blue to-logo-green hover:from-logo-blue/90 hover:to-logo-green/90 text-white">
                        {inviteLoading ? "Sending..." : "Send Invite"}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
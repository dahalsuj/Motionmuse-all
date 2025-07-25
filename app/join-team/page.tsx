"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, CheckCircle, XCircle, Loader2 } from "lucide-react";

function JoinTeamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [inviterName, setInviterName] = useState("");
  const [org, setOrg] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const token = searchParams.get("token");
  const teamId = searchParams.get("team");

  useEffect(() => {
    if (!token || !teamId) {
      setError("Invalid invitation link");
      return;
    }
    validateInvitation();
  }, [token, teamId]);

  const validateInvitation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/team/validate-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, teamId }),
      });
      const data = await response.json();
      if (response.ok) {
        setTeamName(data.invitation.org);
        setUserEmail(data.invitation.email);
        setInviteRole(data.invitation.role);
        setInviteMessage(data.invitation.message || "");
        setInviterName(data.invitation.inviterName);
        setOrg(data.invitation.org);
        if (data.existingUser) {
          setUserName(data.existingUser.name);
          setIsNewUser(false);
        } else {
          setIsNewUser(true);
        }
      } else {
        setError(data.error || "Invalid invitation");
      }
    } catch (error) {
      setError("Failed to validate invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    try {
      setLoading(true);
      setError("");
      if (isNewUser) {
        if (!userName.trim()) {
          setError("Full name is required");
          setLoading(false);
          return;
        }
        if (!password.trim()) {
          setError("Password is required");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }
      }
      const response = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token, 
          teamId, 
          name: userName,
          password: isNewUser ? password : undefined
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/enterprise");
        }, 2000);
      } else {
        setError(data.error || "Failed to join team");
      }
    } catch (error) {
      setError("Failed to join team");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !teamName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muse-orange" />
            <span className="ml-2 text-lg">Validating invitation...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error && !teamName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-muse-red to-muse-orange text-white"
            >
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Team!</h1>
            <p className="text-gray-600 mb-6">
              You have successfully joined <strong>{teamName}</strong>
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-muse-orange mr-2" />
              <span>Redirecting to dashboard...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-muse-red to-muse-orange rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Accept Invitation</CardTitle>
          <p className="text-gray-600">Join <span className="font-semibold text-muse-orange">{org}</span> as <span className="font-semibold text-muse-orange">{inviteRole}</span></p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="mb-2 text-navy font-semibold">Invited by: <span className="text-muse-orange">{inviterName}</span></div>
            {inviteMessage && (
              <div className="mb-2 text-muted-foreground italic">"{inviteMessage}"</div>
            )}
            <div className="text-orange-700">
              <strong>Your Email:</strong> {userEmail}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isNewUser ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-navy">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-2 border-navy/20 focus-visible:ring-muse-orange"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-navy">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 border-navy/20 focus-visible:ring-muse-orange"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-navy">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 border-navy/20 focus-visible:ring-muse-orange"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                Welcome back! You already have an account. You'll be logged in automatically.
              </p>
            </div>
          )}

          <Button
            onClick={handleJoinTeam}
            disabled={loading}
            className="w-full bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Joining Team...
              </>
            ) : (
              "Join Team"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinTeamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muse-orange" />
            <span className="ml-2 text-lg">Loading...</span>
          </div>
        </Card>
      </div>
    }>
      <JoinTeamContent />
    </Suspense>
  );
} 
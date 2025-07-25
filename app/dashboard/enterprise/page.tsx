"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Wand2, Video, Presentation, Mic2, User, Users, Settings, Home, HelpCircle, Plus, CloudUpload } from "lucide-react";
import Image from "next/image";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import BrandKitsPage from "@/app/dashboard/brand-kits/page";
import { useToast } from "@/components/ui/use-toast";

const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: Home },
  { key: "team-videos", label: "Team Videos", icon: Video },
  { key: "templates", label: "Templates", icon: Wand2 },
  { key: "brand-kits", label: "Brand Kits", icon: Presentation },
  { key: "settings", label: "Settings", icon: Settings },
];

const ADMIN_ITEMS = [
  { key: "manage-users", label: "Manage Users", icon: Users },
  { key: "permissions", label: "Permissions", icon: User },
  { key: "billing", label: "Billing", icon: Presentation },
  { key: "export-report", label: "Export Report", icon: Mic2 },
];

const getSectionLabel = (key: string) => {
  const allItems = [...NAV_ITEMS, ...ADMIN_ITEMS];
  return allItems.find(item => item.key === key)?.label || "Dashboard";
};

const SectionHeader = ({ section, user }: { section: string; user: { name?: string; workspaceName?: string } | undefined }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold text-navy">{getSectionLabel(section)}</h1>
      <span className="text-sm text-muted-foreground">in <b>{user?.workspaceName || "Workspace"}</b></span>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600">
        {user?.name?.[0]}
      </div>
      <a href="/help" title="Help" className="text-muted-foreground hover:text-muse-orange">
        <HelpCircle className="w-6 h-6" />
      </a>
    </div>
  </div>
);

// Add TeamData type
interface TeamData {
  id: string;
  name: string;
  members: { id: string; name: string; email: string; role?: string; plan?: string }[];
  brandKit?: { logo?: string; fonts: string[]; colors: string[] };
  usage?: { videosThisMonth: number; quota: number; activeUsers: number; updatedAt: string };
  projects?: { id: string; name: string; user: string; date: string }[];
  videos?: { title: string; creator: string; date: string; status: string }[];
  templates?: { id: string; name: string }[];
  invoices?: { id: string; date: string; amount: string; status: string }[];
  permissions?: { role: string; view: boolean; edit: boolean; delete: boolean; billing: boolean }[];
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default function EnterpriseDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [projectUserFilter, setProjectUserFilter] = useState("All");
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");
  const [inviteMessage, setInviteMessage] = useState("");
  const { toast } = useToast();

  // Check if current user is admin
  const isAdmin = teamData?.members?.find(member => member.email === user?.email)?.role === "Admin";

  useEffect(() => {
    if (user && user.plan !== "enterprise") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchTeam() {
      setLoading(true);
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeamData(data.team);
      setLoading(false);
    }
    fetchTeam();
  }, [user]);

  useEffect(() => {
    if (!loading && !teamData) {
      // No team found for this enterprise user
      // Optionally, you can set an error state here
      // setError("No team found. Please contact support.");
    }
  }, [loading, teamData, router]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    setEmailError("");
    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setInviteLoading(true);
    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole, message: inviteMessage }),
    });
    setInviteLoading(false);
    if (res.ok) {
      setInviteSuccess("Invitation sent!");
      setInviteEmail("");
      setInviteRole("Editor");
      setInviteMessage("");
      toast({ title: "Success", description: "Invitation sent!", variant: "default" });
      // Optionally refresh team data
      const data = await res.json();
      setTeamData(data.team || teamData);
    } else {
      const data = await res.json();
      setInviteError(data.error || "Failed to invite user");
      toast({ title: "Error", description: data.error || "Failed to invite user", variant: "destructive" });
    }
  };

  if (!user) return null;
  if (loading) return <div className="p-8">Loading...</div>;
  if (!teamData) return <div className="p-8 text-red-600 font-bold">No team found for your account. Please contact support.</div>;

  // Filter projects by user
  const filteredProjects =
    projectUserFilter === "All"
      ? teamData.projects || []
      : (teamData.projects || []).filter((p) => p.user === projectUserFilter);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-orange-50 to-muse-orange/10">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col py-6 px-4 min-h-screen">
        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition text-left w-full ${
                activeSection === item.key
                  ? "bg-gradient-to-r from-muse-red to-muse-orange text-white shadow"
                  : "text-gray-700 hover:bg-orange-100"
              }`}
              onClick={() => setActiveSection(item.key)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <>
              <div className="mt-6 mb-2 text-xs text-gray-400 uppercase px-4">Admin</div>
              {ADMIN_ITEMS.map(item => (
                <button
                  key={item.key}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition text-left w-full ${
                    activeSection === item.key
                      ? "bg-gradient-to-r from-muse-red to-muse-orange text-white shadow"
                      : "text-gray-700 hover:bg-orange-100"
                  }`}
                  onClick={() => setActiveSection(item.key)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </>
          )}
          
          {/* User Profile & Logout */}
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-3 mb-2 px-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600">
                {user.name[0]}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
            <button
              className="flex items-center gap-2 w-full mt-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition"
              onClick={logout}
            >
              <span className="w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold">N</span>
              Logout
            </button>
          </div>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Main Section Content */}
        {activeSection === "dashboard" && (
          <>
            {/* Welcome Banner */}
            <div className="mb-10 rounded-2xl bg-gradient-to-r from-muse-red to-muse-orange p-8 flex items-center justify-between shadow-lg">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="inline-block w-8 h-8 mr-2" />
                  Welcome {teamData.name} Team!
                </h1>
                <p className="text-white/90 text-lg">Empower your team with advanced collaboration and analytics.</p>
              </div>
              <Button
                asChild
                className="bg-white text-muse-red font-bold shadow-lg hover:bg-orange-50 transition"
              >
                <Link href="/video-generator">Create New Video</Link>
              </Button>
            </div>
            {/* Team Information */}
            <Card className="p-6 rounded-xl shadow-md border-0 bg-white mb-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-muse-orange" /> Team Information</h2>
              <div>Team Name: <b>{teamData.name}</b></div>
              <div className="mt-2">
                <b>Members:</b>
                <ul className="ml-4 list-disc">
                  {teamData.members.map((m) => (
                    <li key={m.name}>{m.name} <span className="text-xs text-muted-foreground">({m.role})</span></li>
                  ))}
                </ul>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="mt-4 bg-gradient-to-r from-muse-red to-muse-orange text-white hover:from-muse-red/90 hover:to-muse-orange/90">
                    Invite Member
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Invite a New Team Member</AlertDialogTitle>
                    <AlertDialogDescription>
                      Enter the details below to invite a new team member. They will receive an invitation email.
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
                    <div>
                      <Label htmlFor="invite-role" className="text-navy">Role</Label>
                      <select
                        id="invite-role"
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value)}
                        className="mt-2 border rounded px-3 py-2 w-full focus-visible:ring-logo-blue"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="invite-message" className="text-navy">Message <span className="text-xs text-muted-foreground">(optional)</span></Label>
                      <textarea
                        id="invite-message"
                        value={inviteMessage}
                        onChange={e => setInviteMessage(e.target.value)}
                        className="mt-2 border rounded px-3 py-2 w-full min-h-[60px] focus-visible:ring-logo-blue"
                        placeholder="Add a personal message (optional)"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
              <Button
                          type="submit"
                          disabled={inviteLoading || !validateEmail(inviteEmail)}
                          className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
              >
                          {inviteLoading ? "Sending..." : "Send Invite"}
              </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
            {/* Team Usage Overview */}
            <Card className="p-6 rounded-xl shadow-md border-0 bg-white mb-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Video className="w-5 h-5 text-muse-orange" /> Team Usage Overview</h2>
              <div>Total videos this month: <b>{teamData.usage?.videosThisMonth || 0}</b> / {teamData.usage?.quota || 0}</div>
              <div>Active users: <b>{teamData.usage?.activeUsers || 0}</b></div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-muse-red to-muse-orange h-3 rounded-full"
                  style={{ width: `${((teamData.usage?.videosThisMonth || 0) / (teamData.usage?.quota || 1)) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {(teamData.usage?.quota ?? 0) - (teamData.usage?.videosThisMonth || 0)} videos remaining this month
              </div>
            </Card>

            {/* Recent Projects by Team Members */}
            <Card className="p-6 rounded-xl shadow-md border-0 bg-white mb-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Mic2 className="w-5 h-5 text-muse-orange" /> Recent Projects by Team Members</h2>
              <div>
                <label>Filter by user: </label>
                <select
                  className="border rounded px-2 py-1 ml-2"
                  value={projectUserFilter}
                  onChange={e => setProjectUserFilter(e.target.value)}
                >
                  <option>All</option>
                  {teamData.members.map((m) => (
                    <option key={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <ul className="mt-4 space-y-2">
                {filteredProjects.map((p) => (
                  <li key={p.id}>
                    <span className="font-medium">{p.name}</span> by <span className="text-muse-orange">{p.user}</span> <span className="text-xs text-muted-foreground">({p.date})</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
        {activeSection === "team-videos" && (
          <>
            <SectionHeader section="team-videos" user={user ?? undefined} />
            <Card className="p-8 rounded-xl shadow-md border-0 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Video className="w-5 h-5 text-muse-orange" /> Team Videos</h2>
                <Button className="bg-gradient-to-r from-muse-red to-muse-orange text-white">Upload New Video</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead><TableHead>Creator</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.videos?.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell>{v.title}</TableCell>
                      <TableCell>{v.creator}</TableCell>
                      <TableCell>{v.date}</TableCell>
                      <TableCell>{v.status}</TableCell>
                      <TableCell>
                        <Button variant="ghost">
                          View
                        </Button>
                        <Button variant="ghost">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
        {activeSection === "templates" && (
          <>
            <SectionHeader section="templates" user={user ?? undefined} />
            <Card className="p-8 rounded-xl shadow-md border-0 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Wand2 className="w-5 h-5 text-muse-orange" /> Templates</h2>
                <Button className="bg-gradient-to-r from-muse-red to-muse-orange text-white">Add New Template</Button>
              </div>
              <ul className="mb-4">
                {teamData.templates?.map((t) => (
                  <li key={t.id} className="flex items-center justify-between border-b py-2">
                    <span>{t.name}</span>
                    <div>
                      <Button variant="ghost">
                        Edit
                      </Button>
                      <Button variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
        {activeSection === "brand-kits" && (
          <BrandKitsPage />
        )}
        {activeSection === "settings" && (
          <>
            <SectionHeader section="settings" user={user ?? undefined} />
            <Card className="p-8 rounded-xl shadow-md border-0 bg-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-muse-orange" /> Workspace Settings</h2>
              <div className="mb-4">
                <label className="block mb-1">Workspace Name</label>
                <input className="input w-full border rounded px-3 py-2" value={teamData.name + "'s Workspace"} readOnly />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Notifications</label>
                <select className="input w-full border rounded px-3 py-2">
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Push</option>
                </select>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-2 text-red-600">Danger Zone</h3>
                <Button variant="destructive">Delete Workspace</Button>
              </div>
            </Card>
          </>
        )}
        {activeSection === "manage-users" && isAdmin && (
          <>
            <SectionHeader section="manage-users" user={user ?? undefined} />
            <Card className="p-8 rounded-xl shadow-md border-0 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-muse-orange" /> Team Members</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                <Button className="bg-gradient-to-r from-muse-red to-muse-orange text-white">Invite Member</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Invite a New Team Member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the details below to invite a new team member. They will receive an invitation email.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleInvite} className="space-y-4">
                      <div>
                        <Label htmlFor="invite-email-manage" className="text-navy">Email Address</Label>
                        <Input
                          id="invite-email-manage"
                          type="email"
                          placeholder="Email address"
                          value={inviteEmail}
                          onChange={e => setInviteEmail(e.target.value)}
                          className="mt-2 border-navy/20 focus-visible:ring-logo-blue"
                          required
                        />
                        {emailError && <div className="text-xs text-red-600 mt-1">{emailError}</div>}
                      </div>
                      <div>
                        <Label htmlFor="invite-role" className="text-navy">Role</Label>
                        <select
                          id="invite-role"
                          value={inviteRole}
                          onChange={e => setInviteRole(e.target.value)}
                          className="mt-2 border rounded px-3 py-2 w-full focus-visible:ring-logo-blue"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="invite-message" className="text-navy">Message <span className="text-xs text-muted-foreground">(optional)</span></Label>
                        <textarea
                          id="invite-message"
                          value={inviteMessage}
                          onChange={e => setInviteMessage(e.target.value)}
                          className="mt-2 border rounded px-3 py-2 w-full min-h-[60px] focus-visible:ring-logo-blue"
                          placeholder="Add a personal message (optional)"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            type="submit"
                            disabled={inviteLoading || !validateEmail(inviteEmail)}
                            className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                          >
                            {inviteLoading ? "Sending..." : "Send Invite"}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.members.map((u, i) => (
                    <TableRow key={i}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <select className="border rounded px-2 py-1">
                          <option>Admin</option>
                          <option>Editor</option>
                          <option>Viewer</option>
                        </select>
                      </TableCell>
                      <TableCell>{"Active"}</TableCell>
                      <TableCell>
                        <Button variant="ghost">
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
        {activeSection === "permissions" && isAdmin && (
          <>
            <SectionHeader section="permissions" user={user ?? undefined} />
            <Card className="p-8 rounded-xl shadow-md border-0 bg-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-muse-orange" /> Permissions Matrix</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead><TableHead>View</TableHead><TableHead>Edit</TableHead><TableHead>Delete</TableHead><TableHead>Billing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.permissions?.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.role}</TableCell>
                      <TableCell>{p.view ? "✔️" : ""}</TableCell>
                      <TableCell>{p.edit ? "✔️" : ""}</TableCell>
                      <TableCell>{p.delete ? "✔️" : ""}</TableCell>
                      <TableCell>{p.billing ? "✔️" : ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
        {activeSection === "billing" && isAdmin && (
          <>
            <SectionHeader section="billing" user={user ?? undefined} />
            <Card className="p-8 rounded-xl shadow-md border-0 bg-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Presentation className="w-5 h-5 text-muse-orange" /> Billing</h2>
              <div className="mb-4">
                <div className="font-semibold">Current Plan: <span className="text-muse-orange">Enterprise</span></div>
                <div>Renewal Date: <b>2024-07-01</b></div>
                <Button className="mt-2 bg-gradient-to-r from-muse-red to-muse-orange text-white">Change Plan</Button>
              </div>
              <h3 className="text-lg font-bold mb-2">Invoices</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.invoices?.map((inv, i) => (
                    <TableRow key={i}>
                      <TableCell>{inv.id}</TableCell>
                      <TableCell>{inv.date}</TableCell>
                      <TableCell>{inv.amount}</TableCell>
                      <TableCell>{inv.status}</TableCell>
                      <TableCell>
                        <Button variant="ghost">
                          View Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Payment Method</h3>
                <input className="input w-full border rounded px-3 py-2 mb-2" placeholder="Card ending in 1234" readOnly />
                <Button variant="outline">Update Payment Method</Button>
              </div>
            </Card>
          </>
        )}
        {activeSection === "export-report" && isAdmin && (
          <>
            <SectionHeader section="export-report" user={user ?? undefined} />
            <Card className="p-8 rounded-xl shadow-md border-0 bg-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Mic2 className="w-5 h-5 text-muse-orange" /> Export Report</h2>
              <div className="mb-4">
                <label className="block mb-1">Export Type</label>
                <select className="input w-full border rounded px-3 py-2 mb-4">
                  <option>Videos</option>
                  <option>Users</option>
                  <option>Usage</option>
                </select>
                <Button variant="outline">Download Report</Button>
              </div>
              <h3 className="text-lg font-bold mb-2">Export History</h3>
              <ul className="list-disc ml-6 text-sm text-muted-foreground">
                <li>2024-06-01: Videos exported</li>
                <li>2024-05-15: Users exported</li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </div>
  );
} 
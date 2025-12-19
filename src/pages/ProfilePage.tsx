import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Shield,
  Users,
  Settings,
  Workflow,
  Clock,
  FileSignature,
  CreditCard,
  Mail,
  Send,
  Inbox,
  FileCheck,
  FileText,
  Contact,
  Receipt,
  Building,
  Crown,
  ChevronRight,
  Lock,
  Bell,
  Palette,
  Globe,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const userEmail = user.email || "";
  const userName = user.user_metadata?.full_name || userEmail.split("@")[0] || "User";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const sidebarSections = [
    {
      title: "Account",
      items: [
        { id: "profile", label: "Profile", icon: User },
        { id: "account", label: "My Account", icon: Settings },
        { id: "security", label: "Security", icon: Shield },
        { id: "team", label: "Team", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
    {
      title: "Workflows",
      items: [
        { id: "workflows", label: "Workflows", icon: Workflow },
        { id: "tasks", label: "Last Tasks", icon: Clock },
      ],
    },
    {
      title: "Signatures",
      items: [
        { id: "signatures-overview", label: "Overview", icon: FileSignature },
        { id: "signatures-sent", label: "Sent", icon: Send },
        { id: "signatures-inbox", label: "Inbox", icon: Inbox },
        { id: "signatures-signed", label: "Signed", icon: FileCheck },
        { id: "signatures-templates", label: "Templates", icon: FileText },
        { id: "signatures-contacts", label: "Contacts", icon: Contact },
        { id: "signatures-settings", label: "Settings", icon: Settings },
      ],
    },
    {
      title: "Billing",
      items: [
        { id: "billing-plans", label: "Plans & Packages", icon: Crown },
        { id: "billing-details", label: "Business Details", icon: Building },
        { id: "billing-invoices", label: "Invoices", icon: Receipt },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Card>
                <CardContent className="p-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{userName}</p>
                      <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                    </div>
                  </div>

                  {/* Credits Badge */}
                  <div className="mb-6 p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Credits</span>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {creditsLoading ? "..." : credits?.balance ?? 0}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  {/* Navigation */}
                  <nav className="space-y-6">
                    {sidebarSections.map((section) => (
                      <div key={section.title}>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          {section.title}
                        </h3>
                        <ul className="space-y-1">
                          {section.items.map((item) => (
                            <li key={item.id}>
                              <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                  activeTab === item.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>

                  <Separator className="my-4" />

                  {/* Upgrade CTA */}
                  <Button variant="hero" className="w-full gap-2" onClick={() => navigate("/pricing")}>
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-muted-foreground"
                    onClick={async () => {
                      await signOut();
                      toast.success("Logged out successfully");
                      navigate("/");
                    }}
                  >
                    Log out
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Tab Navigation */}
              <div className="lg:hidden mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-4 h-auto">
                    <TabsTrigger value="profile" className="text-xs py-2">Profile</TabsTrigger>
                    <TabsTrigger value="security" className="text-xs py-2">Security</TabsTrigger>
                    <TabsTrigger value="billing-plans" className="text-xs py-2">Billing</TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs py-2">Settings</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Profile Section */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                        <Badge className="ml-auto">Registered</Badge>
                      </CardTitle>
                      <CardDescription>Manage your public profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">Change Avatar</Button>
                          <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                        </div>
                      </div>
                      
                      <Separator />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input id="displayName" defaultValue={userName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={userEmail} disabled />
                        </div>
                      </div>

                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Account Section */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        My Account
                      </CardTitle>
                      <CardDescription>Manage your account settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email Address</p>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Language</p>
                            <p className="text-sm text-muted-foreground">English</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Palette className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Theme</p>
                            <p className="text-sm text-muted-foreground">System Default</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Section */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security
                      </CardTitle>
                      <CardDescription>Manage your security settings and password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Password</p>
                            <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Change Password</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Not enabled</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Login Notifications</p>
                            <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Team Section */}
              {activeTab === "team" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team
                      </CardTitle>
                      <CardDescription>Manage your team members and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
                        <p className="text-muted-foreground mb-4">Invite team members to collaborate on documents</p>
                        <Button variant="hero">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to add team members
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Section */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Settings
                      </CardTitle>
                      <CardDescription>Configure your application preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates about your account</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">News and product updates</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
                        <div>
                          <p className="font-medium text-destructive">Delete Account</p>
                          <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                        </div>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Workflows Section */}
              {activeTab === "workflows" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5" />
                      Workflows
                    </CardTitle>
                    <CardDescription>Automate your document processing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No workflows created</h3>
                      <p className="text-muted-foreground mb-4">Create automated workflows to streamline your work</p>
                      <Button>Create Workflow</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Last Tasks Section */}
              {activeTab === "tasks" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Last Tasks
                    </CardTitle>
                    <CardDescription>Your recent document processing history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No recent tasks</h3>
                      <p className="text-muted-foreground mb-4">Your processed documents will appear here</p>
                      <Button onClick={() => navigate("/tools")}>Start Processing</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Signatures Overview */}
              {activeTab === "signatures-overview" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSignature className="h-5 w-5" />
                      Signatures Overview
                    </CardTitle>
                    <CardDescription>Manage your digital signatures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Send className="h-8 w-8 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-sm text-muted-foreground">Sent</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Inbox className="h-8 w-8 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-sm text-muted-foreground">Pending</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <FileCheck className="h-8 w-8 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-sm text-muted-foreground">Signed</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Other Signature tabs */}
              {(activeTab === "signatures-sent" || 
                activeTab === "signatures-inbox" || 
                activeTab === "signatures-signed" ||
                activeTab === "signatures-templates" ||
                activeTab === "signatures-contacts" ||
                activeTab === "signatures-settings") && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSignature className="h-5 w-5" />
                      {activeTab.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileSignature className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground">This feature is being developed</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Billing Plans */}
              {activeTab === "billing-plans" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Plans & Packages
                    </CardTitle>
                    <CardDescription>Manage your subscription plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg border bg-muted/50 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Free Plan</p>
                          <p className="text-sm text-muted-foreground">100 credits included</p>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                    </div>
                    <Button variant="hero" className="w-full" onClick={() => navigate("/pricing")}>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Billing Details */}
              {activeTab === "billing-details" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Business Details
                    </CardTitle>
                    <CardDescription>Manage your billing information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input placeholder="Enter company name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax ID</Label>
                        <Input placeholder="Enter tax ID" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Billing Address</Label>
                      <Input placeholder="Enter billing address" />
                    </div>
                    <Button>Save Details</Button>
                  </CardContent>
                </Card>
              )}

              {/* Billing Invoices */}
              {activeTab === "billing-invoices" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Invoices
                    </CardTitle>
                    <CardDescription>View and download your invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                      <p className="text-muted-foreground">Your invoices will appear here after your first purchase</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;

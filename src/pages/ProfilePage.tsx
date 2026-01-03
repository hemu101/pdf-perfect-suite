import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { useProfile } from "@/hooks/useProfile";
import { useProcessingHistory } from "@/hooks/useProcessingHistory";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AccountSection } from "@/components/profile/AccountSection";
import { SecuritySection } from "@/components/profile/SecuritySection";
import { TeamSection } from "@/components/profile/TeamSection";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { WorkflowsSection } from "@/components/profile/WorkflowsSection";
import { SignaturesSection } from "@/components/profile/SignaturesSection";
import { BillingSection } from "@/components/profile/BillingSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Send,
  Inbox,
  FileCheck,
  FileText,
  Contact,
  Receipt,
  Building,
  Crown,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const { profile } = useProfile();
  const { history, loading: historyLoading } = useProcessingHistory();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const userEmail = user.email || "";
  const userName = profile?.full_name || user.user_metadata?.full_name || userEmail.split("@")[0] || "User";
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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "account":
        return <AccountSection />;
      case "security":
        return <SecuritySection />;
      case "team":
        return <TeamSection />;
      case "settings":
        return <SettingsSection />;
      case "workflows":
        return <WorkflowsSection />;
      case "tasks":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Last Tasks
              </CardTitle>
              <CardDescription>Your recent document processing history</CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recent tasks</h3>
                  <p className="text-muted-foreground mb-4">Your processed documents will appear here</p>
                  <Button onClick={() => navigate("/tools")}>Start Processing</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 10).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{task.fileName || "Untitled"}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.toolId} • {task.creditsUsed} credits
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                          {task.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(task.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "signatures-overview":
      case "signatures-sent":
      case "signatures-inbox":
      case "signatures-signed":
      case "signatures-templates":
      case "signatures-contacts":
      case "signatures-settings":
        return <SignaturesSection activeTab={activeTab} />;
      case "billing-plans":
      case "billing-details":
      case "billing-invoices":
        return <BillingSection activeTab={activeTab} />;
      default:
        return <ProfileSection />;
    }
  };

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
                      <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
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
                    {credits?.isAdmin ? (
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Admin - Unlimited</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Credits</span>
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          {creditsLoading ? "..." : credits?.balance ?? 0}
                        </Badge>
                      </div>
                    )}
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

              {renderContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  CreditCard,
  Shield,
  Search,
  Crown,
  UserCheck,
  UserX,
  RefreshCw,
  TrendingUp,
  DollarSign,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  role: string;
  credits: number;
}

interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  plan: string;
  status: string;
  amount: number | null;
  currency: string | null;
  startedAt: string;
  expiresAt: string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    adminCount: 0,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchSubscriptions(), fetchStats()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    // Fetch profiles with credits and roles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return;
    }

    // Fetch roles for all users
    const { data: roles } = await supabase.from("user_roles").select("*");

    // Fetch credits for all users
    const { data: credits } = await supabase.from("user_credits").select("*");

    const usersWithDetails = profiles.map((profile) => {
      const userRole = roles?.find((r) => r.user_id === profile.id);
      const userCredits = credits?.find((c) => c.user_id === profile.id);

      return {
        id: profile.id,
        email: profile.email || "",
        fullName: profile.full_name,
        createdAt: profile.created_at,
        role: userRole?.role || "user",
        credits: userCredits?.balance || 0,
      };
    });

    setUsers(usersWithDetails);
  };

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return;
    }

    // Get user emails
    const userIds = [...new Set(data.map((s) => s.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds);

    const subscriptionsWithEmails = data.map((sub) => ({
      id: sub.id,
      userId: sub.user_id,
      userEmail: profiles?.find((p) => p.id === sub.user_id)?.email || "Unknown",
      plan: sub.plan,
      status: sub.status,
      amount: sub.amount,
      currency: sub.currency,
      startedAt: sub.started_at,
      expiresAt: sub.expires_at,
    }));

    setSubscriptions(subscriptionsWithEmails);
  };

  const fetchStats = async () => {
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: activeSubsCount } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { data: revenueData } = await supabase
      .from("subscriptions")
      .select("amount")
      .eq("status", "active");

    const { count: adminCount } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    const totalRevenue = revenueData?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

    setStats({
      totalUsers: usersCount || 0,
      activeSubscriptions: activeSubsCount || 0,
      totalRevenue,
      adminCount: adminCount || 0,
    });
  };

  const updateUserRole = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}`,
    });

    await fetchUsers();
    await fetchStats();
  };

  const updateUserCredits = async (userId: string, credits: number) => {
    const { error } = await supabase
      .from("user_credits")
      .update({ balance: credits })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update credits",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Credits Updated",
      description: `User credits have been updated to ${credits}`,
    });

    await fetchUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter((s) =>
    s.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage users, subscriptions, and system settings
              </p>
            </div>
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-convert-to/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-convert-to" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                    <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-edit/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-edit" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">रू {stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <Crown className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.adminCount}</p>
                    <p className="text-sm text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users or subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscriptions ({subscriptions.length})
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{u.fullName || "No name"}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={u.role}
                                onValueChange={(value: "admin" | "moderator" | "user") => updateUserRole(u.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                      <UserCheck className="h-4 w-4" />
                                      User
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="moderator">
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-4 w-4" />
                                      Moderator
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                      <Crown className="h-4 w-4" />
                                      Admin
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={u.credits}
                                  onChange={(e) => {
                                    const newCredits = parseInt(e.target.value) || 0;
                                    setUsers(users.map(user => 
                                      user.id === u.id ? { ...user, credits: newCredits } : user
                                    ));
                                  }}
                                  className="w-24"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateUserCredits(u.id, u.credits)}
                                >
                                  Save
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {u.role === "admin" ? (
                                <Badge variant="secondary">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  {u.role}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <UserX className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No users found</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    View all user subscriptions and payment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Expires</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubscriptions.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell>{sub.userEmail}</TableCell>
                            <TableCell>
                              <Badge
                                variant={sub.plan === "business" ? "default" : "secondary"}
                              >
                                {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  sub.status === "active"
                                    ? "default"
                                    : sub.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {sub.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {sub.amount
                                ? `${sub.currency === "NPR" ? "रू" : "$"} ${sub.amount}`
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {new Date(sub.startedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {sub.expiresAt
                                ? new Date(sub.expiresAt).toLocaleDateString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredSubscriptions.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <CreditCard className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No subscriptions found</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

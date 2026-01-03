import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Shield, 
  CreditCard, 
  Users, 
  Settings, 
  FileText,
  Image,
  Zap,
  CheckCircle,
  ArrowRight,
  Code,
  Terminal,
  Key,
  Globe,
  BookOpen
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { useEffect, useState as useReactState } from "react";

const DocumentationPage = () => {
  const [downloading, setDownloading] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useReactState("overview");

  useEffect(() => {
    if (location.hash === "#api") {
      setActiveTab("api");
    }
  }, [location]);

  const generatePDFContent = () => {
    return `
PLATFORM DOCUMENTATION
======================

Generated: ${new Date().toLocaleDateString()}

================================================================================
1. ADMIN SETUP GUIDE
================================================================================

Step 1: Find Your User ID
- Go to Supabase Dashboard → Authentication → Users
- Locate your email address
- Copy the UUID from the "UID" column

Step 2: Grant Admin Access
Run this SQL in Supabase SQL Editor:

  UPDATE public.user_roles 
  SET role = 'admin' 
  WHERE user_id = 'YOUR-USER-ID-HERE';

Admin Benefits:
✓ Unlimited credits (no deductions)
✓ Access to Admin Dashboard (/admin)
✓ User management capabilities
✓ Role assignment powers
✓ Credit adjustment for any user
✓ Subscription overview & revenue stats

================================================================================
2. USER ROLES
================================================================================

Role Types:
- admin: Full access, unlimited credits, user management
- moderator: Extended access, content moderation
- user: Standard access, credit-based usage

Role Assignment (Admin Only):
1. Navigate to /admin
2. Search for user by email
3. Click role dropdown
4. Select new role
5. Changes apply immediately

================================================================================
3. SUBSCRIPTION PLANS
================================================================================

FREE PLAN ($0/forever)
- 300 initial credits
- 5 free tasks per day
- Basic PDF tools
- Standard processing speed
- File size limit: 15MB
- Community support

PRO PLAN ($9/month | रू1,200)
- 5,000 credits
- Unlimited tasks
- All PDF & Image tools
- Priority processing
- File size limit: 100MB
- Batch processing
- Priority email support
- No watermarks

BUSINESS PLAN ($29/month | रू3,900)
- 20,000 credits
- Everything in Pro
- 5 team members
- File size limit: 500MB
- API access
- Custom branding
- Dedicated support
- SSO integration
- Analytics dashboard

================================================================================
4. TOOL CREDIT COSTS
================================================================================

PDF TOOLS:
- Merge PDF: 5 credits
- Split PDF: 5 credits
- Compress PDF: 10 credits
- Office to PDF: 10 credits
- PDF OCR: 5 credits per page
- Rotate PDF: 10 credits
- PDF to JPG: 10 credits

IMAGE TOOLS:
- Compress Image: 2 credits
- Image to PDF: 10 credits
- Background Removal: 10 credits
- Image Upscale: 20 credits

OTHER TOOLS:
- Digital Signature: 80 credits
- AI Spreadsheet: 15 credits

Note: Admin accounts bypass all credit deductions.

================================================================================
5. PAYMENT INTEGRATION (eSewa)
================================================================================

Production Setup:
1. Go to Supabase Dashboard → Settings → Edge Functions
2. Add these secrets:
   - ESEWA_MERCHANT_ID: Your eSewa merchant ID
   - ESEWA_SECRET_KEY: Your eSewa secret key
   - SITE_URL: Your production domain (https://yourdomain.com)

Test Credentials (Development):
- Merchant ID: EPAYTEST
- Secret Key: 8gBm/:&EnhH.1/q

Payment Flow:
1. User selects plan on /pricing
2. Clicks "Start Free Trial" → redirects to /payment
3. Selects eSewa payment method
4. Clicks Pay → redirected to eSewa portal
5. Completes payment → callback activates subscription
6. User redirected to /profile with active subscription

================================================================================
6. APPLICATION ROUTES
================================================================================

Public Routes:
- / : Homepage
- /tools : All tools listing
- /tools/:toolId : Individual tool page
- /pricing : Subscription plans
- /auth : Login/Signup

Protected Routes (Requires Login):
- /profile : User dashboard
- /payment?plan=pro|business : Payment page

Admin Routes (Requires Admin Role):
- /admin : Admin dashboard

================================================================================
7. ADMIN DASHBOARD FEATURES
================================================================================

User Management:
- Search users by email
- View all registered users
- See user credit balances
- Adjust credits (add/remove)

Role Management:
- Assign admin role
- Assign moderator role
- Demote to user role

Subscription Overview:
- View all active subscriptions
- Filter by plan type
- See payment methods used

Revenue Statistics:
- Total monthly revenue
- Active subscription count
- Breakdown by plan

================================================================================
8. DATABASE STRUCTURE
================================================================================

Key Tables:
- profiles: User profile information
- user_roles: Role assignments (admin/moderator/user)
- user_credits: Credit balances
- credit_transactions: Credit usage history
- subscriptions: Subscription records
- processing_history: Tool usage logs

Security:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admin functions use security definer

================================================================================
9. TROUBLESHOOTING
================================================================================

Issue: "Insufficient credits" as Admin
Solution: Verify your role is 'admin' in user_roles table

Issue: Payment callback not working
Solution: Check SITE_URL secret matches your domain

Issue: eSewa payment fails
Solution: Verify merchant credentials in Edge Function secrets

Issue: User can't see admin dashboard
Solution: Assign 'admin' role via SQL or existing admin

================================================================================
10. SECURITY BEST PRACTICES
================================================================================

- Never share admin credentials
- Use strong passwords
- Enable 2FA on Supabase dashboard
- Regularly audit user roles
- Monitor credit transactions for anomalies
- Keep eSewa secrets confidential
- Use HTTPS in production

================================================================================

For support, contact the platform administrator.
Documentation version: 1.0
    `.trim();
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'platform-documentation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Documentation</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Platform Documentation
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Complete guide for users and administrators. Download the full documentation or browse sections below.
            </p>
            <Button 
              size="lg" 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="gap-2"
            >
              <Download className="h-5 w-5" />
              {downloading ? "Downloading..." : "Download Full Documentation"}
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => setActiveTab("overview")}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Admin Setup</p>
                  <p className="text-sm text-muted-foreground">Grant admin access</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => setActiveTab("overview")}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Pricing</p>
                  <p className="text-sm text-muted-foreground">Plans & credits</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => setActiveTab("overview")}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Tools</p>
                  <p className="text-sm text-muted-foreground">Credit costs</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => setActiveTab("overview")}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">eSewa Setup</p>
                  <p className="text-sm text-muted-foreground">Payment config</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => setActiveTab("api")}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">API Docs</p>
                  <p className="text-sm text-muted-foreground">Developer guide</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Overview and API */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="overview" className="gap-2">
                <BookOpen className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2">
                <Code className="h-4 w-4" /> API Reference
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
          {/* Admin Setup */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Admin Setup Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Step 1: Find Your User ID</h4>
                <p className="text-sm text-muted-foreground">
                  Go to Supabase Dashboard → Authentication → Users → Copy your UUID
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Step 2: Run SQL Command</h4>
                <pre className="bg-background p-3 rounded text-sm overflow-x-auto">
{`UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = 'YOUR-USER-ID-HERE';`}
                </pre>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" /> Unlimited Credits
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" /> Admin Dashboard
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" /> User Management
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" /> Role Assignment
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Credit Costs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Tool Credit Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> PDF Tools
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: "Merge PDF", credits: 5 },
                      { name: "Split PDF", credits: 5 },
                      { name: "Compress PDF", credits: 10 },
                      { name: "Office to PDF", credits: 10 },
                      { name: "PDF OCR", credits: "5/page" },
                      { name: "Rotate PDF", credits: 10 },
                      { name: "PDF to JPG", credits: 10 },
                    ].map((tool) => (
                      <div key={tool.name} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{tool.name}</span>
                        <Badge variant="secondary">{tool.credits} credits</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Image className="h-4 w-4" /> Image Tools
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: "Compress Image", credits: 2 },
                      { name: "Image to PDF", credits: 10 },
                      { name: "Background Removal", credits: 10 },
                      { name: "Image Upscale", credits: 20 },
                      { name: "Digital Signature", credits: 80 },
                      { name: "AI Spreadsheet", credits: 15 },
                    ].map((tool) => (
                      <div key={tool.name} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{tool.name}</span>
                        <Badge variant="secondary">{tool.credits} credits</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscription Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-lg">Free</h4>
                  <p className="text-2xl font-bold text-foreground">$0<span className="text-sm font-normal text-muted-foreground">/forever</span></p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 300 initial credits</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 5 tasks/day</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 15MB file limit</li>
                  </ul>
                </div>
                <div className="border-2 border-primary rounded-lg p-4 relative">
                  <Badge className="absolute -top-2 right-4">Popular</Badge>
                  <h4 className="font-semibold text-lg">Pro</h4>
                  <p className="text-2xl font-bold text-foreground">$9<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground">रू1,200 NPR</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 5,000 credits</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Unlimited tasks</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 100MB file limit</li>
                  </ul>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-lg">Business</h4>
                  <p className="text-2xl font-bold text-foreground">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground">रू3,900 NPR</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 20,000 credits</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 5 team members</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 500MB file limit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* eSewa Setup */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                eSewa Payment Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Configure eSewa payment gateway for production payments.
              </p>
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Required Secrets (Supabase Edge Functions)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-2 py-1 rounded">ESEWA_MERCHANT_ID</code>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Your eSewa merchant ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-2 py-1 rounded">ESEWA_SECRET_KEY</code>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Your eSewa secret key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-2 py-1 rounded">SITE_URL</code>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Your production domain</span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-600 mb-2">Test Credentials (Development Only)</h4>
                <p className="text-sm text-muted-foreground">
                  Merchant ID: <code className="bg-background px-1 rounded">EPAYTEST</code><br />
                  Secret Key: <code className="bg-background px-1 rounded">8gBm/:&EnhH.1/q</code>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Application Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Public Routes</h4>
                  <div className="space-y-2 text-sm">
                    {["/", "/tools", "/tools/:id", "/pricing", "/auth", "/docs"].map((route) => (
                      <div key={route} className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">{route}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Protected Routes</h4>
                  <div className="space-y-2 text-sm">
                    {["/profile", "/payment"].map((route) => (
                      <div key={route} className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">{route}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Admin Routes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="font-mono bg-primary">/admin</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            {/* API Documentation Tab */}
            <TabsContent value="api" className="space-y-8" id="api">
              {/* API Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    API Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The PDFTools API allows developers to integrate document processing capabilities into their applications.
                    All API requests require authentication using an API key.
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Base URL</h4>
                    <code className="bg-background px-3 py-2 rounded block text-sm">
                      https://your-project.supabase.co/functions/v1
                    </code>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-2">Include your API key in the request headers:</p>
                      <code className="bg-background px-2 py-1 rounded text-sm block">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Rate Limits</h4>
                      <p className="text-sm text-muted-foreground">
                        Free: 100 requests/day<br />
                        Pro: 5,000 requests/day<br />
                        Business: Unlimited
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Getting Your API Key</h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Log in to your account at /profile</li>
                      <li>Navigate to the API section</li>
                      <li>Click "Generate API Key"</li>
                      <li>Copy and store your key securely</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-600 mb-2">Security Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Never expose your API key in client-side code. Always use server-side requests or environment variables.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    API Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Spreadsheet Endpoint */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 flex items-center gap-3">
                      <Badge className="bg-green-500">POST</Badge>
                      <code className="text-sm">/ai-spreadsheet</code>
                    </div>
                    <div className="p-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Process spreadsheet data with AI-powered analysis and transformations.
                      </p>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Request Body</h5>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`{
  "prompt": "Analyze sales trends",
  "data": [
    ["Product", "Sales", "Month"],
    ["Widget A", 150, "January"],
    ["Widget B", 200, "January"]
  ]
}`}
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Response</h5>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`{
  "success": true,
  "result": "Based on the data, Widget B shows 33% higher sales..."
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* eSewa Payment Endpoint */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 flex items-center gap-3">
                      <Badge className="bg-green-500">POST</Badge>
                      <code className="text-sm">/esewa-payment</code>
                    </div>
                    <div className="p-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Initialize eSewa payment for subscription purchases.
                      </p>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Request Body</h5>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`{
  "amount": 1200,
  "plan": "pro",
  "user_id": "uuid-here"
}`}
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Response</h5>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`{
  "success": true,
  "payment_url": "https://esewa.com.np/epay/...",
  "transaction_id": "TXN123456"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Credits Deduction */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 flex items-center gap-3">
                      <Badge className="bg-blue-500">RPC</Badge>
                      <code className="text-sm">deduct_credits</code>
                    </div>
                    <div className="p-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Deduct credits from a user account (admin bypass available).
                      </p>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Parameters</h5>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`{
  "p_user_id": "user-uuid",
  "p_amount": 10,
  "p_description": "PDF merge operation",
  "p_tool": "merge-pdf"
}`}
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Returns</h5>
                        <code className="bg-muted px-2 py-1 rounded text-sm">boolean</code>
                        <span className="text-sm text-muted-foreground ml-2">- true if successful</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Examples */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Code Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* JavaScript Example */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">JavaScript</Badge>
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// Initialize Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Call AI Spreadsheet function
const { data, error } = await supabase.functions.invoke('ai-spreadsheet', {
  body: {
    prompt: 'Summarize the data',
    data: [['Name', 'Value'], ['Item 1', 100]]
  }
})

if (error) {
  console.error('Error:', error)
} else {
  console.log('Result:', data.result)
}`}
                    </pre>
                  </div>

                  {/* cURL Example */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">cURL</Badge>
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST \\
  'https://your-project.supabase.co/functions/v1/ai-spreadsheet' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "prompt": "Analyze this data",
    "data": [["Col1", "Col2"], ["A", 1]]
  }'`}
                    </pre>
                  </div>

                  {/* Python Example */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">Python</Badge>
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import requests

url = "https://your-project.supabase.co/functions/v1/ai-spreadsheet"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "prompt": "Analyze trends",
    "data": [["Product", "Sales"], ["A", 100], ["B", 200]]
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Error Codes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Error Codes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Code</th>
                          <th className="text-left py-3 px-4 font-semibold">Message</th>
                          <th className="text-left py-3 px-4 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4"><Badge variant="destructive">400</Badge></td>
                          <td className="py-3 px-4 font-mono text-xs">Bad Request</td>
                          <td className="py-3 px-4 text-muted-foreground">Invalid request parameters</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4"><Badge variant="destructive">401</Badge></td>
                          <td className="py-3 px-4 font-mono text-xs">Unauthorized</td>
                          <td className="py-3 px-4 text-muted-foreground">Missing or invalid API key</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4"><Badge variant="destructive">402</Badge></td>
                          <td className="py-3 px-4 font-mono text-xs">Payment Required</td>
                          <td className="py-3 px-4 text-muted-foreground">Insufficient credits</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4"><Badge variant="destructive">429</Badge></td>
                          <td className="py-3 px-4 font-mono text-xs">Too Many Requests</td>
                          <td className="py-3 px-4 text-muted-foreground">Rate limit exceeded</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4"><Badge variant="destructive">500</Badge></td>
                          <td className="py-3 px-4 font-mono text-xs">Internal Error</td>
                          <td className="py-3 px-4 text-muted-foreground">Server-side error</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* SDKs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    SDKs & Libraries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">JavaScript/TypeScript</h4>
                      <code className="bg-muted px-2 py-1 rounded text-sm block mb-2">
                        npm install @supabase/supabase-js
                      </code>
                      <p className="text-sm text-muted-foreground">Official Supabase client for web and Node.js</p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Python</h4>
                      <code className="bg-muted px-2 py-1 rounded text-sm block mb-2">
                        pip install supabase
                      </code>
                      <p className="text-sm text-muted-foreground">Python client for Supabase</p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">REST API</h4>
                      <code className="bg-muted px-2 py-1 rounded text-sm block mb-2">
                        curl / fetch / axios
                      </code>
                      <p className="text-sm text-muted-foreground">Use any HTTP client directly</p>
                    </div>
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

export default DocumentationPage;

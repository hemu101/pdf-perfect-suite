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
  ArrowRight
} from "lucide-react";

const DocumentationPage = () => {
  const [downloading, setDownloading] = useState(false);

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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Card className="hover:border-primary transition-colors cursor-pointer">
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
            <Card className="hover:border-primary transition-colors cursor-pointer">
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
            <Card className="hover:border-primary transition-colors cursor-pointer">
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
            <Card className="hover:border-primary transition-colors cursor-pointer">
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
          </div>

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
                    {["/", "/tools", "/tools/:id", "/pricing", "/auth"].map((route) => (
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationPage;

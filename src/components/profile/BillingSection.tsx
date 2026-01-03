import { useState } from "react";
import { useBusinessDetails } from "@/hooks/useBusinessDetails";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Building, Receipt, Loader2, Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface BillingSectionProps {
  activeTab: string;
}

export const BillingSection = ({ activeTab }: BillingSectionProps) => {
  const navigate = useNavigate();
  const { details, loading: detailsLoading, saveDetails } = useBusinessDetails();
  const { subscription, billingHistory, loading: subLoading } = useSubscription();
  const [saving, setSaving] = useState(false);

  // Form state for business details
  const [companyName, setCompanyName] = useState(details?.company_name || "");
  const [taxId, setTaxId] = useState(details?.tax_id || "");
  const [billingAddress, setBillingAddress] = useState(details?.billing_address || "");
  const [city, setCity] = useState(details?.city || "");
  const [state, setState] = useState(details?.state || "");
  const [country, setCountry] = useState(details?.country || "");
  const [postalCode, setPostalCode] = useState(details?.postal_code || "");
  const [phone, setPhone] = useState(details?.phone || "");

  const handleSaveDetails = async () => {
    setSaving(true);
    await saveDetails({
      company_name: companyName || null,
      tax_id: taxId || null,
      billing_address: billingAddress || null,
      city: city || null,
      state: state || null,
      country: country || null,
      postal_code: postalCode || null,
      phone: phone || null,
    });
    setSaving(false);
  };

  const loading = detailsLoading || subLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Plans Tab
  if (activeTab === "billing-plans") {
    const currentPlan = subscription?.plan || "free";
    const planLabels: Record<string, string> = {
      free: "Free Plan",
      pro: "Pro Plan",
      business: "Business Plan",
    };

    return (
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
                <p className="font-semibold">{planLabels[currentPlan] || "Free Plan"}</p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.status === "active" && subscription?.expiresAt
                    ? `Expires: ${format(new Date(subscription.expiresAt), "MMM d, yyyy")}`
                    : "300 credits included"}
                </p>
              </div>
              <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
                {subscription?.status === "active" ? "Active" : "Current"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className={currentPlan === "free" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Free</CardTitle>
                <p className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ 300 initial credits</p>
                <p>✓ 5 tasks per day</p>
                <p>✓ 15MB file limit</p>
                {currentPlan === "free" && (
                  <Badge variant="outline" className="mt-2">Current Plan</Badge>
                )}
              </CardContent>
            </Card>

            <Card className={currentPlan === "pro" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pro</CardTitle>
                <p className="text-2xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ Unlimited tasks</p>
                <p>✓ Priority processing</p>
                <p>✓ 100MB file limit</p>
                <p>✓ No watermarks</p>
                {currentPlan === "pro" ? (
                  <Badge variant="outline" className="mt-2">Current Plan</Badge>
                ) : (
                  <Button size="sm" className="mt-2 w-full" onClick={() => navigate("/pricing")}>
                    Upgrade
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className={currentPlan === "business" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Business</CardTitle>
                <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ 5 team members</p>
                <p>✓ 500MB file limit</p>
                <p>✓ API access</p>
                <p>✓ Batch processing</p>
                {currentPlan === "business" ? (
                  <Badge variant="outline" className="mt-2">Current Plan</Badge>
                ) : (
                  <Button size="sm" className="mt-2 w-full" onClick={() => navigate("/pricing")}>
                    Upgrade
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Button variant="hero" className="w-full" onClick={() => navigate("/pricing")}>
            <Crown className="h-4 w-4 mr-2" />
            {currentPlan === "free" ? "Upgrade to Premium" : "Manage Subscription"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Business Details Tab
  if (activeTab === "billing-details") {
    return (
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
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / VAT Number</Label>
              <Input
                id="taxId"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="Enter tax ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Input
              id="billingAddress"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              placeholder="Enter billing address"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <Button onClick={handleSaveDetails} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Details"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Invoices Tab
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Invoices
        </CardTitle>
        <CardDescription>View and download your invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {billingHistory.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground">Your invoices will appear here after your first purchase</p>
          </div>
        ) : (
          <div className="space-y-3">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{invoice.plan} Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={invoice.status === "active" ? "default" : "secondary"}>
                    {invoice.status}
                  </Badge>
                  <span className="font-medium">
                    {invoice.currency} {invoice.amount}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toast.info("Invoice download coming soon")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

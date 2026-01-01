import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Crown,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle,
  Check,
  Calendar,
  Receipt,
  Loader2,
} from "lucide-react";

const planDetails = {
  free: { name: "Free", credits: 300, price: 0 },
  pro: { name: "Pro", credits: 5000, price: 1200 },
  business: { name: "Business", credits: 20000, price: 3900 },
};

const SubscriptionManager = () => {
  const navigate = useNavigate();
  const { subscription, billingHistory, loading, cancelSubscription, upgradePlan, downgradePlan } = useSubscription();
  const { credits } = useCredits();
  const [cancelling, setCancelling] = useState(false);

  const currentPlan = subscription?.plan || "free";
  const currentPlanDetails = planDetails[currentPlan as keyof typeof planDetails] || planDetails.free;

  const handleCancel = async () => {
    setCancelling(true);
    await cancelSubscription();
    setCancelling(false);
  };

  const handleUpgrade = async (plan: string) => {
    const result = await upgradePlan(plan);
    if (result.redirectTo) {
      navigate(result.redirectTo);
    }
  };

  const handleDowngrade = async (plan: string) => {
    const result = await downgradePlan(plan);
    if (result.redirectTo) {
      navigate(result.redirectTo);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Current Plan
          </CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-lg border-2 border-primary/20 bg-primary/5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{currentPlanDetails.name} Plan</h3>
                <p className="text-muted-foreground">
                  {currentPlan === "free" 
                    ? "Free forever" 
                    : `रू ${currentPlanDetails.price}/month`}
                </p>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                Current
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credits Available</p>
                  <p className="font-semibold">
                    {credits?.isAdmin ? "Unlimited" : credits?.balance || 0}
                  </p>
                </div>
              </div>
              {subscription?.expiresAt && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renews On</p>
                    <p className="font-semibold">
                      {new Date(subscription.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Plan Actions */}
            <div className="flex flex-wrap gap-3">
              {currentPlan === "free" && (
                <>
                  <Button onClick={() => handleUpgrade("pro")} className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                  <Button onClick={() => handleUpgrade("business")} variant="outline" className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4" />
                    Upgrade to Business
                  </Button>
                </>
              )}

              {currentPlan === "pro" && (
                <>
                  <Button onClick={() => handleUpgrade("business")} className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4" />
                    Upgrade to Business
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <ArrowDownCircle className="h-4 w-4" />
                        Downgrade to Free
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Downgrade to Free Plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll lose access to Pro features at the end of your current billing period. Your remaining credits will be preserved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDowngrade("free")}>
                          Confirm Downgrade
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {currentPlan === "business" && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <ArrowDownCircle className="h-4 w-4" />
                        Downgrade to Pro
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Downgrade to Pro Plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll lose access to Business features like team members and API access at the end of your current billing period.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDowngrade("pro")}>
                          Confirm Downgrade
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {subscription && subscription.status === "active" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Your subscription will remain active until {new Date(subscription.expiresAt || Date.now()).toLocaleDateString()}. After that, you'll be moved to the Free plan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {cancelling ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Cancel Subscription"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(planDetails).map(([planId, plan]) => (
              <div
                key={planId}
                className={`p-4 rounded-lg border ${
                  planId === currentPlan
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{plan.name}</h4>
                  {planId === currentPlan && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {plan.credits.toLocaleString()} credits
                </p>
                <p className="text-lg font-bold">
                  {plan.price === 0 ? "Free" : `रू ${plan.price}/mo`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>View your past payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.plan.charAt(0).toUpperCase() + item.plan.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.amount
                          ? `${item.currency === "NPR" ? "रू" : "$"} ${item.amount}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {item.paymentMethod
                          ? item.paymentMethod.charAt(0).toUpperCase() +
                            item.paymentMethod.slice(1)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "active"
                              ? "default"
                              : item.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No billing history</h3>
              <p className="text-muted-foreground mb-4">
                Your payment history will appear here after your first purchase
              </p>
              <Button onClick={() => navigate("/pricing")}>View Plans</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;

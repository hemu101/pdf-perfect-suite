import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Mail, Globe, Palette, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const AccountSection = () => {
  const { user } = useAuth();
  const { settings, loading, updateSettings } = useUserSettings();
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(settings?.language || "en");
  const [selectedTheme, setSelectedTheme] = useState(settings?.theme || "system");

  const userEmail = user?.email || "";

  const handleLanguageChange = async () => {
    await updateSettings({ language: selectedLanguage });
    setLanguageDialogOpen(false);
  };

  const handleThemeChange = async () => {
    await updateSettings({ theme: selectedTheme });
    setThemeDialogOpen(false);
    // In a real app, you'd also update the actual theme here
    toast.info("Theme will apply on next page load");
  };

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "ne", label: "नेपाली" },
  ];

  const themes = [
    { value: "system", label: "System Default" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Email change requires verification. Contact support.")}
            >
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">
                  {languages.find(l => l.value === (settings?.language || "en"))?.label || "English"}
                </p>
              </div>
            </div>
            <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Change</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Language</DialogTitle>
                  <DialogDescription>Select your preferred language.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setLanguageDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleLanguageChange}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  {themes.find(t => t.value === (settings?.theme || "system"))?.label || "System Default"}
                </p>
              </div>
            </div>
            <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Change</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Theme</DialogTitle>
                  <DialogDescription>Select your preferred theme.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setThemeDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleThemeChange}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

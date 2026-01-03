import { useState } from "react";
import { useSignatures } from "@/hooks/useSignatures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileSignature, Send, Inbox, FileCheck, FileText, Plus, Loader2, Trash2, Clock, Contact } from "lucide-react";
import { format } from "date-fns";

interface SignaturesSectionProps {
  activeTab: string;
}

export const SignaturesSection = ({ activeTab }: SignaturesSectionProps) => {
  const {
    signatures,
    templates,
    loading,
    sentSignatures,
    inboxSignatures,
    signedSignatures,
    pendingCount,
    createSignature,
    deleteSignature,
    createTemplate,
    deleteTemplate,
  } = useSignatures();

  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateSignature = async () => {
    if (!documentName.trim() || !recipientEmail.trim()) return;

    setCreating(true);
    const { error } = await createSignature({
      document_name: documentName.trim(),
      recipient_email: recipientEmail.trim(),
      recipient_name: recipientName.trim() || undefined,
    });
    setCreating(false);

    if (!error) {
      setSignatureDialogOpen(false);
      setDocumentName("");
      setRecipientEmail("");
      setRecipientName("");
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) return;

    setCreating(true);
    const { error } = await createTemplate({ name: templateName.trim() });
    setCreating(false);

    if (!error) {
      setTemplateDialogOpen(false);
      setTemplateName("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Overview Tab
  if (activeTab === "signatures-overview") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5" />
                Signatures Overview
              </CardTitle>
              <CardDescription>Manage your digital signatures</CardDescription>
            </div>
            <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Signature
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Signature</DialogTitle>
                  <DialogDescription>
                    Send a document for signature.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="docName">Document Name</Label>
                    <Input
                      id="docName"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Contract.pdf"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipEmail">Recipient Email</Label>
                    <Input
                      id="recipEmail"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipName">Recipient Name (optional)</Label>
                    <Input
                      id="recipName"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSignatureDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateSignature} disabled={creating || !documentName.trim() || !recipientEmail.trim()}>
                    {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Send Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Send className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{sentSignatures.length}</p>
                  <p className="text-sm text-muted-foreground">Sent</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Inbox className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileCheck className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{signedSignatures.length}</p>
                  <p className="text-sm text-muted-foreground">Signed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sent Tab
  if (activeTab === "signatures-sent") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Sent Signatures
          </CardTitle>
          <CardDescription>Documents you've sent for signature</CardDescription>
        </CardHeader>
        <CardContent>
          {sentSignatures.length === 0 ? (
            <div className="text-center py-12">
              <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sent signatures</h3>
              <p className="text-muted-foreground">Documents you send for signature will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentSignatures.map((sig) => (
                <div key={sig.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileSignature className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{sig.document_name}</p>
                      <p className="text-sm text-muted-foreground">To: {sig.recipient_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={sig.status === "pending" ? "secondary" : "default"}>
                      {sig.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(sig.created_at), "MMM d, yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteSignature(sig.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Inbox Tab
  if (activeTab === "signatures-inbox") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Inbox
          </CardTitle>
          <CardDescription>Documents awaiting your signature</CardDescription>
        </CardHeader>
        <CardContent>
          {inboxSignatures.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Inbox empty</h3>
              <p className="text-muted-foreground">Documents sent to you for signing will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inboxSignatures.map((sig) => (
                <div key={sig.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{sig.document_name}</p>
                      <p className="text-sm text-muted-foreground">From: {sig.recipient_name || "Unknown"}</p>
                    </div>
                  </div>
                  <Button size="sm">Sign Now</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Signed Tab
  if (activeTab === "signatures-signed") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Signed Documents
          </CardTitle>
          <CardDescription>Completed signature requests</CardDescription>
        </CardHeader>
        <CardContent>
          {signedSignatures.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No signed documents</h3>
              <p className="text-muted-foreground">Signed documents will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {signedSignatures.map((sig) => (
                <div key={sig.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{sig.document_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Signed on {sig.signed_at ? format(new Date(sig.signed_at), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Templates Tab
  if (activeTab === "signatures-templates") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Signature Templates
              </CardTitle>
              <CardDescription>Reusable document templates</CardDescription>
            </div>
            <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Template</DialogTitle>
                  <DialogDescription>
                    Create a reusable signature template.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="NDA Template"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateTemplate} disabled={creating || !templateName.trim()}>
                    {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates</h3>
              <p className="text-muted-foreground">Create templates for frequently used documents.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Created {format(new Date(template.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Use</Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Contacts Tab
  if (activeTab === "signatures-contacts") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Contact className="h-5 w-5" />
            Signature Contacts
          </CardTitle>
          <CardDescription>People you frequently request signatures from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Contact className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts saved</h3>
            <p className="text-muted-foreground">Contacts will be saved automatically when you send signature requests.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Settings Tab
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSignature className="h-5 w-5" />
          Signature Settings
        </CardTitle>
        <CardDescription>Configure your signature preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileSignature className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Settings coming soon</h3>
          <p className="text-muted-foreground">Configure your default signature and notification preferences.</p>
        </div>
      </CardContent>
    </Card>
  );
};

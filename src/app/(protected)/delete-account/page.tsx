"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DeleteAccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [confirmText, setConfirmText] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE MY ACCOUNT") {
      toast({
        title: "Confirmation Required",
        description: "Please type 'DELETE MY ACCOUNT' to confirm.",
        variant: "destructive"
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please confirm you understand the consequences.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);

    // Send email to support for manual deletion
    const subject = encodeURIComponent("Delete Account Request - CONFIRMED");
    const body = encodeURIComponent(`
User Details:
- Name: ${user?.displayName || 'N/A'}
- Email: ${user?.email || 'N/A'}
- User ID: ${user?.uid || 'N/A'}
- Request Date: ${new Date().toLocaleString()}

The user has confirmed they want to permanently delete their account and all associated data.

Please process this deletion request.
    `);

    // Open email client
    window.location.href = `mailto:hello@quizzicallabz.qzz.io?subject=${subject}&body=${body}`;

    toast({
      title: "Deletion Request Sent",
      description: "Your account deletion request has been sent to our support team. You will receive confirmation within 24 hours.",
    });

    // Redirect to profile after 3 seconds
    setTimeout(() => {
      router.push("/profile");
    }, 3000);

    setIsDeleting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <PageHeader 
          title="Delete Account" 
          description="Permanently delete your account and all associated data"
        />
      </div>

      <div className="space-y-6">
        {/* Warning Card */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Warning: This Action Cannot Be Undone
            </CardTitle>
            <CardDescription>
              Deleting your account will permanently remove all your data including:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>All quiz results and performance history</li>
              <li>Saved bookmarks and study materials</li>
              <li>Account settings and preferences</li>
              <li>Subscription information (if applicable)</li>
              <li>All personal data associated with your account</li>
            </ul>
          </CardContent>
        </Card>

        {/* Confirmation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confirm Account Deletion
            </CardTitle>
            <CardDescription>
              Please complete the following steps to confirm you want to delete your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Account to be deleted:</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Name:</strong> {user?.displayName || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {user?.email || 'N/A'}
              </p>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Type <strong>DELETE MY ACCOUNT</strong> to confirm:
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="font-mono"
              />
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agree-terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="agree-terms" className="text-sm leading-relaxed">
                I understand that this action is permanent and cannot be undone. 
                All my data will be permanently deleted and cannot be recovered.
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== "DELETE MY ACCOUNT" || !agreedToTerms}
                className="flex-1"
              >
                {isDeleting ? "Processing..." : (
                  <>
                    <span className="hidden sm:inline">Delete My Account Permanently</span>
                    <span className="sm:hidden">Delete Account</span>
                  </>
                )}
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/profile">Cancel</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              This will send a deletion request to our support team. 
              Your account will be deleted within 24 hours after verification.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
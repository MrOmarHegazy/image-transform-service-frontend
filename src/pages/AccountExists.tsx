import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2, Mail, ArrowLeft } from "lucide-react";
import logoImg from "@/assets/website logo - image transform.png";
import { motion } from "framer-motion";

export default function AccountExists() {
  const storedEmail = sessionStorage.getItem("exists_email") ?? "";
  const [sending, setSending] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReset = async () => {
    if (!storedEmail) {
      toast({
        title: "No email found",
        description: "Please go back and try signing up again.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      await resetPassword(storedEmail);
      toast({
        title: "Reset email sent",
        description: `Check ${storedEmail} for a password reset link.`,
      });
    } catch (err: any) {
      toast({
        title: "Could not send reset email",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSignIn = () => {
    sessionStorage.removeItem("exists_email");
    navigate("/login");
  };

  const handleBack = () => {
    sessionStorage.removeItem("exists_email");
    navigate("/signup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <img src={logoImg} alt="ImageTransform" className="w-8 h-8 rounded-xl object-cover" />
          <span className="font-heading font-medium text-lg tracking-tight">
            ImageTransform
          </span>
        </Link>

        <div className="rounded-[18px] border bg-card p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>

          <h1 className="text-xl font-heading font-medium tracking-tight mb-1 text-center">
            Account already exists
          </h1>
          {storedEmail && (
            <p className="text-sm text-muted-foreground text-center mb-2">
              An account with this email already exists:
            </p>
          )}
          {storedEmail && (
            <p className="text-sm font-medium text-foreground text-center mb-7 break-all">
              {storedEmail}
            </p>
          )}
          {!storedEmail && (
            <p className="text-sm text-muted-foreground text-center mb-7">
              An account with that email already exists. Please sign in or reset your password.
            </p>
          )}

          <div className="space-y-3">
            <Button
              className="w-full h-10 rounded-[10px] text-sm"
              onClick={handleSignIn}
            >
              Sign in instead
            </Button>

            <Button
              variant="outline"
              className="w-full h-9 rounded-[10px] text-xs"
              onClick={handleReset}
              disabled={sending}
            >
              {sending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Mail className="mr-2 h-3.5 w-3.5" />
              )}
              Send password reset email
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleBack}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Try a different email
          </button>
        </div>
      </motion.div>
    </div>
  );
}

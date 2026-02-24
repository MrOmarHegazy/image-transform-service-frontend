import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw, ArrowLeft } from "lucide-react";
import logoImg from "@/assets/website logo - image transform.png";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const { user, signIn, resendVerification } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const stored = sessionStorage.getItem("verify_email") ?? "";
  const [email, setEmail] = useState(stored);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showCredentials, setShowCredentials] = useState(!stored);

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await signIn(email, password);
      sessionStorage.removeItem("verify_email");
      navigate("/app");
    } catch (err: any) {
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("not confirmed") || msg.includes("email not confirmed")) {
        toast({
          title: "Not verified yet",
          description: "Please check your email and click the confirmation link, then try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign in failed",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({ title: "Enter your email first", variant: "destructive" });
      return;
    }
    setResending(true);
    try {
      await resendVerification(email);
      toast({ title: "Verification email resent", description: `Check ${email} for a new link.` });
    } catch (err: any) {
      toast({ title: "Could not resend", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const handleDifferentEmail = () => {
    sessionStorage.removeItem("verify_email");
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
              <Mail className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>

          <h1 className="text-xl font-heading font-medium tracking-tight mb-1 text-center">
            Check your inbox
          </h1>
          <p className="text-muted-foreground text-sm mb-2 text-center">
            We sent a confirmation link to:
          </p>
          {email && (
            <p className="text-sm font-medium text-foreground text-center mb-6 break-all">
              {email}
            </p>
          )}
          {!email && (
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter your credentials below to continue.
            </p>
          )}

          <form onSubmit={handleConfirm} className="space-y-4">
            {showCredentials && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="verify-email" className="text-xs font-medium">Email</Label>
                  <Input
                    id="verify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="verify-password" className="text-xs font-medium">Password</Label>
              <Input
                id="verify-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full h-10 rounded-[10px] text-sm" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              I've confirmed my email
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full h-9 rounded-[10px] text-xs"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
              )}
              Resend verification email
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleDifferentEmail}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Use a different email
          </button>
        </div>
      </motion.div>
    </div>
  );
}

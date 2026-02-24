import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import logoImg from "@/assets/website logo - image transform.png";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);
  const { signIn, resendVerification } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResend(false);
    try {
      await signIn(email, password);
      navigate("/app");
    } catch (err: any) {
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("not confirmed") || msg.includes("email not confirmed")) {
        setShowResend(true);
        toast({
          title: "Email not verified",
          description: "Please verify your email before signing in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
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
          <h1 className="text-xl font-heading font-medium tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm mb-7">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <Input
                id="password"
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
              Sign in
            </Button>
          </form>

          {showResend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
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
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-medium">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}

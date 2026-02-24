import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import logoImg from "@/assets/website logo - image transform.png";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { needsVerification, alreadyExists } = await signUp(email, password);
      if (alreadyExists) {
        sessionStorage.setItem("exists_email", email);
        navigate("/account-exists");
        return;
      }
      if (needsVerification) {
        sessionStorage.setItem("verify_email", email);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
        navigate("/verify-email");
      } else {
        toast({ title: "Account created", description: "You're signed in." });
        navigate("/app");
      }
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm mb-7">
            Get started for free
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
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

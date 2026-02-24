import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadTab from "@/components/UploadTab";
import MyImagesTab from "@/components/MyImagesTab";
import { LogOut, Upload, Images, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged out" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-content mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Wand2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-heading font-medium text-[15px] tracking-tight text-foreground">
              ImageTransform
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-content mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Tabs defaultValue="upload" className="space-y-8">
              <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 rounded-[12px] h-10 bg-muted p-1">
                <TabsTrigger value="upload" className="gap-2 rounded-[8px] text-xs data-[state=active]:shadow-sm">
                  <Upload className="h-3.5 w-3.5" /> Upload
                </TabsTrigger>
                <TabsTrigger value="images" className="gap-2 rounded-[8px] text-xs data-[state=active]:shadow-sm">
                  <Images className="h-3.5 w-3.5" /> My Images
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <UploadTab onImageChange={() => setRefreshKey((k) => k + 1)} />
              </TabsContent>
              <TabsContent value="images">
                <MyImagesTab refreshKey={refreshKey} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

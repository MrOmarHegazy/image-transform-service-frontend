import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadTab from "@/components/UploadTab";
import MyImagesTab from "@/components/MyImagesTab";
import { LogOut, Upload, Images, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged out" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Zap className="h-5 w-5 text-primary" />
            ImageTransform
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" /> Upload & Process
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <Images className="h-4 w-4" /> My Images
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <UploadTab onImageChange={() => setRefreshKey(k => k + 1)} />
          </TabsContent>
          <TabsContent value="images">
            <MyImagesTab refreshKey={refreshKey} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadTab from "@/components/UploadTab";
import MyImagesTab from "@/components/MyImagesTab";
import Navbar from "@/components/Navbar";
import { Upload, Images } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "upload" ? "upload" : "images";
  const [refreshKey, setRefreshKey] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const onTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar variant="dashboard" />

      {/* Content */}
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-content mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Tabs
              defaultValue={initialTab}
              onValueChange={onTabChange}
              className="space-y-8"
            >
              <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 rounded-[12px] h-10 bg-muted p-1">
                <TabsTrigger
                  value="upload"
                  className="gap-2 rounded-[8px] text-xs data-[state=active]:shadow-sm"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="gap-2 rounded-[8px] text-xs data-[state=active]:shadow-sm"
                >
                  <Images className="h-3.5 w-3.5" /> My Images
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <UploadTab
                  onImageChange={() => setRefreshKey((k) => k + 1)}
                />
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

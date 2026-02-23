import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import UploadTab from "@/components/UploadTab";
import MyImagesTab from "@/components/MyImagesTab";
import { Upload, Images } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function Dashboard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<"upload" | "images">("upload");

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-[1100px]">
          {/* Tab switcher */}
          <div className="flex items-center gap-1 mb-8 glass rounded-2xl p-1.5 w-fit">
            <button
              onClick={() => setTab("upload")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === "upload"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="h-4 w-4" /> Upload & Process
            </button>
            <button
              onClick={() => setTab("images")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === "images"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Images className="h-4 w-4" /> My Images
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "upload" ? (
              <UploadTab onImageChange={() => setRefreshKey(k => k + 1)} />
            ) : (
              <MyImagesTab refreshKey={refreshKey} />
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

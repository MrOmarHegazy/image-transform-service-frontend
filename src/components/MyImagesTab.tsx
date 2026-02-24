import { useState, useEffect, useCallback } from "react";
import { listImages, deleteImage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { ImageRecord } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ExternalLink,
  Link2,
  Download,
  Trash2,
  ImageOff,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  refreshKey: number;
}

export default function MyImagesTab({ refreshKey }: Props) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await listImages(token);
      setImages(data);
    } catch (err: any) {
      toast({
        title: "Failed to load images",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [token, refreshKey]);

  const confirmDelete = async () => {
    if (!deleteTarget || !token) return;
    setImages((prev) => prev.filter((i) => i.id !== deleteTarget));
    setDeleteTarget(null);
    try {
      await deleteImage(deleteTarget, token);
      toast({ title: "Image deleted" });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
      fetchImages();
    }
  };

  const filtered = images
    .filter((img) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        img.id.toLowerCase().includes(q) ||
        img.createdAt.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied" });
  };

  const downloadImage = useCallback(async (url: string, id: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `image-${id.slice(0, 8)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch {
      toast({
        title: "Download failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by ID or date…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as any)}>
          <SelectTrigger className="w-36 text-sm rounded-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[18px] border bg-card p-3.5 space-y-3"
            >
              <Skeleton className="w-full aspect-square rounded-xl" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-heading font-medium text-base mb-1">
            No images yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Upload and process your first image to see it here.
          </p>
        </motion.div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="rounded-[18px] border bg-card overflow-hidden group transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(139,92,246,0.06)]"
            >
              <div className="aspect-square checker-bg flex items-center justify-center overflow-hidden">
                <img
                  src={img.processedUrl}
                  alt="Processed"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3.5 space-y-2.5">
                <p className="text-[11px] text-muted-foreground">
                  {new Date(img.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={img.processedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(img.processedUrl)}
                  >
                    <Link2 className="h-3 w-3 mr-1" />
                    URL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(img.processedUrl, img.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteTarget(img.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-[18px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-medium text-lg">
              Delete image?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. The image will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[10px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-[10px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

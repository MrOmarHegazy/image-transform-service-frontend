import { useState, useEffect } from "react";
import { listImages, deleteImage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { ImageRecord } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { ExternalLink, Copy, Download, Trash2, ImageOff, Search } from "lucide-react";

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
      toast({ title: "Failed to load images", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [token, refreshKey]);

  const confirmDelete = async () => {
    if (!deleteTarget || !token) return;
    // optimistic
    setImages(prev => prev.filter(i => i.id !== deleteTarget));
    setDeleteTarget(null);
    try {
      await deleteImage(deleteTarget, token);
      toast({ title: "Image deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
      fetchImages();
    }
  };

  const filtered = images
    .filter(img => {
      if (!search) return true;
      const q = search.toLowerCase();
      return img.id.toLowerCase().includes(q) || img.createdAt.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied!" });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID or date…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={sort} onValueChange={v => setSort(v as any)}>
          <SelectTrigger className="w-40">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-3 space-y-3">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No images yet</h3>
          <p className="text-muted-foreground text-sm">Upload and process your first image to see it here.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(img => (
            <div key={img.id} className="rounded-xl border bg-card overflow-hidden group animate-fade-in">
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                <img src={img.processedUrl} alt="Processed" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(img.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  <Button size="sm" variant="outline" asChild>
                    <a href={img.processedUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copyUrl(img.processedUrl)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={img.processedUrl} download>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(img.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The image will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

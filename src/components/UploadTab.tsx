import { useState, useRef, useCallback } from "react";
import { uploadImage, deleteImage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProcessingSteps from "./ProcessingSteps";
import {
  Upload,
  Link2,
  ExternalLink,
  Download,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UploadResponse } from "@/types";

interface Props {
  onImageChange: () => void;
}

export default function UploadTab({ onImageChange }: Props) {
  const { token } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG, and WebP are supported.",
        variant: "destructive",
      });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setStep(-1);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }, []);

  const process = async () => {
    if (!file || !token) return;
    setProcessing(true);
    setStep(0);

    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 2000);
    const timer3 = setTimeout(() => setStep(3), 3200);

    try {
      const res = await uploadImage(file, token);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setStep(4);
      setResult(res);
      toast({
        title: "Image processed",
        description: "Your transformed image is ready.",
      });
      onImageChange();
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setStep(-1);
      toast({
        title: "Processing failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!result || !token) return;
    try {
      await deleteImage(result.id, token);
      toast({ title: "Image deleted" });
      setResult(null);
      setFile(null);
      setPreview(null);
      setStep(-1);
      onImageChange();
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const copyUrl = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.processedUrl);
    toast({ title: "URL copied" });
  };

  const downloadImage = useCallback(async () => {
    if (!result) return;
    try {
      const res = await fetch(result.processedUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `image-${result.id.slice(0, 8)}.png`;
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
  }, [result, toast]);

  const reset = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
    setStep(-1);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Drop zone */}
            <div
              className={`drop-zone rounded-[18px] p-12 text-center cursor-pointer transition-colors ${
                dragOver ? "active" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload image"
              onKeyDown={(e) =>
                e.key === "Enter" && fileRef.current?.click()
              }
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) =>
                  handleFile(e.target.files?.[0] ?? null)
                }
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                  <Upload className="h-5 w-5 text-accent-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, or WebP
                </p>
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[18px] border bg-card p-4"
              >
                <p className="text-xs text-muted-foreground mb-3">Preview</p>
                <div className="checker-bg rounded-xl overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-56 mx-auto object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 truncate">
                  {file?.name}
                </p>
              </motion.div>
            )}

            {processing && <ProcessingSteps currentStep={step} />}

            <Button
              onClick={process}
              disabled={!file || processing}
              className="w-full h-11 text-sm rounded-[12px]"
            >
              {processing ? "Processing…" : "Process Image"}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="rounded-[18px] border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-3">
                Processed Image
              </p>
              <div className="checker-bg rounded-xl overflow-hidden">
                <img
                  src={result.processedUrl}
                  alt="Processed"
                  className="max-h-72 mx-auto object-contain"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                readOnly
                value={result.processedUrl}
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyUrl}
                aria-label="Copy URL"
              >
                <Link2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={result.processedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={downloadImage}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Save
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
              </Button>
            </div>

            <Button
              variant="secondary"
              className="w-full h-10 rounded-[10px] text-sm"
              onClick={reset}
            >
              <ImageIcon className="mr-1.5 h-3.5 w-3.5" /> Process another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

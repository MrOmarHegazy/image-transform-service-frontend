import { useState, useRef, useCallback } from "react";
import { uploadImage, deleteImage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ProcessingSteps from "./ProcessingSteps";
import { Upload, Copy, ExternalLink, Download, Trash2, ImageIcon, FileImage } from "lucide-react";
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
      toast({ title: "Invalid file type", description: "Only JPG, PNG, and WebP are supported.", variant: "destructive" });
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
      toast({ title: "Processed image is ready." });
      onImageChange();
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setStep(-1);
      toast({ title: "Processing failed", description: err.message, variant: "destructive" });
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
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const copyUrl = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.processedUrl);
    toast({ title: "URL copied!" });
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
    setStep(-1);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Upload */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className={`drop-zone rounded-2xl p-12 text-center cursor-pointer transition-all ${dragOver ? "active" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload image"
                onKeyDown={e => e.key === "Enter" && fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                    <Upload className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Drop an image here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG, or WebP</p>
                  </div>
                </div>
              </div>

              {preview && file && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 glass rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <img src={preview} alt="Preview" className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {processing && <ProcessingSteps currentStep={step} />}

              <button
                onClick={process}
                disabled={!file || processing}
                className="w-full h-12 mt-6 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {processing ? "Processing…" : "Process image"}
              </button>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={reset}
                className="w-full h-12 rounded-2xl border border-border text-foreground font-medium hover:bg-secondary/60 transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="h-4 w-4" /> Process another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Result */}
      <div className="flex items-start">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-5"
            >
              <div className="rounded-2xl border border-border overflow-hidden checker-bg">
                <img src={result.processedUrl} alt="Processed" className="w-full max-h-[400px] object-contain" />
              </div>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={result.processedUrl}
                  className="flex-1 h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm font-mono text-foreground truncate focus:outline-none"
                />
                <button
                  onClick={copyUrl}
                  className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
                  aria-label="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={result.processedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-4 rounded-xl border border-border text-sm flex items-center gap-2 text-foreground hover:bg-secondary/60 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
                <a
                  href={result.processedUrl}
                  download
                  className="h-9 px-4 rounded-xl border border-border text-sm flex items-center gap-2 text-foreground hover:bg-secondary/60 transition-all"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
                <button
                  onClick={handleDelete}
                  className="h-9 px-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 hover:bg-destructive/20 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileImage className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Your processed image will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

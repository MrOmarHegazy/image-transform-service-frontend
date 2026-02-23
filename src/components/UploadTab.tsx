import { useState, useRef, useCallback } from "react";
import { uploadImage, deleteImage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProcessingSteps from "./ProcessingSteps";
import { Upload, Copy, ExternalLink, Download, Trash2, ImageIcon } from "lucide-react";
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
      toast({ title: "Image processed!", description: "Your transformed image is ready." });
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Drop zone */}
      {!result && (
        <>
          <div
            className={`drop-zone rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? "active" : ""}`}
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
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                <Upload className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="font-medium">Drop an image here or click to browse</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, or WebP</p>
            </div>
          </div>

          {preview && (
            <div className="rounded-xl border bg-card p-4 animate-fade-in">
              <p className="text-sm text-muted-foreground mb-2">Preview</p>
              <img src={preview} alt="Preview" className="rounded-lg max-h-64 mx-auto object-contain" />
              <p className="text-sm text-muted-foreground mt-2 truncate">{file?.name}</p>
            </div>
          )}

          {processing && <ProcessingSteps currentStep={step} />}

          <Button onClick={process} disabled={!file || processing} className="w-full h-12 text-base rounded-xl">
            {processing ? "Processing…" : "Process Image"}
          </Button>
        </>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-2">Processed Image</p>
            <img src={result.processedUrl} alt="Processed" className="rounded-lg max-h-80 mx-auto object-contain" />
          </div>

          <div className="flex gap-2">
            <Input readOnly value={result.processedUrl} className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyUrl} aria-label="Copy URL"><Copy className="h-4 w-4" /></Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href={result.processedUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Open
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={result.processedUrl} download>
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </a>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>

          <Button variant="secondary" className="w-full" onClick={() => { setResult(null); setFile(null); setPreview(null); setStep(-1); }}>
            <ImageIcon className="mr-2 h-4 w-4" /> Process Another
          </Button>
        </div>
      )}
    </div>
  );
}

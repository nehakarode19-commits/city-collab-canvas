import { useState, DragEvent } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

export function FileDropzone({ file, onChange, accept = ".pdf,.doc,.docx" }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onChange(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onChange(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-12 transition-all",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className={cn(
              "rounded-full p-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="text-lg font-medium mb-1">
                {isDragging ? "Drop file here" : "Drag and drop file here"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">or</p>
              <label htmlFor="file-upload">
                <div className="inline-flex items-center justify-center px-4 py-2 border border-primary/20 rounded-md text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer transition-colors">
                  Select a file
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX (Max 50MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3 flex-shrink-0">
              <File className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.type || "Unknown type"}</span>
                  </div>
                </div>
                <button
                  onClick={() => onChange(null)}
                  className="flex-shrink-0 p-1 hover:bg-destructive/10 rounded transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
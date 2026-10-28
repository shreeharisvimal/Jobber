import { useState, useRef, useCallback } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  dropzoneText?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onChange,
  disabled,
  className,
  dropzoneText = "Drop files here or click to browse",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `"${file.name}" exceeds the maximum size of ${formatFileSize(maxSize)}.`;
      }
      return null;
    },
    [maxSize],
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(newFiles);

      const validFiles: File[] = [];
      for (const file of fileArray) {
        const err = validateFile(file);
        if (err) {
          setError(err);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      const updated = multiple ? [...files, ...validFiles] : validFiles;
      const final = maxFiles ? updated.slice(0, maxFiles) : updated;
      setFiles(final);
      onChange?.(final);
    },
    [files, multiple, maxFiles, validateFile, onChange],
  );

  const removeFile = useCallback(
    (index: number) => {
      const updated = files.filter((_, i) => i !== index);
      setFiles(updated);
      onChange?.(updated);
    },
    [files, onChange],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors",
          "cursor-pointer",
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <Upload className="size-8 text-neutral-400" />
        <p className="text-sm text-neutral-600">{dropzoneText}</p>
        {accept && (
          <p className="text-xs text-neutral-400">Accepted: {accept}</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {error && (
        <p className="text-xs text-danger-600">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="size-4 shrink-0 text-neutral-400" />
                <span className="truncate text-sm text-neutral-700">{file.name}</span>
                <span className="shrink-0 text-xs text-neutral-400">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="shrink-0 rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { FileUpload };

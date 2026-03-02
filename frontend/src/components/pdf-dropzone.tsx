/*
  PDF DROPZONE COMPONENT
  =======================
  A drag-and-drop zone where users can upload PDF files.

  WHAT YOU'LL LEARN:
  - Drag-and-drop events in HTML/React (onDragOver, onDragLeave, onDrop)
  - File input with useRef (accessing DOM elements directly)
  - File validation (checking type and size)
  - Visual feedback states (idle, dragging over, file selected)

  HOW DRAG-AND-DROP WORKS IN THE BROWSER:
  1. User drags a file over the zone → onDragOver fires
  2. We call e.preventDefault() to allow dropping (browser blocks it by default!)
  3. User releases the file → onDrop fires
  4. We read the file from e.dataTransfer.files
  5. We validate it's a PDF and not too large
  6. We pass it up to the parent via onFileSelect
*/

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, X, FileText, Loader2 } from "lucide-react";

interface PdfDropzoneProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
}

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function PdfDropzone({ onFileSelect, isLoading }: PdfDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    /*
      useRef HOOK
      - Creates a reference to a DOM element
      - We use it to programmatically trigger the hidden <input type="file">
      - When user clicks "Browse files", we call fileInputRef.current.click()
      - This is a common pattern for custom file upload UIs
    */
    const fileInputRef = useRef<HTMLInputElement>(null);

    function validateFile(file: File): boolean {
        setError("");

        if (file.type !== "application/pdf") {
            setError("Only PDF files are supported");
            return false;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`);
            return false;
        }

        return true;
    }

    function handleFile(file: File) {
        if (validateFile(file)) {
            setSelectedFile(file);
        }
    }

    /*
      DRAG EVENT HANDLERS
      - preventDefault() is REQUIRED on onDragOver, otherwise browser
        won't allow the drop
      - stopPropagation() prevents the event from bubbling up to parent elements
    */
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
        }
    };

    /* Helper: format file size to human-readable string */
    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <div className="flex flex-col gap-3">
            {/* ── Hidden File Input ── */}
            {/*
        We hide the default <input type="file"> because it's ugly.
        Instead, we style our own drop zone and trigger this input
        programmatically via the ref.
        accept=".pdf" tells the browser's file picker to only show PDFs.
      */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {selectedFile ? (
                /* ── File Selected State ── */
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                        <FileText className="h-8 w-8 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="shrink-0 rounded-md p-1 hover:bg-muted"
                            aria-label="Remove file"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Summarizing...
                            </>
                        ) : (
                            "Summarize PDF"
                        )}
                    </Button>
                </div>
            ) : (
                /* ── Dropzone State ── */
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-all ${isDragging
                            ? "dropzone-active border-primary bg-primary/5"
                            : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
                        }`}
                >
                    <FileUp className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                        <p className="text-sm font-medium">
                            {isDragging ? "Drop your PDF here" : "Drag & drop a PDF"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            or click to browse · Max {MAX_FILE_SIZE_MB}MB
                        </p>
                    </div>
                </div>
            )}

            {/* ── Error Message ── */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}

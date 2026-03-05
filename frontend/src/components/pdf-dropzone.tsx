/*
  PDF DROPZONE COMPONENT — Refined
  ==================================
  Animated dashed border, bounce icon, gradient accent on file selection.
*/

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, X, FileText, Loader2, AlertCircle } from "lucide-react";

interface PdfDropzoneProps {
    onFileSelect: (file: File) => Promise<void>;
    isLoading: boolean;
}

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function PdfDropzone({ onFileSelect, isLoading }: PdfDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState("");
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

    const handleSubmit = async () => {
        if (selectedFile) {
            await onFileSelect(selectedFile);
        }
    };

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <div className="flex flex-col gap-3">
            {/* ── Hidden File Input ── */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {selectedFile ? (
                /* ── File Selected State ── */
                <div className="animate-fade-in-scale flex flex-col gap-3">
                    <div className="gradient-accent-left flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 pl-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)} · PDF Document
                            </p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="shrink-0 rounded-md p-1.5 transition-colors hover:bg-muted"
                            aria-label="Remove file"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="btn-gradient w-full border-0 text-white shadow-md"
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
                    className={`group flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${isDragging
                        ? "dropzone-active scale-[1.02] border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/40 hover:bg-muted/20"
                        }`}
                >
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${isDragging
                            ? "bg-primary/15 text-primary"
                            : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            }`}
                    >
                        <FileUp className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {isDragging ? "Drop your PDF here" : "Drag & drop a PDF"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            or{" "}
                            <span className="font-medium text-primary underline underline-offset-2">
                                browse files
                            </span>{" "}
                            · Max {MAX_FILE_SIZE_MB}MB
                        </p>
                    </div>
                </div>
            )}

            {/* ── Error Message ── */}
            {error && (
                <div className="animate-fade-in-scale flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

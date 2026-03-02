/*
  API CLIENT — Backend Communication
  ====================================
  This file contains all the functions that talk to our FastAPI backend.

  WHAT YOU'LL LEARN:
  - The Fetch API (how browsers make HTTP requests)
  - FormData for file uploads
  - TypeScript type definitions for API responses
  - Error handling patterns for API calls

  WHY A SEPARATE FILE?
  - Single source of truth for all API calls
  - Easy to change the base URL (e.g., when deploying)
  - Components don't need to know about HTTP details
  - Easier to add auth headers, retries, etc. later
*/

/*
  BASE URL
  - In development: our FastAPI runs on port 8000
  - In production: you'd change this to your deployed backend URL
  - Using a constant makes it easy to change in one place
*/
const API_BASE_URL = "http://localhost:8000";

/*
  RESPONSE TYPES
  These mirror the Pydantic models in the backend (schemas.py).
  TypeScript interfaces don't exist at runtime — they're purely
  for catching type errors during development.
*/
export interface SummaryResult {
    summary: string;
    action_items: string[];
    source_type: "pdf" | "youtube";
    source_name: string;
}

/*
  CUSTOM ERROR CLASS
  - Extends the built-in Error with extra API-specific info
  - status: HTTP status code (400, 422, 500, etc.)
  - This helps the UI show more specific error messages
*/
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

/*
  SUMMARIZE YOUTUBE VIDEO
  - Sends a POST request with JSON body: { url: "..." }
  - Returns the parsed summary result
  
  HOW fetch() WORKS:
  1. First argument: the URL to call
  2. Second argument: options object (method, headers, body)
  3. Returns a Promise that resolves to a Response object
  4. response.json() parses the JSON body
  
  IMPORTANT: fetch() does NOT throw on HTTP errors (4xx, 5xx).
  It only throws on network errors. So we must check response.ok manually.
*/
export async function summarizeYoutube(url: string): Promise<SummaryResult> {
    const response = await fetch(`${API_BASE_URL}/api/summarize/youtube`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Tell the server we're sending JSON
        },
        body: JSON.stringify({ url }), // Convert JS object → JSON string
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
            errorData?.detail?.message ||
            errorData?.detail ||
            "Failed to summarize YouTube video";
        throw new ApiError(message, response.status);
    }

    return response.json();
}

/*
  SUMMARIZE PDF
  - Sends a POST request with FormData (for file upload)
  - FormData is the browser's built-in way to send files
  
  WHY NOT JSON?
  JSON can only send text data. To send binary files (like PDFs),
  we use FormData which encodes the file as multipart/form-data.
  
  IMPORTANT: Do NOT set Content-Type header manually with FormData!
  The browser sets it automatically with the correct boundary string.
*/
export async function summarizePdf(file: File): Promise<SummaryResult> {
    const formData = new FormData();
    formData.append("file", file); // "file" must match the parameter name in FastAPI

    const response = await fetch(`${API_BASE_URL}/api/summarize/pdf`, {
        method: "POST",
        body: formData, // No Content-Type header — browser handles it!
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
            errorData?.detail?.message ||
            errorData?.detail ||
            "Failed to summarize PDF";
        throw new ApiError(message, response.status);
    }

    return response.json();
}

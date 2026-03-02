"""
PDF Service — PDF Text Extraction (Placeholder)
=================================================
This service will handle extracting text from uploaded PDF files.

WHAT WILL THIS DO? (Phase 2)
1. Receive the uploaded PDF bytes
2. Use pypdf to read and extract text from each page
3. Return the combined text for AI summarization

WHY pypdf?
- Pure Python (no system dependencies needed)
- Handles most PDF formats
- Lightweight and fast
"""


async def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text content from a PDF file.

    Args:
        file_bytes: Raw bytes of the uploaded PDF file

    Returns:
        Extracted text as a single string

    TODO (Phase 2):
        - Parse PDF using pypdf
        - Handle multi-page documents
        - Handle PDFs with images (OCR consideration)
    """
    # Placeholder — will be replaced with actual PDF parsing
    return "Extracted PDF text will appear here."

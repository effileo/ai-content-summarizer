"""
PDF Service — PDF Text Extraction
====================================
Extracts text from uploaded PDF files using pypdf.
"""

from io import BytesIO
from pypdf import PdfReader


async def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text content from a PDF file.

    Args:
        file_bytes: Raw bytes of the uploaded PDF file

    Returns:
        Extracted text as a single string

    Raises:
        ValueError: If the PDF has no extractable text
    """
    reader = PdfReader(BytesIO(file_bytes))

    pages_text = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages_text.append(text.strip())

    full_text = "\n\n".join(pages_text)

    if not full_text.strip():
        raise ValueError(
            "Could not extract text from this PDF. "
            "It may be a scanned document or image-only PDF."
        )

    return full_text

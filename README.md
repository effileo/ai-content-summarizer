# 🤖 AI Content Summarizer

An AI-powered content summarization tool that transforms PDFs and YouTube videos into structured summaries and actionable checklists using **Google Gemini AI**.

## ✨ Features

- 📄 **PDF Summarization** — Upload any PDF and get a structured summary
- 🎥 **YouTube Summarization** — Paste a YouTube URL and get key takeaways
- ✅ **Action Items** — Automatically extracts actionable tasks from content
- ⚡ **Fast & Smart** — Powered by Gemini 1.5 Flash for speed, Pro for depth

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 15 (App Router), Tailwind CSS, shadcn/ui |
| Backend    | Python FastAPI                      |
| AI Engine  | Google Generative AI (Gemini)       |
| PDF Parser | pypdf                               |
| Transcripts| youtube-transcript-api              |

## 📁 Project Structure

```
ai-content-summarizer/
├── frontend/          → Next.js 15 app (UI)
│   ├── src/app/       → App Router pages & layouts
│   └── src/components/→ Reusable UI components
├── backend/           → Python FastAPI (API)
│   ├── app/main.py    → Server entry point
│   ├── app/routers/   → API endpoints
│   ├── app/services/  → Business logic
│   └── app/models/    → Data schemas
└── README.md          → You are here!
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ ([download](https://nodejs.org/))
- **Python** 3.10+ ([download](https://python.org/))
- **Google Gemini API Key** ([get one](https://makersuite.google.com/app/apikey))

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Start the server
uvicorn app.main:app --reload
```

The API will be running at **http://localhost:8000**
Interactive docs at **http://localhost:8000/docs**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at **http://localhost:3000**

## 📝 License

MIT

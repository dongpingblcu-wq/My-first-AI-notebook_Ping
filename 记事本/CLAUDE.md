# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI-Powered Personal Notebook** - A modern, minimalist, AI-driven personal notebook web application with Apple-style UI. Features include intelligent text polishing, automatic title generation, and auto-tagging using OpenRouter AI services.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React + Shadcn/UI + Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Storage**: Browser Local Storage
- **AI Service**: OpenRouter API (deepseek/deepseek-chat-v3.1)
- **Styling**: Apple-style minimalist design with Tailwind CSS

## Project Structure

```
src/
├── app/
│   ├── api/ai/route.js          # AI processing API endpoint
│   ├── layout.js               # Root layout component
│   ├── page.js                 # Main application page
│   └── globals.css             # Global styles
├── components/
│   ├── sidebar.js              # Sidebar with create button
│   ├── note-list.js            # Note list display
│   ├── editor.js               # Main editor component
│   └── ui/                     # Shadcn/UI components
├── lib/
│   ├── utils.js                # Utility functions
│   └── storage.js              # Local storage operations
└── hooks/
    └── useNotes.js             # Notes state management hook
```

## Development Commands

### Setup
```bash
# Initialize Next.js project with Shadcn/UI
npx create-next-app@latest ai-personal-notebook --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install Shadcn/UI
npx shadcn-ui@latest init

# Install required components
npx shadcn-ui@latest add button textarea input badge tooltip resizable
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
```

### Environment Setup
Create `.env.local` file:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## Core Features Implementation

### 1. Note Management (CRUD)
- **Create**: `POST /api/notes` (local storage)
- **Read**: `GET /api/notes` (from local storage)
- **Update**: `PUT /api/notes/[id]` (local storage)
- **Delete**: `DELETE /api/notes/[id]` (local storage)

### 2. AI Features
- **Text Polishing**: `POST /api/ai` with `{ action: "polish", text: "..." }`
- **Title Generation**: `POST /api/ai` with `{ action: "generate_title", text: "..." }`
- **Tag Generation**: `POST /api/ai` with `{ action: "generate_tags", text: "..." }`

### 3. Data Models
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface AIRequest {
  action: 'polish' | 'generate_title' | 'generate_tags';
  text: string;
}

interface AIResponse {
  result: string | string[];
}
```

## Development Workflow

### Step 1: Project Initialization
1. Set up Next.js project with Shadcn/UI
2. Configure Tailwind CSS for Apple-style design
3. Set up environment variables

### Step 2: Static UI Development
1. Create three-column layout (Sidebar, NoteList, Editor)
2. Implement responsive design
3. Add Apple-style CSS variables and components

### Step 3: Core Note Functionality
1. Implement local storage operations
2. Create note CRUD operations
3. Set up React state management

### Step 4: AI Integration
1. Create `/api/ai` route handler
2. Implement OpenRouter API calls
3. Add error handling and loading states

### Step 5: Polish & Optimization
1. Add animations and transitions
2. Implement real-time saving
3. Add keyboard shortcuts
4. Optimize for mobile devices

## Key Implementation Details

### Local Storage Structure
```javascript
// Key: ai-notebook-notes
[
  {
    id: "unique-id",
    title: "My Note",
    content: "Note content...",
    tags: ["AI", "Development"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
]
```

### API Route Implementation
```javascript
// app/api/ai/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { action, text } = await request.json();
  
  const prompts = {
    polish: `你是一位专业的中文编辑...`,
    generate_title: `你是一位标题党大师...`,
    generate_tags: `你是一位内容分析专家...`
  };
  
  // OpenRouter API call implementation
}
```

### Apple-Style CSS Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

## Testing

```bash
# Unit tests
npm test

# E2E tests (when implemented)
npm run test:e2e

# Manual testing checklist:
# - Create new notes
# - Edit and save notes
# - Delete notes
# - Generate titles with AI
# - Polish text with AI
# - Generate tags with AI
# - Test responsive design
# - Test local storage persistence
```

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to other platforms
npm run start
```

## Common Issues & Solutions

1. **CORS with OpenRouter**: Ensure proper headers in API route
2. **Local Storage Limits**: Handle storage quota exceeded errors
3. **AI API Limits**: Implement rate limiting and error handling
4. **Mobile Responsiveness**: Test on various screen sizes
5. **Performance**: Optimize re-renders with React.memo and useMemo
# CalmSpark Portfolio

An Astro-based personal portfolio website with AI chat capabilities (DeepSeek V3 integration).

## Features

- **Modern Tech Stack**: Built with [Astro](https://astro.build/), React, and Tailwind CSS.
- **AI Integration**: Integrated DeepSeek V3 API for a personal AI assistant.
  - Streaming responses.
  - Context-aware (knows about your projects, skills, and blog posts).
  - **Auto-Navigation**: Can open pages (Blog, Works, etc.) upon user request.
- **Clean UI**: Flat, high-contrast design inspired by modern aesthetics (OPPO/VIVO style).
- **Responsive**: Fully responsive layout for all devices.
- **Dark Mode**: Built-in dark mode support.

## Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or PNPM

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

## Project Structure

- `src/pages`: Astro pages (Home, Works, About, Resume, Chat).
- `src/components`: React and Astro components.
- `src/data`: Shared data (siteData.ts) for consistency across the site and AI context.
- `src/layouts`: Base layouts.

## License

MIT

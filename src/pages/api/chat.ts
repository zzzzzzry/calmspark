import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { galleryItems, experience, skills, personalInfo } from '../../data/siteData';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.DEEPSEEK_API_KEY || import.meta.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('API Key is missing in environment variables');
    return new Response(JSON.stringify({ error: 'Missing API Key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { messages } = body;

    // 1. Fetch Blog Posts for Context
    let recentPosts: string[] = [];
    try {
      const posts = await getCollection('blog');
      recentPosts = posts
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
        .slice(0, 10)
        .map(p => `- Title: ${p.data.title}\n  Description: ${p.data.description}\n  Tags: ${p.data.tags?.join(', ')}`);
    } catch (e) {
      console.error('Failed to fetch blog posts for context:', e);
      // Continue without blog context
    }

    // 2. Format Portfolio Items
    const portfolioContext = galleryItems.map(item => 
      `- Project: ${item.title}\n  Category: ${item.category}\n  Description: ${item.desc}`
    ).join('\n');

    // 3. Format Resume Info
    const resumeContext = `
    Experience:
    ${experience.map(e => `- ${e.role} at ${e.company} (${e.period}): ${e.description}`).join('\n')}
    
    Skills:
    ${skills.map(s => s.name).join(', ')}
    `;

    // 4. Construct System Prompt
    const systemPrompt = `You are the AI assistant for ${personalInfo.name}'s portfolio website.
    
    **Your Persona:**
    - Name: AI Assistant (or 小码酱 if asked).
    - Tone: Calm, sincere, professional and focused. Do not act cute or overly enthusiastic. Keep replies clear, grounded and slightly minimalist.
    - Role: Help visitors understand ${personalInfo.name}'s work, skills, and thoughts.
    
    **User Profile:**
    - Name: ${personalInfo.name}
    - Role: ${personalInfo.role}
    - Bio: ${personalInfo.bio}
    - Status: ${personalInfo.status}
    - Contact: ${personalInfo.contact.email}
    
    **Portfolio Works (Projects/Photos):**
    ${portfolioContext}
    
    **Recent Blog Posts:**
    ${recentPosts.join('\n')}
    
    **Resume Highlights:**
    ${resumeContext}
    
    **Instructions:**
    - Answer questions based on the above information.
    - If asked about specific projects, use the details provided.
    - If the user asks about the tech stack, mention the skills listed.
    - Be concise but helpful.
    - You are speaking to a visitor of the website.

    **Capabilities (Navigation):**
    - You can navigate the user to internal pages by outputting a command at the end of your response: [[NAVIGATE: /path]].
    - Supported paths: /blog, /works, /about, /resume, /chat, /.
    - Use this ONLY when the user explicitly asks to open, go to, or see a specific page (e.g., "Open blog", "Show me your works").
    - Example: "Opening the blog for you. [[NAVIGATE: /blog]]"
    `;

    // Default to DeepSeek, fallback to OpenAI if needed, but the URL determines it.
    // Assuming DeepSeek for now as per plan.
    const apiUrl = 'https://api.deepseek.com/chat/completions';

    console.log(`Sending request to ${apiUrl} with key: ${apiKey.slice(0, 5)}...`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API Error:', response.status, response.statusText, errorText);
        return new Response(JSON.stringify({ error: `API Error: ${response.statusText}`, details: errorText }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Proxy the stream directly to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Internal Error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

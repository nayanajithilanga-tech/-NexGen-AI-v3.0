// ============================================================
// NexGen AI — Production Backend Server
// Node.js + Express + OpenAI API
// Author: Dilshan Nayanajith Ilangasinghe
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT) || 20;

// ── Security Middleware ───────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts for our SPA
}));
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

// ── Rate Limiting ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests. Please wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false
});

const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: DAILY_LIMIT,
  message: { error: `Daily AI limit of ${DAILY_LIMIT} requests reached. Come back tomorrow or upgrade to Pro!` },
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/", globalLimiter);

// ── Tool System Prompts ───────────────────────────────────────
const TOOL_PROMPTS = {
  youtube_title: `You are an expert YouTube SEO and content strategist with 10+ years experience.
Generate 10 highly clickable, SEO-optimized YouTube video titles.
Rules:
- Mix curiosity gaps, numbers, power words, emotional triggers
- Include titles optimized for BOTH search and click-through-rate
- Vary formats: listicles, how-tos, questions, bold statements
- Keep each under 70 characters when possible
- Label each: [CTR], [SEO], [Curiosity], [Story], [How-To], etc.
- End with: "💡 TOP PICK:" and 3 power words to use
Format as a clean numbered list.`,

  youtube_description: `You are a YouTube SEO expert who writes descriptions that rank and convert.
Write a complete YouTube video description (400-600 words) that:
- Opens with a strong hook (first 2 lines visible before "Show more")
- Contains natural keyword placement
- Includes chapters/timestamps section (use placeholder times like 0:00, 1:30, etc.)
- Has clear CTAs (subscribe, like, comment)
- Adds relevant hashtags (10-15 tags)
Make it engaging and platform-native.`,

  blog_post: `You are a professional SEO content writer and blogger.
Write a complete, publish-ready blog post for the given topic.
Structure:
1. Compelling H1 title (SEO-optimized)
2. Introduction (hook + what reader will learn)
3. Main body with H2/H3 headers (5-7 sections)
4. Key takeaways or summary
5. CTA at the end
6. Meta description (155 chars max)
7. SEO keywords used (list 5)
Write 800-1200 words. Make it genuinely valuable and human.`,

  seo_keywords: `You are an SEO strategist specializing in keyword research.
Generate a complete keyword strategy for the given topic:
1. PRIMARY KEYWORD (highest intent/volume)
2. 10 SECONDARY KEYWORDS (related, medium competition)
3. 10 LONG-TAIL KEYWORDS (lower competition, high intent)
4. 5 QUESTION KEYWORDS (for featured snippets)
5. 3 LOCAL SEO KEYWORDS (if applicable)
6. Competition level for each (Low/Med/High)
7. Content angle recommendation for ranking
Format clearly in sections.`,

  instagram_caption: `You are a top Instagram content strategist and copywriter.
Generate 5 distinct Instagram caption variations.
Each should:
- Open with a scroll-stopping first line
- Be 100-300 words
- Include storytelling, value, or entertainment
- End with a strong CTA
- Include 20-25 relevant hashtags (broad/niche/micro)
Label: [Storytelling], [Educational], [Motivational], [Relatable], [Bold]`,

  tiktok_hook: `You are a viral TikTok strategist.
Generate 10 powerful TikTok video hooks (first 3 seconds).
Each should:
- Create immediate curiosity, shock, or relatability
- Use pattern interrupts or bold claims
- Be conversational and TikTok-native
Format: numbered list with [type] label.
End with: Top Pick + Why It Works + Optimal Video Length.`,

  linkedin_post: `You are a LinkedIn ghostwriter who writes posts getting 100K+ impressions.
Write a high-performing LinkedIn post.
Structure:
- Hook line (no "I'm excited to announce")
- Story/insight (short paragraphs, LinkedIn whitespace is crucial)
- Key takeaway
- Engagement CTA (specific question)
- 5 hashtags
Also provide: 2 alternative opening hooks for A/B testing.
Tone: Professional but human.`,

  email_writer: `You are a world-class email copywriter.
Write a complete email package:
1. MAIN EMAIL:
   - Subject line + 2 A/B test alternatives
   - Preview text (90 chars)
   - Full email body (human, concise, action-oriented)
   - P.S. line if appropriate
2. FOLLOW-UP: 3-day follow-up version
3. SUBJECT LINE ANALYSIS: Why these will get opened
No corporate speak. Every sentence must earn its place.`,

  resume_builder: `You are an elite executive resume writer and career coach.
Generate complete ATS-optimized resume content:
1. Professional Summary (3-4 sentences)
2. 10 achievement-focused bullet points (STAR method, with metrics)
3. 15 ATS keywords for the role
4. Skills section (technical + soft skills)
5. LinkedIn headline suggestion
6. Elevator pitch (one-liner)
Format professionally. Make every word count.`,

  hashtag_generator: `You are a social media growth expert specializing in hashtag strategy.
Generate a complete hashtag strategy:
- 10 HIGH-VOLUME hashtags (1M+ posts)
- 10 MID-VOLUME hashtags (100K-1M posts)
- 10 MICRO hashtags (under 100K, highest engagement)
- 3 BRANDED/NICHE hashtags to own
- Optimal number per platform
- Pro tips + shadowban warnings
Explain the strategy behind the selection.`,

  tiktok_caption: `You are a TikTok growth specialist.
Write 5 TikTok caption variations:
- 100-150 characters each
- Include CTA for comments
- 1-3 relevant emojis
- 5-8 trending hashtags
Also suggest: Best posting time, thumbnail text, pinned comment idea.`,

  business_idea: `You are a startup advisor and serial entrepreneur.
Generate a complete business idea analysis for the given niche/interest:
1. TOP 5 BUSINESS IDEAS (with income potential)
2. For the BEST IDEA:
   - Business model explanation
   - Target market analysis
   - Startup costs estimate
   - Revenue streams (3 ways to earn)
   - First 30-day action plan
   - Tools/platforms needed
   - Realistic income timeline
3. QUICK WIN: One idea you can start this week with $0
Make it specific, actionable, and honest about challenges.`,

  chat: `You are NexGen AI — a powerful assistant for content creators, marketers, entrepreneurs, and freelancers.
You excel at: content creation, marketing strategy, SEO, growth tactics, brainstorming, and business advice.
Be direct, insightful, and genuinely helpful. Match tone to the question.
Use headers/bullets when it helps clarity. Always give more value than expected.`
};

// ── Input Validation ──────────────────────────────────────────
function validateInput(tool, inputs) {
  if (!tool || typeof tool !== "string") return "Invalid tool specified.";
  if (!inputs || typeof inputs !== "object") return "Invalid inputs.";
  
  const validTools = Object.keys(TOOL_PROMPTS);
  if (!validTools.includes(tool)) return "Unknown tool.";
  
  // Check for main input field
  const mainField = inputs.topic || inputs.message || inputs.role || inputs.context;
  if (!mainField || mainField.trim().length < 2) return "Please provide a topic or input.";
  if (mainField.length > 2000) return "Input too long. Keep it under 2000 characters.";
  
  return null;
}

// ── OpenAI API Call ───────────────────────────────────────────
async function callOpenAI(systemPrompt, userMessage, maxTokens = 1400) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: maxTokens,
      temperature: 0.82,
      presence_penalty: 0.1,
      frequency_penalty: 0.2
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ── Build User Message from Inputs ───────────────────────────
function buildUserMessage(tool, inputs) {
  const t = (v) => v || "";
  switch (tool) {
    case "youtube_title":
      return `Generate YouTube titles for: "${inputs.topic}"\nNiche: ${t(inputs.style)}\nAudience: ${t(inputs.audience) || "General viewers"}`;
    case "youtube_description":
      return `Write YouTube description for: "${inputs.topic}"\nVideo type: ${t(inputs.type) || "Educational"}\nChannel niche: ${t(inputs.niche)}`;
    case "blog_post":
      return `Write a blog post about: "${inputs.topic}"\nAudience: ${t(inputs.audience)}\nTone: ${t(inputs.tone) || "Informative and engaging"}`;
    case "seo_keywords":
      return `Generate keyword strategy for: "${inputs.topic}"\nIndustry: ${t(inputs.industry)}\nTarget: ${t(inputs.target) || "General audience"}`;
    case "instagram_caption":
      return `Write Instagram captions for: "${inputs.topic}"\nNiche: ${t(inputs.niche)}\nTone: ${t(inputs.tone) || "Engaging"}\nCTA goal: ${t(inputs.cta) || "Increase engagement"}`;
    case "tiktok_hook":
      return `Generate TikTok hooks for: "${inputs.topic}"\nStyle: ${t(inputs.style) || "Curiosity-driven"}\nFormat: ${t(inputs.format) || "Talking head"}`;
    case "linkedin_post":
      return `Write a LinkedIn post about: "${inputs.topic}"\nGoal: ${t(inputs.goal) || "Build thought leadership"}\nBackground: ${t(inputs.background) || "Industry professional"}`;
    case "email_writer":
      return `Write a ${t(inputs.type) || "professional"} email.\nContext: ${inputs.context || inputs.topic}\nRecipient: ${t(inputs.recipient) || "Professional"}\nGoal: ${t(inputs.outcome) || "Get a response"}`;
    case "resume_builder":
      return `Build resume content for: "${inputs.role || inputs.topic}"\nExperience: ${t(inputs.experience) || "3-5 years"}\nSkills: ${t(inputs.skills)}\nIndustry: ${t(inputs.industry)}`;
    case "hashtag_generator":
      return `Hashtag strategy for: "${inputs.topic}"\nPlatform: ${t(inputs.platform) || "Instagram"}\nNiche: ${t(inputs.niche)}`;
    case "tiktok_caption":
      return `TikTok captions for: "${inputs.topic}"\nStyle: ${t(inputs.style) || "Educational"}\nTarget: ${t(inputs.target) || "18-35 year olds"}`;
    case "business_idea":
      return `Business ideas for: "${inputs.topic}"\nBudget: ${t(inputs.budget) || "Low/bootstrapped"}\nSkills: ${t(inputs.skills) || "General"}\nLocation: ${t(inputs.location) || "Global/Online"}`;
    case "chat":
    default:
      return inputs.message || inputs.topic || "";
  }
}

// ── API Routes ────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!OPENAI_API_KEY,
    model: "gpt-4o-mini",
    dailyLimit: DAILY_LIMIT,
    timestamp: new Date().toISOString()
  });
});

// Main AI generation endpoint
app.post("/api/generate", aiLimiter, async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "Server not configured. Contact support." });
  }

  const { tool, inputs } = req.body;
  const validationError = validateInput(tool, inputs);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const systemPrompt = TOOL_PROMPTS[tool] || TOOL_PROMPTS.chat;
  const userMessage = buildUserMessage(tool, inputs);
  const maxTokens = ["blog_post", "resume_builder"].includes(tool) ? 2000 : 1400;

  try {
    const result = await callOpenAI(systemPrompt, userMessage, maxTokens);
    res.json({ result, tool, model: "gpt-4o-mini", timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(`[Generate Error] Tool: ${tool}`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Chat endpoint
app.post("/api/chat", aiLimiter, async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "Server not configured." });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing messages array." });
  }
  if (messages.length > 50) {
    return res.status(400).json({ error: "Too many messages in history." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: TOOL_PROMPTS.chat },
          ...messages.slice(-20) // Keep last 20 messages for context
        ],
        max_tokens: 1500,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || "OpenAI error");
    }

    const data = await response.json();
    res.json({ result: data.choices[0].message.content, model: "gpt-4o-mini" });
  } catch (err) {
    console.error("[Chat Error]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Blog posts API
app.get("/api/blog", (req, res) => {
  const blogDir = path.join(__dirname, "blog-posts");
  try {
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".json"));
    const posts = files.map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(blogDir, f), "utf8"));
      return {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        date: data.date,
        readTime: data.readTime,
        image: data.image
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(posts);
  } catch {
    res.json([]);
  }
});

app.get("/api/blog/:slug", (req, res) => {
  const blogDir = path.join(__dirname, "blog-posts");
  try {
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".json"));
    for (const f of files) {
      const data = JSON.parse(fs.readFileSync(path.join(blogDir, f), "utf8"));
      if (data.slug === req.params.slug) {
        return res.json(data);
      }
    }
    res.status(404).json({ error: "Post not found" });
  } catch {
    res.status(500).json({ error: "Could not load post" });
  }
});

// Serve SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ NexGen AI server running at http://localhost:${PORT}`);
  console.log(`   OpenAI key: ${OPENAI_API_KEY ? "✅ Set" : "❌ NOT SET — add OPENAI_API_KEY to .env"}`);
  console.log(`   Model: gpt-4o-mini`);
  console.log(`   Daily limit: ${DAILY_LIMIT} requests/IP\n`);
});

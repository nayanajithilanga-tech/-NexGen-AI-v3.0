# ⚡ NexGen AI — Production-Ready AI SaaS Platform

A complete, production-ready AI tools + blog website built for content creators, marketers, and freelancers. Built for Google ranking, AdSense approval, and passive income generation.

**Author:** Dilshan Nayanajith Ilangasinghe  
**Email:** nayanajithilangasinghe2002@gmail.com  
**Version:** 3.0.0

---

## 🗂 Project Structure

```
nexgen-ai/
├── server.js               ← Node.js + Express backend
├── package.json            ← Dependencies
├── .env.example            ← Environment variable template
├── .gitignore              ← Git ignore rules
├── README.md               ← This file
├── public/
│   ├── index.html          ← Complete SPA frontend
│   ├── sitemap.xml         ← SEO sitemap
│   └── robots.txt          ← Search engine rules
└── blog-posts/
    ├── best-ai-tools-2026.json
    ├── make-money-online-ai-2026.json
    ├── youtube-growth-tips-2026.json
    ├── seo-guide-beginners-2026.json
    ├── tiktok-algorithm-strategy-2026.json
    ├── freelancing-guide-2026.json
    ├── passive-income-ideas-2026.json
    ├── instagram-marketing-guide-2026.json
    ├── linkedin-growth-strategy-2026.json
    └── best-online-business-ideas-2026.json
```

---

## ✅ Features Included

### 🤖 AI Tools (12 total)
| Tool | Use Case |
|------|----------|
| YouTube Title Generator | 10 SEO + CTR optimized titles |
| YouTube Description Writer | Full descriptions with chapters |
| Instagram Caption Generator | 5 styles + hashtag strategy |
| TikTok Hook Generator | 10 viral opening hooks |
| Blog Post Generator | Complete SEO-optimized posts |
| SEO Keyword Generator | Primary + long-tail + LSI keywords |
| LinkedIn Post Writer | Thought leadership content |
| Email Writer | Full emails + subject lines + follow-ups |
| Resume Builder | ATS-optimized content |
| Hashtag Strategy Generator | 30 hashtags across 3 tiers |
| TikTok Caption Writer | Captions + posting tips |
| Business Idea Generator | Complete idea analysis + action plan |

### 📝 Blog System (10 articles)
- Best AI Tools 2026
- Make Money Online with AI
- YouTube Growth Strategy
- SEO Guide for Beginners
- TikTok Algorithm Strategy
- Complete Freelancing Guide
- Passive Income Ideas
- Instagram Marketing Guide
- LinkedIn Growth Strategy
- Best Online Business Ideas

### 🔍 SEO Features
- XML Sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Open Graph meta tags
- Twitter Card meta tags
- Schema.org structured data
- Keyword-optimized blog content
- Internal linking system
- AdSense-ready ad placements

### 📱 UI/UX
- Dark/Light mode toggle
- Mobile-first responsive design
- 4-language support (EN/SI/HI/ES)
- Smooth animations
- Single Page Application (SPA)

### 🔒 Backend Security
- Rate limiting (20 AI calls/day/IP)
- Global API rate limiter (100 req/15 min)
- Input validation and sanitization
- Helmet.js security headers
- Server-side API key handling

### 📄 AdSense Pages
- About Us (with owner details)
- Privacy Policy (GDPR-compliant)
- Terms & Conditions
- Contact Page

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Prerequisites
- **Node.js** v18+ — https://nodejs.org
- **OpenAI API key** — https://platform.openai.com/api-keys

### Step 2: Set Up Project
```bash
# Clone or create the project folder
mkdir nexgen-ai && cd nexgen-ai

# Copy all files into this directory maintaining the structure above
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your API key
# On Linux/Mac:
nano .env

# Set your OpenAI key:
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3000
NODE_ENV=production
DAILY_LIMIT=20
```

### Step 5: Start the Server
```bash
node server.js
```

Expected output:
```
✅ NexGen AI server running at http://localhost:3000
   OpenAI key: ✅ Set
   Model: gpt-4o-mini
   Daily limit: 20 requests/IP
```

### Step 6: Open Your Site
Visit: **http://localhost:3000**

---

## 🌐 Deployment

### Option A: Railway (Recommended — Easiest)
1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables:
   - `OPENAI_API_KEY=sk-your-key`
   - `NODE_ENV=production`
   - `DAILY_LIMIT=20`
4. Railway auto-deploys. Get your URL, update sitemap.xml with the real domain.

### Option B: Render
1. Push to GitHub
2. New Web Service at https://render.com
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add `OPENAI_API_KEY` in Environment settings

### Option C: VPS (DigitalOcean/Linode/Vultr)
```bash
# On your server
git clone your-repo
cd nexgen-ai
npm install
cp .env.example .env
nano .env  # add your key

# Install PM2 for production
npm install -g pm2
pm2 start server.js --name nexgen-ai
pm2 startup  # auto-start on reboot
pm2 save
```

---

## 💰 Monetization Setup

### Google AdSense
1. Deploy your site to a real domain
2. Add quality content (already done with 10 blog posts)
3. Apply at https://adsense.google.com
4. Replace the ad placeholder divs in `index.html` with your AdSense code:

```html
<!-- Find these divs in index.html and replace with your AdSense code -->
<div class="ad-slot">
  <!-- Replace this with your actual AdSense code: -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-YOURCODE" ...></ins>
```

### AdSense Approval Checklist
- ✅ Privacy Policy page (included)
- ✅ Terms & Conditions page (included)
- ✅ About Us page (included)
- ✅ Contact page (included)
- ✅ 10+ quality blog articles (included)
- ✅ Original, valuable AI tools (included)
- ✅ Clean, professional design (included)
- ✅ No policy violations
- ⚠️ Deploy to real domain first
- ⚠️ Get some real traffic before applying
- ⚠️ Submit sitemap to Google Search Console

---

## 🔍 SEO Setup Checklist

After deployment:

1. **Update sitemap.xml** — Replace `nexgenai.tools` with your actual domain
2. **Google Search Console** — Add property, submit sitemap
3. **Google Analytics 4** — Add tracking code to `index.html` `<head>`
4. **Custom domain** — Get a .com domain and point to your deployment
5. **HTTPS** — Railway/Render provide free SSL

---

## 📝 Adding More Blog Posts

Create a new JSON file in `blog-posts/` following this structure:

```json
{
  "slug": "my-new-post",
  "title": "My New Blog Post Title",
  "excerpt": "Short description shown in blog grid...",
  "category": "Category Name",
  "date": "2026-03-01",
  "readTime": "7 min read",
  "image": "ai-tools",
  "metaDescription": "SEO meta description max 155 chars...",
  "keywords": ["keyword1", "keyword2"],
  "content": "<h2>Section 1</h2><p>Content here...</p>"
}
```

The blog automatically picks up new JSON files — no code changes needed.

**Available image values:** `ai-tools`, `money-online`, `youtube-growth`, `seo-guide`, `tiktok-strategy`, `freelancing`, `passive-income`, `instagram-marketing`, `linkedin-strategy`, `business-ideas`

---

## ⚙️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | required | Your OpenAI API key |
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | `production` for deployment |
| `DAILY_LIMIT` | 20 | AI generations per IP per day |

To change the AI model, edit `server.js` line:
```js
model: "gpt-4o-mini",  // Change to "gpt-4o" for higher quality
```

---

## 💡 Tips for Success

- **Content:** Add a new blog post every week targeting "best [niche] tools 2026" keywords
- **Social media:** Share blog posts on Pinterest, Twitter/X for traffic
- **SEO:** Submit to Google Search Console within 24 hours of deployment
- **AdSense:** Apply after 15-20 real blog posts and some organic traffic
- **Model:** Use `gpt-4o-mini` for cost efficiency; switch to `gpt-4o` for premium quality
- **Domain:** Get a `.com` with keywords like `aitools`, `contenttools`, `nexgenai`

---

## 🔧 Cost Estimates

| Component | Cost |
|-----------|------|
| OpenAI gpt-4o-mini | ~$0.001-0.003 per tool use |
| Railway hosting | Free tier available |
| Custom domain | $10-15/year |
| **Total to start** | **~$10-15/year** |

At 100 daily active users: ~$1-5/day in API costs, offset by AdSense revenue.

---

Created with ❤️ by Dilshan Nayanajith Ilangasinghe  
NexGen AI v3.0 — Built for global reach and passive income

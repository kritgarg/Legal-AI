# 🏛️ LegalEase AI

> **Making legal documents understandable for everyone**

LegalEase AI is an intelligent document analysis platform that transforms complex legal documents into plain-English summaries with risk assessments. Upload your contracts, agreements, or legal documents and get instant AI-powered insights.

## 🚀 Project Overview

LegalEase AI leverages advanced AI technology to:
- Extract text from PDF and TXT documents
- Generate comprehensive summaries in bullet points
- Assess risk levels (Safe, Moderate, High)
- Identify specific risk factors with explanations
- Provide interactive chat for document-specific questions

Perfect for individuals, small businesses, and anyone who needs to understand legal documents without hiring expensive lawyers.



## Demo

https://legal-ai-peach.vercel.app/




## ✨ Features

### 📄 **Document Processing**
- **Multi-format Support**: PDF and TXT file uploads (up to 2MB)
- **Advanced Text Extraction**: Multiple extraction methods for maximum compatibility
- **Smart Fallbacks**: Handles various PDF types including complex layouts

### 🤖 **AI-Powered Analysis**
- **Plain-English Summaries**: Complex legal jargon translated to understandable language
- **Risk Assessment**: Automated risk level evaluation with detailed explanations
- **Risk Flagging**: Identifies specific clauses that need attention
- **Context-Aware**: Understands legal document structure and terminology

### 💬 **Interactive Chat**
- **Document Q&A**: Ask specific questions about your uploaded document
- **Contextual Responses**: AI answers based on the analyzed document content
- **Real-time Interaction**: Instant responses powered by Gemini AI

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Glassmorphism Effects**: Beautiful, modern interface with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions
- **Dark Theme**: Easy on the eyes with professional appearance

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.1** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### **Backend & APIs**
- **Next.js API Routes** - Serverless backend functions
- **Formidable** - File upload handling
- **PDF Processing**:
  - `pdf-parse` - Primary PDF text extraction
  - `pdfjs-dist` - Advanced PDF parsing fallback
- **Google Gemini AI** - Document analysis and chat responses

### **Deployment & Infrastructure**
- **Vercel** - Hosting and deployment platform
- **Edge Functions** - Serverless API endpoints
- **Environment Variables** - Secure API key management

## 📂 Project Structure

```
legalai-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── chat/              # Chat page
│   │   ├── privacy/           # Privacy policy page
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   │   ├── Navbar.jsx    # Navigation component
│   │   │   └── resizable-navbar.jsx
│   │   ├── chat.jsx          # Main chat interface
│   │   ├── Hero.jsx          # Landing page hero
│   │   ├── Footer.jsx        # Footer component
│   │   └── ...               # Other components
│   ├── lib/                  # Utility functions
│   │   ├── utils.js          # General utilities
│   │   └── pdfReader.js      # PDF processing utilities
│   └── pages/api/            # API routes
│       ├── extract.js        # Document processing endpoint
│       ├── chat.js           # Chat API endpoint
│       └── analyse/          # Analysis endpoints
├── public/                   # Static assets
│   ├── Logo.svg             # Application logo
│   └── logo.png             # Alternative logo format
├── .env.local               # Environment variables (not in repo)
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## ⚙️ Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager
- Google Gemini API key

### **1. Clone the Repository**
```bash
git clone https://github.com/kritgarg/Legal-AI.git
cd Legal-AI
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Environment Setup**
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

### **4. Verify Installation**
```bash
npm run dev
```
Visit `http://localhost:3000` to see the application running.

## ▶️ Running the App

### **Development Mode**
```bash
npm run dev
```
- Runs on `http://localhost:3000`
- Hot reload enabled
- Development optimizations

### **Production Build**
```bash
npm run build
npm start
```

### **Type Checking**
```bash
npm run type-check
```

### **Linting**
```bash
npm run lint
```

## 🌐 Deployment (Vercel)

### **Automatic Deployment**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key
4. Deploy automatically on every push to main branch

### **Manual Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add GEMINI_API_KEY
```

### **Environment Variables for Production**
In your Vercel dashboard, add:
- `GEMINI_API_KEY`: Your Google Gemini API key

## 📸 Screenshots (Optional)

*Coming soon - Add screenshots of your application in action*

## ⚖️ Disclaimer

**Important Legal Notice:**

- This tool provides AI-generated analysis for informational purposes only
- **NOT a substitute for professional legal advice**
- Always consult qualified legal professionals for important legal matters
- No attorney-client relationship is created by using this service
- Users are responsible for verifying all information
- The developers assume no liability for decisions made based on AI analysis

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙌 Contributing

We welcome contributions! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Contribution Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### **Areas for Contribution**
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔧 Performance optimizations

## ❓ FAQ

### **General Questions**

**Q: What types of documents can I upload?**
A: Currently supports PDF and TXT files up to 2MB. Works best with text-based PDFs rather than scanned images.

**Q: Is my document data secure?**
A: Documents are processed temporarily and not stored permanently. However, they are sent to Google's Gemini AI for analysis.

**Q: How accurate is the AI analysis?**
A: The AI provides helpful insights but should not replace professional legal review for important documents.

### **Technical Questions**

**Q: Why is my PDF not being processed?**
A: This usually happens with scanned PDFs or image-based documents. Try using a text-based PDF or convert your document first.

**Q: Can I run this locally without an API key?**
A: No, the Gemini API key is required for document analysis and chat functionality.

**Q: How do I report a bug?**
A: Please open an issue on GitHub with detailed steps to reproduce the problem.

### **Development Questions**

**Q: How do I add a new document format?**
A: Extend the file processing logic in `/src/pages/api/extract.js` and update the file input accept types.

**Q: Can I use a different AI model?**
A: Yes, modify the API endpoints to use different AI services. The current implementation uses Google Gemini.

**Q: How do I customize the UI theme?**
A: Edit the Tailwind CSS classes in components and update the color scheme in `tailwind.config.js`.

---

**Made with ❤️ by [Krit Garg](https://github.com/kritgarg)**

*Empowering everyone to understand legal documents through AI*

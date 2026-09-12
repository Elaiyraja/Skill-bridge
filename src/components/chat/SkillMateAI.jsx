import React, { useState, useEffect, useRef } from 'react';

const SUGGESTED_PROMPTS = [
  "What is Python and why should I learn it?",
  "How do I create my first freelance profile?",
  "Explain HTML and CSS simply for a beginner",
  "Give me a step-by-step learning roadmap for Web Development",
  "How do I prepare for an entry-level job interview?",
  "What courses should I start with if I have no experience?",
  "Canva vs Photoshop — which is better for freelancing?",
  "HTML & CSS தமிழில் விளக்குங்கள் (Explain HTML/CSS in Tamil)"
];

// Offline expert tutor responses for fast, resilient, client-safe learning guidance
const getKnowledgeBaseReply = (query, language) => {
  const q = query.toLowerCase();

  const isTamil = language === "Tamil" || /[\u0B80-\u0BFF]/.test(query) || q.includes("tamil");

  if (isTamil) {
    if (q.includes("html") || q.includes("css") || q.includes("web")) {
      return `வணக்கம்! Web Development தொடங்குவதற்கு HTML மற்றும் CSS மிகவும் முக்கியம்:\n\n1. **HTML (HyperText Markup Language)**: ஒரு வீட்டின் கட்டமைப்பு (சுவர்கள், கதவுகள்) போன்றது. வலைப்பக்கத்தின் தலைப்பு (Heading), பத்திகள் (Paragraphs), படங்கள் மற்றும் இணைப்புகளை உருவாக்கும்.\n2. **CSS (Cascading Style Sheets)**: வீட்டின் வண்ணம் (Paint) மற்றும் அலங்காரம் போன்றது. எழுத்துருக்கள் (Fonts), நிறங்கள் (Colors), மற்றும் மொபைல் வடிவம் (Responsive layout) ஆகியவற்றை அமைக்கும்.\n\n💡 **SkillBridge பரிந்துரை**: நமது இலவச **"HTML & CSS"** பாடத்தை முடித்த பிறகு, ஒரு சிறிய Portfolio இணையதளத்தை உருவாக்கி Freelance செய்ய தொடங்குங்கள்!`;
    }
    if (q.includes("python") || q.includes("பைதான்")) {
      return `பைதான் (Python) என்பது மிகவும் எளிமையான மற்றும் சக்திவாய்ந்த கணினி நிரலாக்க மொழி (Programming Language) ஆகும்:\n\n• **ஏன் கற்க வேண்டும்?**: இது ஆங்கிலம் போன்றே எளிதாக வாசிக்கக்கூடிய தொடரியல் (Syntax) கொண்டது.\n• **பயன்கள்**: இணையதள உருவாக்கம், தரவு பகுப்பாய்வு (Data Analytics), ஆட்டோமேஷன் (Automation), மற்றும் AI.\n\nSkillBridge-ல் உள்ள 8 வார இலவச **"Python"** பாடத்தை இன்றே தொடங்குங்கள்!`;
    }
    if (q.includes("freelance") || q.includes("ப்ரீலான்ஸ்") || q.includes("project")) {
      return `ப்ரீலான்சிங் (Freelancing) தொடங்க எளிய வழிகள்:\n\n1. முதலில் ஒரு குறிப்பிட்ட திறமையை (उदा: Canva Design, HTML/CSS, Excel Data Entry) நன்றாகக் கற்றுக் கொள்ளுங்கள்.\n2. 2 முதல் 3 மாதிரி திட்டங்களை (Sample Projects) உருவாக்கி உங்கள் Portfolio-வை உருவாக்குங்கள்.\n3. SkillBridge "Projects" பக்கத்தில் உள்ள சிறிய திட்டங்களுக்கு (Micro-projects) ஏலம் (Proposal) கேளுங்கள்.\n4. வாடிக்கையாளரிடம் பணிவாகவும், குறித்த நேரத்தில் வேலையை முடித்து தரவும் உறுதி செய்யுங்கள்!`;
    }
    return `வணக்கம்! நான் SkillBridge-ன் **SkillMate AI** வழிகாட்டி. 😊\n\nநீங்கள் எந்த பாடத்தை கற்க விரும்புகிறீர்கள்? (Python, HTML/CSS, MS Office, Data Analytics, அல்லது Freelancing) என்று என்னிடம் கேளுங்கள், நான் உங்களுக்கு எளிய முறையில் விளக்குகிறேன்!`;
  }

  // English Knowledge Engine
  if (q.includes("roadmap") || (q.includes("web") && q.includes("developer"))) {
    return `Here is your step-by-step **Web Development Roadmap for Beginners**:\n\n1. **Step 1: HTML & CSS (4-5 weeks)**\n   • Semantic markup, forms, flexbox, CSS grid, and mobile responsiveness.\n   • Build: A personal portfolio & a local shop landing page.\n\n2. **Step 2: JavaScript Essentials (5-6 weeks)**\n   • DOM manipulation, events, arrays, objects, and Fetch API.\n   • Build: Interactive Todo app, weather dashboard.\n\n3. **Step 3: Freelance Readiness (2 weeks)**\n   • Hosting on GitHub Pages, writing proposals, delivering clean code.\n   • Apply to the open micro-projects right here on SkillBridge!\n\nAll courses are 100% free on SkillBridge. Check out **HTML & CSS (Course #5)** to begin.`;
  }

  if (q.includes("python")) {
    return `**Why learn Python in 2025/2026?**\n\n• **Beginner-Friendly**: Python reads almost like plain English. You write fewer lines of code compared to Java or C++.\n• **High Demand**: Used in Automation, Data Analytics, AI/Machine Learning, and Web Backends.\n• **Real Projects**: You can write scripts to clean Excel files, organize folders, or scrape website data in just a few lessons.\n\n👉 Start with our free **Python Course (#7)** on SkillBridge — it covers variables, loops, file processing, and hands-on automation!`;
  }

  if (q.includes("freelance") || q.includes("profile") || q.includes("proposal")) {
    return `Here are 4 golden rules for winning your first freelance gig on SkillBridge:\n\n1. **Build Proof First**: Clients don't just hire resumes; they hire proof. Build 2-3 clean demo projects (e.g. portfolio site, Canva social media banner pack).\n2. **Personalize Every Proposal**: Mention the client's business name and summarize their problem in your first 2 sentences. Don't copy-paste generic templates.\n3. **Start with Micro-Gigs**: Bid on projects in the ₹300–₹1,500 range to earn positive reviews and build confidence.\n4. **Deliver Ahead of Deadline**: Clear communication and on-time delivery turn first-time clients into repeat clients.`;
  }

  if (q.includes("html") || q.includes("css")) {
    return `**HTML and CSS explained simply**:\n\n• **HTML (Structure)**: Imagine building a house — HTML is the bricks, doors, and window frames. In code, it creates headings, paragraphs, buttons, and image tags.\n• **CSS (Styling)**: CSS is the interior paint, floor tiles, and curtains. It decides what color buttons are, how big text looks, and how elements re-align nicely on a mobile screen.\n\nTogether, they are the foundational language of the entire web. Ready to build your first page? Head to **Courses → HTML & CSS**!`;
  }

  if (q.includes("interview") || q.includes("job")) {
    return `Key steps to ace an entry-level job interview:\n\n1. **Master the STAR Method** for behavioral questions:\n   • **S**ituation: What was the context?\n   • **T**ask: What was your objective?\n   • **A**ction: What specific steps did you take?\n   • **R**esult: What positive outcome did you achieve?\n2. **Know Your Projects**: Be ready to walk through any project listed on your resume line-by-line.\n3. **Prepare Questions for the Interviewer**: Asking *"What does a typical day look like for someone in this role?"* demonstrates high engagement.\n\nEnroll in our free **"Interview Preparation" Course (#17)** for guided mock sessions!`;
  }

  if (q.includes("beginner") || q.includes("start") || q.includes("first")) {
    return `If you are starting completely fresh, here is the recommended sequence:\n\n1. **Computer Basics (#1)** or **MS Office (#2)** — Build foundational comfort with files, typing, and spreadsheets.\n2. **English Basics (#4)** & **Communication Skills (#3)** — Sharpen confidence for client interactions and interviews.\n3. **Choose Your Technical Track**:\n   • *For Web*: HTML & CSS (#5)\n   • *For Programming & Logic*: Python (#7)\n   • *For Quick Design Gigs*: Canva (#14) & Graphic Design (#12)\n\nAll courses are free, self-paced, and include completion certificates!`;
  }

  if (q.includes("canva")) {
    return `**Canva vs Photoshop for Freelancers**:\n\n• **Canva**: Extremely fast, web-based, pre-built templates for Instagram, YouTube thumbnails, and flyers. Perfect for beginners to start delivering paid client work within 1–2 weeks.\n• **Photoshop/Illustrator**: Powerful for custom typography, photo manipulation, and complex vector art, but has a steep learning curve.\n\n💡 **Tip**: Most small local businesses just need clean, quick banners. You can earn very well starting with Canva! Check our free **Canva Course (#14)**.`;
  }

  return `Great question! As your SkillBridge learning mentor, I recommend breaking this down into hands-on practice:\n\n1. Review the foundational concepts in our free course catalog.\n2. Work through the lesson exercises and quizzes.\n3. Apply what you've learned to one of our open micro-projects to gain real client experience.\n\nWould you like me to recommend a specific course or explain any technical concept in detail?`;
};

export const SkillMateAI = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "வணக்கம்! I'm SkillMate AI — your dedicated learning companion on SkillBridge. 😊\n\nI can help you:\n• Master course concepts in English or Tamil\n• Step-by-step roadmap advice\n• Debug coding doubts\n• Prepare winning freelance proposals\n• Interview tips and resume guidance\n\nWhat would you like to explore today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setLoading(true);

    // Check if an external backend AI proxy is configured via environment variable
    const aiEndpoint = import.meta.env.VITE_AI_API_ENDPOINT;

    if (aiEndpoint) {
      try {
        const response = await fetch(aiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: query }],
            language
          })
        });
        const data = await response.json();
        const reply = data.reply || data.content || getKnowledgeBaseReply(query, language);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setLoading(false);
        return;
      } catch (err) {
        console.warn("External AI endpoint unreachable, using embedded tutor engine:", err);
      }
    }

    // High-fidelity embedded learning tutor
    setTimeout(() => {
      const response = getKnowledgeBaseReply(query, language);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div style={{ background: "var(--primary-dark)", padding: "18px 24px", flexShrink: 0 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 860 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), #ff9f2b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
                SkillMate AI
                <span style={{ fontSize: 11, background: "rgba(42, 157, 92, 0.3)", color: "#7FE7A8", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>
                  Active Mentor
                </span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                Bilingual Learning & Career Companion (English / தமிழ்)
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer"
              }}
              aria-label="Select AI Language"
            >
              <option value="English" style={{ color: "#000" }}>English</option>
              <option value="Tamil" style={{ color: "#000" }}>தமிழ் (Tamil)</option>
            </select>
            <button
              className="sb-btn sb-btn-sm"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "none" }}
              onClick={() =>
                setMessages([
                  {
                    role: "assistant",
                    content: "Chat cleared! What concept or question can I help you with today?"
                  }
                ])
              }
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: 12,
                  alignItems: "flex-end"
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--accent), #ff9f2b)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0
                    }}
                  >
                    🤖
                  </div>
                )}
                <div
                  className={`chat-bubble-${msg.role === "user" ? "user" : "ai"}`}
                  style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), #ff9f2b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16
                  }}
                >
                  🤖
                </div>
                <div className="chat-bubble-ai" style={{ display: "flex", gap: 6, alignItems: "center", padding: "14px 20px" }}>
                  <span className="typing-dot" style={{ animationDelay: "0s" }} />
                  <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
                  <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div style={{ padding: "0 24px 12px", flexShrink: 0 }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
              Try asking:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTED_PROMPTS.slice(0, 5).map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  style={{
                    padding: "6px 14px",
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    fontSize: 12,
                    color: "var(--text-mid)",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-mid)";
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div style={{ padding: "16px 24px", background: "#fff", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <div className="container" style={{ maxWidth: 860, display: "flex", gap: 12 }}>
          <input
            className="input-field"
            placeholder={
              language === "Tamil"
                ? "SkillMate-யிடம் பாடங்கள், திட்டங்கள் பற்றி கேளுங்கள்..."
                : "Ask SkillMate anything about courses, coding, proposals, or interview prep..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            style={{ flex: 1 }}
          />
          <button
            className="sb-btn sb-btn-primary"
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            style={{ padding: "10px 22px", opacity: loading || !input.trim() ? 0.6 : 1 }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

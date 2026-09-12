import React from 'react';

export const Icon = ({ name, size = 16, style = {} }) => {
  const icons = {
    home: "🏠", courses: "📚", projects: "💼", about: "ℹ️", stories: "⭐",
    ai: "🤖", login: "🔑", join: "🚀", menu: "☰", close: "✕",
    check: "✓", arrow: "→", star: "★", clock: "⏱", users: "👥",
    cert: "🏆", chart: "📊", book: "📖", code: "💻", design: "🎨",
    marketing: "📣", data: "📈", career: "🎯", rupee: "₹", dollar: "₹",
    send: "➤", chat: "💬", shield: "🛡", heart: "❤", globe: "🌐",
    mail: "✉", phone: "📞", play: "▶", quiz: "❓", assign: "📝",
    search: "🔍", filter: "⚙", eye: "👁", edit: "✏", trash: "🗑",
    plus: "+", dashboard: "⊞", profile: "👤", settings: "⚙", logout: "⏏",
    freelance: "💡", mentor: "🎓", client: "🏢", admin: "🔧",
    verify: "✅", download: "⬇", share: "↗", fire: "🔥"
  };

  return (
    <span style={{ fontSize: size, display: "inline-flex", alignItems: "center", lineHeight: 1, ...style }} aria-hidden="true">
      {icons[name] || "•"}
    </span>
  );
};

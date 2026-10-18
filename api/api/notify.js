
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ ok: false });
  }

  try {
    const { event, title, link } = req.body || {};

    const labels = {
      generated: "HTML Generate হয়েছে",
      download: "Download বাটনে ক্লিক",
      published: "Blogger পোস্ট Publish হয়েছে"
    };

    if (!labels[event]) {
      return res.status(400).json({ ok: false });
    }

    const message =
      labels[event] +
      "\nমুভি: " +
      String(title || "নাম নেই").slice(0, 200) +
      (link ? "\nলিংক: " + String(link).slice(0, 1000) : "");

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const result = await response.json();
    return res.status(result.ok ? 200 : 502).json({
      ok: result.ok
    });
  } catch {
    return res.status(500).json({ ok: false });
  }
};

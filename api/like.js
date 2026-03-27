const GITHUB_API_BASE = "https://api.github.com";
const FILE_PATH = "likes.csv";

function corsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function fetchFile(repo, token) {
  const url = `${GITHUB_API_BASE}/repos/${repo}/contents/${FILE_PATH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "like-api"
    }
  });
  if (res.status === 404) {
    return { sha: null, content: "timestamp,event\n" };
  }
  if (!res.ok) {
    throw new Error(`GitHub GET ${res.status}`);
  }
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { sha: data.sha, content };
}

function countLikes(csvContent) {
  return csvContent
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("timestamp"))
    .length;
}

async function appendLike(repo, token, sha, currentContent) {
  const url = `${GITHUB_API_BASE}/repos/${repo}/contents/${FILE_PATH}`;
  const timestamp = new Date().toISOString();
  const newContent = currentContent + `${timestamp},like\n`;
  const encoded = Buffer.from(newContent).toString("base64");

  const body = {
    message: `like: ${timestamp}`,
    content: encoded
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "like-api",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT ${res.status}: ${text}`);
  }

  return countLikes(newContent);
}

module.exports = async function handler(req, res) {
  corsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO || "binzidd/comparisonofagents";

  if (req.method === "GET") {
    if (!GITHUB_TOKEN) {
      return res.status(200).json({ total: 0 });
    }
    try {
      const { content } = await fetchFile(GITHUB_REPO, GITHUB_TOKEN);
      return res.status(200).json({ total: countLikes(content) });
    } catch (err) {
      console.error("GET /api/like error:", err);
      return res.status(200).json({ total: 0 });
    }
  }

  if (req.method === "POST") {
    if (!GITHUB_TOKEN) {
      return res.status(503).json({ error: "Like tracking not configured" });
    }
    try {
      const { sha, content } = await fetchFile(GITHUB_REPO, GITHUB_TOKEN);
      const total = await appendLike(GITHUB_REPO, GITHUB_TOKEN, sha, content);
      return res.status(200).json({ total });
    } catch (err) {
      console.error("POST /api/like error:", err);
      return res.status(502).json({ error: "Failed to save like" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

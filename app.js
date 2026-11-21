const API = "https://api.microlink.io/";

// tags we pull straight from the page so we can tell what's really there,
// not just what Microlink managed to guess
const TAGS = {
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogImage: 'meta[property="og:image"]',
  ogUrl: 'meta[property="og:url"]',
  twitterCard: 'meta[name="twitter:card"]',
  description: 'meta[name="description"]',
};

const CHECKS = [
  ["title", "<title>", "Shown in tabs and search results"],
  ["description", "meta description", "Used by search engines"],
  ["ogTitle", "og:title", "Title in shared links"],
  ["ogDescription", "og:description", "Text under the title"],
  ["ogImage", "og:image", "The big preview image"],
  ["ogUrl", "og:url", "Canonical link for shares"],
  ["twitterCard", "twitter:card", "Enables large image cards"],
];

const form = document.getElementById("preview-form");
const input = document.getElementById("url-input");
const button = document.getElementById("go-btn");
const statusEl = document.getElementById("status");
const output = document.getElementById("output");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  output.classList.add("hidden");
  button.disabled = true;
  setStatus("Fetching page...");

  try {
    const data = await fetchPreview(input.value.trim());
    render(data);
    setStatus("");
    output.classList.remove("hidden");
  } catch (err) {
    setStatus(err.message, true);
  } finally {
    button.disabled = false;
  }
});

document.getElementById("copy-btn").addEventListener("click", async (e) => {
  const text = document.getElementById("snippet").textContent;
  await navigator.clipboard.writeText(text);
  e.target.textContent = "Copied!";
  setTimeout(() => (e.target.textContent = "Copy"), 1500);
});

async function fetchPreview(url) {
  const params = new URLSearchParams({ url });
  for (const [name, selector] of Object.entries(TAGS)) {
    params.set(`data.${name}.selector`, selector);
    params.set(`data.${name}.attr`, "content");
  }

  const res = await fetch(`${API}?${params}`);
  if (res.status === 429) {
    throw new Error("The free API limit for today is used up. Try again tomorrow.");
  }

  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.message || "Couldn't read that page.");
  }
  return json.data;
}

function render(d) {
  const url = d.url || input.value;
  const host = new URL(url).hostname.replace(/^www\./, "");
  const title = d.ogTitle || d.title || host;
  const desc = d.ogDescription || d.description || "";
  const image = d.image && d.image.url;

  fill(".p-title", title);
  fill(".p-desc", desc);
  fill(".p-host", host);
  fill(".p-publisher", d.publisher || host);
  fill(".p-url", url);

  document.querySelectorAll(".p-image").forEach((img) => {
    img.style.display = image ? "" : "none";
    if (image) img.src = image;
  });

  document.querySelectorAll(".p-logo").forEach((img) => {
    img.src = d.logo ? d.logo.url : `https://${host}/favicon.ico`;
  });

  const link = document.getElementById("chat-link");
  link.href = url;
  link.textContent = url;

  renderChecks(d);
  renderSnippet({ title, desc, image, url });
}

function renderChecks(d) {
  const list = document.getElementById("checks");
  list.innerHTML = "";

  for (const [key, label, hint] of CHECKS) {
    const found = Boolean(d[key]);
    const li = document.createElement("li");
    li.innerHTML = `<span>${found ? "✅" : "❌"}</span><code></code><span class="hint"></span>`;
    li.querySelector("code").textContent = label;
    li.querySelector(".hint").textContent = found ? "found" : hint;
    list.appendChild(li);
  }
}

function renderSnippet({ title, desc, image, url }) {
  const lines = [
    `<meta name="description" content="${escapeAttr(desc)}">`,
    `<meta property="og:title" content="${escapeAttr(title)}">`,
    `<meta property="og:description" content="${escapeAttr(desc)}">`,
    `<meta property="og:image" content="${escapeAttr(image || "https://your-site.com/preview.png")}">`,
    `<meta property="og:url" content="${escapeAttr(url)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ];
  document.getElementById("snippet").textContent = lines.join("\n");
}

function fill(selector, text) {
  document.querySelectorAll(selector).forEach((el) => (el.textContent = text));
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}

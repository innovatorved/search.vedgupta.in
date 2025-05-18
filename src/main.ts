import { bangs } from "./bang";
import "./global.css";

import posthog from 'posthog-js'

posthog.init('phc_XcplcYY1wslNAuiWHmLtS45O6yc40zrQn5tdhQFum8Z',
    {
        api_host: 'https://eu.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Search</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container">
          <input
            type="text"
            class="url-input"
            value="https://search.vedgupta.in?q=%s"
            readonly
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
      </div>
      <footer class="footer">
        <a href="https://x.com/innovatorved" target="_blank">innovatorved</a>
        •
        <a href="https://github.com/innovatorved" target="_blank">github</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/Search"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
  );
  if (!searchUrl) return null;
  posthog.capture("search_redirect",{
      original_query: query,
      bang_candidate: bangCandidate,
      selected_bang: selectedBang?.t,
      selected_bang_url: selectedBang?.u,
      clean_query: cleanQuery,
      redirect_url: searchUrl,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
  });
  console.log({
    original_query: query,
    bang_candidate: bangCandidate,
    selected_bang: selectedBang?.t,
    selected_bang_url: selectedBang?.u,
    clean_query: cleanQuery,
    redirect_url: searchUrl,
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
})

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();

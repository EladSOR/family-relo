/**
 * Thin GitHub REST client for the admin freshness dashboard.
 *
 * Required env vars (server-only):
 *   GITHUB_REVIEW_TOKEN   classic PAT or fine-grained token with `contents:write`
 *                         on the FamiRelo repo
 *   GITHUB_REPO           "owner/repo" — e.g. "eladsh/relocation-engine"
 *   GITHUB_BRANCH         (optional) default "main"
 *
 * We deliberately keep this client tiny: only the four endpoints we need
 * for "mark reviewed", "list recent reviews", and "revert".
 */

const API = "https://api.github.com";

interface RepoCfg {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

function cfg(): RepoCfg {
  const token = process.env.GITHUB_REVIEW_TOKEN;
  const repo  = process.env.GITHUB_REPO;
  if (!token) throw new Error("GITHUB_REVIEW_TOKEN is not set");
  if (!repo)  throw new Error("GITHUB_REPO is not set (expected 'owner/repo')");
  const [owner, name] = repo.split("/");
  if (!owner || !name) throw new Error(`GITHUB_REPO '${repo}' must be 'owner/repo'`);
  return { owner, repo: name, branch: process.env.GITHUB_BRANCH ?? "main", token };
}

async function gh<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = cfg();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Authorization":        `Bearer ${token}`,
      "Accept":               "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type":         "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub ${init?.method ?? "GET"} ${path} → ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

// ── File reads / writes ──────────────────────────────────────────────────────

interface ContentFile {
  sha: string;
  content: string;       // base64
  encoding: "base64";
  path: string;
}

export async function getFile(path: string): Promise<{ sha: string; text: string }> {
  const { owner, repo, branch } = cfg();
  const file = await gh<ContentFile>(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`,
  );
  const text = Buffer.from(file.content, "base64").toString("utf8");
  return { sha: file.sha, text };
}

export async function putFile(opts: {
  path: string;
  text: string;
  /** Empty string when creating a new file (no prior blob). */
  sha: string;
  message: string;
  authorName?: string;
  authorEmail?: string;
}): Promise<{ commitSha: string }> {
  const { owner, repo, branch } = cfg();
  const body: Record<string, unknown> = {
    message: opts.message,
    content: Buffer.from(opts.text, "utf8").toString("base64"),
    branch,
    committer: {
      name:  opts.authorName  ?? "famirelo-admin",
      email: opts.authorEmail ?? "admin@famirelo.com",
    },
  };
  if (opts.sha) body.sha = opts.sha;
  const res = await gh<{ commit: { sha: string } }>(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(opts.path)}`,
    { method: "PUT", body: JSON.stringify(body) },
  );
  return { commitSha: res.commit.sha };
}

// ── Commit history (for "Recent changes" + revert) ──────────────────────────

export interface ReviewCommit {
  sha: string;
  message: string;
  author: string;
  date: string;       // ISO
  url: string;        // html_url
}

export async function listRecentDataCommits(limit = 20): Promise<ReviewCommit[]> {
  const { owner, repo, branch } = cfg();
  const path = "data/cities.json";
  const commits = await gh<Array<{
    sha: string;
    html_url: string;
    commit: { message: string; author: { name: string; date: string } };
  }>>(
    `/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}` +
    `&path=${encodeURIComponent(path)}&per_page=${limit}`,
  );
  return commits.map(c => ({
    sha: c.sha,
    message: c.commit.message.split("\n")[0],
    author: c.commit.author.name,
    date: c.commit.author.date,
    url: c.html_url,
  }));
}

// ── Revert: replay a commit's parent state for cities.json ───────────────────
//
// We don't use `git revert` (no shell here). Instead: fetch the file content
// at the commit's *parent* and PUT it back as a new commit with current SHA.
// This is a one-file revert — exactly what we need since reviews only touch
// cities.json.

export async function revertCitiesJsonAt(commitSha: string): Promise<{ commitSha: string }> {
  const { owner, repo } = cfg();
  const path = "data/cities.json";

  // 1. Find the parent of the commit being reverted.
  const detail = await gh<{ parents: { sha: string }[] }>(
    `/repos/${owner}/${repo}/commits/${commitSha}`,
  );
  const parentSha = detail.parents[0]?.sha;
  if (!parentSha) throw new Error(`Commit ${commitSha} has no parent — cannot revert.`);

  // 2. Get the file content as it was at the parent.
  const parentFile = await gh<ContentFile>(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${parentSha}`,
  );
  const parentText = Buffer.from(parentFile.content, "base64").toString("utf8");

  // 3. Get the current SHA on the branch tip (needed for PUT).
  const current = await getFile(path);

  // 4. PUT the parent's content back.
  return putFile({
    path,
    text: parentText,
    sha: current.sha,
    message: `revert(freshness): restore cities.json to state before ${commitSha.slice(0, 7)}`,
  });
}

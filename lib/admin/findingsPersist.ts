/**
 * Persistence layer for scan findings.
 *
 * Two modes (picked automatically):
 *   • With GITHUB_REVIEW_TOKEN set → commit data/scan-findings.json to the
 *     repo via the GitHub Contents API. Works on Vercel where the function
 *     filesystem is ephemeral. Triggers a Vercel rebuild on each save —
 *     fine because scans/approvals are rare (once a month / a few per day).
 *   • Without the token → write to local disk (dev mode).
 *
 * Read path is always local filesystem because by the time a request runs,
 * the bundled deployment already contains the last-committed JSON.
 */

import { getFile, putFile } from "./github";
import { loadFindings, saveFindings, type FindingsFile } from "./findings";

const PATH = "data/scan-findings.json";

export function readFindings(): FindingsFile {
  return loadFindings();
}

export async function writeFindings(
  data: FindingsFile,
  commitMessage: string,
  authorEmail: string,
): Promise<{ committed: boolean; commitSha?: string }> {
  // Local fallback when GitHub creds are missing.
  if (!process.env.GITHUB_REVIEW_TOKEN || !process.env.GITHUB_REPO) {
    saveFindings(data);
    return { committed: false };
  }

  // Production path — commit via GitHub.
  const remote = await getFile(PATH).catch(() => null);
  const newText = JSON.stringify(data, null, 2) + "\n";

  if (!remote) {
    // First commit of the findings file (unlikely — it's seeded in the repo).
    const { commitSha } = await putFile({
      path: PATH,
      text: newText,
      sha: "",
      message: commitMessage,
      authorName:  authorEmail.split("@")[0],
      authorEmail,
    });
    return { committed: true, commitSha };
  }

  if (remote.text === newText) return { committed: true };

  const { commitSha } = await putFile({
    path: PATH,
    text: newText,
    sha: remote.sha,
    message: commitMessage,
    authorName:  authorEmail.split("@")[0],
    authorEmail,
  });
  return { committed: true, commitSha };
}

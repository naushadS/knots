import { platform } from "../../shared/platformBridge";
import { GITHUB_API_LATEST_RELEASE_URL, RELEASES_URL } from "../../shared/site";
import { APP_VERSION, isNewerVersion } from "../../shared/version";

export interface UpdateSection {
  type: "features" | "improvements" | "fixes" | "announcements" | "other";
  title: string;
  items: string[];
}

export interface UpdateInfo {
  version: string;
  title: string;
  notes: string;
  sections?: UpdateSection[];
  releaseUrl: string;
  apkUrl: string | null;
  isUpdateAvailable: boolean;
}

export function parseNotesToSections(notes: string): UpdateSection[] {
  const sections: UpdateSection[] = [];
  let currentSection: UpdateSection | null = null;

  for (const line of notes.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
      const title = trimmed.replace(/^#+\s*/, "");
      const lower = title.toLowerCase();
      let type: UpdateSection["type"] = "other";
      if (lower.includes("feature")) type = "features";
      else if (lower.includes("improvement")) type = "improvements";
      else if (lower.includes("fix") || lower.includes("bug")) type = "fixes";
      else if (lower.includes("announcement")) type = "announcements";

      currentSection = { type, title, items: [] };
      sections.push(currentSection);
    } else if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      const item = trimmed.replace(/^[*-\s]+/, "").trim();
      if (item) {
        if (!currentSection) {
          currentSection = { type: "features", title: "Changes", items: [] };
          sections.push(currentSection);
        }
        currentSection.items.push(item);
      }
    }
  }
  return sections;
}

export async function checkForUpdate(currentVersion: string = APP_VERSION): Promise<UpdateInfo> {
  const res = await fetch(GITHUB_API_LATEST_RELEASE_URL, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    if (res.status === 404) {
      return {
        version: currentVersion,
        title: "Current Version",
        notes: "No newer releases found on GitHub.",
        sections: [],
        releaseUrl: RELEASES_URL,
        apkUrl: null,
        isUpdateAvailable: false,
      };
    }
    throw new Error(`GitHub check failed (${res.status})`);
  }
  const data = await res.json();
  const remoteTag = (data.tag_name || "").trim();
  const isDebug = platform.isAppDebug();
  const targetName = isDebug ? "app-debug.apk" : "app-release.apk";
  const assets: Array<{ name: string; browser_download_url: string }> = data.assets || [];
  const apkAsset =
    assets.find((a) => a.name === targetName) || assets.find((a) => a.name.endsWith(".apk"));
  const notes = data.body || "";

  return {
    version: remoteTag,
    title: data.name || remoteTag,
    notes,
    sections: parseNotesToSections(notes),
    releaseUrl: data.html_url || `${RELEASES_URL}/latest`,
    apkUrl: apkAsset?.browser_download_url ?? null,
    isUpdateAvailable: remoteTag ? isNewerVersion(remoteTag, currentVersion) : false,
  };
}

export function triggerUpdate(update: UpdateInfo): void {
  if (typeof window !== "undefined") {
    window.open(update.apkUrl || update.releaseUrl, "_blank", "noopener");
  }
}

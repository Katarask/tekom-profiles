// Notion API Helper für Kandidaten-Profile

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const KANDIDATEN_DB = process.env.NOTION_KANDIDATEN_DB!;

interface KandidatProfile {
  id: string;
  name: string;
  position: string;
  standort: string;
  email?: string;
  telefon?: string;
  gehalt?: string;
  verfuegbarkeit?: string;
  branche: string[];
  techStack: string[];
  status: string;
  content: string;
  notionUrl: string;
  // NEU: Token & Ablauf
  profilToken?: string;
  gueltigBis?: string;
  erstelltAm?: string;
}

// Notion Page zu Kandidat-Daten
function parseNotionPage(page: any): KandidatProfile | null {
  const props = page.properties;

  const getName = (prop: any) => prop?.title?.[0]?.plain_text || "";
  const getText = (prop: any) => prop?.rich_text?.[0]?.plain_text || "";
  const getEmail = (prop: any) => prop?.email || "";
  const getPhone = (prop: any) => prop?.phone_number || "";
  const getSelect = (prop: any) => prop?.select?.name || "";
  const getMultiSelect = (prop: any) => prop?.multi_select?.map((s: any) => s.name) || [];
  const getDate = (prop: any) => prop?.date?.start || "";

  return {
    id: page.id,
    name: getName(props["Name"]),
    position: getText(props["Position"]),
    standort: getText(props["Wohnort"]),
    email: getEmail(props["E-Mail"]),
    telefon: getPhone(props["Handynummer"]),
    gehalt: getText(props["Gehaltsvorstellung"]),
    verfuegbarkeit: getText(props["Verfügbarkeit"]),
    branche: getMultiSelect(props["Branchenerfahrung"]),
    techStack: getMultiSelect(props["Tech Stack"]),
    status: getSelect(props["Pipeline Status"]),
    content: "",
    notionUrl: page.url,
    // NEU: Token & Ablauf
    profilToken: getText(props["Profil-Token"]),
    gueltigBis: getDate(props["Gültig bis"]),
    erstelltAm: page.created_time
  };
}

// NEU: Kandidat per Token suchen
export async function getKandidatByToken(token: string): Promise<KandidatProfile | null> {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${KANDIDATEN_DB}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: {
          property: "Profil-Token",
          rich_text: { equals: token }
        },
        page_size: 1
      }),
      next: { revalidate: 60 }
    });

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return parseNotionPage(data.results[0]);
    }

    return null;
  } catch (error) {
    console.error("Notion API Error:", error);
    return null;
  }
}

// Kandidat per ID suchen (sucht in Name oder custom ID Feld)
export async function getKandidatByProfileId(profileId: string): Promise<KandidatProfile | null> {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${KANDIDATEN_DB}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: {
          or: [
            // Suche nach Name der mit der ID beginnt
            { property: "Name", title: { contains: profileId } },
            // Oder nach Profil-ID Feld falls vorhanden
            { property: "Profil-ID", rich_text: { equals: profileId } }
          ]
        },
        page_size: 1
      }),
      next: { revalidate: 60 } // Cache für 60 Sekunden
    });

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return parseNotionPage(data.results[0]);
    }

    return null;
  } catch (error) {
    console.error("Notion API Error:", error);
    return null;
  }
}

// Kandidat per Notion Page ID holen
export async function getKandidatByPageId(pageId: string): Promise<KandidatProfile | null> {
  try {
    // Clean page ID (remove dashes if needed)
    const cleanId = pageId.replace(/-/g, "");

    const response = await fetch(`https://api.notion.com/v1/pages/${cleanId}`, {
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return null;
    }

    const page = await response.json();
    return parseNotionPage(page);
  } catch (error) {
    console.error("Notion API Error:", error);
    return null;
  }
}

// Page Content holen (Blocks)
export async function getPageContent(pageId: string): Promise<string> {
  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28"
      },
      next: { revalidate: 60 }
    });

    const data = await response.json();
    let content = "";

    for (const block of data.results || []) {
      if (block.type === "paragraph") {
        const text = block.paragraph?.rich_text?.map((t: any) => t.plain_text).join("") || "";
        if (text) content += text + "\n\n";
      } else if (block.type === "heading_2") {
        const text = block.heading_2?.rich_text?.map((t: any) => t.plain_text).join("") || "";
        if (text) content += `## ${text}\n\n`;
      } else if (block.type === "bulleted_list_item") {
        const text = block.bulleted_list_item?.rich_text?.map((t: any) => t.plain_text).join("") || "";
        if (text) content += `- ${text}\n`;
      }
    }

    return content.trim();
  } catch (error) {
    console.error("Error fetching page content:", error);
    return "";
  }
}

// NEU: Prüfen ob Profil abgelaufen ist
export function isProfileExpired(gueltigBis: string | undefined): boolean {
  if (!gueltigBis) return false; // Kein Ablaufdatum = nicht abgelaufen

  const expiryDate = new Date(gueltigBis);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return expiryDate < today;
}

// NEU: Token generieren (wird beim Erstellen in Notion gespeichert)
export function generateProfileToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// NEU: Ablaufdatum berechnen (3 Wochen ab heute)
export function calculateExpiryDate(weeks: number = 3): string {
  const date = new Date();
  date.setDate(date.getDate() + (weeks * 7));
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

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
    notionUrl: page.url
  };
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

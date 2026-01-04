import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;

// View Counter - wird bei jedem Profilaufruf getriggert
export async function POST(request: NextRequest) {
  try {
    const { pageId } = await request.json();

    if (!pageId) {
      return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
    }

    // Aktuellen View-Count holen
    const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28"
      }
    });

    if (!pageResponse.ok) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const page = await pageResponse.json();
    const currentViews = page.properties["Profil Views"]?.number || 0;

    // Views incrementieren
    const updateResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          "Profil Views": {
            number: currentViews + 1
          }
        }
      })
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      console.error("Notion update failed:", error);
      // Nicht kritisch - View zählen ist optional
      return NextResponse.json({ views: currentViews, updated: false });
    }

    return NextResponse.json({ views: currentViews + 1, updated: true });
  } catch (error) {
    console.error("View counter error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

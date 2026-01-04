import { MapPin, Mail, Phone, Shield, AlertTriangle } from "lucide-react";
import { getKandidatByPageId, getPageContent, isProfileExpired } from "@/lib/notion";
import { notFound } from "next/navigation";
import ViewCounter from "@/components/ViewCounter";

// TEKOM Daten
const tekom = {
  name: "TEKOM Industrielle Systemtechnik GmbH",
  contact: "Deniz L. Tulay",
  email: "d.l.tulay@tekom-gmbh.de",
  phone: "089 290 33815",
  address: "Westenriederstraße 49, 80331 München",
  website: "www.tekom-gmbh.de"
};

// Erfahrungsjahre schätzen
function estimateYears(branche: string[]): string {
  if (branche.length >= 4) return "15+";
  if (branche.length >= 3) return "10+";
  if (branche.length >= 2) return "5+";
  return "3+";
}

// Expired Profile Page
function ExpiredProfile() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-light text-slate-100 mb-4">
          Profil nicht mehr verfügbar
        </h1>
        <p className="text-slate-400 mb-8">
          Dieses Kandidatenprofil ist abgelaufen und wurde archiviert.
          Für aktuelle Profile kontaktieren Sie uns bitte direkt.
        </p>
        <div className="text-sm text-slate-500 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            {tekom.email}
          </p>
          <p className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            {tekom.phone}
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-600">
            {tekom.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Notion Page ID kann mit oder ohne Bindestriche sein
  const kandidat = await getKandidatByPageId(id);

  if (!kandidat) {
    notFound();
  }

  // Ablauf-Check: Profil älter als 1 Monat?
  if (isProfileExpired(kandidat.profilErstelltAm)) {
    return <ExpiredProfile />;
  }

  // Content laden
  const content = await getPageContent(id);

  // Profil-ID: Aus Notion oder generieren
  const profileId = kandidat.kandidatenId || `TC-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`;

  // Executive Summary: Aus Notion oder generieren
  const executiveSummary = kandidat.executiveSummary ||
    `Erfahrene Fachkraft im Bereich ${kandidat.position || "Engineering"} mit fundierter Expertise in ${kandidat.branche.slice(0, 3).join(", ") || "technischen Industrien"}. Verfügbar für neue Herausforderungen ${kandidat.verfuegbarkeit ? `ab ${kandidat.verfuegbarkeit}` : "nach Vereinbarung"}.`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* View Counter (unsichtbar) */}
      <ViewCounter pageId={id} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.8s ease-out both; }
        .fade-in-1 { animation-delay: 0.1s; }
        .fade-in-2 { animation-delay: 0.2s; }
        .fade-in-3 { animation-delay: 0.3s; }
        .fade-in-4 { animation-delay: 0.4s; }
        .fade-in-5 { animation-delay: 0.5s; }
        .fade-in-6 { animation-delay: 0.6s; }
        .fade-in-7 { animation-delay: 0.7s; }

        @media print {
          @page { size: A4; margin: 2cm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .fade-in { animation: none !important; opacity: 1 !important; transform: none !important; }
          .bg-slate-950 { background: #0f172a !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-20">

        {/* Header */}
        <header className="pb-6 sm:pb-8 border-b border-slate-800 fade-in fade-in-1">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-950 font-bold text-base sm:text-lg">T</span>
            </div>
            <div>
              <p className="text-sm sm:text-base font-medium text-slate-200">TEKOM Industrielle Systemtechnik GmbH</p>
              <p className="text-xs sm:text-sm text-teal-500 font-medium tracking-wide">Headhunting</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Vermittlung innovativer Köpfe in Defense · IT · Robotik · Aviation · Aerospace
          </p>
        </header>

        {/* Hero */}
        <section className="py-8 sm:py-12 lg:py-16 border-b border-slate-800 fade-in fade-in-2">
          <p className="text-xs tracking-[0.3em] text-teal-500 uppercase mb-4 sm:mb-6">{profileId}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-100 leading-[1.15] mb-6 sm:mb-8">
            {kandidat.position || "Fachkraft"}
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-8 sm:gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-600" />
              {kandidat.standort || "Deutschland"}
            </span>
            <span>{estimateYears(kandidat.branche)} Jahre Erfahrung</span>
            <span>Verfügbar {kandidat.verfuegbarkeit || "nach Vereinbarung"}</span>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 py-6 sm:py-8 border-b border-slate-800 fade-in fade-in-3">
          <div className="flex justify-between sm:block">
            <p className="text-xs tracking-wider text-slate-600 uppercase mb-1 sm:mb-2">Gehaltsrahmen</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-light text-slate-200">{kandidat.gehalt || "Auf Anfrage"}</p>
          </div>
          <div className="flex justify-between sm:block sm:text-center">
            <p className="text-xs tracking-wider text-slate-600 uppercase mb-1 sm:mb-2">Verfügbarkeit</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-light text-slate-200">{kandidat.verfuegbarkeit || "Flexibel"}</p>
          </div>
          <div className="flex justify-between sm:block sm:text-right">
            <p className="text-xs tracking-wider text-slate-600 uppercase mb-1 sm:mb-2">Arbeitsmodell</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-light text-slate-200">Hybrid</p>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="py-8 sm:py-12 border-b border-slate-800 fade-in fade-in-4">
          <h2 className="text-xs tracking-[0.2em] text-teal-500 uppercase mb-4 sm:mb-6">Executive Summary</h2>
          <p className="text-base sm:text-lg lg:text-xl font-light text-slate-300 leading-relaxed">
            {executiveSummary}
          </p>

          {kandidat.techStack.length > 0 && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-800/50">
              <h3 className="text-xs tracking-[0.2em] text-slate-600 uppercase mb-3 sm:mb-4">Kernqualifikationen</h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                {kandidat.techStack.join(" · ")}
              </p>
            </div>
          )}
        </section>

        {/* Branchenerfahrung */}
        {kandidat.branche.length > 0 && (
          <section className="py-8 sm:py-12 border-b border-slate-800 fade-in fade-in-5">
            <h2 className="text-xs tracking-[0.2em] text-teal-500 uppercase mb-6 sm:mb-8">Branchenerfahrung</h2>
            <div className="space-y-3 sm:space-y-4">
              {kandidat.branche.map((branche, i) => (
                <div key={i} className="flex gap-4 sm:gap-6">
                  <span className="text-teal-500/50 font-light text-base sm:text-lg">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-slate-300 text-base sm:text-lg font-light">{branche}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Content from Notion */}
        {content && (
          <section className="py-8 sm:py-12 border-b border-slate-800 fade-in fade-in-6">
            <h2 className="text-xs tracking-[0.2em] text-teal-500 uppercase mb-6 sm:mb-8">Details</h2>
            <div className="prose prose-invert prose-slate max-w-none">
              <div className="text-slate-300 whitespace-pre-line">{content}</div>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="py-8 sm:py-12 fade-in fade-in-7">
          <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-slate-900/50 rounded-lg border border-slate-800/50">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-500 space-y-2 sm:space-y-3">
              <p className="text-slate-400 font-medium">Vertraulichkeitshinweis</p>
              <p>
                Dieses Dokument enthält vertrauliche Informationen und ist ausschließlich für den
                vorgesehenen Empfänger bestimmt. Jegliche Weitergabe, Vervielfältigung oder
                Veröffentlichung bedarf der schriftlichen Genehmigung der TEKOM GmbH.
              </p>
              <p className="hidden sm:block">
                Bei versehentlichem Erhalt bitten wir um umgehende Benachrichtigung und Löschung
                des Dokuments. Datenschutz gemäß DSGVO.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 sm:pt-8 border-t border-slate-800 fade-in fade-in-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 text-xs text-slate-600">
            <div>
              <p className="text-slate-400">{tekom.name}</p>
              <p className="hidden sm:block">{tekom.address}</p>
            </div>
            <div className="flex gap-4 sm:flex-col sm:gap-0 sm:text-right">
              <p className="flex items-center gap-2 sm:justify-end">
                <Mail className="w-3 h-3" />
                {tekom.email}
              </p>
              <p className="flex items-center gap-2 sm:justify-end sm:mt-1">
                <Phone className="w-3 h-3" />
                {tekom.phone}
              </p>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-700 uppercase tracking-widest mt-6 sm:mt-8">
            {tekom.website}
          </p>
        </footer>

      </div>
    </div>
  );
}

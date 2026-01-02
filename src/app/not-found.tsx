import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
          <span className="text-slate-500 font-bold text-2xl">?</span>
        </div>
        
        <h1 className="text-2xl font-light text-slate-100 mb-4">
          Profil nicht gefunden
        </h1>
        
        <p className="text-slate-400 mb-8">
          Dieses Kandidaten-Profil existiert nicht oder wurde deaktiviert.
          Bitte kontaktieren Sie TEKOM für einen aktualisierten Link.
        </p>
        
        <Link 
          href="/"
          className="inline-block px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Zurück
        </Link>
        
        <p className="text-xs text-slate-600 mt-8">
          TEKOM Industrielle Systemtechnik GmbH<br />
          d.l.tulay@tekom-gmbh.de
        </p>
      </div>
    </div>
  );
}

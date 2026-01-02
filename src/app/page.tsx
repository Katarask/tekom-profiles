import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-xl bg-teal-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-slate-950 font-bold text-2xl">T</span>
        </div>
        
        <h1 className="text-2xl font-light text-slate-100 mb-4">
          TEKOM Kandidaten-Profile
        </h1>
        
        <p className="text-slate-400 mb-8">
          Diese Seite enthält vertrauliche Kandidaten-Profile.
          Bitte verwenden Sie den direkten Link, den Sie von TEKOM erhalten haben.
        </p>
        
        <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-800/50 text-left">
          <Shield className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-500">
            <p className="text-slate-400 font-medium mb-1">Datenschutz</p>
            <p>
              Profile sind nur mit direktem Link zugänglich und werden 
              nach 90 Tagen automatisch deaktiviert.
            </p>
          </div>
        </div>
        
        <p className="text-xs text-slate-600 mt-8">
          TEKOM Industrielle Systemtechnik GmbH<br />
          München · www.tekom-gmbh.de
        </p>
      </div>
    </div>
  );
}

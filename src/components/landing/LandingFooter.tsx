import { FullLogo } from '@/components/ui/Logo';

export default function LandingFooter() {
  return (
    <footer className="py-20 px-6 sm:px-10 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
        <div className="space-y-4">
          <FullLogo className="h-6 mx-auto sm:mx-0" />
          <p className="text-xs text-gray-400 font-medium max-w-xs leading-relaxed">
            The memory infrastructure for modern, high-stakes organizations.
          </p>
        </div>
        
        <div className="flex flex-col items-center sm:items-end gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            Institutional Continuity
          </p>
          <p className="text-xs text-gray-400 font-bold">
            © {new Date().getFullYear()} Klump. Built for generations.
          </p>
        </div>
      </div>
    </footer>
  );
}


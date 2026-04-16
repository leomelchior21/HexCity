import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="relative w-24 h-6">
            <Image src="/hexcity-logo-white.svg" alt="HEXCITY" fill className="object-contain object-left" />
          </div>
          <span className="text-white/20 text-sm">Interactive Project Hub</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/30">
          <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
          <Link href="/swot" className="hover:text-white/60 transition-colors">SWOT</Link>
          <Link href="/ideation" className="hover:text-white/60 transition-colors">Ideation</Link>
          <Link href="/lab" className="hover:text-white/60 transition-colors">Ardudeck</Link>
          <Link href="/simulation" className="hover:text-white/60 transition-colors">City Sim</Link>
        </div>

        <div className="text-white/18 text-xs font-mono">São Paulo · 2026 · v2.0</div>
      </div>
    </footer>
  );
}

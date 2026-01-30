import { Link } from "wouter";
import { Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

// Custom Jike Icon
const JikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.24 7.22a.56.56 0 0 0-.77 0 .56.56 0 0 0 0 .78l2.7 2.76H7.33a.55.55 0 1 0 0 1.1h6.84l-2.7 2.75a.55.55 0 0 0 .78.78l3.66-3.67a.55.55 0 0 0 0-.77L12.24 7.22Z" />
    <path d="M12 1.5A10.5 10.5 0 1 0 22.5 12 10.51 10.51 0 0 0 12 1.5Zm0 19A8.5 8.5 0 1 1 20.5 12 8.51 8.51 0 0 1 12 20.5Z" />
  </svg>
);

// Custom Discord Icon (Simple Version)
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.67 13.67 0 0 0-.57 1.173 18.258 18.258 0 0 0-5.566 0 13.713 13.713 0 0 0-.574-1.173.074.074 0 0 0-.077-.037 19.802 19.802 0 0 0-4.887 1.515.073.073 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.074.074 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="py-16 bg-black border-t border-border/40 text-sm text-muted-foreground relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <Link href="/">
            <span className="text-xl font-bold font-cinzel text-foreground tracking-widest cursor-pointer hover:text-primary transition-colors">NOWBUILD</span>
          </Link>
          <p className="max-w-xs leading-relaxed whitespace-pre-line">
            {t('footer.tagline')}
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-bold text-foreground">{t('footer.products')}</h4>
          <ul className="space-y-2">
            <li><Link href="/showcase" className="hover:text-primary transition-colors">{t('navbar.showcase')}</Link></li>
            <li><Link href="/download" className="hover:text-primary transition-colors">{t('navbar.download')}</Link></li>
            <li><Link href="/subscription" className="hover:text-primary transition-colors">{t('navbar.subscription')}</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-foreground">{t('footer.community')}</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
            <li>
                <a href="https://github.com/clawdbot/clawdbot" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub
                </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p>{t('footer.copyright', { year: currentYear })}</p>
        
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/10 hover:text-[#FFE411]">
                <a href="https://web.okjike.com/u/5FCF6430-748D-45F0-AF58-821BB1F4C6E3" target="_blank" rel="noopener noreferrer" title="即刻">
                    <JikeIcon className="w-5 h-5" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/10 hover:text-[#1DA1F2]">
                <a href="https://x.com/jackzhong1998?s=21" target="_blank" rel="noopener noreferrer" title="Twitter / X">
                    <Twitter className="w-5 h-5" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/10 hover:text-[#5865F2]">
                <a href="https://discord.gg/qru93zVu" target="_blank" rel="noopener noreferrer" title="Discord">
                    <DiscordIcon className="w-5 h-5" />
                </a>
            </Button>
        </div>
      </div>
    </footer>
  );
}

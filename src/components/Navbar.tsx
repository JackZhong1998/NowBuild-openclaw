import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket, Twitter, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.png";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Icons for Navbar shortcuts
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.67 13.67 0 0 0-.57 1.173 18.258 18.258 0 0 0-5.566 0 13.713 13.713 0 0 0-.574-1.173.074.074 0 0 0-.077-.037 19.802 19.802 0 0 0-4.887 1.515.073.073 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.074.074 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
  </svg>
);

const JikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.24 7.22a.56.56 0 0 0-.77 0 .56.56 0 0 0 0 .78l2.7 2.76H7.33a.55.55 0 1 0 0 1.1h6.84l-2.7 2.75a.55.55 0 0 0 .78.78l3.66-3.67a.55.55 0 0 0 0-.77L12.24 7.22Z" />
    <path d="M12 1.5A10.5 10.5 0 1 0 22.5 12 10.51 10.51 0 0 0 12 1.5Zm0 19A8.5 8.5 0 1 1 20.5 12 8.51 8.51 0 0 1 12 20.5Z" />
  </svg>
);

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { openSignIn } = useClerk();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSignIn = () => {
    openSignIn({ forceRedirectUrl: "/#/waitlist" });
  };

  const navItems = [
    { name: t('navbar.home'), path: "/" },
    { name: t('navbar.showcase'), path: "/showcase" },
    { name: t('navbar.download'), path: "/download" },
    { name: t('navbar.about'), path: "/about" },
    { name: t('navbar.waitlist'), path: "/waitlist" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/">
              <span className="flex items-center space-x-3 cursor-pointer group shrink-0">
                <div className="relative w-8 h-8 overflow-hidden rounded-full shadow-[0_0_10px_rgba(192,0,0,0.5)] border border-primary/30 group-hover:border-primary/60 transition-colors">
                    <img src={logoImg} alt="NowBuild Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl lg:text-2xl font-bold tracking-tight text-foreground font-cinzel">
                  NowBuild
                </span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                    <span 
                      className={cn(
                        "px-3 py-2 rounded-full text-sm font-medium transition-all hover:bg-secondary cursor-pointer",
                        location === item.path 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.name}
                    </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Community Shortcuts */}
            <div className="hidden md:flex items-center gap-1 border-r border-border/40 pr-4 mr-2">
                <a href="https://web.okjike.com/u/5FCF6430-748D-45F0-AF58-821BB1F4C6E3" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-[#FFE411] transition-colors" title="即刻">
                    <JikeIcon className="w-4 h-4" />
                </a>
                <a href="https://x.com/jackzhong1998?s=21" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-[#1DA1F2] transition-colors" title="Twitter">
                    <Twitter className="w-4 h-4" />
                </a>
                <a href="https://discord.gg/qru93zVu" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-[#5865F2] transition-colors" title="Discord">
                    <DiscordIcon className="w-4 h-4" />
                </a>
            </div>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => changeLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => changeLanguage('zh')}>
                  简体中文
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <SignedOut>
                <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-primary" onClick={handleSignIn}>
                    {t('navbar.login')}
                </Button>
                <Button size="sm" className="hidden md:flex rounded-full bg-gradient-to-r from-primary to-destructive hover:from-primary/90 hover:to-destructive/90 text-white shadow-lg shadow-primary/20 border border-white/10" onClick={handleSignIn}>
                    <Rocket className="w-4 h-4 mr-2" />
                    {t('navbar.launch')}
                </Button>
            </SignedOut>

            <SignedIn>
                <Button asChild size="sm" className="hidden md:flex rounded-full bg-gradient-to-r from-primary to-destructive hover:from-primary/90 hover:to-destructive/90 text-white shadow-lg shadow-primary/20 border border-white/10">
                  <Link href="/waitlist">
                    <Rocket className="w-4 h-4 mr-2" />
                    {t('navbar.console')}
                  </Link>
                </Button>
                <div className="hidden md:block">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </SignedIn>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border/40 bg-background"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                    <span 
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer",
                        location === item.path 
                          ? "bg-secondary text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </span>
                </Link>
              ))}
              
              <div className="flex gap-4 px-3 py-4 border-t border-border/40 mt-2">
                <a href="https://web.okjike.com/u/5FCF6430-748D-45F0-AF58-821BB1F4C6E3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#FFE411]">
                    <JikeIcon className="w-6 h-6" />
                </a>
                <a href="https://x.com/jackzhong1998?s=21" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2]">
                    <Twitter className="w-6 h-6" />
                </a>
                <a href="https://discord.gg/qru93zVu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#5865F2]">
                    <DiscordIcon className="w-6 h-6" />
                </a>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                 <SignedOut>
                    <Button className="w-full justify-center rounded-full bg-primary text-primary-foreground" onClick={handleSignIn}>
                        {t('navbar.start_now')}
                    </Button>
                 </SignedOut>
                 <SignedIn>
                    <Button asChild className="w-full justify-center rounded-full bg-primary text-primary-foreground">
                        <Link href="/waitlist" onClick={() => setMobileMenuOpen(false)}>
                            {t('navbar.enter_console')}
                        </Link>
                    </Button>
                 </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

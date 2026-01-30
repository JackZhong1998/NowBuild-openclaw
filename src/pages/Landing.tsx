import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Bot, Shield, Terminal, Cpu, Zap, Layout, CheckCircle2, XCircle, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
      <main className="flex-1 flex flex-col justify-center items-center relative overflow-hidden px-6 pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium border border-primary/20 backdrop-blur-sm mx-auto shadow-[0_0_15px_rgba(192,0,0,0.3)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="tracking-wide uppercase text-xs font-bold text-gold">{t('landing.badge')}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground leading-[1.1] font-cinzel"
          >
            {t('landing.title_prefix')}<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-500 to-amber-500 drop-shadow-[0_0_10px_rgba(192,0,0,0.5)]">
              {t('landing.title_suffix')}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light"
          >
            {t('landing.description')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/#/subscription">
                    <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(192,0,0,0.4)] hover:shadow-[0_0_30px_rgba(192,0,0,0.6)] transition-all hover:scale-105 border border-white/10">
                        <Rocket className="mr-2 h-5 w-5" />
                        {t('navbar.launch')}
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(192,0,0,0.4)] hover:shadow-[0_0_30px_rgba(192,0,0,0.6)] transition-all hover:scale-105 border border-white/10" asChild>
                    <Link href="/subscription">
                        <Rocket className="mr-2 h-5 w-5" />
                        {t('navbar.console')}
                    </Link>
                </Button>
            </SignedIn>

            <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg bg-transparent border-primary/30 text-primary-foreground hover:bg-primary/10 hover:border-primary/60 hover:text-white transition-all hover:scale-105 backdrop-blur-sm" asChild>
              <Link href="/idea">
                <Bot className="mr-2 h-5 w-5" />
                {t('landing.btn_idea')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Comparison Section (SEO Focused) */}
      <section className="py-24 bg-card/30 border-y border-border/40 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-cinzel text-gold">{t('landing.why_title')}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('landing.why_desc')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Competitor Side */}
                <div className="space-y-8 p-8 rounded-3xl bg-background/20 border border-white/5 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-6">
                        <Terminal className="w-8 h-8 text-muted-foreground" />
                        <h3 className="text-2xl font-bold text-muted-foreground">{t('landing.comparison.oss_title')}</h3>
                        <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground border border-white/5">Clawdbot / OpenClaw</span>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-muted-foreground">
                            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{t('landing.comparison.oss_1')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-muted-foreground">
                            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{t('landing.comparison.oss_2')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-muted-foreground">
                            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{t('landing.comparison.oss_3')}</span>
                        </li>
                    </ul>
                </div>

                {/* NowBuild Side */}
                <div className="space-y-8 p-8 rounded-3xl bg-gradient-to-b from-primary/10 to-background border border-primary/30 shadow-[0_0_30px_rgba(192,0,0,0.1)] relative">
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                    
                    <div className="flex items-center gap-4 mb-6">
                        <Cpu className="w-8 h-8 text-primary" />
                        <h3 className="text-2xl font-bold text-foreground">{t('landing.comparison.nb_title')}</h3>
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">Enterprise Ready</span>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-foreground">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span>{t('landing.comparison.nb_1')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-foreground">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span>{t('landing.comparison.nb_2')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-foreground">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span>{t('landing.comparison.nb_3')}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 bg-background relative">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Layout className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gold">{t('landing.features.arch_title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {t('landing.features.arch_desc')}
                </p>
            </div>
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gold">{t('landing.features.privacy_title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {t('landing.features.privacy_desc')}
                </p>
            </div>
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gold">{t('landing.features.evo_title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {t('landing.features.evo_desc')}
                </p>
            </div>
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
            <h2 className="text-2xl font-bold text-center mb-8 font-cinzel text-muted-foreground">{t('landing.ecosystem_title')}</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground/60 text-sm text-center">
                <p>
                    {t('landing.ecosystem_desc')}
                </p>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Brain, Heart, Lightbulb, Users, Crown, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="relative py-24 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="outline" className="mb-4 px-3 py-1 text-sm border-primary/30 bg-primary/5 text-primary uppercase tracking-widest">{t('about.badge')}</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold font-cinzel text-foreground mb-6">
                        {t('about.title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                        {t('about.description')}
                    </p>
                </motion.div>
            </div>
        </section>

        {/* Core Values */}
        <section className="max-w-5xl mx-auto px-6 pb-24 space-y-24">
            {/* Value 1 */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold font-cinzel">{t('about.values_title')}</h2>
                </div>
                <div className="prose prose-invert max-w-none text-muted-foreground text-lg leading-8 pl-0 md:pl-16 border-l-2 border-primary/20">
                    <p className="mb-6">
                        {t('about.values_1')}
                    </p>
                    <p className="mb-6" dangerouslySetInnerHTML={{ __html: t('about.values_2') }}></p>
                </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Origins */}
            <div className="space-y-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold font-cinzel">{t('about.origins_title')}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-card/50 p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Crown className="w-5 h-5 text-gold" /> {t('about.val_judgement')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t('about.val_judgement_desc') }}></p>
                    </div>

                    <div className="bg-card/50 p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" /> {t('about.empathy')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            {t('about.empathy_desc')}
                        </p>
                        <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground/80">
                            {(t('about.empathy_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-card/50 p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-400" /> {t('about.needs')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t('about.needs_desc') }}></p>
                    </div>
                </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Why Now */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold font-cinzel">{t('about.why_now_title')}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-12 pl-0 md:pl-16">
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-foreground">{t('about.diff_val')}</h4>
                        <p className="text-muted-foreground">
                            {t('about.diff_val_desc')}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-foreground">{t('about.opportunity')}</h4>
                        <p className="text-muted-foreground">
                            {t('about.opportunity_desc')}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-foreground">{t('about.mission')}</h4>
                        <p className="text-muted-foreground">
                            {t('about.mission_desc')}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-foreground">{t('about.loop')}</h4>
                        <p className="text-muted-foreground">
                            {t('about.loop_desc')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, Sparkles, CheckCircle2, MessageSquare } from "lucide-react";

export default function Waitlist() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call
    setTimeout(() => {
        setSubmitted(true);
        toast.success(t('waitlist.success_toast'));
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background pt-24 flex flex-col selection:bg-primary/20">
      <div className="max-w-4xl mx-auto space-y-16 px-6 flex-1 w-full pb-24 flex flex-col justify-center">
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium border border-primary/20 backdrop-blur-sm mx-auto shadow-[0_0_15px_rgba(192,0,0,0.3)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="tracking-wide uppercase text-xs font-bold text-gold">{t('waitlist.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-cinzel text-foreground leading-tight">
            {t('waitlist.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {t('waitlist.description')}
          </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto w-full bg-card border border-primary/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(192,0,0,0.15)] relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 text-center mb-6">
                        <Rocket className="w-10 h-10 mx-auto text-primary mb-2" />
                        <h3 className="text-xl font-bold text-foreground">{t('waitlist.form_title')}</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <Input 
                            type="email" 
                            placeholder={t('waitlist.email_placeholder')} 
                            className="bg-background/50 border-white/10 h-12 text-lg focus:border-primary/50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                            {t('waitlist.join_btn')} <Sparkles className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground pt-2">
                        {t('waitlist.spam_policy')}
                    </p>
                </form>
            ) : (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8 space-y-4"
                >
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{t('waitlist.success_title')}</h3>
                    <p className="text-muted-foreground">
                        {t('waitlist.success_desc')}
                    </p>
                </motion.div>
            )}
        </motion.div>

        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
            {[
                { label: t('waitlist.stat_1_label'), value: "2,000+" },
                { label: t('waitlist.stat_2_label'), value: "99.9%" },
                { label: t('waitlist.stat_3_label'), value: "24/7" },
            ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/5 border border-white/5">
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 font-cinzel">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center pt-8"
        >
            <Button asChild variant="outline" className="border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary/60 h-12 px-6 rounded-full">
                <Link href="/idea">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('waitlist.enter_idea')}
                </Link>
            </Button>
        </motion.div>

      </div>
      
      <Footer />
    </div>
  );
}

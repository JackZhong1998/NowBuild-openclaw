import { useState, useMemo } from "react";
import { cases as casesZh } from "@/data/cases";
import { cases as casesEn } from "@/data/cases_en";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Heart, Search, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function Showcase() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const cases = useMemo(() => (i18n.language === "en" ? casesEn : casesZh), [i18n.language]);

  const categories = useMemo(() => {
    const cats = new Set(cases.map(c => c.category));
    return ["all", ...Array.from(cats)];
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [cases, searchTerm, categoryFilter]);

  // Translate category function
  const getCategoryLabel = (cat: string) => {
    if (cat === 'all') return t('showcase.filter_all');
    // @ts-ignore
    return t(`categories.${cat}`, cat); 
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium border border-border/50 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('showcase.badge')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 font-cinzel"
          >
            {t('showcase.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed whitespace-pre-line"
          >
            {t('showcase.description')}
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t('showcase.search_placeholder')}
              className="pl-10 bg-secondary/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
            <div className="flex gap-2">
                {categories.map(c => (
                  <Button
                    key={c}
                    variant={categoryFilter === c ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(c)}
                    className="rounded-full whitespace-nowrap"
                  >
                    {getCategoryLabel(c)}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto p-6 md:p-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-muted/60 bg-card/50 backdrop-blur-sm group overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b border-border/40 bg-secondary/20">
                    <Avatar className="h-10 w-10 ring-2 ring-background">
                      <AvatarImage src={item.image} alt={item.author} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary">{item.author[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{item.author}</span>
                      <span className="text-xs text-muted-foreground truncate">{item.authorHandle}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded-full border border-border/50 shadow-sm">
                      <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                      {item.likes}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4 pt-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="font-normal text-xs bg-primary/5 text-primary border-primary/20">{getCategoryLabel(item.category)}</Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4 group-hover:text-foreground transition-colors">
                        {item.description}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.techStack.slice(0, 4).map(tech => (
                        <Badge key={tech} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-secondary text-secondary-foreground/80 hover:bg-secondary-foreground/10">
                            {tech}
                        </Badge>
                        ))}
                        {item.techStack.length > 4 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-secondary text-secondary-foreground/80">
                                +{item.techStack.length - 4}
                            </Badge>
                        )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-3 pb-4 border-t border-border/40 bg-secondary/10">
                    <Button asChild className="w-full group/btn" variant="ghost" size="sm">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-muted-foreground group-hover/btn:text-primary">
                        <span>{t('showcase.view_details')}</span>
                        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredCases.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 space-y-4"
          >
            <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">{t('showcase.no_results')}</h3>
            <p className="text-muted-foreground">{t('showcase.no_results_desc')}</p>
            <Button variant="outline" onClick={() => {setSearchTerm(""); setCategoryFilter("all");}}>
              {t('showcase.clear_filter')}
            </Button>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
}

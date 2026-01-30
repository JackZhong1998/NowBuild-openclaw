import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Apple, Terminal, Download, ArrowRight, Github, Command, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function DownloadPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 flex flex-col">
      {/* Header */}
      <section className="py-20 px-6 text-center space-y-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm border-primary/20 bg-primary/5 text-primary">{t('download.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 font-cinzel">
              {t('download.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
              {t('download.description')}
            </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" asChild>
                <a href="https://clawdbotai.app/download" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    {t('download.btn_official')}
                </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base bg-background/50 backdrop-blur-sm" asChild>
                <a href="https://github.com/clawdbot/clawdbot" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    {t('download.btn_github')}
                </a>
            </Button>
        </motion.div>
      </section>

      {/* Installation Methods */}
      <section className="max-w-5xl mx-auto px-6 pb-24 w-full">
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-secondary/50 backdrop-blur-sm rounded-xl">
            <TabsTrigger value="quick" className="rounded-lg py-2.5">{t('download.tabs.quick')}</TabsTrigger>
            <TabsTrigger value="npm" className="rounded-lg py-2.5">{t('download.tabs.npm')}</TabsTrigger>
            <TabsTrigger value="source" className="rounded-lg py-2.5">{t('download.tabs.source')}</TabsTrigger>
            <TabsTrigger value="desktop" className="rounded-lg py-2.5">{t('download.tabs.desktop')}</TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="quick">
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    {t('download.tabs.quick')}
                  </CardTitle>
                  <CardDescription>
                    {t('download.quick_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative group">
                    <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-slate-800 shadow-inner">
                      curl -fsSL https://clawd.bot/install.sh | bash
                    </div>
                    <Button variant="ghost" size="sm" className="absolute right-2 top-2 h-8 text-xs text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => navigator.clipboard.writeText('curl -fsSL https://clawd.bot/install.sh | bash')}>
                        Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="npm">
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Command className="h-5 w-5 text-orange-500" />
                    {t('download.tabs.npm')}
                  </CardTitle>
                  <CardDescription>
                    {t('download.npm_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm border border-slate-800 shadow-inner">
                    <div className="flex flex-col gap-2">
                        <span className="opacity-50"># Global Install</span>
                        <span>npm i -g clawdbot</span>
                        <span className="opacity-50 mt-2"># Install Daemon</span>
                        <span>clawdbot onboard --install-daemon</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="source">
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    {t('download.tabs.source')}
                  </CardTitle>
                  <CardDescription>
                    {t('download.source_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm border border-slate-800 shadow-inner">
                    <div className="flex flex-col gap-2">
                        <span>git clone https://github.com/clawdbot/clawdbot.git</span>
                        <span>cd clawdbot && pnpm install && pnpm run build</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="desktop">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors cursor-pointer" onClick={() => window.open('https://github.com/clawdbot/clawdbot/releases', '_blank')}>
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Apple className="h-5 w-5" />
                            macOS App (Beta)
                        </CardTitle>
                        <CardDescription>
                            macOS 14+ (Universal Binary)
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t('download.mac_desc')}
                            </p>
                            <div className="flex items-center text-primary text-sm font-medium">
                                Download <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm opacity-70">
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            Windows App
                        </CardTitle>
                        <CardDescription>
                            Coming Soon
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t('download.win_desc')}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
          </div>
        </Tabs>
      </section>

      {/* Features Grid */}
      <section className="bg-secondary/20 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 font-cinzel">{t('download.features_title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: t('download.features.chat_title'),
                        desc: t('download.features.chat_desc'),
                        icon: "💬"
                    },
                    {
                        title: t('download.features.browser_title'),
                        desc: t('download.features.browser_desc'),
                        icon: "🌐"
                    },
                    {
                        title: t('download.features.file_title'),
                        desc: t('download.features.file_desc'),
                        icon: "📂"
                    },
                    {
                        title: t('download.features.shell_title'),
                        desc: t('download.features.shell_desc'),
                        icon: "⚡"
                    }
                ].map((feature, i) => (
                    <Card key={i} className="bg-background/60 backdrop-blur-sm border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="text-3xl mb-2">{feature.icon}</div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h3 className="text-2xl font-bold mb-8 font-cinzel">{t('download.req_title')}</h3>
        <div className="space-y-6">
            <div className="flex gap-4 items-start">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                    <h4 className="font-semibold">Node.js</h4>
                    <p className="text-muted-foreground text-sm">{t('download.req_node')}</p>
                </div>
            </div>
            <Separator />
            <div className="flex gap-4 items-start">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                    <h4 className="font-semibold">{t('download.req_title') === '系统要求' ? '操作系统' : 'Operating System'}</h4>
                    <p className="text-muted-foreground text-sm">{t('download.req_os')}</p>
                </div>
            </div>
            <Separator />
            <div className="flex gap-4 items-start">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                    <h4 className="font-semibold">{t('download.req_title') === '系统要求' ? 'AI 提供商 API Key' : 'AI Provider API Key'}</h4>
                    <p className="text-muted-foreground text-sm">{t('download.req_api')}</p>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

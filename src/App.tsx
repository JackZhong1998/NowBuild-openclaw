import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "@/pages/Landing";
import Showcase from "@/pages/Showcase";
import DownloadPage from "@/pages/Download";
import Waitlist from "@/pages/Waitlist";
import About from "@/pages/About";
import Idea from "@/pages/Idea";
import { Navbar } from "@/components/Navbar";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

function AppRouterContent() {
  const [location] = useLocation();
  const isIdeaPage = location === "/idea";

  return (
    <>
      {!isIdeaPage && <Navbar />}
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/showcase" component={Showcase} />
        <Route path="/download" component={DownloadPage} />
        <Route path="/about" component={About} />
        <Route path="/waitlist" component={Waitlist} />
        <Route path="/idea" component={Idea} />
        <Route path="/subscription" component={Waitlist} />
        <Route path="/:rest*" component={Landing} />
      </Switch>
    </>
  );
}

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <AppRouterContent />
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
        signInForceRedirectUrl="/#/waitlist"
        signUpForceRedirectUrl="/#/waitlist"
      >
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;

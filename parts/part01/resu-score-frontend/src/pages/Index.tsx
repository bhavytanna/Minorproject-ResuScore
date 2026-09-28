import { motion } from "framer-motion";
import { Sparkles, Target, FileSearch, CheckSquare, TrendingUp, Zap, Shield, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { FeatureCard } from "@/components/FeatureCard";
import { BackgroundEffects } from "@/components/BackgroundEffects";

const features = [
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Get instant feedback on how well your resume parses through applicant tracking systems.",
  },
  {
    icon: FileSearch,
    title: "Content Analysis",
    description: "AI-powered analysis of your skills, experience, and achievements presentation.",
  },
  {
    icon: CheckSquare,
    title: "Format Check",
    description: "Ensure your resume follows industry-standard formatting best practices.",
  },
  {
    icon: TrendingUp,
    title: "Keyword Analysis",
    description: "Identify missing keywords and optimize for specific job descriptions.",
  },
  {
    icon: Zap,
    title: "Instant Scoring",
    description: "Get a comprehensive score with detailed breakdown in seconds.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your resume data is encrypted and never stored or shared.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  AI-Powered Resume Analysis
                </span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Get Your Resume
                <br />
                <span className="gradient-text glow-text">ATS-Ready</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                Upload your resume and get instant feedback on ATS compatibility,
                formatting, content quality, and actionable improvements.
              </p>
            </motion.div>

            {/* Coming Soon Upload Box */}
            <motion.div
              className="max-w-2xl mx-auto glass rounded-2xl p-12 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Lock className="w-12 h-12 text-primary/60" />
                <p className="text-xl font-semibold text-foreground">Upload Feature</p>
                <p className="text-sm">
                  📌 <strong>Part 1 of 10</strong> – This part demonstrates the project's landing page UI, feature cards, animations, and overall design system.
                </p>
                <div className="px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium text-sm">
                  🚧 File Upload coming in Part 2
                </div>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                "1K+ Resumes Analyzed",
                "95% Accuracy Rate",
                "Free to Use",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </motion.div>
          </section>

          {/* Features Grid */}
          <section className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-muted-foreground text-lg">
                Comprehensive analysis to make your resume stand out
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.1 * index + 0.7}
                />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <motion.section
            className="max-w-4xl mx-auto mt-24 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="glass rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Start analyzing your resume for free and get actionable insights in seconds.
                </p>
                <motion.button
                  className="px-8 py-4 rounded-xl bg-primary/30 text-primary-foreground font-semibold text-lg border border-primary/40 cursor-not-allowed inline-flex items-center gap-2 opacity-60"
                  disabled
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze Now (Coming in Part 2)
                </motion.button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 ResuScore. Built with precision for job seekers.</p>
          <p className="mt-1 text-xs text-primary/60">📌 Part 1 of 10 – Landing Page & UI Design System</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

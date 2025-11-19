import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Carbon Report
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
          Simplify Carbon Footprint Reporting
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Prepare ISO 14067, CBAM, and environmental reports with guided questionnaires,
          automated data collection, and collaborative workflows.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            View Demo
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Everything you need for carbon reporting
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Report Templates"
            description="Pre-built templates for ISO 14067, CBAM, and custom reports"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Data Requests"
            description="Request data from suppliers and stakeholders with one click"
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Progress Tracking"
            description="Visual roadmap and completion tracking for every project"
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-6 w-6" />}
            title="Smart Questionnaires"
            description="Adaptive forms that recommend relevant report types"
          />
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Create Project"
              description="Answer a quick questionnaire or manually select report types"
            />
            <Step
              number="2"
              title="Collect Data"
              description="Fill in data yourself or request from contacts via email templates"
            />
            <Step
              number="3"
              title="Export Reports"
              description="Generate professional PDF reports ready for submission"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join companies streamlining their carbon reporting process.
        </p>
        <Link
          href="/register"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2"
        >
          Create Free Account
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 rounded-lg bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Carbon Report Platform
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://carbonreport.app" 
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
              >
                carbonreport.app
              </a>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                © 2025 Carbon Report. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors">
      <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

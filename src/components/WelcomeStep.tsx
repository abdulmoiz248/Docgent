"use client"

import { motion } from "framer-motion"
import { FileText, Receipt, GraduationCap, BarChart3, Sparkles } from "lucide-react"
import type { DocumentType, AppState } from "@/app/page"

interface WelcomeStepProps {
  onNext: () => void
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export default function WelcomeStep({ onNext, appState, updateAppState }: WelcomeStepProps) {
  const documentTypes = [
    {
      type: "invoice" as DocumentType,
      title: "Invoice",
      description: "Professional billing documents with automated calculations",
      icon: Receipt,
      gradient: "from-blue-500 to-cyan-500",
      features: ["Auto calculations", "Client management", "Payment terms"],
    },
    {
      type: "word-doc" as DocumentType,
      title: "Word Doc",
      description: "General purpose documents for any occasion",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      features: ["Flexible content", "Custom structure", "Rich formatting"],
    },
    {
      type: "assignment" as DocumentType,
      title: "Assignment",
      description: "Academic papers with proper citations and structure",
      icon: GraduationCap,
      gradient: "from-green-500 to-emerald-500",
      features: ["Academic format", "Citation support", "Research structure"],
    },
    {
      type: "report" as DocumentType,
      title: "Report",
      description: "Business and research reports with data insights",
      icon: BarChart3,
      gradient: "from-orange-500 to-red-500",
      features: ["Executive summary", "Data analysis", "Recommendations"],
    },
  ]

  const handleSelection = (type: DocumentType) => {
    updateAppState({ documentType: type })
    setTimeout(onNext, 400)
  }

  return (
    <div className="max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">Hello, what do you want to make today?</h2>
          <Sparkles className="w-8 h-8 text-yellow-400 ml-3" />
        </div>
        <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Choose the type of document you'd like to create and let our AI handle the rest
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        {documentTypes.map((doc, index) => (
          <motion.div
            key={doc.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4 + index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.02,
              y: -8,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelection(doc.type)}
            className="group cursor-pointer"
          >
            <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 h-full transition-all duration-500 hover:border-slate-600/70 hover:bg-slate-800/60 overflow-hidden">
              {/* Background gradient effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${doc.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${doc.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg`}
              >
                <doc.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 group-hover:bg-clip-text transition-all duration-300">
                  {doc.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{doc.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {doc.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-slate-500">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${doc.gradient} mr-2`} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover border effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${doc.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}
                style={{
                  background: `linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%, transparent 100%)`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-500 text-sm">
          ✨ All documents are generated with AI and can be customized to your needs
        </p>
      </motion.div>
    </div>
  )
}

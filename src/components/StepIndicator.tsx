"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Welcome", description: "Choose document type" },
    { number: 2, title: "Content", description: "Add your information" },
    { number: 3, title: "Outline", description: "Review structure" },
    { number: 4, title: "Generate", description: "Create document" },
  ]

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2 md:space-x-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 md:p-6">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 transition-all duration-500 ${
                  currentStep > step.number
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 shadow-lg shadow-green-400/25"
                    : currentStep === step.number
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 shadow-lg shadow-blue-400/25"
                      : "bg-slate-800/50 border-slate-600 hover:border-slate-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                {currentStep > step.number ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                ) : (
                  <span className="text-white font-bold text-lg md:text-xl">{step.number}</span>
                )}
              </motion.div>

              <div className="mt-3 text-center hidden sm:block">
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    currentStep >= step.number ? "text-white" : "text-slate-400"
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-300 ${
                    currentStep >= step.number ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>

            {index < steps.length - 1 && (
              <motion.div
                className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 transition-all duration-500 ${
                  currentStep > step.number ? "bg-green-400" : "bg-slate-600"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

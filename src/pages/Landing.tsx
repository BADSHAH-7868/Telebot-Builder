import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Code, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Do I need coding experience to use TeleBot AI?',
    answer: 'No! TeleBot AI is designed for everyone. Just describe what you want your Telegram bot to do, and our AI will generate the Python code for you.',
  },
  {
    question: 'What kind of bots can I create?',
    answer: 'You can create a wide range of Telegram bots, from simple chatbots to complex bots with features like user authentication, database integration, and custom commands.',
  },
  {
    question: 'Is the generated code ready to deploy?',
    answer: 'Yes, the code is production-ready and uses the python-telegram-bot library. You can deploy it to platforms like Heroku, AWS, or any server supporting Python.',
  },
  {
    question: 'How do I get an API key?',
    answer: 'You can get a free OpenRouter API key from https://openrouter.ai/keys to access our supported AI models.',
  },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Particle Effects */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
          className="text-center space-y-8 max-w-5xl mx-auto"
        >
          {/* Logo and Title */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl">
              <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ahsan Labs TeleBot AI
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Transform your ideas into powerful Telegram bots with AI-driven code generation.
          </motion.p>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            No coding skills? No problem. Describe your bot, and our AI will craft production-ready Python code using python-telegram-bot.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/select-model')}
            >
              Build Your Bot Now
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-gray-700/50 rounded-full text-white font-semibold text-lg hover:bg-gray-600/50 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Why TeleBot AI Section */}
      <section id="why" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/20">
        <motion.div
          className="container mx-auto text-center space-y-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Choose TeleBot AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}
            >
              <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Smart AI Generation</h3>
              <p className="text-gray-400 text-sm">
                Our AI understands your needs and generates optimized, secure Python code tailored to your vision.
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(168, 85, 247, 0.2)' }}
            >
              <Code className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Production-Ready Code</h3>
              <p className="text-gray-400 text-sm">
                Get complete Python scripts using python-telegram-bot, ready to deploy on any platform.
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(6, 182, 212, 0.2)' }}
            >
              <Zap className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Easy Customization</h3>
              <p className="text-gray-400 text-sm">
                Edit and refine your bot’s code with AI assistance, no coding expertise required.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="container mx-auto text-center space-y-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 80, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-300 text-sm mb-4">
                "TeleBot AI made it so easy to create a Telegram bot for my community. I just described what I wanted, and the code was ready in minutes!"
              </p>
              <p className="text-white font-semibold">Alex M., Community Manager</p>
            </motion.div>
            <motion.div
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-300 text-sm mb-4">
                "I’m not a developer, but TeleBot AI helped me build a bot with custom commands for my business. It’s a game-changer!"
              </p>
              <p className="text-white font-semibold">Sarah K., Small Business Owner</p>
            </motion.div>
            <motion.div
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-300 text-sm mb-4">
                "The AI refinement feature is amazing. I added complex features to my bot with just a few prompts. Highly recommend!"
              </p>
              <p className="text-white font-semibold">James T., Developer</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/20">
        <motion.div
          className="container mx-auto text-center space-y-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className="w-full flex justify-between items-center text-left text-white text-lg font-semibold"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-400" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.p
                    className="text-gray-400 text-sm mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Create Your Bot?</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of users building smarter Telegram bots with TeleBot AI.
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/select-model')}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Cpu, Check } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
}

const FREE_MODELS: Model[] = [
  // { id: 'openai/gpt-oss-20b:free', name: 'GPT-OSS 20B', provider: 'OpenAI', description: 'Powerful general-purpose model' },
  { id: 'openrouter/sonoma-dusk-alpha', name: 'Sonoma Dusk Alpha', provider: 'Openrouter', description: 'Latest experimental model' },
  { id: 'openrouter/sonoma-sky-alpha', name: 'Sonoma Sky Alpha', provider: 'Openrouter', description: 'Latest experimental model' },
  // { id: 'agentica-org/deepcoder-14b-preview:free', name: 'DeepCoder 14B', provider: 'Agentica', description: 'Specialized coding model' },
  // { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B', provider: 'OpenAI', description: 'Large context understanding' },
  // { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', provider: 'Z.AI', description: 'Fast and efficient model' },
  // { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', provider: 'Qwen', description: 'Code generation specialist' },
  // { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', provider: 'Meta', description: 'Advanced reasoning capabilities' },
  // { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', provider: 'DeepSeek', description: 'Research-focused model' },
  // { id: 'anthropic/claude-3-haiku:free', name: 'Claude 3 Haiku', provider: 'Anthropic', description: 'Creative and helpful assistant' },
  // { id: 'google/gemini-flash-1.5:free', name: 'Gemini Flash 1.5', provider: 'Google', description: 'Fast multimodal processing' },
];

const ModelSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const handleContinue = () => {
    if (selectedModel && apiKey) {
      sessionStorage.setItem('selectedModel', selectedModel);
      sessionStorage.setItem('apiKey', apiKey);
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Configure Your AI Assistant</h1>
        </motion.header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Select AI Model</h2>
              </div>
              <div className="space-y-3 max-h-[32rem] overflow-y-auto custom-scrollbar pr-2">
                {FREE_MODELS.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 80 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedModel === model.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:bg-gray-700/20'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-white">{model.name}</h3>
                        <p className="text-sm text-gray-400">{model.provider}</p>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">{model.description}</p>
                      </div>
                      {selectedModel === model.id && (
                        <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* API Key Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">API Configuration</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-2">
                    OpenRouter API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                      placeholder="Enter your OpenRouter API key"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-base font-semibold text-blue-400 mb-2">Need an API Key?</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Get your free OpenRouter API key to access all available models.
                  </p>
                  <a
                    href="https://openrouter.ai/models?max_price=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    Get API Key →
                  </a>
                </div>

                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base"
                  disabled={!selectedModel || !apiKey}
                  onClick={handleContinue}
                  whileHover={{ scale: selectedModel && apiKey ? 1.02 : 1 }}
                  whileTap={{ scale: selectedModel && apiKey ? 0.98 : 1 }}
                >
                  Continue to Chat
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ModelSelection;
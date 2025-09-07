import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Edit3, Wand2, Check, Send, Bot, User, MessageSquare } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const CodeEditor: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const [requirements, setRequirements] = useState<string>('');
  const [isEditingCode, setIsEditingCode] = useState<boolean>(false);
  const [editedCode, setEditedCode] = useState<string>('');
  const [editedRequirements, setEditedRequirements] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isCopiedCode, setIsCopiedCode] = useState<boolean>(false);
  const [isCopiedRequirements, setIsCopiedRequirements] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<'chat' | 'refine'>('chat');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedModel = sessionStorage.getItem('selectedModel');
  const apiKey = sessionStorage.getItem('apiKey');
  const conversationContext = sessionStorage.getItem('conversationContext') || '';

  useEffect(() => {
    const storedCode = sessionStorage.getItem('generatedCode');
    const storedRequirements = sessionStorage.getItem('requirementsTxt');
    
    if (!storedCode || !selectedModel || !apiKey) {
      navigate('/select-model');
      return;
    }
    
    setCode(storedCode);
    setEditedCode(storedCode);
    setRequirements(storedRequirements || 'python-telegram-bot==20.0\n');
    setEditedRequirements(storedRequirements || 'python-telegram-bot==20.0\n');
    setIsLoading(false);
  }, [selectedModel, apiKey, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const downloadFiles = () => {
    const finalCode = isEditingCode ? editedCode : code;
    const finalRequirements = isEditingCode ? editedRequirements : requirements;

    // Download Python file
    const codeBlob = new Blob([finalCode], { type: 'text/plain' });
    const codeUrl = URL.createObjectURL(codeBlob);
    const codeA = document.createElement('a');
    codeA.href = codeUrl;
    codeA.download = 'telegram_bot.py';
    codeA.click();
    URL.revokeObjectURL(codeUrl);

    // Download requirements.txt
    const reqBlob = new Blob([finalRequirements], { type: 'text/plain' });
    const reqUrl = URL.createObjectURL(reqBlob);
    const reqA = document.createElement('a');
    reqA.href = reqUrl;
    reqA.download = 'requirements.txt';
    reqA.click();
    URL.revokeObjectURL(reqUrl);
  };

  const copyCode = async () => {
    const finalCode = isEditingCode ? editedCode : code;
    try {
      await navigator.clipboard.writeText(finalCode);
      setIsCopiedCode(true);
      setTimeout(() => setIsCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      setError('Failed to copy code to clipboard.');
    }
  };

  const copyRequirements = async () => {
    const finalRequirements = isEditingCode ? editedRequirements : requirements;
    try {
      await navigator.clipboard.writeText(finalRequirements);
      setIsCopiedRequirements(true);
      setTimeout(() => setIsCopiedRequirements(false), 2000);
    } catch (err) {
      console.error('Failed to copy requirements:', err);
      setError('Failed to copy requirements to clipboard.');
    }
  };

  const handleInputSubmit = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);

    if (mode === 'refine') {
      await refineCode();
    } else {
      await sendChatMessage();
    }

    setIsProcessing(false);
  };

  const refineCode = async () => {
    const maxRetries = 5;
    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: 'system',
                content: `You are an expert Python developer. Update the provided Telegram bot code and requirements.txt based on the user's modification request while maintaining existing functionality. 
Output format: First, the full updated Python code, then a separator '---REQUIREMENTS---', then the updated contents of requirements.txt as plain text.
Return only the complete, updated Python code with comments and requirements.txt.`,
              },
              {
                role: 'user',
                content: `Current code:\n\n${isEditingCode ? editedCode : code}\n\nCurrent requirements.txt:\n\n${isEditingCode ? editedRequirements : requirements}\n\nModification request: ${inputText}\n\nReturn the complete updated code and requirements.txt.`,
              },
            ],
            max_tokens: 9000,
            temperature: 0.4,
          }),
        });

        if (!response.ok) throw new Error(`API call failed with status ${response.status}`);

        const data = await response.json();
        const refinedContent: string = data.choices[0]?.message?.content || '';
        
        if (!refinedContent.includes('---REQUIREMENTS---')) {
          throw new Error('Invalid response format: Missing ---REQUIREMENTS--- separator');
        }

        const [refinedCode, refinedRequirements] = refinedContent.split('---REQUIREMENTS---').map(part => part.trim());

        setEditedCode(refinedCode);
        setEditedRequirements(refinedRequirements);
        setIsEditingCode(true);
        setInputText('');
        return;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        attempt++;
        if (attempt === maxRetries) {
          setError(`Failed to refine code after ${maxRetries} attempts. Please try again later.`);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };

  const sendChatMessage = async () => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputText('');

    const maxRetries = 5;
    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: 'system',
                content: 'You are a helpful AI assistant for discussing and explaining the generated Telegram bot code. Provide insights, explanations, or suggestions, but do not generate or modify code here. For code changes, suggest using the refine feature.',
              },
              ...chatMessages.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content,
              })),
              {
                role: 'user',
                content: `Conversation context from bot design: ${conversationContext}\n\n${inputText}`,
              },
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) throw new Error(`API call failed with status ${response.status}`);

        const data = await response.json();
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.choices[0]?.message?.content || 'No response from AI.',
          sender: 'ai',
          timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, aiResponse]);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        attempt++;
        if (attempt === maxRetries) {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: 'Sorry, I hit a snag after several tries. Please try again.',
            sender: 'ai',
            timestamp: new Date(),
          };
          setChatMessages((prev) => [...prev, errorMessage]);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="w-2 h-2 bg-white rounded-full" />
          <span>Loading...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-red-400">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
          onClick={() => navigate('/chat')}
        >
          Back to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-3 sm:p-4 sticky top-0 z-20 shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto flex flex-col items-start gap-3">
          <div className="flex items-center gap-3 w-full">
            <motion.button
              onClick={() => navigate('/chat')}
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white shadow-md hover:shadow-blue-500/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-white">Bot Code Editor</h1>
              <p className="text-xs sm:text-sm text-gray-300">Review and refine your Telegram bot script</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <motion.button
              className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-blue-500/30 transition-all duration-300"
              onClick={() => setIsEditingCode(!isEditingCode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 justify-center">
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{isEditingCode ? 'View' : 'Edit'}</span>
              </div>
            </motion.button>
            <motion.button
              className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-blue-500/30 transition-all duration-300"
              onClick={copyCode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 justify-center">
                {isCopiedCode ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span>{isCopiedCode ? 'Copied Code!' : 'Copy Code'}</span>
              </div>
            </motion.button>
            <motion.button
              className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-blue-500/30 transition-all duration-300"
              onClick={copyRequirements}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 justify-center">
                {isCopiedRequirements ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span>{isCopiedRequirements ? 'Copied Req!' : 'Copy Req'}</span>
              </div>
            </motion.button>
            <motion.button
              className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-blue-500/30 transition-all duration-300"
              onClick={downloadFiles}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 justify-center">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Download Files</span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-3 sm:px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* Code Editor/Viewer Section */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Python Code */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
          >
            <h2 className="p-3 border-b border-gray-700/30 text-sm font-medium">telegram_bot.py</h2>
            {isEditingCode ? (
              <textarea
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                className="w-full h-[40vh] p-3 sm:p-4 bg-gray-900 text-white font-mono text-xs sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 custom-scrollbar"
                style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace', lineHeight: '1.5', tabSize: 4 }}
                spellCheck={false}
              />
            ) : (
              <div className="h-[40vh] overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                  language="python"
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: window.innerWidth < 640 ? '8px' : '16px',
                    fontSize: window.innerWidth < 640 ? '12px' : '14px',
                    lineHeight: '1.5',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    borderRadius: '8px',
                  }}
                  showLineNumbers
                  wrapLines
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            )}
          </motion.div>

          {/* Requirements.txt */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
          >
            <h2 className="p-3 border-b border-gray-700/30 text-sm font-medium">requirements.txt</h2>
            {isEditingCode ? (
              <textarea
                value={editedRequirements}
                onChange={(e) => setEditedRequirements(e.target.value)}
                className="w-full h-[20vh] p-3 sm:p-4 bg-gray-900 text-white font-mono text-xs sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 custom-scrollbar"
                style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace', lineHeight: '1.5', tabSize: 4 }}
                spellCheck={false}
              />
            ) : (
              <div className="h-[20vh] overflow-auto custom-scrollbar p-3 sm:p-4 text-xs sm:text-sm whitespace-pre-wrap">
                {requirements}
              </div>
            )}
          </motion.div>
        </div>

        {/* Interaction Section */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.div
            className="bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700/30 shadow-lg p-3 sm:p-4 flex flex-col flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
          >
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                className={`flex items-center gap-2 text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-lg ${mode === 'chat' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setMode('chat')}
              >
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Chat with AI</span>
              </button>
              <button
                className={`flex items-center gap-2 text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-lg ${mode === 'refine' ? 'bg-purple-600' : 'bg-gray-700'}`}
                onClick={() => setMode('refine')}
              >
                <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Refine Code</span>
              </button>
            </div>

            {/* Chat Messages (Visible in Chat Mode) */}
            {mode === 'chat' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto space-y-2 custom-scrollbar"
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`p-1 rounded-full ${
                          message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <User className="w-3 h-3 text-white" />
                        ) : (
                          <Bot className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div
                        className={`p-2 rounded-lg text-xs ${
                          message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-[10px] opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && mode === 'chat' && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded-full bg-purple-600">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="p-2 rounded-lg bg-gray-700">
                        <div className="flex items-center gap-1">
                          <motion.div
                            className="flex gap-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </motion.div>
            )}

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={mode === 'chat' ? 'Ask about the code...' : 'Specify refinements (e.g., add logging, improve error handling, add new commands)...'}
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-300 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 resize-none"
                  rows={2}
                  disabled={isProcessing}
                />
                <motion.button
                  className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white disabled:opacity-50"
                  onClick={handleInputSubmit}
                  disabled={!inputText.trim() || isProcessing}
                  whileHover={{ scale: inputText.trim() && !isProcessing ? 1.05 : 1 }}
                  whileTap={{ scale: inputText.trim() && !isProcessing ? 0.95 : 1 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              {isProcessing && mode === 'refine' && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
                  <motion.div
                    className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span>Refining...</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
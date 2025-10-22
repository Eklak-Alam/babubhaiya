import { useEffect, useState } from "react";
import { FaRobot, FaTimes, FaCopy, FaCheck, FaChartBar, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";
import { useTheme } from '@/context/ThemeContext';

export default function AnalyzeResponseModal({ 
  isOpen, 
  onClose, 
  analysisData,
  isLoading = false 
}) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Theme-based styles
  const themeStyles = {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    modalBackground: theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
      : 'bg-gradient-to-br from-white to-gray-50',
    modalBorder: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-400/50',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      tertiary: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    },
    card: {
      background: theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/80',
      border: theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50',
    },
    button: {
      primary: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
      secondary: theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200',
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const copyToClipboard = async () => {
    if (analysisData?.summary) {
      await navigator.clipboard.writeText(analysisData.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm transition-opacity duration-300 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative ${themeStyles.modalBackground} border ${themeStyles.modalBorder} rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 ${
          animateIn ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${themeStyles.card.border}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaRobot className="text-white text-lg sm:text-xl" />
              </div>
              <div className={`absolute -inset-1 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-400/20'} rounded-xl blur-sm animate-pulse`}></div>
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${themeStyles.text.primary}`}>AI Conversation Analysis</h2>
              <p className={`text-xs sm:text-sm ${themeStyles.text.secondary}`}>Powered by Accord AI</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 ${themeStyles.button.secondary}`}
          >
            <FaTimes size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
              <div className="relative mb-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 border-4 ${theme === 'dark' ? 'border-purple-500/20' : 'border-purple-400/30'} border-t-purple-500 rounded-full animate-spin`}></div>
                <FaRobot className="absolute inset-0 m-auto text-purple-400 text-lg sm:text-xl" />
              </div>
              <h3 className={`text-base sm:text-lg font-semibold ${themeStyles.text.primary} mb-2`}>Analyzing Conversation</h3>
              <p className={`${themeStyles.text.secondary} text-center text-sm sm:text-base`}>AI is analyzing your chat patterns and providing insights...</p>
              
              {/* Animated dots */}
              <div className="flex gap-1 mt-4">
                {[0, 1, 2].map((index) => (
                  <div 
                    key={index}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${index * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : analysisData ? (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Summary Section */}
              <div className={`${themeStyles.card.background} rounded-xl p-3 sm:p-4 border-l-4 border-purple-500`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <FaChartBar className="text-purple-400" />
                  <h3 className={`font-semibold ${themeStyles.text.primary} text-sm sm:text-base`}>Summary</h3>
                </div>
                <p className={`${themeStyles.text.secondary} leading-relaxed text-sm sm:text-base`}>{analysisData.summary}</p>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 mt-2 sm:mt-3 px-2 sm:px-3 py-1 text-xs sm:text-sm text-purple-400 hover:text-purple-300 ${
                    theme === 'dark' ? 'hover:bg-purple-500/20' : 'hover:bg-purple-500/10'
                  } rounded-lg transition-all duration-200`}
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  {copied ? "Copied!" : "Copy Summary"}
                </button>
              </div>

              {/* Key Insights */}
              {analysisData.insights && analysisData.insights.length > 0 && (
                <div className={`${themeStyles.card.background} rounded-xl p-3 sm:p-4 border-l-4 border-blue-500`}>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <FaLightbulb className="text-blue-400" />
                    <h3 className={`font-semibold ${themeStyles.text.primary} text-sm sm:text-base`}>Key Insights</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisData.insights.map((insight, index) => (
                      <div key={index} className={`flex items-start gap-3 p-2 sm:p-3 ${
                        theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-200/50'
                      } rounded-lg`}>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                        <p className={`${themeStyles.text.secondary} text-xs sm:text-sm`}>{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment Analysis */}
              {analysisData.sentiment && (
                <div className={`${themeStyles.card.background} rounded-xl p-3 sm:p-4 border-l-4 border-green-500`}>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className={`font-semibold ${themeStyles.text.primary} text-sm sm:text-base`}>Sentiment Analysis</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      analysisData.sentiment.score > 0.3 
                        ? `${
                            theme === 'dark' 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                              : "bg-green-500/10 text-green-600 border border-green-500/30"
                          }`
                        : analysisData.sentiment.score < -0.3
                        ? `${
                            theme === 'dark' 
                              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                              : "bg-red-500/10 text-red-600 border border-red-500/30"
                          }`
                        : `${
                            theme === 'dark' 
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                              : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30"
                          }`
                    }`}>
                      {analysisData.sentiment.label}
                    </div>
                    <span className={`${themeStyles.text.secondary} text-xs sm:text-sm`}>
                      Confidence: {Math.round(analysisData.sentiment.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                <div className={`${themeStyles.card.background} rounded-xl p-3 sm:p-4 border-l-4 border-yellow-500`}>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <FaExclamationTriangle className="text-yellow-400" />
                    <h3 className={`font-semibold ${themeStyles.text.primary} text-sm sm:text-base`}>Recommendations</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisData.recommendations.map((rec, index) => (
                      <div key={index} className={`flex items-start gap-3 p-2 sm:p-3 ${
                        theme === 'dark' 
                          ? 'bg-yellow-500/10 border border-yellow-500/20' 
                          : 'bg-yellow-500/5 border border-yellow-500/20'
                      } rounded-lg`}>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                        <p className={`${
                          theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
                        } text-xs sm:text-sm`}>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {analysisData.statistics && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className={`${themeStyles.card.background} rounded-lg p-2 sm:p-3 text-center`}>
                    <div className="text-xl sm:text-2xl font-bold text-purple-400">{analysisData.statistics.totalMessages}</div>
                    <div className={`text-xs ${themeStyles.text.secondary}`}>Total Messages</div>
                  </div>
                  <div className={`${themeStyles.card.background} rounded-lg p-2 sm:p-3 text-center`}>
                    <div className="text-xl sm:text-2xl font-bold text-blue-400">{analysisData.statistics.avgResponseTime}m</div>
                    <div className={`text-xs ${themeStyles.text.secondary}`}>Avg Response</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
              <div className={`${themeStyles.text.secondary} mb-4 text-sm sm:text-base`}>No analysis data available</div>
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end p-4 sm:p-6 border-t ${themeStyles.card.border}`}>
          <button
            onClick={onClose}
            className={`px-4 sm:px-6 py-2 ${themeStyles.button.primary} ${themeStyles.text.primary} rounded-lg transition-all duration-200 font-medium text-sm sm:text-base`}
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
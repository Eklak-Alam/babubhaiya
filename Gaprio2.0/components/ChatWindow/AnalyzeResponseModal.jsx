import { useEffect, useState } from "react";
import { FaRobot, FaTimes, FaCopy, FaCheck, FaChartBar, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";

export default function AnalyzeResponseModal({ 
  isOpen, 
  onClose, 
  analysisData,
  isLoading = false 
}) {
  const [copied, setCopied] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 ${
          animateIn ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaRobot className="text-white text-xl" />
              </div>
              <div className="absolute -inset-1 bg-purple-500/20 rounded-xl blur-sm animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Conversation Analysis</h2>
              <p className="text-sm text-gray-400">Powered by Accord AI</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                <FaRobot className="absolute inset-0 m-auto text-purple-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analyzing Conversation</h3>
              <p className="text-gray-400 text-center">AI is analyzing your chat patterns and providing insights...</p>
              
              {/* Animated dots */}
              <div className="flex gap-1 mt-4">
                {[0, 1, 2].map((index) => (
                  <div 
                    key={index}
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${index * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : analysisData ? (
            <div className="p-6 space-y-6">
              {/* Summary Section */}
              <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-3">
                  <FaChartBar className="text-purple-400" />
                  <h3 className="font-semibold text-white">Summary</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{analysisData.summary}</p>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 mt-3 px-3 py-1 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all duration-200"
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  {copied ? "Copied!" : "Copy Summary"}
                </button>
              </div>

              {/* Key Insights */}
              {analysisData.insights && analysisData.insights.length > 0 && (
                <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-3">
                    <FaLightbulb className="text-blue-400" />
                    <h3 className="font-semibold text-white">Key Insights</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisData.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment Analysis */}
              {analysisData.sentiment && (
                <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="font-semibold text-white">Sentiment Analysis</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisData.sentiment.score > 0.3 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : analysisData.sentiment.score < -0.3
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      {analysisData.sentiment.label}
                    </div>
                    <span className="text-gray-400 text-sm">
                      Confidence: {Math.round(analysisData.sentiment.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center gap-2 mb-3">
                    <FaExclamationTriangle className="text-yellow-400" />
                    <h3 className="font-semibold text-white">Recommendations</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-yellow-300 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {analysisData.statistics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{analysisData.statistics.totalMessages}</div>
                    <div className="text-xs text-gray-400">Total Messages</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{analysisData.statistics.avgResponseTime}m</div>
                    <div className="text-xs text-gray-400">Avg Response</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="text-gray-400 mb-4">No analysis data available</div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 font-medium"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
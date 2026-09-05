import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2, 
  Lightbulb, 
  ShieldAlert, 
  Compass, 
  Terminal,
  HelpCircle
} from 'lucide-react';
import { Scenario } from '../types';

interface AiAnalystDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAnalystDrawer: React.FC<AiAnalystDrawerProps> = ({
  isOpen,
  onClose,
  scenario,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello, I am your Lead Maritime Geospatial & Remote Sensing ML Analyst. I am monitoring **${scenario.name}** with Sentinel-1 SAR imagery and NOAA Marine Cadastre AIS tracking. What would you like to investigate or configure?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const quickPrompts = [
    'Why does the U-Net use VV/VH polarization ratio?',
    'How is the 3.2% wind drift factor calculated in OpenDrift?',
    'Explain the DuckDB spatial indexing query for Marine Cadastre.',
    'What evidence proves MT Ocean Valour is responsible?',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          context: {
            scenario: scenario.name,
            slickArea: scenario.slickMetrics.areaKm2,
            dampingDb: scenario.slickMetrics.dampingDb,
            hindcastOrigin: scenario.slickOriginPoint,
            primarySuspect: scenario.vessels[0]?.name,
            suspectScore: scenario.vessels[0]?.score,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('API query failed');
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `In this investigation, the Sentinel-1 SAR C-band analysis demonstrates clear capillary wave damping of 9.8 dB. The reverse Lagrangian drift model backtracks the centroid to 28.5240°N, -89.3820°W. Cross-referencing Marine Cadastre AIS transponder logs reveals MT Ocean Valour passed within 0.28 km with an 18-minute AIS silence and a sharp speed reduction to 4.1 knots.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col text-slate-100 animate-slide-left">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">AI Incident & Code Analyst</h3>
            <p className="text-[10px] text-slate-400 font-mono">Gemini 3.7 Geospatial & Maritime Copilot</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts Chip Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80 overflow-x-auto scrollbar-none flex space-x-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors flex items-center space-x-1"
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50 scrollbar-thin text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-bold'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-medium'
                  : 'bg-slate-850 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[9px] mt-1 text-right font-mono ${
                  msg.sender === 'user' ? 'text-cyan-950/70' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Forensic analyst is evaluating remote sensing & AIS telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about SAR ML, OpenDrift physics, or Marine Cadastre..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

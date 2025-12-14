import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Map, 
  ShieldQuestion, 
  BookOpen, 
  Menu as MenuIcon,
  Image as ImageIcon,
  Home
} from 'lucide-react';

// --- Configuration ---
// Lazy initialization to avoid top-level crashes if process is undefined during initial load
const getAI = () => {
  const key = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  if (!key) console.warn("API Key might be missing");
  return new GoogleGenAI({ apiKey: key });
};

// Models
const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";

// --- Types ---
type GameState = 'MENU' | 'PLAYING' | 'LOADING' | 'ERROR';

interface StoryNode {
  text: string;
  choices: { text: string }[];
  imagePrompt?: string;
  title?: string;
}

interface GameContext {
  genre: string;
  history: string[];
}

// --- Components ---

// 1. Loading Screen
const LoadingScreen = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full space-y-8 p-8 text-center animate-fade-in bg-slate-900/50 backdrop-blur-sm">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
      <div className="relative p-4 rounded-full border border-indigo-500/30 bg-slate-900/50 shadow-2xl">
         <Sparkles className="w-12 h-12 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-xl font-medium tracking-wide text-indigo-100">{message}</p>
      <div className="flex gap-1 justify-center">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  </div>
);

// 2. Main Menu
const MainMenu = ({ onStart }: { onStart: (genre: string) => void }) => {
  const genres = [
    { id: 'fantasy', name: 'Фэнтези', icon: <Map className="w-6 h-6" />, desc: 'Меч и магия' },
    { id: 'scifi', name: 'Киберпанк', icon: <ShieldQuestion className="w-6 h-6" />, desc: 'Будущее и технологии' },
    { id: 'mystery', name: 'Детектив', icon: <BookOpen className="w-6 h-6" />, desc: 'Тайны и расследования' },
  ];

  return (
    <div className="flex flex-col h-full w-full p-6 animate-fade-in relative overflow-hidden bg-slate-900">
        {/* Background Atmosphere */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-purple-900/20 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50%] bg-blue-900/20 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col h-full max-w-md mx-auto w-full">
            <header className="mb-10 mt-6 text-center space-y-2">
                <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-2 shadow-lg shadow-indigo-900/20">
                     <Sparkles className="w-8 h-8 text-indigo-300" />
                </div>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200 drop-shadow-sm tracking-tight">
                    ЭХО
                </h1>
                <p className="text-xs font-bold text-indigo-400/80 uppercase tracking-[0.3em]">Интерактивные Миры</p>
            </header>

            <div className="flex-1 flex flex-col justify-center space-y-4">
                {genres.map((genre, idx) => (
                    <button
                        key={genre.id}
                        onClick={() => onStart(genre.name)}
                        className="group relative overflow-hidden glass-button p-4 rounded-2xl text-left transition-all active:scale-[0.97]"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center space-x-4">
                            <div className="p-3 bg-slate-800/80 rounded-xl text-indigo-400 group-hover:text-indigo-300 transition-colors shadow-inner">
                                {genre.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors">{genre.name}</h3>
                                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{genre.desc}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <footer className="mt-auto pt-8 pb-4 text-center">
                 <p className="text-[10px] text-slate-600 font-mono">POWERED BY GEMINI 2.5</p>
            </footer>
        </div>
    </div>
  );
};

// 3. Game Screen
const GameScreen = ({ 
  node, 
  imageUrl, 
  onChoice, 
  onBackToMenu 
}: { 
  node: StoryNode; 
  imageUrl: string | null; 
  onChoice: (text: string) => void; 
  onBackToMenu: () => void;
}) => {
  const [typedText, setTypedText] = useState('');
  const textRef = useRef<HTMLDivElement>(null);
  
  // Typewriter effect
  useEffect(() => {
    setTypedText('');
    let i = 0;
    const speed = 15; 
    const fullText = node.text || '';
    
    // Clear previous interval if node changes rapidly
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(prev => fullText.substring(0, i + 1));
        i++;
        if (textRef.current) {
           textRef.current.scrollTop = textRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [node]);

  return (
    <div className="flex flex-col h-full relative bg-slate-900 w-full max-w-md mx-auto">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-start pointer-events-none bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={onBackToMenu}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-bold uppercase tracking-wide hover:bg-slate-800/80 active:scale-95 transition-all shadow-lg"
        >
          <Home className="w-3 h-3" />
          <span>Меню</span>
        </button>
        
        {node.title && (
             <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md shadow-lg">
                 <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">{node.title}</span>
             </div>
        )}
      </div>

      {/* Visual Area (Image) */}
      <div className="h-[45%] w-full relative shrink-0 bg-slate-800 overflow-hidden">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt="Scene" 
              className="w-full h-full object-cover animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-900">
            <ImageIcon className="w-16 h-16 opacity-20 mb-2" />
            <span className="text-xs uppercase tracking-widest opacity-30">Визуализация...</span>
          </div>
        )}
      </div>

      {/* Story & Controls */}
      <div className="flex-1 flex flex-col relative -mt-12 z-20 px-4 pb-6 overflow-hidden">
        <div className="flex-1 glass-panel rounded-2xl flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
            
            {/* Scrollable Text */}
            <div 
                ref={textRef}
                className="flex-1 p-6 overflow-y-auto custom-scrollbar"
            >
                <p className="serif-text text-[15px] leading-7 text-slate-200/90 whitespace-pre-wrap drop-shadow-sm">
                    {typedText}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/5 flex flex-col gap-3">
                {node.choices.map((choice, idx) => (
                    <button
                        key={idx}
                        onClick={() => onChoice(choice.text)}
                        className="w-full group relative p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800 hover:from-indigo-900/50 hover:to-slate-800 border border-white/5 hover:border-indigo-500/30 text-white font-medium text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-between"
                    >
                        <span className="text-left pr-4 group-hover:text-indigo-200 transition-colors">{choice.text}</span>
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                             <Play className="w-3 h-3 text-slate-400 group-hover:text-indigo-300 fill-current" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

const App = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [context, setContext] = useState<GameContext>({ genre: '', history: [] });
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('');

  // Generate Story
  const generateStoryStep = async (prompt: string, history: string[], genre: string) => {
    try {
      const AI = getAI();
      setLoadingMsg('ИИ пишет историю...');
      
      const systemInstruction = `
        Ты ведущий текстовой RPG (квест). Жанр: ${genre}.
        Язык: Русский.
        Задача: Создай продолжение истории (сцену) и 2-3 варианта выбора.
        Формат: JSON.
        
        JSON схема:
        {
          "title": "Заголовок сцены (2-3 слова, например: 'Темный Лес')",
          "text": "Текст сцены (300-500 знаков). Литературный стиль, описывай окружение, запахи, звуки.",
          "imagePrompt": "Описание для генерации картинки (на английском), детальное, визуальное. Например: 'Dark forest with glowing mushrooms, cinematic lighting, 8k'.",
          "choices": [
            { "text": "Действие 1" },
            { "text": "Действие 2" }
          ]
        }

        История: ${history.join('\n')}
        Действие игрока: ${prompt}
      `;

      const response = await AI.models.generateContent({
        model: TEXT_MODEL,
        contents: [{ role: 'user', parts: [{ text: "Next scene." }] }],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              text: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      if (!response.text) throw new Error("No text response");
      const data = JSON.parse(response.text) as StoryNode;
      setCurrentNode(data);

      // Generate Image (non-blocking for UI, but we wait for loading screen logic)
      if (data.imagePrompt) {
        setLoadingMsg('Создание иллюстрации...');
        // We use generateContent for Flash Image model
        AI.models.generateContent({
            model: IMAGE_MODEL,
            contents: {
                parts: [{ text: `${genre} aesthetic, detailed, cinematic. ${data.imagePrompt}` }]
            }
        }).then(imgResp => {
            const part = imgResp.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (part && part.inlineData && part.inlineData.data) {
                setCurrentImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            } else {
                setCurrentImage(null);
            }
        }).catch(err => {
            console.error("Image gen error:", err);
            setCurrentImage(null); // Continue without image
        });
      } else {
          setCurrentImage(null);
      }
      
      setGameState('PLAYING');

    } catch (error) {
      console.error(error);
      alert('Ошибка! Попробуйте еще раз. (Проверьте API Key)');
      setGameState('MENU');
    }
  };

  const handleStartGame = async (genre: string) => {
    setGameState('LOADING');
    setContext({ genre, history: [] });
    await generateStoryStep("Начало приключения.", [], genre);
  };

  const handleChoice = async (choiceText: string) => {
    if (!currentNode) return;
    setGameState('LOADING');
    
    const newHistory = [...context.history, `Сцена: ${currentNode.text}`, `Выбор: ${choiceText}`].slice(-4); 
    setContext(prev => ({ ...prev, history: newHistory }));
    
    await generateStoryStep(choiceText, newHistory, context.genre);
  };

  const handleBackToMenu = () => {
    if (confirm("Вы уверены? Прогресс будет потерян.")) {
        setGameState('MENU');
        setCurrentImage(null);
        setCurrentNode(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950">
      {gameState === 'MENU' && <MainMenu onStart={handleStartGame} />}
      
      {gameState === 'LOADING' && <LoadingScreen message={loadingMsg} />}
      
      {gameState === 'PLAYING' && currentNode && (
        <GameScreen 
          node={currentNode} 
          imageUrl={currentImage} 
          onChoice={handleChoice} 
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

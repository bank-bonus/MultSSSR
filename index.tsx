import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Play, RotateCcw, Home, Tv, Heart, Info, XCircle, Share2, Star, Trophy, Film, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

// --- Global VK Bridge Declaration ---
declare const vkBridge: any;

// --- Types ---
type GameState = 'MENU' | 'GAME' | 'RESULT' | 'GAMEOVER' | 'LEVEL_UP' | 'WIN';

interface Cartoon {
    id: string;
    ru: { title: string; desc: string; };
}

// --- Data (UNCHANGED) ---
const CARTOONS: Cartoon[] = [
  { id: "nu_pogodi", ru: { title: "Ну, погоди!", desc: "Легендарная погоня Волка за Зайцем." } },
  { id: "vinni", ru: { title: "Винни-Пух", desc: "Винни-Пуха озвучивал Евгений Леонов." } },
  { id: "prostokvashino", ru: { title: "Простоквашино", desc: "Дядя Фёдор уехал жить с котом и псом." } },
  { id: "bremenskie", ru: { title: "Бременские музыканты", desc: "Музыкальная фантазия с элементами рок-н-ролла." } },
  { id: "ezhik", ru: { title: "Ёжик в тумане", desc: "Признан лучшим мультфильмом всех времён." } },
  { id: "karlson", ru: { title: "Малыш и Карлсон", desc: "История о человеке, который живет на крыше." } },
  { id: "pes", ru: { title: "Жил-был пёс", desc: "Фраза «Щас спою!» стала крылатой." } },
  { id: "taina", ru: { title: "Тайна третьей планеты", desc: "Фантастическое путешествие Алисы Селезнёвой." } },
  { id: "korabl", ru: { title: "Летучий корабль", desc: "Мюзикл про любовь и летучий корабль." } },
  { id: "gena", ru: { title: "Крокодил Гена", desc: "Здесь впервые прозвучала песня про день рождения." } },
  { id: "leopold", ru: { title: "Кот Леопольд", desc: "Ребята, давайте жить дружно!" } },
  { id: "kesha", ru: { title: "Попугай Кеша", desc: "Таити, Таити... Нас и здесь неплохо кормят!" } },
  { id: "sneg", ru: { title: "Падал прошлогодний снег", desc: "Маловато будет!" } },
  { id: "umka", ru: { title: "Умка", desc: "История о белом медвежонке." } },
  { id: "maugli", ru: { title: "Маугли", desc: "Советская экранизация Киплинга." } },
  { id: "cheburashka", ru: { title: "Чебурашка", desc: "Неизвестный науке зверь с большими ушами." } },
  { id: "vovka", ru: { title: "Вовка в Тридевятом царстве", desc: "«И так сойдёт!» — девиз лентяя Вовки." } },
  { id: "popugaev", ru: { title: "38 попугаев", desc: "А в попугаях-то я гораздо длиннее!" } },
  { id: "kuzya", ru: { title: "Домовёнок Кузя", desc: "Я не жадный, я домовитый!" } },
  { id: "funtik", ru: { title: "Приключения Фунтика", desc: "Подайте на домики для бездомных поросят!" } },
  { id: "gav", ru: { title: "Котёнок по имени Гав", desc: "Давай бояться вместе!" } },
  { id: "ostrov", ru: { title: "Остров сокровищ", desc: "Гротескная экранизация с музыкальными вставками." } },
  { id: "varezhka", ru: { title: "Варежка", desc: "Девочка так хотела собаку, что варежка ожила." } },
  { id: "ded_moroz", ru: { title: "Дед Мороз и лето", desc: "Дед Мороз узнает, что такое лето." } },
  { id: "chipollino", ru: { title: "Чиполлино", desc: "Революция овощей против синьора Помидора." } },
  { id: "antelopa", ru: { title: "Золотая антилопа", desc: "Антилопа выбивала золотые монеты копытами." } },
  { id: "alenkiy", ru: { title: "Аленький цветочек", desc: "Сказка о любви красавицы и чудовища." } },
  { id: "12mes", ru: { title: "Двенадцать месяцев", desc: "Девочка встречает 12 месяцев у новогоднего костра." } },
  { id: "snowqueen", ru: { title: "Снежная королева", desc: "Герда отправляется спасать Кая из ледяного плена." } },
  { id: "neznaika", ru: { title: "Незнайка на Луне", desc: "Коротышки отправляются в космическое путешествие." } },
  { id: "vrungel", ru: { title: "Капитан Врунгель", desc: "Как вы яхту назовете, так она и поплывет!" } },
  { id: "aibolit", ru: { title: "Доктор Айболит", desc: "Добрый доктор лечит зверей в Африке." } },
  { id: "rikki", ru: { title: "Рикки-Тикки-Тави", desc: "Отважный мангуст сражается с кобрами." } },
  { id: "konyok", ru: { title: "Конёк-Горбунок", desc: "Верный волшебный друг Ивана." } },
  { id: "plastilin", ru: { title: "Пластилиновая ворона", desc: "А может быть собака, а может быть корова..." } },
  { id: "mamontenok", ru: { title: "Мама для мамонтёнка", desc: "Плыву я сквозь волны и ветер к единственной маме на свете." } },
  { id: "bolibok", ru: { title: "Бобик в гостях у Барбоса", desc: "Человек собаке друг, это знают все вокруг!" } },
  { id: "rybka", ru: { title: "О рыбаке и рыбке", desc: "Не хочу быть черной крестьянкой, хочу быть столбовою дворянкой!" } },
  { id: "tsarevna", ru: { title: "Царевна-лягушка", desc: "Иван-царевич сжигает лягушачью кожу." } },
  { id: "fedora", ru: { title: "Федорино горе", desc: "От грязнули Федоры сбежала вся посуда." } },
  { id: "moydodyr", ru: { title: "Мойдодыр", desc: "Надо, надо умываться по утрам и вечерам!" } },
  { id: "kot_sapog", ru: { title: "Кот в сапогах", desc: "Хитрый кот помогает своему хозяину стать маркизом." } },
  { id: "snezhnaya", ru: { title: "Снегурочка", desc: "Девочка из снега, которая растаяла от любви." } },
  { id: "dyuym", ru: { title: "Дюймовочка", desc: "Маленькая девочка, рожденная в цветке." } },
  { id: "zaec", ru: { title: "Мешок яблок", desc: "Четыре сыночка и лапочка дочка." } },
];

// --- Helper for Images ---
const getPlaceholderUrl = (title: string) => `https://placehold.co/600x450/333/eee?text=${encodeURIComponent(title)}`;

// --- Components ---

interface TVFrameProps {
    children?: React.ReactNode;
    brand?: string;
}

const TVFrame: React.FC<TVFrameProps> = ({ children, brand = "РУБИН" }) => (
    <div className="relative w-full max-w-md aspect-[4/3] bg-[#5c3a21] rounded-2xl border-b-8 border-r-4 border-[#3e2716] shadow-2xl p-3 flex-shrink-0 mx-auto transform transition-transform hover:scale-[1.01]">
        <div className="w-full h-full bg-black rounded-xl border-[6px] border-[#2a1a0e] shadow-inner relative overflow-hidden group">
             {/* Screen Content */}
            <div className="absolute inset-0 z-10 bg-black flex items-center justify-center">
                {children}
            </div>
            {/* Overlay Effects */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-radial from-transparent via-black/10 to-black/60" />
            <div className="absolute inset-0 z-20 pointer-events-none opacity-5 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Tv_noise.gif')] mix-blend-overlay" />
            <div className="absolute inset-0 z-20 pointer-events-none scanlines" />
        </div>
        {/* TV branding */}
        <div className="absolute bottom-[-16px] right-8 bg-[#3e2716] px-4 py-1 rounded-b-lg border-b-2 border-r-2 border-[#2a1a0e] shadow-md z-30 flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]"></div>
            <span className="text-[10px] font-bold text-[#d4af37] tracking-[0.2em] font-ruslan">{brand}</span>
        </div>
        {/* Antenna */}
        <div className="absolute top-[-30px] right-10 w-1 h-16 bg-gray-400 rotate-12 origin-bottom -z-10 border border-gray-600"></div>
        <div className="absolute top-[-30px] right-6 w-1 h-12 bg-gray-400 -rotate-12 origin-bottom -z-10 border border-gray-600"></div>
    </div>
);

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'primary' | 'ad' | 'outline' | 'share' | 'menu' | 'leaderboard';
    className?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    onClick, 
    variant = 'default',
    className = '',
    disabled = false
}) => {
    // New 3D button styles
    const baseStyle = "w-full font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center transition-all rounded-xl select-none relative active:translate-y-[4px] active:shadow-none btn-press disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        default: "bg-[#fff8e1] border-2 border-[#5c3a21] text-[#3e2716] shadow-[0_4px_0_#5c3a21] py-2 text-base hover:bg-white",
        primary: "bg-[#cc3333] border-2 border-[#8a2323] text-[#fff] shadow-[0_4px_0_#8a2323] py-4 text-lg hover:bg-[#d94444]",
        menu: "bg-[#cc3333] border-2 border-[#8a2323] text-[#fff] shadow-[0_6px_0_#8a2323] py-5 text-xl hover:bg-[#d94444]",
        leaderboard: "bg-[#d4af37] border-2 border-[#b08d26] text-[#3e2716] shadow-[0_6px_0_#b08d26] py-3 text-lg hover:bg-[#e5be49]",
        ad: "bg-[#4a7c59] border-2 border-[#2e5239] text-white shadow-[0_4px_0_#2e5239] py-3 mt-3 hover:bg-[#5da06e]",
        outline: "bg-transparent border-2 border-[#5c3a21] text-[#5c3a21] py-3 mt-2 hover:bg-[#5c3a21] hover:text-[#fff8e1] shadow-none active:translate-y-0",
        share: "bg-[#4285f4] border-2 border-[#2b5ba3] text-white shadow-[0_4px_0_#2b5ba3] py-3 mt-2 hover:bg-[#5c9aff]"
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]} ${className}`} 
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// Supported extensions to try
const EXTENSIONS = ['.jpg', '.png', '.jpeg', '.webp'];

const GameImage = ({ id, title }: { id: string, title: string }) => {
    // Start with index 0 (EXTENSIONS[0] which is .jpg)
    const [extIndex, setExtIndex] = useState(0);
    // REMOVED './' prefix to better handle static serving
    const [imgSrc, setImgSrc] = useState<string>(`images/${id}${EXTENSIONS[0]}`);

    useEffect(() => {
        // Reset when ID changes
        setExtIndex(0);
        setImgSrc(`images/${id}${EXTENSIONS[0]}`);
    }, [id]);

    const handleError = () => {
        const nextIndex = extIndex + 1;
        if (nextIndex < EXTENSIONS.length) {
            setExtIndex(nextIndex);
            setImgSrc(`images/${id}${EXTENSIONS[nextIndex]}`);
        } else {
            // All extensions failed, show placeholder
            setImgSrc(getPlaceholderUrl(title));
        }
    };

    return (
        <img 
            key={imgSrc} // Force re-render on src change to reset error state
            src={imgSrc} 
            alt={title} 
            onError={handleError}
            className="w-full h-full object-cover filter contrast-[1.15] brightness-[0.95] sepia-[0.15]"
        />
    );
};

// Layout Container Card
const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`bg-[#fffbf0] border-4 border-[#3e2716] rounded-2xl p-6 shadow-[8px_8px_0_rgba(62,39,22,0.2)] ${className}`}>
        {children}
    </div>
);

const App = () => {
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [maxLives, setMaxLives] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState<Cartoon | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // New State for progression
    const [usedIds, setUsedIds] = useState<string[]>([]);
    const [stars, setStars] = useState(0);
    const [stageCounter, setStageCounter] = useState(0); // Tracks questions within a set of 4
    
    useEffect(() => {
        const initApp = async () => {
            try {
                if (typeof vkBridge !== 'undefined') {
                    await vkBridge.send('VKWebAppInit');
                    vkBridge.send('VKWebAppShowBannerAd', {
                        banner_location: 'bottom'
                    }).catch((e: any) => console.log('Banner ad error', e));
                }
            } catch (e) {
                console.error('VK Bridge Init Failed', e);
            }
        };
        initApp();

        const saved = localStorage.getItem('sovietQuizHighScore');
        if (saved) setHighScore(parseInt(saved, 10));
    }, []);

    const saveScore = (newScore: number) => {
        if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('sovietQuizHighScore', newScore.toString());
        }
        
        if (typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppSetLeaderboardScore', { value: newScore })
                .catch((error: any) => console.log('Score save failed', error));
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setMaxLives(3);
        setUsedIds([]);
        setStars(0);
        setStageCounter(0);
        setGameState('GAME');
        nextQuestion(true); // true = reset usedIds inside isn't needed, but good for clarity
    };

    const goToMenu = () => {
        setGameState('MENU');
    };

    const openLeaderboard = () => {
        if (typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppShowLeaderboardBox', { user_result: highScore })
                .catch((e: any) => console.log('Leaderboard open error', e));
        }
    };

    const nextQuestion = (isFirst = false) => {
        setIsProcessing(false);
        setSelectedOption(null);
        
        // Filter out used cartoons
        const availableCartoons = CARTOONS.filter(c => !usedIds.includes(c.id));
        
        if (availableCartoons.length === 0) {
            setGameState('WIN');
            saveScore(score + 1000); // Bonus for finishing all
            return;
        }

        const correct = availableCartoons[Math.floor(Math.random() * availableCartoons.length)];
        
        // Add to used list
        if (!isFirst) {
            // Already added logic in handleAnswer or effect? 
            // Better to add it when the question is set.
        }
        
        // Distractors can be any cartoon other than correct
        let distractors = CARTOONS.filter(c => c.id !== correct.id);
        distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
        const allOptions = [correct, ...distractors].sort(() => 0.5 - Math.random()).map(c => c.ru.title);
        
        setCurrentQuestion(correct);
        setOptions(allOptions);
        setGameState('GAME');
    };

    const handleLevelUp = () => {
        const newStars = stars + 1;
        setStars(newStars);
        setStageCounter(0); // Reset counter for next star
        
        // Difficulty Logic
        let newMaxLives = maxLives;
        if (newStars === 1) {
            // After 1 star (4 questions), drop to max 2 lives
            newMaxLives = 2;
        } else if (newStars >= 2) {
             // After 2 stars (8 questions), drop to max 1 life
            newMaxLives = 1;
        }

        setMaxLives(newMaxLives);
        // Reduce current lives if they exceed new max
        if (lives > newMaxLives) {
            setLives(newMaxLives);
        }

        setGameState('LEVEL_UP');
    };

    const handleAnswer = (answer: string) => {
        if (isProcessing || !currentQuestion) return;
        setIsProcessing(true);
        setSelectedOption(answer);

        const isCorrect = answer === currentQuestion.ru.title;

        // Mark this question ID as used
        setUsedIds(prev => [...prev, currentQuestion.id]);

        if (isCorrect) {
            setScore(prev => prev + 100);
            const nextCounter = stageCounter + 1;
            setStageCounter(nextCounter);
            
            setTimeout(() => {
                if (nextCounter >= 4) {
                    handleLevelUp();
                } else {
                    setGameState('RESULT');
                }
            }, 1000);

        } else {
            setLives(prev => prev - 1);
             setTimeout(() => {
                if (lives - 1 <= 0) {
                    saveScore(score);
                    setGameState('GAMEOVER');
                } else {
                    setGameState('RESULT');
                }
            }, 1200);
        }
    };

    const continueAfterLevelUp = () => {
        setGameState('GAME'); // Just a visual transition, question is already loaded or we load next?
        // Actually we need to load next question
        nextQuestion();
    };

    const handleRevive = async () => {
        try {
            if (typeof vkBridge !== 'undefined') {
                const data = await vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' });
                if (data.result) {
                     setLives(1);
                     // Allow revive but cap at current maxLives logic? No, give them 1 life.
                     setGameState('GAME');
                     // We need to re-roll question because current one is marked 'used' but failed?
                     // Actually, if they failed, they shouldn't skip it, but for simplicity let's skip to next
                     nextQuestion(); 
                     return;
                }
            }
        } catch (e) {
            console.error('Ad show failed', e);
        }
        // Fallback
        setLives(1);
        setGameState('GAME');
        nextQuestion();
    };

    const handleShare = () => {
        if (typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppShare', {
                link: 'https://vk.com/app52163532',
                message: `Я собрал ${stars} звёзд и набрал ${score} очков в СоюзМультКвиз! Сможешь лучше?`
            });
        }
    };

    return (
        <div className="w-full h-full max-w-[500px] flex flex-col items-center relative bg-pattern pb-[60px]">
            
            {/* --- TOP HUD --- */}
            {(gameState === 'GAME' || gameState === 'RESULT' || gameState === 'LEVEL_UP') && (
                <div className="absolute top-0 left-0 right-0 h-16 bg-[#2c2c2c] shadow-lg z-50 flex justify-between items-center px-4 text-[#f0ead6] border-b-4 border-[#3e2716]">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={goToMenu}
                            className="p-2 -ml-2 text-white/70 hover:text-white transition-colors"
                        >
                            <Home className="w-6 h-6" />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Счет</span>
                            <span className="text-xl font-ruslan text-[#d4af37] leading-none">{score}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Stars Counter */}
                        <div className="flex items-center gap-1">
                             <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                             <span className="font-bold text-lg">{stars}</span>
                        </div>

                        {/* Lives */}
                        <div className="flex gap-1 items-center bg-black/30 px-3 py-1 rounded-full border border-white/10">
                            {[...Array(maxLives)].map((_, i) => (
                                <Heart 
                                    key={i} 
                                    className={`w-5 h-5 transition-all ${i < lives ? 'fill-[#cc3333] text-[#cc3333]' : 'fill-[#4a4a4a] text-[#4a4a4a]'}`} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- MENU SCREEN --- */}
            {gameState === 'MENU' && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 animate-fade-in">
                    <Card className="w-full max-w-sm text-center transform -rotate-1 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#cc3333]"></div>
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-[#cc3333]"></div>
                        
                        <div className="mb-8 mt-4 relative">
                            <Film className="w-12 h-12 text-[#cc3333] opacity-20 absolute -top-4 -left-2 rotate-[-15deg]" />
                            <h1 className="text-6xl font-ruslan text-[#cc3333] leading-[0.85] drop-shadow-[3px_3px_0_#3e2716] relative z-10">
                                СОЮЗ<br/>МУЛЬТ<br/>КВИЗ
                            </h1>
                            <Film className="w-12 h-12 text-[#cc3333] opacity-20 absolute -bottom-2 -right-2 rotate-[15deg]" />
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mb-8 text-[#5c3a21] font-bold text-sm tracking-widest uppercase border-y border-[#5c3a21] py-2">
                             <Tv className="w-4 h-4" /> <span>Мультфильмы СССР</span> <Tv className="w-4 h-4" />
                        </div>

                        {highScore > 0 && (
                            <div className="mb-6 inline-flex items-center gap-2 bg-[#ffecb3] text-[#5c3a21] px-4 py-2 rounded-lg border-2 border-[#d4af37] shadow-sm">
                                <Trophy className="w-5 h-5 text-[#d4af37] fill-current" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] uppercase font-bold opacity-60">Рекорд</span>
                                    <span className="text-lg font-bold">{highScore}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 w-full">
                            <Button variant="menu" onClick={startGame}>
                                <div className="flex items-center gap-3">
                                    <Play className="fill-current w-6 h-6" />
                                    ИГРАТЬ
                                </div>
                            </Button>

                            <Button variant="leaderboard" onClick={openLeaderboard}>
                                <div className="flex items-center gap-3 justify-center">
                                    <BarChart3 className="w-5 h-5" />
                                    РЕЙТИНГ
                                </div>
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- GAMEPLAY SCREEN --- */}
            {gameState === 'GAME' && currentQuestion && (
                <div className="flex-1 w-full flex flex-col items-center pt-20 pb-16 px-4 overflow-y-auto no-scrollbar">
                    
                    {/* Progress dots for current stage */}
                    <div className="flex gap-2 mb-4">
                        {[...Array(4)].map((_, i) => (
                             <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < stageCounter ? 'bg-[#4a7c59]' : 'bg-[#d1c7b7]'}`}></div>
                        ))}
                    </div>

                    <TVFrame>
                        <GameImage id={currentQuestion.id} title={currentQuestion.ru.title} />
                    </TVFrame>

                    <div className="w-full max-w-md mt-4 flex-shrink-0">
                        <div className="bg-[#3e2716] text-[#f0ead6] px-5 py-2 rounded-t-xl mx-2 border-b-2 border-[#5c3a21] flex items-center justify-between">
                            <span className="font-bold tracking-widest text-sm uppercase text-[#d4af37]">Вопрос:</span>
                            {/* Difficulty Indicator */}
                            {maxLives === 1 && <span className="text-xs bg-red-600 px-2 py-0.5 rounded text-white animate-pulse">ХАРДКОР</span>}
                            {maxLives === 2 && <span className="text-xs bg-orange-600 px-2 py-0.5 rounded text-white">СЛОЖНО</span>}
                            {maxLives === 3 && <span className="text-xs bg-green-600 px-2 py-0.5 rounded text-white">НОРМА</span>}
                        </div>
                        
                        <div className="bg-[#5c3a21] p-2 rounded-xl shadow-xl grid grid-cols-2 gap-2">
                            {options.map((option, idx) => {
                                let btnStyle = "";
                                const isSelected = selectedOption === option;
                                const isCorrect = option === currentQuestion.ru.title;

                                if (isProcessing) {
                                    if (isSelected) {
                                        btnStyle = isCorrect ? "animate-correct !bg-[#4a7c59] !border-[#2e5239] !text-white" : "animate-wrong !bg-[#cc3333] !border-[#8a2323] !text-white";
                                    } else if (isCorrect && selectedOption) {
                                        btnStyle = "!bg-[#4a7c59] !border-[#2e5239] !text-white opacity-80";
                                    } else {
                                        btnStyle = "opacity-40";
                                    }
                                }

                                return (
                                    <Button 
                                        key={idx} 
                                        onClick={() => handleAnswer(option)}
                                        className={`min-h-[56px] text-xs sm:text-sm normal-case leading-tight ${btnStyle}`}
                                        disabled={isProcessing}
                                    >
                                        {option}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* --- LEVEL UP / STAR AWARD SCREEN --- */}
            {gameState === 'LEVEL_UP' && (
                 <div className="flex-1 w-full flex flex-col items-center justify-center p-6 pt-20 animate-fade-in bg-black/80 absolute inset-0 z-[60]">
                    <Card className="w-full max-w-sm text-center relative border-[#d4af37]">
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                            <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 animate-star drop-shadow-lg" />
                        </div>
                        
                        <h2 className="text-3xl font-ruslan text-[#d4af37] mt-10 mb-2">ОТЛИЧНО!</h2>
                        <p className="text-[#5c3a21] font-bold mb-4 uppercase text-sm">Звезда получена</p>
                        
                        <div className="bg-[#3e2716] text-[#f0ead6] p-4 mb-6 rounded-xl text-left">
                            <p className="text-xs uppercase opacity-70 mb-2">Следующий этап:</p>
                            {maxLives === 2 && (
                                <div className="flex items-center gap-3 text-orange-400">
                                    <AlertTriangle className="w-6 h-6" />
                                    <span className="font-bold leading-tight">Внимание!<br/>Максимум 2 жизни.</span>
                                </div>
                            )}
                            {maxLives === 1 && (
                                <div className="flex items-center gap-3 text-red-500">
                                    <AlertTriangle className="w-6 h-6" />
                                    <span className="font-bold leading-tight">ОПАСНОСТЬ!<br/>Только 1 жизнь!</span>
                                </div>
                            )}
                        </div>

                        <Button variant="leaderboard" onClick={continueAfterLevelUp}>
                            ПРОДОЛЖИТЬ
                        </Button>
                    </Card>
                 </div>
            )}

            {/* --- LEVEL COMPLETE SCREEN --- */}
            {gameState === 'RESULT' && currentQuestion && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 pt-20 animate-fade-in">
                    <Card className="w-full max-w-sm relative">
                         {/* Stamp effect */}
                         <div className={`absolute top-4 right-4 border-4 p-2 rounded rotate-[-12deg] font-ruslan text-xl z-20 opacity-80 mix-blend-multiply ${selectedOption === currentQuestion.ru.title ? 'border-[#4a7c59] text-[#4a7c59]' : 'border-[#cc3333] text-[#cc3333]'}`}>
                            {selectedOption === currentQuestion.ru.title ? 'ВЕРНО' : 'ОШИБКА'}
                         </div>

                        <div className="w-full aspect-video bg-black rounded-lg border-2 border-[#3e2716] mb-4 overflow-hidden relative shadow-inner">
                             <GameImage id={currentQuestion.id} title={currentQuestion.ru.title} />
                        </div>

                        <h3 className="text-2xl font-bold text-[#cc3333] mb-2 leading-none font-ruslan">{currentQuestion.ru.title}</h3>
                        
                        <div className="bg-[#f0ead6] p-3 rounded-lg border border-[#d1c7b7] text-sm text-[#5c3a21] mb-6 flex gap-3 items-start">
                            <Info className="w-5 h-5 min-w-[20px] text-[#cc3333] mt-0.5" />
                            <span className="italic">{currentQuestion.ru.desc}</span>
                        </div>

                        <Button variant="primary" onClick={() => nextQuestion()}>
                            СЛЕДУЮЩИЙ ВОПРОС
                        </Button>
                    </Card>
                </div>
            )}

            {/* --- WIN SCREEN --- */}
            {gameState === 'WIN' && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 animate-fade-in">
                    <Card className="w-full max-w-sm text-center border-[#d4af37]">
                        <h2 className="text-4xl font-ruslan text-[#d4af37] mb-4 drop-shadow-md">ПОБЕДА!</h2>
                        <div className="text-[#5c3a21] mb-6">Вы отгадали все мультфильмы!</div>
                        
                         <div className="bg-[#3e2716] text-[#f0ead6] p-4 mb-6 rounded-xl shadow-inner border-b border-white/10">
                            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Итоговый счет</p>
                            <p className="text-5xl font-ruslan text-[#d4af37]">{score}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                             <Button variant="outline" onClick={goToMenu}>
                                <Home className="w-5 h-5 mr-2" /> МЕНЮ
                            </Button>
                            <Button variant="share" onClick={handleShare}>
                                <Share2 className="w-5 h-5 mr-2" /> ПОСТ
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- GAME OVER SCREEN --- */}
            {gameState === 'GAMEOVER' && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 animate-fade-in">
                    <Card className="w-full max-w-sm text-center border-[#cc3333]">
                        <h2 className="text-5xl font-ruslan text-[#cc3333] mb-6 drop-shadow-md">КОНЕЦ<br/>ФИЛЬМА</h2>
                        
                        <div className="bg-[#3e2716] text-[#f0ead6] p-4 mb-6 rounded-xl shadow-inner border-b border-white/10">
                            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Итоговый счет</p>
                            <p className="text-5xl font-ruslan text-[#d4af37]">{score}</p>
                        </div>

                        {/* Revive Option */}
                        <div className="mb-4">
                            <Button variant="ad" onClick={handleRevive}>
                                <div className="flex items-center justify-between w-full px-2">
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold text-lg flex items-center gap-2"> <Heart className="fill-white w-4 h-4"/> ЕЩЁ ШАНС</span>
                                        <span className="text-[10px] opacity-90 font-normal">Реклама</span>
                                    </div>
                                    <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold">FREE</div>
                                </div>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#3e2716]/20">
                            <Button variant="outline" onClick={goToMenu}>
                                <Home className="w-5 h-5 mr-2" /> МЕНЮ
                            </Button>
                            <Button variant="share" onClick={handleShare}>
                                <Share2 className="w-5 h-5 mr-2" /> ПОСТ
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
            
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
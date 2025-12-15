import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Play, RotateCcw, Home, Tv, Heart, Info, XCircle, Share2, Star, Trophy, Film, BarChart3 } from 'lucide-react';

// --- Global VK Bridge Declaration ---
declare const vkBridge: any;

// --- Types ---
type GameState = 'MENU' | 'GAME' | 'RESULT' | 'GAMEOVER';

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
const getLocalImageUrl = (id: string) => `/images/${id}.jpg`;
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

const GameImage = ({ id, title }: { id: string, title: string }) => {
    const [imgSrc, setImgSrc] = useState<string>(getLocalImageUrl(id));

    useEffect(() => {
        setImgSrc(getLocalImageUrl(id));
    }, [id]);

    const handleError = () => {
        setImgSrc(getPlaceholderUrl(title));
    };

    return (
        <img 
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
    const [currentQuestion, setCurrentQuestion] = useState<Cartoon | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    useEffect(() => {
        const initApp = async () => {
            try {
                if (typeof vkBridge !== 'undefined') {
                    await vkBridge.send('VKWebAppInit');
                    // Show sticky banner ad at bottom immediately on init
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
        
        // Push score to VK Leaderboard
        if (typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppSetLeaderboardScore', { value: newScore })
                .then((data: any) => console.log('Score saved to VK', data))
                .catch((error: any) => console.log('Score save failed', error));
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setGameState('GAME');
        nextQuestion();
    };

    const goToMenu = () => {
        setGameState('MENU');
    };

    const openLeaderboard = () => {
        if (typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppShowLeaderboardBox', { user_result: highScore })
                .catch((e: any) => console.log('Leaderboard open error', e));
        } else {
            console.log("VK Bridge not available, simulating leaderboard open");
        }
    };

    const nextQuestion = () => {
        setIsProcessing(false);
        setSelectedOption(null);
        
        const correct = CARTOONS[Math.floor(Math.random() * CARTOONS.length)];
        let distractors = CARTOONS.filter(c => c.id !== correct.id);
        distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
        const allOptions = [correct, ...distractors].sort(() => 0.5 - Math.random()).map(c => c.ru.title);
        
        setCurrentQuestion(correct);
        setOptions(allOptions);
        setGameState('GAME');
    };

    const handleAnswer = (answer: string) => {
        if (isProcessing || !currentQuestion) return;
        setIsProcessing(true);
        setSelectedOption(answer);

        const isCorrect = answer === currentQuestion.ru.title;

        if (isCorrect) {
            setScore(prev => prev + 100);
        } else {
            setLives(prev => prev - 1);
        }

        setTimeout(() => {
            if (!isCorrect && lives <= 1) {
                const finalScore = isCorrect ? score + 100 : score;
                saveScore(finalScore);
                setGameState('GAMEOVER');
            } else {
                setGameState('RESULT');
            }
        }, 1200);
    };

    const handleRevive = async () => {
        try {
            if (typeof vkBridge !== 'undefined') {
                const data = await vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' });
                if (data.result) {
                     setLives(1);
                     setGameState('GAME');
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
                message: `Мой рекорд: ${score} очков в викторине! Сможешь больше?`
            });
        }
    };

    return (
        <div className="w-full h-full max-w-[500px] flex flex-col items-center relative bg-pattern pb-[60px]">
            {/* Added bottom padding for Banner Ad space */}
            
            {/* --- TOP HUD (Only in Game) --- */}
            {(gameState === 'GAME' || gameState === 'RESULT') && (
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
                    <div className="flex gap-1 items-center bg-black/30 px-3 py-1 rounded-full border border-white/10">
                        {[...Array(3)].map((_, i) => (
                            <Heart 
                                key={i} 
                                className={`w-5 h-5 transition-all ${i < lives ? 'fill-[#cc3333] text-[#cc3333]' : 'fill-[#4a4a4a] text-[#4a4a4a]'}`} 
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* --- MENU SCREEN --- */}
            {gameState === 'MENU' && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 animate-fade-in">
                    <Card className="w-full max-w-sm text-center transform -rotate-1 relative overflow-hidden">
                        {/* Decorative background elements inside card */}
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
                    
                    <TVFrame>
                        <GameImage id={currentQuestion.id} title={currentQuestion.ru.title} />
                    </TVFrame>

                    <div className="w-full max-w-md mt-4 flex-shrink-0">
                        <div className="bg-[#3e2716] text-[#f0ead6] px-5 py-2 rounded-t-xl mx-2 border-b-2 border-[#5c3a21] flex items-center justify-between">
                            <span className="font-bold tracking-widest text-sm uppercase text-[#d4af37]">Вопрос:</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#cc3333]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#4a7c59]"></div>
                            </div>
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
                                        // Show correct answer if wrong selected
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

                        <Button variant="primary" onClick={nextQuestion}>
                            СЛЕДУЮЩИЙ ВОПРОС
                        </Button>
                    </Card>
                </div>
            )}

            {/* --- GAME OVER / SHOP SCREEN --- */}
            {gameState === 'GAMEOVER' && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 animate-fade-in">
                    <Card className="w-full max-w-sm text-center border-[#cc3333]">
                        <h2 className="text-5xl font-ruslan text-[#cc3333] mb-6 drop-shadow-md">КОНЕЦ<br/>ФИЛЬМА</h2>
                        
                        <div className="bg-[#3e2716] text-[#f0ead6] p-4 mb-6 rounded-xl shadow-inner border-b border-white/10">
                            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Итоговый счет</p>
                            <p className="text-5xl font-ruslan text-[#d4af37]">{score}</p>
                        </div>

                        {/* Fake Shop / Premium Revive Option */}
                        <div className="mb-4">
                            <Button variant="ad" onClick={handleRevive}>
                                <div className="flex items-center justify-between w-full px-2">
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold text-lg flex items-center gap-2"> <Heart className="fill-white w-4 h-4"/> ВТОРОЙ ШАНС</span>
                                        <span className="text-[10px] opacity-90 font-normal">Просмотр рекламы</span>
                                    </div>
                                    <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold">БЕСПЛАТНО</div>
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
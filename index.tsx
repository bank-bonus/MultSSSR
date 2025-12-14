import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Play, RotateCcw, Home, Tv, Heart, Info, XCircle } from 'lucide-react';

// --- Types ---
type GameState = 'MENU' | 'GAME' | 'RESULT' | 'GAMEOVER';

interface Cartoon {
    id: string;
    // Removed imageUrl from interface as we generate it from ID
    ru: { title: string; desc: string; };
}

// --- Data ---
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
const getLocalImageUrl = (id: string) => {
    // This expects images to be in an 'images' folder at the root (public/images)
    return `./images/${id}.jpg`;
};

const getPlaceholderUrl = (title: string) => {
    return `https://placehold.co/600x450/333/eee?text=${encodeURIComponent(title)}`;
};

// --- Components ---

interface TVFrameProps {
    children?: React.ReactNode;
    brand?: string;
}

const TVFrame: React.FC<TVFrameProps> = ({ children, brand = "РУБИН" }) => (
    <div className="relative w-full max-w-md aspect-[4/3] bg-[#5c3a21] rounded-xl border-2 border-[#3e2716] shadow-xl p-2 md:p-3 mb-4 flex-shrink-0">
        <div className="w-full h-full bg-black rounded-lg border-4 border-[#1a1a1a] shadow-inner relative overflow-hidden group">
             {/* Screen Content */}
            <div className="absolute inset-0 z-10 bg-black flex items-center justify-center">
                {children}
            </div>
            
            {/* Overlay Effects */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-radial from-transparent via-black/20 to-black/80" />
            <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Tv_noise.gif')] mix-blend-overlay opacity-5" />
            <div className="absolute inset-0 z-20 pointer-events-none scanlines" />
        </div>
        
        {/* TV Controls/Brand */}
        <div className="absolute bottom-[-14px] right-6 bg-[#3e2716] px-3 py-1 rounded-b-lg border border-t-0 border-[#2a1a0e] shadow-md z-30">
            <span className="text-[10px] font-bold text-[#d4af37] tracking-widest">{brand}</span>
        </div>
        
        {/* Decorative Knobs */}
        <div className="absolute top-10 -right-2 w-1 h-12 bg-[#2a1a0e] rounded-r-md" />
        <div className="absolute top-24 -right-2 w-1 h-8 bg-[#2a1a0e] rounded-r-md" />
    </div>
);

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'primary' | 'ad' | 'outline';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    onClick, 
    variant = 'default',
    className = ''
}) => {
    const baseStyle = "w-full font-bold uppercase tracking-wide cursor-pointer flex items-center justify-center transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-lg select-none";
    
    const variants = {
        default: "bg-[#f0ead6] border-2 border-[#1a1a1a] text-[#1a1a1a] shadow-[3px_3px_0_rgba(0,0,0,0.2)] py-3 hover:bg-white",
        primary: "bg-[#cc0000] border-2 border-[#1a1a1a] text-[#f0ead6] shadow-[4px_4px_0_#1a1a1a] py-4 text-lg hover:bg-[#e60000]",
        ad: "bg-[#4a7c59] border-2 border-dashed border-white text-white shadow-lg py-3 mt-3",
        outline: "bg-transparent border-2 border-[#1a1a1a] text-[#1a1a1a] py-2 mt-2 hover:bg-[#1a1a1a] hover:text-[#f0ead6]"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

// Robust Image Component that handles errors
const GameImage = ({ id, title }: { id: string, title: string }) => {
    const [imgSrc, setImgSrc] = useState<string>(getLocalImageUrl(id));

    useEffect(() => {
        // Reset when question changes
        setImgSrc(getLocalImageUrl(id));
    }, [id]);

    const handleError = () => {
        console.log(`Image not found for ${id}, switching to placeholder.`);
        setImgSrc(getPlaceholderUrl(title));
    };

    return (
        <img 
            src={imgSrc} 
            alt={title} 
            onError={handleError}
            className="w-full h-full object-cover filter contrast-110 brightness-90 sepia-[0.3]"
        />
    );
};

const App = () => {
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState<Cartoon | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Load Highscore
    useEffect(() => {
        const saved = localStorage.getItem('sovietQuizHighScore');
        if (saved) setHighScore(parseInt(saved, 10));
    }, []);

    const saveScore = (newScore: number) => {
        if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('sovietQuizHighScore', newScore.toString());
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

    const nextQuestion = () => {
        setIsProcessing(false);
        setSelectedOption(null);
        
        // Random question
        const correct = CARTOONS[Math.floor(Math.random() * CARTOONS.length)];
        
        // Random distractors (unique)
        let distractors = CARTOONS.filter(c => c.id !== correct.id);
        // Shuffle distractors
        distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        // Combine and shuffle options
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
                saveScore(score);
                setGameState('GAMEOVER');
            } else {
                setGameState('RESULT');
            }
        }, 1500);
    };

    const handleRevive = () => {
        // Simulation of Ad Reward
        setLives(1);
        setGameState('GAME');
        nextQuestion();
    };

    return (
        <div className="w-full h-full max-w-[500px] flex flex-col items-center relative bg-[#f0ead6]">
            
            {/* Header (Score & Lives) - Only in Game/Result */}
            {(gameState === 'GAME' || gameState === 'RESULT') && (
                <div className="absolute top-0 left-0 right-0 h-16 bg-[#cc0000] border-b-4 border-[#990000] shadow-md z-50 flex justify-between items-center px-4 text-[#f0ead6]">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={goToMenu}
                            className="p-2 -ml-2 hover:bg-[#990000] rounded-lg transition-colors active:scale-95"
                            aria-label="В меню"
                        >
                            <Home className="w-6 h-6" />
                        </button>
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] opacity-80 font-bold">СЧЕТ</span>
                            <span className="text-2xl font-ruslan">{score}</span>
                        </div>
                    </div>
                    <div className="flex gap-1 text-xl">
                        {[...Array(3)].map((_, i) => (
                            <Heart 
                                key={i} 
                                className={`w-6 h-6 ${i < lives ? 'fill-[#f0ead6] text-[#f0ead6]' : 'fill-black/20 text-black/20'}`} 
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* --- MENU SCREEN --- */}
            {gameState === 'MENU' && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 space-y-8 animate-fade-in">
                    <div className="w-full bg-[#fff8e1] border-4 border-[#cc0000] p-6 shadow-[8px_8px_0_#1a1a1a] rounded-lg text-center transform -rotate-1">
                        <h1 className="text-5xl font-ruslan text-[#cc0000] leading-[0.9] drop-shadow-[2px_2px_0_#1a1a1a] mb-2">
                            СОЮЗ<br/>МУЛЬТ<br/>КВИЗ
                        </h1>
                        <div className="h-1 bg-[#1a1a1a] w-1/2 mx-auto my-4 rounded-full"></div>
                        <p className="font-bold text-[#555] tracking-widest text-sm uppercase">Мультфильмы СССР</p>
                    </div>

                    {highScore > 0 && (
                        <div className="bg-[#1a1a1a] text-[#d4af37] px-4 py-2 rounded font-bold border-2 border-[#d4af37] shadow-lg flex items-center gap-2">
                            <span>⭐ РЕКОРД:</span>
                            <span className="text-xl">{highScore}</span>
                        </div>
                    )}

                    <Button variant="primary" onClick={startGame}>
                        <div className="flex items-center gap-2">
                            <Play className="fill-current w-5 h-5" />
                            Начать просмотр
                        </div>
                    </Button>
                </div>
            )}

            {/* --- GAME SCREEN --- */}
            {gameState === 'GAME' && currentQuestion && (
                <div className="flex-1 w-full flex flex-col items-center pt-20 pb-6 px-4 overflow-y-auto">
                    <TVFrame>
                        <GameImage id={currentQuestion.id} title={currentQuestion.ru.title} />
                    </TVFrame>

                    <div className="bg-[#1a1a1a] text-[#f0ead6] px-4 py-2 -skew-x-6 border-l-4 border-[#cc0000] shadow-lg mb-4">
                        <span className="block skew-x-6 font-bold tracking-wider">ОТКУДА ЭТОТ КАДР?</span>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3">
                        {options.map((option, idx) => {
                            let btnStyle = "";
                            const isSelected = selectedOption === option;
                            const isCorrect = option === currentQuestion.ru.title;

                            if (isProcessing) {
                                if (isSelected) {
                                    btnStyle = isCorrect ? "animate-correct border-[#4a7c59]" : "animate-wrong border-[#cc0000]";
                                } else if (isCorrect && selectedOption) {
                                    // Show correct answer if wrong was selected
                                    btnStyle = "bg-[#4a7c59] text-white border-[#4a7c59]";
                                } else {
                                    btnStyle = "opacity-50";
                                }
                            }

                            return (
                                <Button 
                                    key={idx} 
                                    onClick={() => handleAnswer(option)}
                                    className={`min-h-[60px] text-sm normal-case leading-tight ${btnStyle}`}
                                >
                                    {option}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- RESULT SCREEN --- */}
            {gameState === 'RESULT' && currentQuestion && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 pt-20 animate-fade-in">
                    <div className="w-full bg-white border-4 border-[#cc0000] p-5 shadow-[6px_6px_0_#1a1a1a] rounded-lg relative overflow-hidden">
                        {/* Background grid pattern */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        
                        <h2 className={`text-4xl font-ruslan text-center mb-4 ${selectedOption === currentQuestion.ru.title ? 'text-[#4a7c59]' : 'text-[#cc0000]'}`}>
                            {selectedOption === currentQuestion.ru.title ? 'ВЕРНО!' : 'ОШИБКА!'}
                        </h2>

                        <div className="w-full aspect-video bg-black rounded border-2 border-[#1a1a1a] mb-4 overflow-hidden relative">
                             <GameImage id={currentQuestion.id} title={currentQuestion.ru.title} />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1 text-center">
                                КАДР ИЗ МУЛЬТФИЛЬМА
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-[#cc0000] mb-2 leading-none">{currentQuestion.ru.title}</h3>
                        
                        <div className="bg-[#f9f9f9] border-l-4 border-[#cc0000] p-3 text-sm italic text-gray-600 mb-6">
                            <Info className="inline w-4 h-4 mr-2 mb-1" />
                            {currentQuestion.ru.desc}
                        </div>

                        <Button variant="primary" onClick={nextQuestion}>
                            ДАЛЕЕ &gt;&gt;
                        </Button>
                    </div>
                </div>
            )}

            {/* --- GAMEOVER SCREEN --- */}
            {gameState === 'GAMEOVER' && (
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 animate-fade-in">
                    <div className="bg-[#cc0000] p-2 rounded shadow-2xl w-full max-w-sm">
                        <div className="border-4 border-double border-[#d4af37] p-6 text-center text-[#f0ead6]">
                            <h2 className="text-5xl font-ruslan mb-4 drop-shadow-md">КОНЕЦ<br/>ФИЛЬМА</h2>
                            
                            <div className="bg-[#1a1a1a] text-white p-4 mb-4 rounded">
                                <p className="text-sm opacity-70">ВАШ РЕЗУЛЬТАТ</p>
                                <p className="text-4xl font-bold text-[#d4af37]">{score}</p>
                            </div>

                            <p className="text-sm mb-6 leading-tight">Плёнка оборвалась! Но вы можете попробовать снова.</p>

                            <Button variant="ad" onClick={handleRevive}>
                                <div className="flex flex-col items-center">
                                    <span className="flex items-center gap-2 text-lg"><Tv className="w-5 h-5" /> ВОСКРЕСНУТЬ</span>
                                    <span className="text-[10px] opacity-80 font-normal">(Посмотреть рекламу)</span>
                                </div>
                            </Button>

                            <Button variant="outline" onClick={goToMenu} className="mt-4 border-[#f0ead6] text-[#f0ead6] hover:bg-[#f0ead6] hover:text-[#cc0000]">
                                <Home className="w-4 h-4 mr-2" /> В МЕНЮ
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
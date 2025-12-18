import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Minus, Square, Globe, Terminal as TermIcon, Microscope, Beaker, Zap,
  Activity, Cpu, Thermometer, Grid3X3, Notebook, Flame, Sparkles,
  FunctionSquare, Boxes, Compass, Dna, Play, Pause, RefreshCw,
  ChevronRight, ArrowRight, Wind, Layers, Settings as SettingsIcon, Power,
  Search, Volume2, Wifi, Battery, Palette, Monitor, Info, Trash2, Send, Loader2,
  ShieldCheck, Database, Network, Atom, Calculator, ChevronLeft, Home, ExternalLink,
  AlertCircle, Layout, Maximize2
} from 'lucide-react';

/* --- GEMINI API CONFIG --- */
const apiKey = ""; 

const fetchGemini = async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: { parts: [{ text: "You are Zenith OS AI. Keep responses concise and technical. Use a futuristic tone." }] }
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (error) {
            if (i === 4) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
};

const generateWallpaper = async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: { prompt: `Futuristic desktop wallpaper, high resolution, digital art style: ${prompt}` },
                    parameters: { sampleCount: 1 }
                })
            });
            const data = await response.json();
            return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        } catch (error) {
            if (i === 4) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
};

/* --- BOOT ANIMATION COMPONENT (ULTRA) --- */
const BootSequence = ({ onComplete }) => {
    const [hasInteracted, setHasInteracted] = useState(false);
    const [stage, setStage] = useState(0);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);

    const bootLogs = [
        "BIOS v28.01.09 CHECK... SUCCESS",
        "ZENITH KERNEL LOADED @ 0x0000006E656C6548",
        "MAPPING VIRTUAL MEMORY... 128TB OK",
        "NEURAL NETWORKS INITIALIZING...",
        "DECRYPTING USER PROFILES...",
        "GPGPU ACCELERATION: ENABLED",
        "UI CORE: READY"
    ];

    const startBoot = async () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioContextRef.current && AudioContext) {
                audioContextRef.current = new AudioContext();
            }
            if (audioContextRef.current?.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            
            if (audioRef.current) {
                audioRef.current.muted = false;
                audioRef.current.volume = 0.8;
                // Capture the play promise to handle potential interruptions
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Playback prevented or interrupted:", error);
                    });
                }
            }
        } catch (err) {
            console.error("Boot Audio Error:", err);
        }
        setHasInteracted(true);
    };

    useEffect(() => {
        if (!hasInteracted) return;
        let logIndex = 0;
        const interval = setInterval(() => {
            if (logIndex < bootLogs.length) {
                setLogs(prev => [...prev, bootLogs[logIndex]]);
                logIndex++;
                setStage(logIndex);
                setProgress((logIndex / bootLogs.length) * 100);
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 1200); 
            }
        }, 350);
        return () => clearInterval(interval);
    }, [hasInteracted, onComplete]);

    return (
        <div className="fixed inset-0 bg-[#020202] z-[9999] flex items-center justify-center font-mono overflow-hidden">
            {/* Audio stays persistent here to avoid "media removed" errors */}
            <audio ref={audioRef} preload="auto" crossOrigin="anonymous">
                <source src="https://reactos-boot-85864.tiiny.site/reactos-boot-85864.mp3" type="audio/mpeg" />
            </audio>

            {!hasInteracted ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer" onClick={startBoot}>
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                        backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}></div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500/40 blur-[100px] rounded-full group-hover:bg-blue-400/60 transition-all duration-700"></div>
                        <div className="relative z-10 w-24 h-24 flex items-center justify-center border-4 border-white/10 rounded-full group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300">
                            <Power size={48} className="text-white group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/20 rounded-full animate-ping"></div>
                    </div>
                    <div className="mt-12 text-center z-10">
                        <div className="text-blue-500 font-mono text-[11px] tracking-[0.5em] uppercase font-bold animate-pulse">Wake System</div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ 
                        backgroundImage: 'linear-gradient(transparent 95%, #3b82f6 95%), linear-gradient(90deg, transparent 95%, #3b82f6 95%)',
                        backgroundSize: '20px 20px'
                    }}></div>
                    <div className="relative w-full max-w-4xl px-8 flex flex-col md:flex-row items-center gap-16 animate-in fade-in duration-700">
                        <div className="relative w-64 h-64 flex-shrink-0">
                            <div className="absolute inset-0 border-[3px] border-blue-500/20 rounded-full animate-[spin_8s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-blue-400/10 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                            <Cpu size={48} className="text-blue-500 animate-pulse relative z-10" />
                        </div>
                        <div className="flex-1 space-y-8 w-full">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-black text-white tracking-tighter italic">ZENITH OS <span className="text-blue-500">NEXUS</span></h1>
                                <div className="flex items-center gap-2 text-[10px] text-blue-400/60 uppercase tracking-widest">
                                    <ShieldCheck size={12} /> Encrypted Core | Runtime 0.4ms
                                </div>
                            </div>
                            <div className="space-y-2 min-h-[140px]">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-4 items-center text-[10px] animate-in slide-in-from-left-4 duration-200">
                                        <span className="text-blue-500 opacity-40">0x{i.toString(16).padStart(2, '0')}</span>
                                        <span className={i === logs.length - 1 ? "text-white font-bold" : "text-white/40"}>{log}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-white transition-all duration-300 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

/* --- BROWSER APP --- */
const NexusBrowser = () => {
    const [url, setUrl] = useState('https://www.google.com/search?igu=1');
    const [inputUrl, setInputUrl] = useState('google.com');
    const [history, setHistory] = useState(['https://www.google.com/search?igu=1']);
    const [historyIdx, setHistoryIdx] = useState(0);
    const [showNotice, setShowNotice] = useState(true);

    const navigate = (newUrl) => {
        let finalUrl = newUrl;
        if (!newUrl.startsWith('http')) {
            if (newUrl.includes('.') && !newUrl.includes(' ')) {
                finalUrl = 'https://' + newUrl;
            } else {
                finalUrl = `https://www.google.com/search?q=${encodeURIComponent(newUrl)}&igu=1`;
            }
        }
        setUrl(finalUrl);
        setInputUrl(newUrl);
        const newHistory = history.slice(0, historyIdx + 1);
        newHistory.push(finalUrl);
        setHistory(newHistory);
        setHistoryIdx(newHistory.length - 1);
    };

    return (
        <div className="h-full flex flex-col bg-[#111] text-white overflow-hidden">
            {showNotice && (
                <div className="bg-blue-600 px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider animate-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={14} />
                        <span>System Notice: Due to iframe limitations, some websites may not load correctly.</span>
                    </div>
                    <button onClick={() => setShowNotice(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={12}/></button>
                </div>
            )}
            <div className="bg-[#222] p-2 flex items-center gap-3 border-b border-white/5">
                <div className="flex gap-1">
                    <button onClick={() => historyIdx > 0 && setUrl(history[historyIdx - 1])} className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30"><ChevronLeft size={16}/></button>
                    <button onClick={() => navigate('https://www.google.com/search?igu=1')} className="p-1.5 hover:bg-white/10 rounded-lg"><Home size={16}/></button>
                </div>
                <div className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 group focus-within:ring-1 ring-blue-500/50">
                    <Globe size={14} className="text-white/40" />
                    <input 
                        className="bg-transparent border-none outline-none text-xs w-full text-white/80" 
                        value={inputUrl} 
                        onChange={(e) => setInputUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(inputUrl)}
                    />
                </div>
            </div>
            <div className="flex-1 bg-white relative">
                <iframe src={url} className="w-full h-full border-none" title="Nexus Browser View" />
            </div>
        </div>
    );
};

/* --- LAB APPS --- */
const ProjectileLab = () => {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(20);
    const g = 9.8;
    const stats = useMemo(() => {
        const rad = (angle * Math.PI) / 180;
        const H = (velocity**2 * Math.sin(rad)**2) / (2 * g);
        const R = (velocity**2 * Math.sin(2 * rad)) / g;
        const T = (2 * velocity * Math.sin(rad)) / g;
        return { H: H.toFixed(2), R: R.toFixed(2), T: T.toFixed(2) };
    }, [angle, velocity]);
    return (
        <div className="h-full bg-slate-950 p-6 flex flex-col text-white">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-6">Projectile Simulator</h3>
            <div className="flex-1 relative border-l border-b border-white/10 mb-6">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                    <path d={`M 10 190 Q ${10 + (stats.R * 2)} ${190 - (stats.H * 8)} ${10 + (stats.R * 4)} 190`} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"/>
                </svg>
            </div>
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold text-white/40 text-sm">Angle: {angle}°</label>
                    <input type="range" min="10" max="85" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
            </div>
        </div>
    );
};

/* --- CONTINUUM SHELL --- */
const ContinuumShell = () => {
    const [history, setHistory] = useState([{ type: 'sys', text: 'Zenith Continuum Shell v7.5' }]);
    const [input, setInput] = useState('');
    const handleCommand = async (e) => {
        if (e.key === 'Enter') {
            setHistory(prev => [...prev, { type: 'user', text: `> ${input}` }, { type: 'sys', text: `Processing: ${input}` }]);
            setInput('');
        }
    };
    return (
        <div className="h-full bg-black p-4 font-mono text-xs flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-1 mb-2">
                {history.map((line, i) => <div key={i} className={line.type === 'user' ? 'text-white' : 'text-blue-400'}>{line.text}</div>)}
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 pt-2 text-green-500">
                <span>zenith@nexus:~$</span>
                <input className="bg-transparent border-none outline-none flex-1 text-white" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} />
            </div>
        </div>
    );
};

/* --- SETTINGS APP --- */
const SettingsApp = ({ setWallpaper, scale, setScale, isFullScreen, setIsFullScreen }) => {
    const [activeTab, setActiveTab] = useState('personalization');
    const [genPrompt, setGenPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Native full-screen disallowed: ${err.message}. Using pseudo-fullscreen instead.`);
            });
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
            setIsFullScreen(false);
        }
    };

    const handleGenerate = async () => {
        if (!genPrompt) return;
        setIsGenerating(true);
        try {
            const img = await generateWallpaper(genPrompt);
            setWallpaper(img);
        } catch (e) { console.error(e); }
        setIsGenerating(false);
    };

    return (
        <div className="h-full bg-[#0a0a0a] flex text-white overflow-hidden">
            <div className="w-48 border-r border-white/5 p-6 flex flex-col gap-4">
                <button onClick={() => setActiveTab('personalization')} className={`flex items-center gap-3 p-3 rounded-xl text-[10px] font-bold uppercase transition-all duration-200 ${activeTab === 'personalization' ? 'bg-blue-600' : 'hover:bg-white/5 active:scale-95'}`}><Palette size={16}/> Style</button>
                <button onClick={() => setActiveTab('system')} className={`flex items-center gap-3 p-3 rounded-xl text-[10px] font-bold uppercase transition-all duration-200 ${activeTab === 'system' ? 'bg-blue-600' : 'hover:bg-white/5 active:scale-95'}`}><Monitor size={16}/> System</button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200">
                {activeTab === 'personalization' ? (
                    <div className="space-y-10">
                        <h2 className="text-xl font-black">Personalization</h2>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-blue-400">Generate Wallpaper</h3>
                            <div className="flex gap-2">
                                <input value={genPrompt} onChange={(e) => setGenPrompt(e.target.value)} placeholder="e.g. Cyberpunk city" className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs flex-1 outline-none focus:border-blue-500/50 transition-colors" />
                                <button onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-500 active:scale-95 transition-all">{isGenerating ? '...' : 'Create'}</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <h2 className="text-xl font-black">System Display</h2>
                        
                        <div className="bg-white/5 p-6 rounded-3xl space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold">Pseudo Full Screen</h3>
                                    <p className="text-[10px] text-white/40 uppercase">Maximize viewport usage (Bypasses Permission Policies)</p>
                                </div>
                                <button 
                                    onClick={toggleFullScreen}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isFullScreen ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${isFullScreen ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold">Interface Scale</h3>
                                        <p className="text-[10px] text-white/40 uppercase">Adjust text and element sizing</p>
                                    </div>
                                    <span className="text-xs font-mono text-blue-400">{(scale * 100).toFixed(0)}%</span>
                                </div>
                                <div className="relative pt-2 pb-6">
                                    <input 
                                        type="range" 
                                        min="0.8" 
                                        max="1.2" 
                                        step="0.05" 
                                        value={scale} 
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <div className="flex justify-between absolute bottom-0 left-0 right-0 text-[8px] text-white/20 font-black">
                                        <span>COMPACT</span>
                                        <span>DEFAULT</span>
                                        <span>LARGE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* --- SYSTEM FRAMEWORK --- */
const Window = ({ app, onClose, onMinimize, isActive, onFocus, isMaximized, onToggleMaximize, onSnap, scale }) => {
    const [position, setPosition] = useState(app.snapPosition || app.defaultPos || { x: 100, y: 100 });
    const [size, setSize] = useState(app.snapSize || app.defaultSize || { w: 600, h: 400 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (isMaximized || app.snapped) return;
        onFocus();
        setIsDragging(true);
        setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    useEffect(() => {
        const handleMouseMove = (e) => { if (isDragging) setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }); };
        const handleMouseUp = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const getLayoutStyle = () => {
        if (app.maximized) return { top: 0, left: 0, width: '100%', height: 'calc(100% - 72px)', borderRadius: 0 };
        if (app.snapped === 'left') return { top: 0, left: 0, width: '50%', height: 'calc(100% - 72px)', borderRadius: 0 };
        if (app.snapped === 'right') return { top: 0, left: '50%', width: '50%', height: 'calc(100% - 72px)', borderRadius: 0 };
        return { 
            top: position.y, 
            left: position.x, 
            width: size.w * scale, 
            height: size.h * scale 
        };
    };

    return (
        <div 
            className={`absolute bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[1.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200 ${isActive ? 'z-50 ring-1 ring-white/20' : 'z-40 opacity-90'}`}
            style={{...getLayoutStyle(), transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'}}
            onMouseDown={onFocus}
        >
            <div className="h-10 bg-white/5 flex items-center justify-between px-4 cursor-default border-b border-white/5 active:bg-white/10 transition-colors" onMouseDown={handleMouseDown}>
                <div className="flex items-center gap-2 text-[9px] text-white/90 font-black uppercase">
                    {app.icon} <span>{app.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onMinimize} className="p-1 hover:bg-white/5 rounded-full transition-colors"><Minus size={12} /></button>
                    <div className="flex bg-white/5 rounded-lg overflow-hidden border border-white/10 mx-1">
                        <button onClick={() => onSnap('left')} className="p-1 hover:bg-blue-600 transition-colors"><Layout size={10} className="rotate-90" /></button>
                        <button onClick={onToggleMaximize} className="p-1 hover:bg-blue-600 transition-colors"><Square size={8} /></button>
                        <button onClick={() => onSnap('right')} className="p-1 hover:bg-blue-600 transition-colors"><Layout size={10} className="-rotate-90" /></button>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-red-500 rounded-full transition-colors"><X size={12} /></button>
                </div>
            </div>
            <div className="flex-1 relative overflow-hidden" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100/scale}%`, height: `${100/scale}%` }}>
                {app.component}
            </div>
        </div>
    );
};

export default function App() {
    const [wallpaper, setWallpaper] = useState("https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=100");
    const [booting, setBooting] = useState(true);
    const [windows, setWindows] = useState([]);
    const [activeWindowId, setActiveWindowId] = useState(null);
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const APPS = useMemo(() => [
        { id: 'browser', title: 'Nexus Browser', icon: <Globe size={18} className="text-blue-500"/>, component: <NexusBrowser />, defaultSize: {w: 900, h: 600} },
        { id: 'settings', title: 'Settings', icon: <SettingsIcon size={18}/>, component: <SettingsApp setWallpaper={setWallpaper} scale={scale} setScale={setScale} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />, defaultSize: {w: 600, h: 500} },
        { id: 'terminal', title: 'Terminal', icon: <TermIcon size={18} className="text-green-500"/>, component: <ContinuumShell />, defaultSize: {w: 600, h: 400} },
        { id: 'physics', title: 'Physics Lab', icon: <Flame size={18} className="text-blue-400"/>, component: <ProjectileLab />, defaultSize: {w: 450, h: 500} },
        { id: 'maths', title: 'Maths Lab', icon: <FunctionSquare size={18} className="text-purple-400"/>, component: <div className="p-8 text-white">Maths Lab Visualization...</div>, defaultSize: {w: 400, h: 450} },
        { id: 'notes', title: 'Notes', icon: <Notebook size={18} className="text-yellow-400"/>, component: <textarea className="w-full h-full bg-transparent p-4 text-white outline-none" placeholder="Notes..."></textarea>, defaultSize: {w: 400, h: 500} },
    ], [scale, isFullScreen]);

    const launchApp = (id) => {
        const appDef = APPS.find(a => a.id === id);
        const existing = windows.find(w => w.appId === id);
        setIsStartMenuOpen(false);
        if (existing) {
            setWindows(windows.map(w => w.id === existing.id ? { ...w, minimized: false } : w));
            setActiveWindowId(existing.id);
            return;
        }
        const newWin = { id: Date.now(), appId: id, ...appDef, minimized: false, maximized: false, snapped: null, defaultPos: { x: 100 + (windows.length * 30), y: 50 + (windows.length * 30) } };
        setWindows([...windows, newWin]);
        setActiveWindowId(newWin.id);
    };

    return (
        <div 
            className={`relative overflow-hidden bg-black font-sans transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-[10000]' : 'w-full h-screen'}`} 
            style={{ fontSize: `${16 * scale}px` }}
        >
            {booting ? (
                <BootSequence onComplete={() => setBooting(false)} />
            ) : (
                <div className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-out" style={{ backgroundImage: `url(${wallpaper})` }}>
                    
                    {/* DESKTOP ICONS */}
                    <div className="absolute inset-0 p-12 grid grid-flow-col grid-rows-6 gap-8 w-fit" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                        {APPS.slice(0, 5).map(app => (
                            <div key={app.id} onDoubleClick={() => launchApp(app.id)} className="w-20 h-20 flex flex-col items-center gap-2 group cursor-pointer active:scale-90 transition-transform duration-150">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all border border-white/5 backdrop-blur-md group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">{app.icon}</div>
                                <span className="text-[8px] text-white/70 font-black uppercase tracking-widest text-center group-hover:text-white transition-colors">{app.title}</span>
                            </div>
                        ))}
                    </div>

                    {/* WINDOWS */}
                    {windows.map(win => !win.minimized && (
                        <Window key={win.id} app={win} isActive={activeWindowId === win.id} isMaximized={win.maximized}
                            onClose={() => setWindows(windows.filter(w => w.id !== win.id))}
                            onMinimize={() => setWindows(windows.map(w => w.id === win.id ? { ...w, minimized: true } : w))}
                            onToggleMaximize={() => setWindows(windows.map(w => w.id === win.id ? { ...w, maximized: !w.maximized, snapped: null } : w))}
                            onSnap={(side) => setWindows(windows.map(w => w.id === win.id ? { ...w, snapped: w.snapped === side ? null : side, maximized: false } : w))}
                            onFocus={() => setActiveWindowId(win.id)}
                            scale={scale}
                        />
                    ))}

                    {/* START MENU */}
                    {isStartMenuOpen && (
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] z-[6000] p-8 animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-300 shadow-2xl overflow-hidden" style={{ transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'bottom center' }}>
                            <div className="grid grid-cols-4 gap-6 overflow-y-auto no-scrollbar pb-6">
                                {APPS.map(app => (
                                    <button key={app.id} onClick={() => launchApp(app.id)} className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group active:scale-90 duration-150">
                                        <div className="group-hover:scale-110 transition-transform duration-200">{app.icon}</div>
                                        <span className="text-[9px] font-bold text-white/60 uppercase group-hover:text-white">{app.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TASKBAR */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center w-full px-4 pointer-events-none z-[5000]">
                        <div 
                          className="h-14 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center px-2 gap-1 pointer-events-auto shadow-2xl transition-all duration-300"
                          style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
                        >
                            <button onClick={() => setIsStartMenuOpen(!isStartMenuOpen)} className={`p-2.5 rounded-xl transition-all duration-200 active:scale-90 ${isStartMenuOpen ? 'bg-blue-500/30' : 'hover:bg-blue-500/20'}`}><Grid3X3 size={22} className="text-blue-500" /></button>
                            <div className="w-[1px] h-6 bg-white/10 mx-1" />
                            {windows.map(win => (
                              <div key={win.id} onClick={() => { setWindows(windows.map(w => w.id === win.id ? { ...w, minimized: false } : w)); setActiveWindowId(win.id); }} className={`p-2.5 rounded-xl cursor-pointer relative transition-all duration-200 active:scale-90 ${activeWindowId === win.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                  {win.icon}
                                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${win.minimized ? 'bg-white/30' : 'bg-blue-500'}`} />
                              </div>
                            ))}
                            <div className="w-[1px] h-6 bg-white/10 mx-1" />
                            <div className="flex items-center gap-2 px-2 text-white/40"><Wifi size={14} /><Volume2 size={14} /><Battery size={14} /></div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}
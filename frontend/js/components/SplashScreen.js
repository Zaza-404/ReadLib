function SplashScreen({ onDone }) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Memuat aplikasi...');
    const [showLogo, setShowLogo] = useState(false);

    const loadingMessages = [
        'Memuat aplikasi...',
        'Menyiapkan perpustakaan...',
        'Memuat koleksi buku...',
        'Siap membaca! ✨'
    ];

    useEffect(() => {
        // Animate logo entrance
        setTimeout(() => setShowLogo(true), 300);

        // Simulate loading progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                
                // Show "Siap membaca!" then navigate
                setLoadingText('Siap membaca! ✨');
                setTimeout(onDone, 600);
            }
            
            setProgress(Math.min(100, currentProgress));
            
            // Update loading message
            const messageIndex = Math.min(
                Math.floor(currentProgress / 25),
                loadingMessages.length - 1
            );
            setLoadingText(loadingMessages[messageIndex]);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="screen splash-screen" style={{
            gap: 0,
            background: 'linear-gradient(145deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Particles */}
            <div style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none'
            }}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: Math.random() * 6 + 2,
                            height: Math.random() * 6 + 2,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <StatusBar light/>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                zIndex: 1,
                padding: '0 20px'
            }}>
                {/* Logo with animation */}
                <div 
                    className="splash-logo" 
                    style={{
                        transform: showLogo ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-20deg)',
                        opacity: showLogo ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(.34,1.56,.64,1)',
                        width: 100,
                        height: 100,
                        borderRadius: 28,
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }}
                >
                    <span style={{ 
                        fontSize: 48,
                        animation: 'pulse 2s ease-in-out infinite'
                    }}>
                        📚
                    </span>
                </div>

                {/* Title with animation */}
                <div style={{
                    textAlign: 'center',
                    opacity: showLogo ? 1 : 0,
                    transform: showLogo ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.3s'
                }}>
                    <div className="splash-title" style={{
                        fontSize: 42,
                        letterSpacing: '-1px',
                        textShadow: '0 2px 20px rgba(0,0,0,0.1)'
                    }}>
                        ReadLib
                    </div>
                    <div className="splash-subtitle" style={{
                        fontSize: 15,
                        marginTop: 8,
                        color: 'rgba(255,255,255,0.75)'
                    }}>
                        Perpustakaan Digital Kamu
                    </div>
                </div>

                {/* Loading Section */}
                <div style={{
                    width: '100%',
                    maxWidth: 280,
                    marginTop: 20,
                    opacity: showLogo ? 1 : 0,
                    transition: 'opacity 0.6s ease 0.5s'
                }}>
                    {/* Progress Bar */}
                    <div style={{
                        width: '100%',
                        height: 4,
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.15)',
                        overflow: 'hidden',
                        marginBottom: 12
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            borderRadius: 2,
                            background: 'linear-gradient(90deg, #60a5fa, #fff)',
                            transition: 'width 0.3s ease'
                        }}/>
                    </div>

                    {/* Loading Text */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.7)'
                    }}>
                        <span>{loadingText}</span>
                        <span style={{
                            fontVariantNumeric: 'tabular-nums',
                            fontSize: 12
                        }}>
                            {Math.round(progress)}%
                        </span>
                    </div>

                    {/* Loading Dots Animation */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 16
                    }}>
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.4)',
                                    animation: `bounce 1.4s ease-in-out infinite`,
                                    animationDelay: `${i * 0.2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Version */}
                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: 0.5
                }}>
                    v1.0.0
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.1); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
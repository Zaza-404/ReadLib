function OnboardingScreen({ onDone }) {
    const [slide, setSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [direction, setDirection] = useState('next');

    const slides = [
        {
            emoji: '📖',
            title: 'Baca Kapan Saja',
            desc: 'Akses ribuan buku dari genggaman tanganmu, kapan pun dan di mana pun kamu berada. Nikmati pengalaman membaca yang nyaman di perangkat favoritmu.',
            color: '#EFF6FF',
            btnColor: '#3B82F6',
            btn: 'Selanjutnya',
            illustration: '📚'
        },
        {
            emoji: '🔖',
            title: 'Tandai & Catat',
            desc: 'Simpan halaman favoritmu dan tambahkan catatan pribadi untuk referensi mendatang. Tidak akan pernah kehilangan jejak bacaanmu lagi.',
            color: '#F0FDF4',
            btnColor: '#22C55E',
            btn: 'Selanjutnya',
            illustration: '✍️'
        },
        {
            emoji: '🎯',
            title: 'Rekomendasi Untukmu',
            desc: 'Dapatkan rekomendasi buku yang dipersonalisasi berdasarkan selera bacaanmu. Temukan buku baru yang sesuai dengan minatmu setiap hari.',
            color: '#FFF7ED',
            btnColor: '#F59E0B',
            btn: 'Mulai Sekarang',
            illustration: '🌟'
        }
    ];

    const s = slides[slide];

    useEffect(() => {
        setProgress(((slide + 1) / slides.length) * 100);
    }, [slide]);

    const goToSlide = (index) => {
        setDirection(index > slide ? 'next' : 'prev');
        setSlide(index);
    };

    const handleNext = () => {
        if (slide < slides.length - 1) {
            goToSlide(slide + 1);
        } else {
            onDone();
        }
    };

    const handleSkip = () => {
        onDone();
    };

    const handleDotClick = (index) => {
        if (index !== slide) {
            goToSlide(index);
        }
    };

    return (
        <div className="screen" style={{background:'#fff',overflow:'hidden'}}>
            {/* Progress Bar */}
            <div style={{
                position:'absolute',
                top:0,
                left:0,
                right:0,
                height:3,
                background:'var(--border-light)',
                zIndex:10
            }}>
                <div style={{
                    height:'100%',
                    background:`linear-gradient(90deg, ${s.btnColor}, ${s.btnColor}dd)`,
                    width:`${progress}%`,
                    transition:'width 0.5s cubic-bezier(.4,0,.2,1)'
                }}/>
            </div>

            {/* Skip Button */}
            {slide < slides.length - 1 && (
                <button
                    onClick={handleSkip}
                    style={{
                        position:'absolute',
                        top:16,
                        right:20,
                        zIndex:10,
                        background:'rgba(255,255,255,0.8)',
                        border:'1px solid var(--border-light)',
                        padding:'6px 14px',
                        borderRadius:20,
                        fontSize:12,
                        color:'var(--text-secondary)',
                        cursor:'pointer',
                        fontFamily:'Poppins',
                        fontWeight:500,
                        backdropFilter:'blur(8px)'
                    }}
                >
                    Lewati
                </button>
            )}

            {/* Illustration Area */}
            <div 
                className="onboard-illo" 
                style={{
                    background:s.color,
                    transition:'background 0.5s ease',
                    position:'relative',
                    overflow:'hidden'
                }}
            >
                <div style={{
                    position:'absolute',
                    fontSize:200,
                    opacity:0.08,
                    right:-40,
                    top:-40,
                    transform:'rotate(15deg)'
                }}>
                    {s.illustration}
                </div>
                <span style={{
                    fontSize:120,
                    animation:'fadeInUp 0.6s ease',
                    position:'relative',
                    zIndex:1
                }}>
                    {s.emoji}
                </span>
            </div>

            {/* Content */}
            <div style={{
                flex:1,
                padding:'32px 28px 40px',
                display:'flex',
                flexDirection:'column',
                gap:20,
                animation:'fadeInUp 0.4s ease'
            }}>
                <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:12}}>
                    <h1 style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:30,
                        fontWeight:700,
                        color:'var(--text-primary)',
                        lineHeight:1.2
                    }}>
                        {s.title}
                    </h1>
                    <p style={{
                        fontSize:15,
                        color:'var(--text-secondary)',
                        lineHeight:1.7,
                        maxWidth:320
                    }}>
                        {s.desc}
                    </p>

                    {/* Feature highlights for current slide */}
                    <div style={{
                        marginTop:12,
                        display:'flex',
                        flexDirection:'column',
                        gap:8
                    }}>
                        {slide === 0 && (
                            <>
                                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--text-secondary)'}}>
                                    <span style={{fontSize:16}}>📱</span>
                                    <span>Baca di HP, tablet, atau komputer</span>
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--text-secondary)'}}>
                                    <span style={{fontSize:16}}>🌙</span>
                                    <span>Mode malam untuk kenyamanan mata</span>
                                </div>
                            </>
                        )}
                        {slide === 1 && (
                            <>
                                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--text-secondary)'}}>
                                    <span style={{fontSize:16}}>📌</span>
                                    <span>Tandai halaman penting dengan mudah</span>
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--text-secondary)'}}>
                                    <span style={{fontSize:16}}>📝</span>
                                    <span>Catat ide dan kutipan favorit</span>
                                </div>
                            </>
                        )}
                        {slide === 2 && (
                            <>
                                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--text-secondary)'}}>
                                    <span style={{fontSize:16}}>🤖</span>
                                    <span>Rekomendasi AI berdasarkan minatmu</span>
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--text-secondary)'}}>
                                    <span style={{fontSize:16}}>📊</span>
                                    <span>Lacak progress membaca harian</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Dots */}
                <div style={{
                    display:'flex',
                    justifyContent:'center',
                    gap:10,
                    marginBottom:4
                }}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDotClick(i)}
                            style={{
                                width:i === slide ? 28 : 8,
                                height:8,
                                borderRadius:4,
                                background:i === slide ? s.btnColor : 'var(--border-medium)',
                                border:'none',
                                cursor:'pointer',
                                transition:'all 0.3s cubic-bezier(.4,0,.2,1)',
                                padding:0
                            }}
                        />
                    ))}
                </div>

                {/* Button */}
                <button 
                    className="btn-primary" 
                    style={{
                        background:s.btnColor,
                        height:54,
                        fontSize:16,
                        borderRadius:'12px',
                        boxShadow:`0 4px 16px ${s.btnColor}44`
                    }} 
                    onClick={handleNext}
                >
                    {s.btn}
                    {slide < slides.length - 1 && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    )}
                </button>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
function ErrorScreen({ nav, errorMessage, onRetry }) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRetry = async () => {
        if (onRetry) {
            setLoading(true);
            try {
                await onRetry();
            } catch (err) {
                console.error('Retry failed:', err);
            } finally {
                setLoading(false);
            }
        } else {
            // Default retry: reload page
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                window.location.reload();
            }, 1500);
        }
    };

    const copyError = () => {
        const errorText = errorMessage || 'Unknown error occurred';
        navigator.clipboard?.writeText(errorText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getErrorType = () => {
        if (!errorMessage) return 'unknown';
        const msg = errorMessage.toLowerCase();
        if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
            return 'network';
        }
        if (msg.includes('auth') || msg.includes('token') || msg.includes('unauthorized')) {
            return 'auth';
        }
        if (msg.includes('not found') || msg.includes('404')) {
            return 'notfound';
        }
        if (msg.includes('server') || msg.includes('500')) {
            return 'server';
        }
        return 'unknown';
    };

    const errorType = getErrorType();

    const errorConfigs = {
        network: {
            emoji: '📡',
            title: 'Koneksi Bermasalah',
            desc: 'Tidak dapat terhubung ke server. Periksa koneksi internetmu dan coba lagi.',
            action: 'Periksa Koneksi'
        },
        auth: {
            emoji: '🔒',
            title: 'Sesi Berakhir',
            desc: 'Sesi loginmu telah berakhir. Silakan login kembali untuk melanjutkan.',
            action: 'Login Ulang'
        },
        notfound: {
            emoji: '🔍',
            title: 'Halaman Tidak Ditemukan',
            desc: 'Halaman yang kamu cari tidak tersedia atau telah dipindahkan.',
            action: 'Kembali ke Beranda'
        },
        server: {
            emoji: '⚙️',
            title: 'Server Bermasalah',
            desc: 'Terjadi masalah pada server. Tim kami sedang bekerja untuk memperbaikinya.',
            action: 'Coba Lagi'
        },
        unknown: {
            emoji: '⚠️',
            title: 'Terjadi Kesalahan',
            desc: errorMessage || 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
            action: 'Coba Lagi'
        }
    };

    const config = errorConfigs[errorType] || errorConfigs.unknown;

    return (
        <div className="screen" style={{background: '#fff'}}>
            <StatusBar/>
            
            {/* Header dengan back button */}
            <div className="header" style={{borderBottom: '1px solid var(--border-light)'}}>
                <button className="back-btn" onClick={() => nav('home')}>
                    {icons.back()}
                </button>
                <span className="header-title" style={{color: 'var(--error)'}}>Error</span>
                <div style={{width:36}}></div>
            </div>

            <div className="scroll-content" style={{paddingBottom: 80, display: 'flex', alignItems: 'center'}}>
                <div className="state-center" style={{padding: '20px 24px', gap: 20}}>
                    {/* Error Icon dengan animasi */}
                    <div style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        background: '#FEE2E2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                        animation: 'fadeInUp 0.4s ease'
                    }}>
                        <span style={{fontSize: 48}}>{config.emoji}</span>
                    </div>

                    {/* Error Details */}
                    <div style={{textAlign: 'center', animation: 'fadeInUp 0.4s ease 0.1s both'}}>
                        <div className="state-title" style={{fontSize: 22, marginBottom: 8}}>
                            {config.title}
                        </div>
                        <div className="state-desc" style={{maxWidth: 320, margin: '0 auto', lineHeight: 1.7}}>
                            {config.desc}
                        </div>
                    </div>

                    {/* Error Code / Message (expandable) */}
                    {errorMessage && (
                        <div style={{
                            width: '100%',
                            maxWidth: 320,
                            marginTop: 8,
                            padding: '12px 16px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            fontSize: 12,
                            color: 'var(--text-secondary)',
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            position: 'relative',
                            border: '1px solid var(--border-light)',
                            animation: 'fadeInUp 0.4s ease 0.2s both'
                        }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span style={{fontWeight: 600, fontSize: 11}}>🔍 Detail Error</span>
                                <button
                                    onClick={copyError}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        color: 'var(--text-disabled)',
                                        padding: '4px 8px',
                                        borderRadius: 4,
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--border-light)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {copied ? '✓ Disalin' : '📋 Salin'}
                                </button>
                            </div>
                            <div style={{marginTop: 6, fontSize: 11, color: 'var(--text-disabled)', lineHeight: 1.6}}>
                                {errorMessage}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        width: '100%',
                        maxWidth: 280,
                        marginTop: 12,
                        animation: 'fadeInUp 0.4s ease 0.3s both'
                    }}>
                        <button 
                            className="btn-primary" 
                            onClick={handleRetry} 
                            disabled={loading}
                            style={{height: 48}}
                        >
                            {loading ? (
                                <div className="spinner" style={{width: 20, height: 20, borderWidth: 2}}/>
                            ) : (
                                <>
                                    {icons.refresh()}
                                    {config.action}
                                </>
                            )}
                        </button>

                        <button 
                            className="btn-secondary" 
                            onClick={() => {
                                if (errorType === 'auth') {
                                    nav('login');
                                } else {
                                    nav('home');
                                }
                            }}
                            style={{height: 48}}
                        >
                            {errorType === 'auth' ? 'Login Ulang' : 'Kembali ke Beranda'}
                        </button>
                    </div>

                    {/* Help Links */}
                    <div style={{
                        marginTop: 16,
                        display: 'flex',
                        gap: 16,
                        alignItems: 'center',
                        fontSize: 12,
                        color: 'var(--text-disabled)',
                        animation: 'fadeInUp 0.4s ease 0.4s both'
                    }}>
                        <span 
                            style={{cursor: 'pointer'}}
                            onClick={() => window.open('mailto:support@readlib.com', '_blank')}
                        >
                            📧 Hubungi Support
                        </span>
                        <span style={{color: 'var(--border-light)'}}>|</span>
                        <span 
                            style={{cursor: 'pointer'}}
                            onClick={() => window.open('/faq', '_blank')}
                        >
                            ❓ FAQ
                        </span>
                    </div>

                    {/* Status Indicator */}
                    <div style={{
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        color: 'var(--text-disabled)'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--error)',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}/>
                        <span>Status: Error</span>
                        <span style={{color: 'var(--border-light)'}}>|</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Nav dengan disabled state */}
            <div className="bottom-nav" style={{opacity: 0.5, pointerEvents: 'none'}}>
                {['home', 'search', 'category', 'library', 'profile'].map(id => (
                    <div key={id} className={`nav-item${id === 'home' ? ' active' : ''}`}>
                        {id === 'home' && icons.home()}
                        {id === 'search' && icons.search()}
                        {id === 'category' && icons.category()}
                        {id === 'library' && icons.library()}
                        {id === 'profile' && icons.profile()}
                        <span>{id === 'home' ? 'Beranda' : id === 'search' ? 'Cari' : id === 'category' ? 'Kategori' : id === 'library' ? 'Koleksi' : 'Profil'}</span>
                        <div className="nav-dot"/>
                    </div>
                ))}
            </div>

            {/* CSS Animation untuk pulse */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.8); }
                }
            `}</style>
        </div>
    );
}
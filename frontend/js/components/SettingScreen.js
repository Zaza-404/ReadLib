function SettingsScreen({ nav }) {
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        autoBookmark: true,
        fontSize: 'medium',
        language: 'id',
        downloadQuality: 'auto',
        autoSync: true,
        readingGoal: 30,
        weeklyReport: true
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('readlib_settings');
        if (savedSettings) {
            try {
                setSettings({...settings, ...JSON.parse(savedSettings)});
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }, []);

    const saveSettings = (newSettings) => {
        const updated = {...settings, ...newSettings};
        setSettings(updated);
        localStorage.setItem('readlib_settings', JSON.stringify(updated));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggle = (key) => {
        saveSettings({[key]: !settings[key]});
    };

    const handleSliderChange = (key, value) => {
        saveSettings({[key]: value});
    };

    const fontSizes = {
        small: 'Kecil',
        medium: 'Sedang',
        large: 'Besar',
        xlarge: 'Sangat Besar'
    };

    const languages = [
        { id: 'id', label: 'Bahasa Indonesia' },
        { id: 'en', label: 'English' }
    ];

    const downloadQualities = [
        { id: 'low', label: 'Rendah (hemat data)' },
        { id: 'medium', label: 'Sedang' },
        { id: 'high', label: 'Tinggi (kualitas terbaik)' },
        { id: 'auto', label: 'Otomatis' }
    ];

    return (
        <div className="screen">
            <StatusBar/>
            <div className="header">
                <button className="back-btn" onClick={() => nav('back')}>
                    {icons.back()}
                </button>
                <span className="header-title">Pengaturan</span>
                <button 
                    className="back-btn"
                    style={{
                        background: saved ? 'var(--success)' : 'var(--bg-secondary)',
                        opacity: saved ? 1 : 0,
                        transition: 'opacity 0.3s'
                    }}
                >
                    {saved && <span style={{fontSize: 14, color: '#fff'}}>✓</span>}
                </button>
            </div>

            <div className="scroll-content" style={{padding: '0 20px 80px'}}>
                {/* Display Settings */}
                <div style={{marginTop: 20}}>
                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: 10,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>🖥️</span> Tampilan
                    </div>
                    
                    <div className="toggle-wrap">
                        <div className="toggle-info">
                            <div className="toggle-label">Mode Gelap</div>
                            <div className="toggle-desc">Tampilan latar belakang gelap</div>
                        </div>
                        <button className={`toggle${settings.darkMode ? ' on' : ''}`} onClick={() => toggle('darkMode')}/>
                    </div>

                    <div style={{padding: '14px 0', borderBottom: '1px solid var(--border-light)'}}>
                        <div className="toggle-label" style={{marginBottom: 10}}>Ukuran Font</div>
                        <div style={{display: 'flex', gap: 8}}>
                            {Object.entries(fontSizes).map(([key, label]) => (
                                <button 
                                    key={key} 
                                    onClick={() => handleSliderChange('fontSize', key)} 
                                    style={{
                                        flex: 1,
                                        padding: '8px 4px',
                                        borderRadius: 8,
                                        border: `1.5px solid ${settings.fontSize === key ? 'var(--primary)' : 'var(--border-medium)'}`,
                                        background: settings.fontSize === key ? 'var(--primary-light)' : 'transparent',
                                        color: settings.fontSize === key ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontSize: key === 'small' ? 11 : key === 'medium' ? 13 : key === 'large' ? 15 : 17,
                                        fontFamily: 'Poppins',
                                        cursor: 'pointer',
                                        fontWeight: settings.fontSize === key ? 600 : 400,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{padding: '14px 0', borderBottom: '1px solid var(--border-light)'}}>
                        <div className="toggle-label" style={{marginBottom: 10}}>Bahasa</div>
                        <div style={{display: 'flex', gap: 8}}>
                            {languages.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => handleSliderChange('language', lang.id)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: 8,
                                        border: `1.5px solid ${settings.language === lang.id ? 'var(--primary)' : 'var(--border-medium)'}`,
                                        background: settings.language === lang.id ? 'var(--primary-light)' : 'transparent',
                                        color: settings.language === lang.id ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontSize: 13,
                                        fontFamily: 'Poppins',
                                        cursor: 'pointer',
                                        fontWeight: settings.language === lang.id ? 600 : 400,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reading Settings */}
                <div style={{marginTop: 24}}>
                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: 10,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>📖</span> Membaca
                    </div>

                    <div className="toggle-wrap">
                        <div className="toggle-info">
                            <div className="toggle-label">Auto Bookmark</div>
                            <div className="toggle-desc">Simpan posisi baca otomatis</div>
                        </div>
                        <button className={`toggle${settings.autoBookmark ? ' on' : ''}`} onClick={() => toggle('autoBookmark')}/>
                    </div>

                    <div className="toggle-wrap">
                        <div className="toggle-info">
                            <div className="toggle-label">Sinkronisasi Otomatis</div>
                            <div className="toggle-desc">Sinkronkan progress antar perangkat</div>
                        </div>
                        <button className={`toggle${settings.autoSync ? ' on' : ''}`} onClick={() => toggle('autoSync')}/>
                    </div>

                    <div style={{padding: '14px 0', borderBottom: '1px solid var(--border-light)'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>
                                <div className="toggle-label">Target Membaca Harian</div>
                                <div className="toggle-desc">{settings.readingGoal} menit per hari</div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                <button
                                    onClick={() => handleSliderChange('readingGoal', Math.max(5, settings.readingGoal - 5))}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 6,
                                        border: '1px solid var(--border-medium)',
                                        background: 'var(--bg-secondary)',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    −
                                </button>
                                <span style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    minWidth: 30,
                                    textAlign: 'center'
                                }}>
                                    {settings.readingGoal}
                                </span>
                                <button
                                    onClick={() => handleSliderChange('readingGoal', Math.min(120, settings.readingGoal + 5))}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 6,
                                        border: '1px solid var(--border-medium)',
                                        background: 'var(--bg-secondary)',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div style={{marginTop: 24}}>
                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: 10,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>🔔</span> Notifikasi
                    </div>

                    <div className="toggle-wrap">
                        <div className="toggle-info">
                            <div className="toggle-label">Aktifkan Notifikasi</div>
                            <div className="toggle-desc">Terima pembaruan dan pengingat</div>
                        </div>
                        <button className={`toggle${settings.notifications ? ' on' : ''}`} onClick={() => toggle('notifications')}/>
                    </div>

                    <div className="toggle-wrap" style={{borderBottom: 'none'}}>
                        <div className="toggle-info">
                            <div className="toggle-label">Laporan Mingguan</div>
                            <div className="toggle-desc">Ringkasan aktivitas membaca setiap minggu</div>
                        </div>
                        <button className={`toggle${settings.weeklyReport ? ' on' : ''}`} onClick={() => toggle('weeklyReport')}/>
                    </div>
                </div>

                {/* Download Settings */}
                <div style={{marginTop: 24}}>
                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: 10,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>📥</span> Unduhan
                    </div>

                    <div style={{padding: '14px 0', borderBottom: '1px solid var(--border-light)'}}>
                        <div className="toggle-label" style={{marginBottom: 10}}>Kualitas Unduhan</div>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                            {downloadQualities.map(q => (
                                <button
                                    key={q.id}
                                    onClick={() => handleSliderChange('downloadQuality', q.id)}
                                    style={{
                                        flex: '1 1 auto',
                                        padding: '6px 12px',
                                        borderRadius: 20,
                                        border: `1.5px solid ${settings.downloadQuality === q.id ? 'var(--primary)' : 'var(--border-medium)'}`,
                                        background: settings.downloadQuality === q.id ? 'var(--primary-light)' : 'transparent',
                                        color: settings.downloadQuality === q.id ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontSize: 12,
                                        fontFamily: 'Poppins',
                                        cursor: 'pointer',
                                        fontWeight: settings.downloadQuality === q.id ? 600 : 400,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {q.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* About */}
                <div style={{
                    marginTop: 32,
                    paddingTop: 20,
                    borderTop: '1px solid var(--border-light)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginBottom: 8
                    }}>
                        <span style={{fontSize: 20}}>📚</span>
                        <span style={{
                            fontSize: 16,
                            fontWeight: 700,
                            fontFamily: "'Playfair Display',serif",
                            color: 'var(--text-primary)'
                        }}>
                            ReadLib
                        </span>
                    </div>
                    <div style={{fontSize: 12, color: 'var(--text-disabled)'}}>
                        v1.0.0 · Made with ❤️
                    </div>
                    <div style={{
                        fontSize: 11,
                        color: 'var(--text-disabled)',
                        marginTop: 4,
                        display: 'flex',
                        gap: 16,
                        justifyContent: 'center'
                    }}>
                        <span style={{cursor: 'pointer'}}>Privacy Policy</span>
                        <span>·</span>
                        <span style={{cursor: 'pointer'}}>Terms of Service</span>
                        <span>·</span>
                        <span style={{cursor: 'pointer'}}>Support</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
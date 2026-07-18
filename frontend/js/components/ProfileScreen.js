function ProfileScreen({ nav, openEditProfile, openSettings }) {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ read_count: 0, collection_count: 0, bookmark_count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [profileData, statsData, notifData] = await Promise.all([
                getProfile(),
                getStats().catch(() => ({})),
                getNotifications().catch(() => [])
            ]);

            setProfile(profileData);
            setStats({
                read_count: statsData.read_count || 0,
                collection_count: statsData.collection_count || 0,
                bookmark_count: statsData.bookmark_count || 0
            });
            setUnreadCount(notifData.filter(n => !n.is_read).length);

        } catch (err) {
            console.error('Error fetching profile data:', err);
            setError('Gagal memuat profil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = () => {
        if (!profile || !profile.name) return '?';
        const parts = profile.name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase() || '?';
    };

    const handleLogout = () => {
        if (confirm('Yakin ingin keluar dari akun?')) {
            logout();
            nav('login');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="screen">
                <StatusBar/>
                <div className="state-center" style={{paddingTop:80}}>
                    <div className="spinner"/>
                    <div className="state-desc">Memuat profil...</div>
                </div>
                <BottomNav active="profile" nav={nav}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="screen">
                <StatusBar/>
                <div className="state-center">
                    <div className="state-emoji">⚠️</div>
                    <div className="state-title">Gagal Memuat</div>
                    <div className="state-desc">{error}</div>
                    <button className="btn-primary" style={{width:160,marginTop:16}} onClick={fetchProfileData}>
                        {icons.refresh()} Coba Lagi
                    </button>
                </div>
                <BottomNav active="profile" nav={nav}/>
            </div>
        );
    }

    return (
        <div className="screen">
            <StatusBar/>
            <div className="scroll-content">
                {/* Header with cover */}
                <div style={{
                    background: 'linear-gradient(160deg, #EFF6FF, #DBEAFE)',
                    padding: '30px 20px 24px',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 16,
                        right: 20,
                        display: 'flex',
                        gap: 8
                    }}>
                        <button 
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: 'rgba(255,255,255,0.8)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(8px)'
                            }}
                            onClick={openSettings}
                        >
                            ⚙️
                        </button>
                    </div>

                    <div className="avatar-lg" style={{
                        margin: '0 auto 12px',
                        border: '4px solid #fff',
                        boxShadow: '0 4px 20px rgba(59,130,246,0.2)'
                    }}>
                        {getInitials()}
                    </div>
                    
                    <h2 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: 'var(--text-primary)'
                    }}>
                        {profile?.name || 'Pengguna'}
                    </h2>
                    
                    <p style={{fontSize: 13, color: 'var(--text-secondary)', marginTop: 4}}>
                        {profile?.email || ''}
                    </p>
                    
                    {profile?.location && (
                        <p style={{fontSize: 12, color: 'var(--text-secondary)', marginTop: 4}}>
                            📍 {profile.location}
                        </p>
                    )}
                    
                    {profile?.bio && (
                        <p style={{
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                            marginTop: 8,
                            maxWidth: 300,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontStyle: 'italic'
                        }}>
                            "{profile.bio}"
                        </p>
                    )}
                    
                    <p style={{
                        fontSize: 11,
                        color: 'var(--text-disabled)',
                        marginTop: 8
                    }}>
                        Bergabung {formatDate(profile?.created_at)}
                    </p>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'flex',
                    padding: '20px 20px',
                    gap: 1,
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border-light)'
                }}>
                    {[
                        { label: 'Dibaca', val: stats.read_count, icon: '📖' },
                        { label: 'Koleksi', val: stats.collection_count, icon: '📚' },
                        { label: 'Bookmark', val: stats.bookmark_count, icon: '🔖' }
                    ].map((s, i) => (
                        <div key={i} style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '8px 0',
                            borderRight: i < 2 ? '1px solid var(--border-light)' : 'none'
                        }}>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                fontFamily: "'Playfair Display',serif"
                            }}>
                                {s.val}
                            </div>
                            <div style={{
                                fontSize: 12,
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4
                            }}>
                                <span>{s.icon}</span>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Menu Items */}
                <div style={{padding: '20px 20px 80px'}}>
                    {[
                        { icon: '✏️', bg: '#EFF6FF', label: 'Edit Profil', sub: 'Ubah nama, foto, dan info', action: openEditProfile },
                        { icon: '🔔', bg: '#F0FDF4', label: 'Notifikasi', sub: `Kelola notifikasi${unreadCount > 0 ? ` (${unreadCount} baru)` : ''}`, action: () => nav('notif') },
                        { icon: '⚙️', bg: '#FFF7ED', label: 'Pengaturan', sub: 'Tampilan, font, preferensi', action: openSettings },
                        { icon: '📊', bg: '#F5F3FF', label: 'Statistik Membaca', sub: 'Lihat progress dan aktivitas', action: () => nav('stats') },
                        { icon: '❓', bg: '#F3F4F6', label: 'Bantuan & FAQ', sub: 'Pusat bantuan', action: () => alert('Fitur bantuan akan segera hadir! 📚') },
                        { icon: '🚪', bg: '#FFF1F2', label: 'Keluar', sub: 'Logout dari akun', action: handleLogout, danger: true },
                    ].map((m, i) => (
                        <div key={i} className="menu-item" onClick={m.action}>
                            <div className="menu-icon-wrap" style={{ background: m.bg }}>
                                <span style={{ fontSize: 18 }}>{m.icon}</span>
                            </div>
                            <div className="menu-text">
                                <div className="menu-label" style={m.danger ? { color: 'var(--error)' } : {}}>
                                    {m.label}
                                </div>
                                <div className="menu-sub">{m.sub}</div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav active="profile" nav={nav}/>
        </div>
    );
}
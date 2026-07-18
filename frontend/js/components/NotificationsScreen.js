function NotificationsScreen({ nav }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all | unread | read

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getNotifications();
            setNotifications(data || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Gagal memuat notifikasi. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
            );
        } catch (err) {
            console.error('Error marking notification read:', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => 
                prev.map(n => ({ ...n, is_read: 1 }))
            );
        } catch (err) {
            console.error('Error marking all notifications read:', err);
        }
    };

    const handleDeleteNotification = async (id) => {
        // Note: You'd need a DELETE endpoint for this
        // For now, just remove from UI
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getFilteredNotifications = () => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.is_read);
        }
        if (filter === 'read') {
            return notifications.filter(n => n.is_read);
        }
        return notifications;
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const filtered = getFilteredNotifications();

    const getTimeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID');
    };

    if (loading) {
        return (
            <div className="screen">
                <StatusBar/>
                <div className="header">
                    <button className="back-btn" onClick={() => nav('back')}>
                        {icons.back()}
                    </button>
                    <span className="header-title">Notifikasi</span>
                </div>
                <div className="state-center">
                    <div className="spinner"/>
                    <div className="state-desc">Memuat notifikasi...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="screen">
                <StatusBar/>
                <div className="header">
                    <button className="back-btn" onClick={() => nav('back')}>
                        {icons.back()}
                    </button>
                    <span className="header-title">Notifikasi</span>
                </div>
                <div className="state-center">
                    <div className="state-emoji">⚠️</div>
                    <div className="state-title">Gagal Memuat</div>
                    <div className="state-desc">{error}</div>
                    <button className="btn-primary" style={{width:160,marginTop:16}} onClick={fetchNotifications}>
                        {icons.refresh()} Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen">
            <StatusBar/>
            <div className="header">
                <button className="back-btn" onClick={() => nav('back')}>
                    {icons.back()}
                </button>
                <span className="header-title">Notifikasi</span>
                {unreadCount > 0 && (
                    <button 
                        style={{
                            marginLeft:'auto',
                            fontSize:12,
                            color:'var(--primary)',
                            background:'none',
                            border:'none',
                            cursor:'pointer',
                            fontWeight:500,
                            fontFamily:'Poppins',
                            padding:'4px 8px',
                            borderRadius:6,
                            transition:'background 0.2s'
                        }}
                        onClick={handleMarkAllRead}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        Tandai semua dibaca
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div style={{
                display:'flex',
                padding:'8px 20px',
                gap:8,
                borderBottom:'1px solid var(--border-light)',
                background:'#fff'
            }}>
                {[
                    {id:'all',label:'Semua',count:notifications.length},
                    {id:'unread',label:'Belum Dibaca',count:unreadCount},
                    {id:'read',label:'Sudah Dibaca',count:notifications.length - unreadCount}
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        style={{
                            flex:1,
                            padding:'6px 12px',
                            borderRadius:20,
                            border:'1px solid',
                            borderColor: filter === f.id ? 'var(--primary)' : 'var(--border-light)',
                            background: filter === f.id ? 'var(--primary-light)' : 'transparent',
                            color: filter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                            fontSize:12,
                            fontWeight: filter === f.id ? 600 : 400,
                            cursor:'pointer',
                            transition:'all 0.2s',
                            fontFamily:'Poppins'
                        }}
                    >
                        {f.label} ({f.count})
                    </button>
                ))}
            </div>

            <div className="scroll-content" style={{padding:'16px 20px 80px'}}>
                {filtered.length === 0 ? (
                    <div className="state-center" style={{paddingTop:40}}>
                        <div className="state-emoji">🔔</div>
                        <div className="state-title">
                            {filter === 'all' ? 'Tidak Ada Notifikasi' : 
                             filter === 'unread' ? 'Semua Sudah Dibaca' : 
                             'Belum Ada Notifikasi Dibaca'}
                        </div>
                        <div className="state-desc">
                            {filter === 'all' ? 'Kamu sudah melihat semua notifikasi.' : 
                             filter === 'unread' ? 'Semua notifikasi sudah kamu baca. 👍' : 
                             'Mulai baca notifikasi untuk melihatnya di sini.'}
                        </div>
                    </div>
                ) : (
                    filtered.map(n => (
                        <div 
                            key={n.id} 
                            className="notif-item" 
                            style={{
                                background: n.is_read ? 'transparent' : 'var(--bg-card)',
                                border: n.is_read ? '1px solid transparent' : '1px solid var(--border-light)',
                                cursor: n.is_read ? 'default' : 'pointer'
                            }} 
                            onClick={() => !n.is_read && handleMarkRead(n.id)}
                        >
                            <div style={{
                                width:40,
                                height:40,
                                borderRadius:10,
                                background: n.is_read ? 'var(--bg-secondary)' : 'var(--primary-light)',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                fontSize:20,
                                flex:'none'
                            }}>
                                {n.icon || '📌'}
                            </div>
                            <div style={{flex:1}}>
                                <div style={{
                                    display:'flex',
                                    justifyContent:'space-between',
                                    alignItems:'flex-start'
                                }}>
                                    <div style={{
                                        fontSize:13,
                                        fontWeight: n.is_read ? 400 : 600,
                                        color:'var(--text-primary)',
                                        flex:1,
                                        paddingRight:8
                                    }}>
                                        {n.title}
                                    </div>
                                    {!n.is_read && <div className="notif-dot"/>}
                                </div>
                                <div style={{
                                    fontSize:12,
                                    color:'var(--text-secondary)',
                                    lineHeight:1.5,
                                    marginTop:2
                                }}>
                                    {n.body}
                                </div>
                                <div style={{
                                    display:'flex',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    marginTop:6
                                }}>
                                    <div style={{fontSize:11,color:'var(--text-disabled)'}}>
                                        {getTimeAgo(n.created_at)}
                                    </div>
                                    {n.is_read && (
                                        <button
                                            style={{
                                                fontSize:11,
                                                color:'var(--text-disabled)',
                                                background:'none',
                                                border:'none',
                                                cursor:'pointer',
                                                padding:'2px 6px',
                                                borderRadius:4,
                                                transition:'all 0.2s'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNotification(n.id);
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
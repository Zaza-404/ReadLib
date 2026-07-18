function HomeScreen({ nav, openBook, openSearch }) {
    const [books, setBooks] = useState([]);
    const [continuing, setContinuing] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('Pembaca');
    const [greeting, setGreeting] = useState('Selamat pagi');

    useEffect(() => {
        fetchHomeData();
        setGreeting(getGreeting());
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat pagi';
        if (hour < 18) return 'Selamat siang';
        return 'Selamat malam';
    };

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch books and user profile in parallel
            const [booksData, profileData] = await Promise.all([
                getBooks(),
                getProfile().catch(() => null)
            ]);
            
            setBooks(booksData);
            
            // Set user name if available
            if (profileData && profileData.name) {
                setUserName(profileData.name);
            }

            // Filter continuing books (progress > 0 and < 100)
            const continuingBooks = booksData.filter(b => 
                b.user_progress > 0 && b.user_progress < 100
            );
            setContinuing(continuingBooks);

            // Filter recommended books (not started or progress = 0)
            const recommendedBooks = booksData.filter(b => 
                b.user_progress === 0 || b.user_progress === undefined
            );
            setRecommended(recommendedBooks);

        } catch (err) {
            console.error('Error fetching home data:', err);
            setError('Gagal memuat data. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const getProgress = (book) => {
        return book.user_progress || 0;
    };

    if (loading) {
        return (
            <div className="screen">
                <StatusBar/>
                <div style={{padding:'8px 20px 12px',background:'#fff',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border-light)'}}>
                    <div style={{flex:1}}>
                        <div className="search-bar" style={{cursor:'pointer',pointerEvents:'none',opacity:0.6}}>
                            {icons.search()}
                            <span style={{fontSize:14,color:'var(--text-disabled)'}}>Cari buku, penulis...</span>
                        </div>
                    </div>
                    <div style={{width:40,height:40,borderRadius:12,background:'var(--bg-secondary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {icons.bell()}
                    </div>
                </div>
                <div className="state-center">
                    <div className="spinner"/>
                    <div className="state-desc">Memuat perpustakaanmu...</div>
                </div>
                <BottomNav active="home" nav={nav}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="screen">
                <StatusBar/>
                <div style={{padding:'8px 20px 12px',background:'#fff',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border-light)'}}>
                    <div style={{flex:1}}>
                        <div className="search-bar" style={{cursor:'pointer',pointerEvents:'none',opacity:0.6}}>
                            {icons.search()}
                            <span style={{fontSize:14,color:'var(--text-disabled)'}}>Cari buku, penulis...</span>
                        </div>
                    </div>
                    <div style={{width:40,height:40,borderRadius:12,background:'var(--bg-secondary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {icons.bell()}
                    </div>
                </div>
                <div className="state-center">
                    <div className="state-emoji">⚠️</div>
                    <div className="state-title">Gagal Memuat</div>
                    <div className="state-desc">{error}</div>
                    <button className="btn-primary" style={{width:160,marginTop:16}} onClick={fetchHomeData}>
                        {icons.refresh()} Coba Lagi
                    </button>
                </div>
                <BottomNav active="home" nav={nav}/>
            </div>
        );
    }

    return (
        <div className="screen">
            <StatusBar/>
            <div style={{padding:'8px 20px 12px',background:'#fff',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--border-light)'}}>
                <div style={{flex:1}} onClick={openSearch}>
                    <div className="search-bar" style={{cursor:'pointer',pointerEvents:'none'}}>
                        {icons.search()}
                        <span style={{fontSize:14,color:'var(--text-disabled)'}}>Cari buku, penulis...</span>
                    </div>
                </div>
                <div style={{position:'relative',cursor:'pointer'}} onClick={() => nav('notif')}>
                    <div style={{width:40,height:40,borderRadius:12,background:'var(--bg-secondary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {icons.bell()}
                    </div>
                    <div style={{position:'absolute',top:6,right:6,width:8,height:8,borderRadius:4,background:'var(--error)',border:'2px solid #fff'}}/>
                </div>
            </div>
            <div className="scroll-content">
                <div style={{padding:'20px 20px 0'}}>
                    <p style={{fontSize:13,color:'var(--text-secondary)'}}>{greeting},</p>
                    <h2 style={{fontSize:22,fontWeight:700,color:'var(--text-primary)',fontFamily:"'Playfair Display',serif"}}>
                        {userName} 👋
                    </h2>
                </div>

                {/* Statistics Cards */}
                <div style={{padding:'16px 20px 0',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    <div style={{background:'var(--bg-card)',padding:'12px',borderRadius:'12px',textAlign:'center',boxShadow:'var(--shadow)'}}>
                        <div style={{fontSize:20,fontWeight:700,color:'var(--primary)'}}>
                            {books.filter(b => b.user_progress === 100).length}
                        </div>
                        <div style={{fontSize:11,color:'var(--text-secondary)'}}>Selesai</div>
                    </div>
                    <div style={{background:'var(--bg-card)',padding:'12px',borderRadius:'12px',textAlign:'center',boxShadow:'var(--shadow)'}}>
                        <div style={{fontSize:20,fontWeight:700,color:'var(--warning)'}}>
                            {continuing.length}
                        </div>
                        <div style={{fontSize:11,color:'var(--text-secondary)'}}>Sedang Dibaca</div>
                    </div>
                    <div style={{background:'var(--bg-card)',padding:'12px',borderRadius:'12px',textAlign:'center',boxShadow:'var(--shadow)'}}>
                        <div style={{fontSize:20,fontWeight:700,color:'var(--success)'}}>
                            {recommended.length}
                        </div>
                        <div style={{fontSize:11,color:'var(--text-secondary)'}}>Belum Dibaca</div>
                    </div>
                </div>

                {continuing.length > 0 && (
                    <div className="section" style={{marginTop:20}}>
                        <div className="section-header">
                            <span className="section-title">Lanjutkan Membaca</span>
                            <span className="section-link" onClick={() => nav('library')}>Lihat Semua</span>
                        </div>
                        <div className="h-scroll">
                            {continuing.map(b => (
                                <div key={b.id} className="h-scroll-item" onClick={() => openBook(b)}>
                                    <div style={{
                                        width:120,
                                        background:'var(--bg-card)',
                                        borderRadius:12,
                                        overflow:'hidden',
                                        boxShadow:'var(--shadow)',
                                        cursor:'pointer',
                                        transition:'transform 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                                        <BookCover book={b} size="md" style={{width:'100%',height:140,borderRadius:0}}/>
                                        <div style={{padding:'10px 10px 12px'}}>
                                            <div style={{fontSize:12,fontWeight:600,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                                {b.title}
                                            </div>
                                            <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:8}}>
                                                {b.author}
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{width:getProgress(b)+'%'}}/>
                                            </div>
                                            <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:4}}>
                                                {getProgress(b)}% selesai
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="section" style={{marginTop:24,paddingBottom:20}}>
                    <div className="section-header">
                        <span className="section-title">Rekomendasi Untukmu</span>
                        <span className="section-link" onClick={openSearch}>Lihat Semua</span>
                    </div>
                    {recommended.slice(0, 3).map(b => (
                        <div key={b.id} className="book-card-h" onClick={() => openBook(b)}>
                            <BookCover book={b} size="sm"/>
                            <div className="book-info">
                                <div className="book-title">{b.title}</div>
                                <div className="book-author">{b.author}</div>
                                <div className="book-genre">{b.genre}</div>
                                <div className="stars" style={{marginTop:4}}>
                                    {[1,2,3,4,5].map(i => (
                                        <span key={i} className="star" style={{fontSize:11}}>
                                            {i <= Math.floor(b.rating) ? '⭐' : '☆'}
                                        </span>
                                    ))}
                                    <span style={{fontSize:11,color:'var(--text-secondary)',marginLeft:4}}>
                                        {b.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recommended.length === 0 && (
                        <div style={{textAlign:'center',padding:'20px 0',color:'var(--text-secondary)'}}>
                            <div style={{fontSize:32,marginBottom:8}}>🎉</div>
                            <div>Semua buku sudah dibaca!</div>
                        </div>
                    )}
                </div>
            </div>
            <BottomNav active="home" nav={nav}/>
        </div>
    );
}
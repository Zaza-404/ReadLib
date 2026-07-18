function LibraryScreen({ nav, openBook, collection }) {
    const [tab, setTab] = useState('collection');
    const [books, setBooks] = useState([]);
    const [collectionBooks, setCollectionBooks] = useState([]);
    const [progressBooks, setProgressBooks] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ read_count: 0, collection_count: 0, bookmark_count: 0 });

    useEffect(() => {
        fetchLibraryData();
    }, []);

    const fetchLibraryData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch all data in parallel
            const [allBooks, collectionData, progressData, statsData] = await Promise.all([
                getBooks(),
                getCollection().catch(() => []),
                getProgress().catch(() => []),
                getStats().catch(() => ({}))
            ]);

            setBooks(allBooks);
            setCollectionBooks(collectionData);
            setProgressBooks(progressData);
            setStats(statsData);

            // Fetch bookmarks (would need a separate API endpoint)
            // For now, using static data from BOOKMARKS
            const bookmarkData = BOOKMARKS || [];
            setBookmarks(bookmarkData);

        } catch (err) {
            console.error('Error fetching library data:', err);
            setError('Gagal memuat perpustakaan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const getBookById = (id) => {
        return books.find(b => b.id === id);
    };

    if (loading) {
        return (
            <div className="screen">
                <StatusBar/>
                <div style={{padding:'16px 20px 0',background:'#fff',borderBottom:'1px solid var(--border-light)'}}>
                    <h2 style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',serif",marginBottom:16}}>
                        Perpustakaanku
                    </h2>
                    <div style={{display:'flex',gap:0}}>
                        {['collection','history','bookmark'].map(t => (
                            <button key={t} style={{
                                flex:1,
                                padding:'10px 4px',
                                background:'none',
                                border:'none',
                                borderBottom:'2.5px solid transparent',
                                fontSize:13,
                                fontWeight:400,
                                color:'var(--text-secondary)',
                                cursor:'pointer',
                                transition:'all 0.2s'
                            }}>
                                {t === 'collection' ? 'Koleksi' : t === 'history' ? 'Riwayat' : 'Bookmark'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="state-center">
                    <div className="spinner"/>
                    <div className="state-desc">Memuat koleksi...</div>
                </div>
                <BottomNav active="library" nav={nav}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="screen">
                <StatusBar/>
                <div style={{padding:'16px 20px 0',background:'#fff',borderBottom:'1px solid var(--border-light)'}}>
                    <h2 style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',serif",marginBottom:16}}>
                        Perpustakaanku
                    </h2>
                </div>
                <div className="state-center">
                    <div className="state-emoji">⚠️</div>
                    <div className="state-title">Gagal Memuat</div>
                    <div className="state-desc">{error}</div>
                    <button className="btn-primary" style={{width:160,marginTop:16}} onClick={fetchLibraryData}>
                        {icons.refresh()} Coba Lagi
                    </button>
                </div>
                <BottomNav active="library" nav={nav}/>
            </div>
        );
    }

    const renderCollection = () => {
        if (collectionBooks.length === 0) {
            return (
                <div className="state-center">
                    <div className="state-emoji">📚</div>
                    <div className="state-title">Koleksi Masih Kosong</div>
                    <div className="state-desc">Mulai tambahkan buku yang kamu suka ke koleksi.</div>
                    <button className="btn-primary" style={{width:'auto',padding:'0 24px',marginTop:8}} onClick={() => nav('search')}>
                        Cari Buku
                    </button>
                </div>
            );
        }

        return (
            <div style={{padding:'16px 20px'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                    {collectionBooks.map(book => (
                        <div key={book.id} style={{cursor:'pointer'}} onClick={() => openBook(book)}>
                            <BookCover book={book} size="md" style={{width:'100%',height:120,borderRadius:8}}/>
                            <div style={{
                                fontSize:11,
                                fontWeight:600,
                                color:'var(--text-primary)',
                                marginTop:6,
                                lineHeight:1.3,
                                overflow:'hidden',
                                display:'-webkit-box',
                                WebkitLineClamp:2,
                                WebkitBoxOrient:'vertical'
                            }}>
                                {book.title}
                            </div>
                            <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:2}}>
                                {book.author}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{marginTop:16,textAlign:'center',fontSize:12,color:'var(--text-secondary)'}}>
                    {collectionBooks.length} buku dalam koleksi
                </div>
            </div>
        );
    };

    const renderHistory = () => {
        const historyBooks = books.filter(b => b.user_progress > 0);
        
        if (historyBooks.length === 0) {
            return (
                <div className="state-center">
                    <div className="state-emoji">📖</div>
                    <div className="state-title">Belum Ada Riwayat</div>
                    <div className="state-desc">Mulai membaca untuk melihat riwayatmu di sini.</div>
                </div>
            );
        }

        // Sort by progress (descending)
        const sorted = [...historyBooks].sort((a, b) => (b.user_progress || 0) - (a.user_progress || 0));

        return (
            <div style={{padding:'16px 20px'}}>
                {sorted.map(b => (
                    <div key={b.id} className="book-card-h" onClick={() => openBook(b)}>
                        <BookCover book={b} size="sm"/>
                        <div className="book-info">
                            <div className="book-title">{b.title}</div>
                            <div className="book-author">{b.author}</div>
                            <div style={{marginTop:4}}>
                                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                                    <span style={{fontSize:11,color:'var(--text-secondary)'}}>Progress</span>
                                    <span style={{
                                        fontSize:11,
                                        fontWeight:600,
                                        color: b.user_progress === 100 ? 'var(--success)' : 'var(--primary)'
                                    }}>
                                        {b.user_progress}%
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{
                                        width: b.user_progress + '%',
                                        background: b.user_progress === 100 ? 'var(--success)' : 'var(--primary)'
                                    }}/>
                                </div>
                            </div>
                            {b.user_progress === 100 && (
                                <span style={{fontSize:11,color:'var(--success)',fontWeight:500}}>
                                    ✓ Selesai dibaca
                                </span>
                            )}
                            {b.user_progress > 0 && b.user_progress < 100 && (
                                <span style={{fontSize:11,color:'var(--primary)',fontWeight:500}}>
                                    Lanjutkan membaca...
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderBookmarks = () => {
        if (bookmarks.length === 0) {
            return (
                <div className="state-center">
                    <div className="state-emoji">🔖</div>
                    <div className="state-title">Belum Ada Bookmark</div>
                    <div className="state-desc">Tandai halaman favoritmu saat membaca.</div>
                </div>
            );
        }

        return (
            <div style={{padding:'16px 20px'}}>
                {bookmarks.map(bm => {
                    const book = getBookById(bm.bookId);
                    return (
                        <div key={bm.id} style={{
                            background:'var(--bg-card)',
                            borderRadius:12,
                            padding:'14px',
                            marginBottom:12,
                            boxShadow:'var(--shadow)',
                            cursor:'pointer',
                            borderLeft:'3px solid var(--primary)'
                        }} onClick={() => openBook(book || {id: bm.bookId, title: bm.bookTitle})}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                                <span style={{fontSize:16}}>🔖</span>
                                <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>
                                    {bm.bookTitle}
                                </span>
                                <span style={{
                                    marginLeft:'auto',
                                    fontSize:11,
                                    color:'var(--text-secondary)',
                                    background:'var(--bg-secondary)',
                                    padding:'2px 8px',
                                    borderRadius:20
                                }}>
                                    {bm.chapter}
                                </span>
                            </div>
                            <p style={{
                                fontSize:13,
                                color:'var(--text-secondary)',
                                lineHeight:1.6,
                                fontStyle:'italic'
                            }}>
                                "{bm.note}"
                            </p>
                            <div style={{fontSize:11,color:'var(--text-disabled)',marginTop:6}}>
                                Halaman {bm.page}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="screen">
            <StatusBar/>
            <div style={{padding:'16px 20px 0',background:'#fff',borderBottom:'1px solid var(--border-light)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                    <h2 style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>
                        Perpustakaanku
                    </h2>
                    <span style={{fontSize:12,color:'var(--text-secondary)'}}>
                        {stats.read_count || 0} buku selesai
                    </span>
                </div>
                <div style={{display:'flex',gap:0}}>
                    {[
                        {id:'collection',label:'Koleksi',count:stats.collection_count || collectionBooks.length},
                        {id:'history',label:'Riwayat',count:stats.read_count || books.filter(b => b.user_progress > 0).length},
                        {id:'bookmark',label:'Bookmark',count:bookmarks.length}
                    ].map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => setTab(t.id)} 
                            style={{
                                flex:1,
                                padding:'10px 4px',
                                background:'none',
                                border:'none',
                                borderBottom:`2.5px solid ${tab === t.id ? 'var(--primary)' : 'transparent'}`,
                                fontSize:13,
                                fontWeight:tab === t.id ? 600 : 400,
                                color:tab === t.id ? 'var(--primary)' : 'var(--text-secondary)',
                                cursor:'pointer',
                                transition:'all 0.2s',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                gap:4
                            }}
                        >
                            {t.label}
                            <span style={{
                                fontSize:10,
                                background:tab === t.id ? 'var(--primary-light)' : 'var(--bg-secondary)',
                                color:tab === t.id ? 'var(--primary)' : 'var(--text-secondary)',
                                padding:'1px 6px',
                                borderRadius:10,
                                marginLeft:4
                            }}>
                                {t.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="scroll-content">
                {tab === 'collection' && renderCollection()}
                {tab === 'history' && renderHistory()}
                {tab === 'bookmark' && renderBookmarks()}
            </div>
            <BottomNav active="library" nav={nav}/>
        </div>
    );
}
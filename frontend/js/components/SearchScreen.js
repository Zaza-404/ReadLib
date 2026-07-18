function SearchScreen({ nav, openBook }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recent, setRecent] = useState(() => {
        const saved = localStorage.getItem('readlib_recent_searches');
        return saved ? JSON.parse(saved) : ['Atomic Habits', 'Dune', 'Sapiens'];
    });
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);
    const [showClear, setShowClear] = useState(false);
    const inp = useRef();

    useEffect(() => {
        setTimeout(() => inp.current?.focus(), 300);
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const books = await getBooks();
            // Sort by rating or randomize for trending
            const shuffled = [...books].sort(() => Math.random() - 0.5);
            setTrending(shuffled.slice(0, 4));
        } catch (err) {
            console.error('Error fetching trending:', err);
            // Fallback to static data
            setTrending(BOOKS.slice(0, 4));
        }
    };

    const handleSearch = async (searchQuery) => {
        const q = searchQuery || query;
        if (!q.trim() || q.trim().length < 2) {
            setResults([]);
            return;
        }

        try {
            setSearching(true);
            setError(null);
            const data = await searchBooks(q.trim());
            setResults(data);
            
            // Save to recent searches
            if (data.length > 0 && !recent.includes(q.trim())) {
                const newRecent = [q.trim(), ...recent.filter(r => r !== q.trim())].slice(0, 5);
                setRecent(newRecent);
                localStorage.setItem('readlib_recent_searches', JSON.stringify(newRecent));
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Gagal mencari. Silakan coba lagi.');
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleQueryChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setShowClear(value.length > 0);
        
        if (value.length >= 2) {
            handleSearch(value);
        } else {
            setResults([]);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowClear(false);
        inp.current?.focus();
    };

    const handleRecentClick = (term) => {
        setQuery(term);
        handleSearch(term);
    };

    const removeRecent = (term, e) => {
        e.stopPropagation();
        const newRecent = recent.filter(r => r !== term);
        setRecent(newRecent);
        localStorage.setItem('readlib_recent_searches', JSON.stringify(newRecent));
    };

    const getBookProgress = (book) => {
        return book.user_progress || 0;
    };

    return (
        <div className="screen">
            <StatusBar/>
            <div style={{
                padding: '12px 20px',
                background: '#fff',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div className="search-bar" style={{borderColor: query ? 'var(--primary)' : undefined}}>
                    {icons.search()}
                    <input 
                        ref={inp} 
                        className="search-input" 
                        placeholder="Cari buku, penulis, genre..." 
                        value={query} 
                        onChange={handleQueryChange}
                        autoFocus
                    />
                    {showClear && (
                        <button 
                            style={{
                                background:'none',
                                border:'none',
                                cursor:'pointer',
                                padding:4,
                                color:'var(--text-secondary)',
                                fontSize:18,
                                lineHeight:1
                            }} 
                            onClick={clearSearch}
                        >
                            ✕
                        </button>
                    )}
                </div>
                
                {/* Search stats */}
                {query && !searching && results.length > 0 && (
                    <div style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>{results.length} hasil untuk "<strong>{query}</strong>"</span>
                        <span style={{
                            fontSize: 11,
                            color: 'var(--text-disabled)',
                            background: 'var(--bg-secondary)',
                            padding: '2px 10px',
                            borderRadius: 12
                        }}>
                            {searching ? 'Mencari...' : 'Selesai'}
                        </span>
                    </div>
                )}
            </div>

            <div className="scroll-content">
                {error && (
                    <div style={{
                        margin: '16px 20px',
                        padding: '12px 16px',
                        background: '#FEE2E2',
                        borderRadius: 8,
                        color: '#DC2626',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                        <button 
                            style={{
                                marginLeft: 'auto',
                                background: 'none',
                                border: 'none',
                                color: '#DC2626',
                                cursor: 'pointer',
                                fontSize: 16
                            }}
                            onClick={() => setError(null)}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {!query && (
                    <>
                        {/* Recent Searches */}
                        <div className="section">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 12
                            }}>
                                <div className="section-title">Pencarian Terakhir</div>
                                {recent.length > 0 && (
                                    <span 
                                        style={{
                                            fontSize: 11,
                                            color: 'var(--text-disabled)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setRecent([]);
                                            localStorage.removeItem('readlib_recent_searches');
                                        }}
                                    >
                                        Hapus Semua
                                    </span>
                                )}
                            </div>
                            {recent.length > 0 ? (
                                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                                    {recent.map((r, i) => (
                                        <div 
                                            key={i} 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '10px 0',
                                                borderBottom: '1px solid var(--border-light)',
                                                cursor: 'pointer'
                                            }} 
                                            onClick={() => handleRecentClick(r)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8"/>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                            </svg>
                                            <span style={{
                                                fontSize: 14,
                                                color: 'var(--text-secondary)',
                                                flex: 1
                                            }}>
                                                {r}
                                            </span>
                                            <button
                                                onClick={(e) => removeRecent(r, e)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-disabled)',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                    padding: '4px'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px 0',
                                    color: 'var(--text-disabled)',
                                    fontSize: 13
                                }}>
                                    Belum ada pencarian
                                </div>
                            )}
                        </div>

                        {/* Trending */}
                        <div className="section" style={{marginTop: 24, paddingBottom: 80}}>
                            <div className="section-title" style={{marginBottom: 12}}>
                                🔥 Sedang Trending
                            </div>
                            {trending.map(b => (
                                <div key={b.id} className="book-card-h" onClick={() => openBook(b)}>
                                    <BookCover book={b} size="sm"/>
                                    <div className="book-info">
                                        <div className="book-title">{b.title}</div>
                                        <div className="book-author">{b.author}</div>
                                        <div className="book-genre">{b.genre}</div>
                                        <div className="stars">
                                            {[1,2,3,4,5].map(i => (
                                                <span key={i} style={{fontSize: 11}}>
                                                    {i <= Math.floor(b.rating) ? '⭐' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                        {getBookProgress(b) > 0 && (
                                            <div style={{marginTop: 4}}>
                                                <div style={{
                                                    fontSize: 10,
                                                    color: 'var(--text-secondary)'
                                                }}>
                                                    {getBookProgress(b)}% selesai
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Search Results */}
                {query && results.length > 0 && (
                    <div style={{padding: '16px 20px 80px'}}>
                        {results.map(b => (
                            <div key={b.id} className="book-card-h" onClick={() => openBook(b)}>
                                <BookCover book={b} size="sm"/>
                                <div className="book-info">
                                    <div className="book-title">{b.title}</div>
                                    <div className="book-author">{b.author}</div>
                                    <div className="book-genre">{b.genre}</div>
                                    <div style={{
                                        fontSize: 11,
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {b.pages} halaman · {b.year}
                                    </div>
                                    <div className="stars">
                                        {[1,2,3,4,5].map(i => (
                                            <span key={i} style={{fontSize: 11}}>
                                                {i <= Math.floor(b.rating) ? '⭐' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                    {getBookProgress(b) > 0 && (
                                        <div style={{marginTop: 4}}>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{
                                                    width: getBookProgress(b) + '%'
                                                }}/>
                                            </div>
                                            <div style={{
                                                fontSize: 10,
                                                color: 'var(--text-secondary)',
                                                marginTop: 2
                                            }}>
                                                {getBookProgress(b)}% selesai
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty Results */}
                {query && results.length === 0 && !error && !searching && (
                    <div className="state-center">
                        <div className="state-emoji">🔍</div>
                        <div className="state-title">Tidak Ditemukan</div>
                        <div className="state-desc">
                            Tidak ada buku yang cocok dengan "{query}".<br/>
                            Coba kata kunci lain.
                        </div>
                        <div style={{
                            marginTop: 12,
                            fontSize: 13,
                            color: 'var(--text-secondary)'
                        }}>
                            💡 Tips: Coba cari berdasarkan judul atau penulis
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {searching && (
                    <div className="state-center">
                        <div className="spinner" style={{width: 30, height: 30}}/>
                        <div className="state-desc">Mencari buku...</div>
                    </div>
                )}
            </div>
            <BottomNav active="search" nav={nav}/>
        </div>
    );
}
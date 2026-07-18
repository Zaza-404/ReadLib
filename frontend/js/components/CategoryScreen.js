function CategoryScreen({ nav, openBook }) {
    const [selected, setSelected] = useState(null);
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredBooks, setFilteredBooks] = useState([]);

    // Fetch all books and group by genre
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getBooks();
            setBooks(data);
            
            // Group books by genre for categories
            const genreMap = {};
            data.forEach(book => {
                if (!genreMap[book.genre]) {
                    genreMap[book.genre] = {
                        id: book.genre.toLowerCase().replace(/\s+/g, '-'),
                        name: book.genre,
                        icon: getGenreIcon(book.genre),
                        count: 0,
                        color: getGenreColor(book.genre),
                        textColor: getGenreTextColor(book.genre)
                    };
                }
                genreMap[book.genre].count++;
            });
            
            setCategories(Object.values(genreMap));
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('Gagal memuat kategori. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const getGenreIcon = (genre) => {
        const icons = {
            'Self-Help': '🧠',
            'Sci-Fi': '🚀',
            'Classic': '📚',
            'Dystopia': '🌑',
            'History': '🏛️',
            'Fiction': '✨',
            'Business': '💼',
            'Romance': '💖',
            'Mystery': '🔍',
            'Horror': '👻',
            'Fantasy': '🐉',
            'Biography': '📝',
            'Science': '🔬',
            'Philosophy': '🤔'
        };
        return icons[genre] || '📖';
    };

    const getGenreColor = (genre) => {
        const colors = {
            'Self-Help': '#EFF6FF',
            'Sci-Fi': '#F0FDF4',
            'Classic': '#FFF7ED',
            'Dystopia': '#F5F3FF',
            'History': '#FFF1F2',
            'Fiction': '#ECFDF5',
            'Business': '#FFFBEB',
            'Romance': '#FDF2F8',
            'Mystery': '#F0F9FF',
            'Horror': '#F9FAFB'
        };
        return colors[genre] || '#F3F4F6';
    };

    const getGenreTextColor = (genre) => {
        const colors = {
            'Self-Help': '#1D4ED8',
            'Sci-Fi': '#15803D',
            'Classic': '#C2410C',
            'Dystopia': '#6D28D9',
            'History': '#BE123C',
            'Fiction': '#065F46',
            'Business': '#92400E',
            'Romance': '#9D174D',
            'Mystery': '#0369A1',
            'Horror': '#374151'
        };
        return colors[genre] || '#4B5563';
    };

    const handleCategorySelect = (categoryId) => {
        if (selected === categoryId) {
            setSelected(null);
            setFilteredBooks([]);
            return;
        }
        
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            setSelected(categoryId);
            const filtered = books.filter(b => b.genre === category.name);
            setFilteredBooks(filtered);
        }
    };

    const getBookProgress = (book) => {
        return book.user_progress || 0;
    };

    if (loading) {
        return (
            <div className="screen">
                <StatusBar/>
                <div className="header">
                    <div style={{flex:1}}></div>
                    <span className="header-title" style={{textAlign:'center'}}>Kategori</span>
                    <div style={{width:36}}></div>
                </div>
                <div className="state-center">
                    <div className="spinner"/>
                    <div className="state-desc">Memuat kategori...</div>
                </div>
                <BottomNav active="category" nav={nav}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="screen">
                <StatusBar/>
                <div className="header">
                    <div style={{flex:1}}></div>
                    <span className="header-title" style={{textAlign:'center'}}>Kategori</span>
                    <div style={{width:36}}></div>
                </div>
                <div className="state-center">
                    <div className="state-emoji">⚠️</div>
                    <div className="state-title">Gagal Memuat</div>
                    <div className="state-desc">{error}</div>
                    <button className="btn-primary" style={{width:160,marginTop:16}} onClick={fetchBooks}>
                        {icons.refresh()} Coba Lagi
                    </button>
                </div>
                <BottomNav active="category" nav={nav}/>
            </div>
        );
    }

    return (
        <div className="screen">
            <StatusBar/>
            <div className="header">
                <div style={{flex:1}}></div>
                <span className="header-title" style={{textAlign:'center'}}>Kategori</span>
                <div style={{width:36}}></div>
            </div>
            <div className="scroll-content">
                <div style={{padding:'20px 20px 12px'}}>
                    <p style={{fontSize:13,color:'var(--text-secondary)'}}>Jelajahi koleksi</p>
                    <h2 style={{fontSize:22,fontWeight:700,color:'var(--text-primary)',fontFamily:"'Playfair Display',serif"}}>
                        Berdasarkan Genre
                    </h2>
                </div>
                
                <div style={{padding:'0 20px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                        {categories.map(c => (
                            <div 
                                key={c.id} 
                                className="cat-card" 
                                style={{
                                    background: selected === c.id ? c.textColor : c.color,
                                    border: `1.5px solid ${selected === c.id ? c.textColor : c.color}`
                                }} 
                                onClick={() => handleCategorySelect(c.id)}
                            >
                                <div className="cat-icon">{c.icon}</div>
                                <div>
                                    <div className="cat-name" style={{
                                        color: selected === c.id ? '#fff' : c.textColor
                                    }}>
                                        {c.name}
                                    </div>
                                    <div style={{
                                        fontSize:11,
                                        color: selected === c.id ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'
                                    }}>
                                        {c.count} buku
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selected && filteredBooks.length > 0 && (
                    <div style={{padding:'20px 20px 80px'}}>
                        <div className="section-title" style={{marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
                            <span>📚 Buku</span>
                            <span style={{fontSize:13,fontWeight:'normal',color:'var(--text-secondary)'}}>
                                ({filteredBooks.length})
                            </span>
                        </div>
                        {filteredBooks.map(b => (
                            <div key={b.id} className="book-card-h" onClick={() => openBook(b)}>
                                <BookCover book={b} size="sm"/>
                                <div className="book-info">
                                    <div className="book-title">{b.title}</div>
                                    <div className="book-author">{b.author}</div>
                                    <div className="stars">
                                        {[1,2,3,4,5].map(i => (
                                            <span key={i} style={{fontSize:11}}>
                                                {i <= Math.floor(b.rating) ? '⭐' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                    {getBookProgress(b) > 0 && (
                                        <div style={{marginTop:4}}>
                                            <div style={{display:'flex',justifyContent:'space-between'}}>
                                                <span style={{fontSize:10,color:'var(--text-secondary)'}}>
                                                    Progress
                                                </span>
                                                <span style={{fontSize:10,fontWeight:600,color:'var(--primary)'}}>
                                                    {getBookProgress(b)}%
                                                </span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{width:getBookProgress(b) + '%'}}/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selected && filteredBooks.length === 0 && (
                    <div className="state-center" style={{paddingTop:20}}>
                        <div className="state-emoji">📭</div>
                        <div className="state-title">Belum Ada Buku</div>
                        <div className="state-desc">
                            Buku kategori ini belum tersedia saat ini.
                        </div>
                    </div>
                )}

                {!selected && (
                    <div style={{padding:'20px 20px 80px',textAlign:'center'}}>
                        <div style={{fontSize:48,marginBottom:12}}>🏷️</div>
                        <div style={{fontSize:13,color:'var(--text-secondary)'}}>
                            Pilih salah satu kategori di atas untuk melihat daftar bukunya
                        </div>
                    </div>
                )}
            </div>
            <BottomNav active="category" nav={nav}/>
        </div>
    );
}
function ReaderScreen({ book, nav }) {
    const [fontSize, setFontSize] = useState(16);
    const [darkMode, setDarkMode] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
    const [progress, setProgress] = useState(book?.user_progress || 0);
    const [currentPage, setCurrentPage] = useState(book?.current_page || 0);
    const [saving, setSaving] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [showBookmark, setShowBookmark] = useState(false);
    const [bookmarkNote, setBookmarkNote] = useState('');
    const [fontFamily, setFontFamily] = useState('Poppins');

    useEffect(() => {
        // Load bookmarks for this book
        const saved = BOOKMARKS.filter(b => b.bookId === book?.id) || [];
        setBookmarks(saved);
    }, [book]);

    if (!book) return null;

    const bg = darkMode ? '#1a1a2e' : '#fff';
    const tc = darkMode ? '#e2e8f0' : 'var(--text-primary)';
    const tc2 = darkMode ? '#94a3b8' : 'var(--text-secondary)';

    const handleProgressUpdate = async (newProgress, page) => {
        try {
            setSaving(true);
            const result = await updateProgress(book.id, newProgress, page);
            setProgress(result.progress);
            setCurrentPage(result.currentPage);
            
            // Show notification if completed
            if (newProgress === 100) {
                setTimeout(() => {
                    alert('🎉 Selamat! Kamu telah menyelesaikan buku ini!');
                }, 500);
            }
        } catch (err) {
            console.error('Error updating progress:', err);
            alert('Gagal menyimpan progress. Silakan coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    const handlePageChange = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const newProgress = Math.round(x * 100);
        const clamped = Math.min(100, Math.max(0, newProgress));
        const page = Math.round((clamped / 100) * book.pages);
        setProgress(clamped);
        setCurrentPage(page);
        handleProgressUpdate(clamped, page);
    };

    const handleFontSizeChange = (delta) => {
        setFontSize(f => Math.min(24, Math.max(12, f + delta)));
    };

    const handleAddBookmark = () => {
        if (bookmarkNote.trim()) {
            const newBookmark = {
                id: Date.now(),
                bookId: book.id,
                bookTitle: book.title,
                page: currentPage || 1,
                note: bookmarkNote.trim(),
                chapter: `Halaman ${currentPage || 1}`
            };
            setBookmarks([...bookmarks, newBookmark]);
            setBookmarkNote('');
            setShowBookmark(false);
            alert('🔖 Bookmark berhasil ditambahkan!');
        } else {
            alert('Silakan tulis catatan untuk bookmark.');
        }
    };

    const getText = () => {
        // In real app, this would fetch from API based on book.id
        return READER_TEXT;
    };

    const paragraphs = getText().split('\n\n');

    return (
        <div className="screen" style={{ background: bg, transition: 'background 0.3s' }}>
            {/* Top Bar */}
            <div className="reader-top-bar" style={{
                background: darkMode ? '#16213e' : undefined,
                borderColor: darkMode ? '#2d3748' : undefined
            }}>
                <button className="back-btn" style={{
                    background: darkMode ? '#2d3748' : undefined
                }} onClick={() => {
                    // Save progress before leaving
                    if (progress > (book.user_progress || 0)) {
                        handleProgressUpdate(progress, currentPage);
                    }
                    nav('back');
                }}>
                    {icons.back()}
                </button>
                <span style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: 600,
                    color: tc,
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {book.title}
                </span>
                <div style={{display: 'flex', gap: 8}}>
                    <button className="reader-btn" style={{
                        background: darkMode ? '#2d3748' : undefined,
                        position: 'relative'
                    }} onClick={() => setShowBookmark(!showBookmark)}>
                        {icons.bookmark()}
                        {bookmarks.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                background: 'var(--primary)',
                                color: '#fff',
                                fontSize: 8,
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {bookmarks.length}
                            </span>
                        )}
                    </button>
                    <button className="reader-btn" style={{
                        background: darkMode ? '#2d3748' : undefined
                    }} onClick={() => setShowPanel(!showPanel)}>
                        {icons.type()}
                    </button>
                </div>
            </div>

            {/* Bookmark Panel */}
            {showBookmark && (
                <div style={{
                    position: 'absolute',
                    top: 70,
                    right: 20,
                    background: darkMode ? '#16213e' : 'var(--bg-card)',
                    borderRadius: 12,
                    padding: 16,
                    width: 280,
                    maxHeight: 300,
                    overflow: 'auto',
                    boxShadow: 'var(--shadow-md)',
                    border: `1px solid ${darkMode ? '#2d3748' : 'var(--border-light)'}`,
                    zIndex: 50
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12
                    }}>
                        <h4 style={{fontSize: 14, fontWeight: 600, color: tc}}>
                            🔖 Bookmark
                        </h4>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: tc2,
                            cursor: 'pointer',
                            fontSize: 18
                        }} onClick={() => setShowBookmark(false)}>
                            ✕
                        </button>
                    </div>

                    {bookmarks.length > 0 ? (
                        <div style={{marginBottom: 12}}>
                            {bookmarks.map(b => (
                                <div key={b.id} style={{
                                    padding: '8px 0',
                                    borderBottom: `1px solid ${darkMode ? '#2d3748' : 'var(--border-light)'}`
                                }}>
                                    <div style={{fontSize: 12, color: tc2}}>
                                        {b.chapter}
                                    </div>
                                    <div style={{fontSize: 13, color: tc, marginTop: 2}}>
                                        "{b.note}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{fontSize: 13, color: tc2, marginBottom: 12}}>
                            Belum ada bookmark di buku ini.
                        </div>
                    )}

                    <div>
                        <textarea
                            placeholder="Tulis catatan untuk bookmark..."
                            value={bookmarkNote}
                            onChange={e => setBookmarkNote(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 8,
                                borderRadius: 8,
                                border: `1px solid ${darkMode ? '#2d3748' : 'var(--border-light)'}`,
                                background: darkMode ? '#1a1a2e' : '#fff',
                                color: tc,
                                fontSize: 12,
                                resize: 'vertical',
                                minHeight: 60,
                                fontFamily: 'Poppins'
                            }}
                        />
                        <button
                            onClick={handleAddBookmark}
                            style={{
                                width: '100%',
                                marginTop: 8,
                                padding: '8px',
                                background: 'var(--primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 600,
                                fontFamily: 'Poppins'
                            }}
                        >
                            + Tambah Bookmark
                        </button>
                    </div>
                </div>
            )}

            {/* Reader Content */}
            <div className="reader-content" onClick={() => {
                setShowPanel(false);
                setShowBookmark(false);
            }}>
                <div style={{
                    fontSize: fontSize,
                    color: tc,
                    lineHeight: 1.85,
                    fontFamily: fontFamily,
                    maxWidth: 600,
                    margin: '0 auto'
                }}>
                    {paragraphs.map((para, i) => (
                        <p key={i} className="reader-para" style={{
                            fontSize: fontSize,
                            color: tc,
                            lineHeight: 1.85,
                            fontFamily: fontFamily
                        }}>
                            {para}
                        </p>
                    ))}
                    <div style={{height: 40}}/>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="reader-bottom" style={{
                background: darkMode ? '#16213e' : undefined,
                borderColor: darkMode ? '#2d3748' : undefined
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8
                }}>
                    <span style={{fontSize: 12, color: tc2}}>
                        Halaman {Math.max(1, Math.round((progress / 100) * book.pages))} dari {book.pages}
                    </span>
                    <span style={{fontSize: 12, color: tc2}}>
                        {progress}%
                    </span>
                </div>
                <div className="progress-bar" style={{
                    height: 6,
                    borderRadius: 3,
                    cursor: 'pointer',
                    background: darkMode ? '#2d3748' : 'var(--bg-secondary)'
                }} onClick={handlePageChange}>
                    <div className="progress-fill" style={{
                        width: progress + '%',
                        height: '100%',
                        borderRadius: 3,
                        background: saving ? 'var(--warning)' : 'var(--primary)',
                        transition: saving ? 'none' : 'width 0.3s'
                    }}/>
                </div>
                {saving && (
                    <div style={{
                        fontSize: 10,
                        color: tc2,
                        textAlign: 'center',
                        marginTop: 4
                    }}>
                        Menyimpan progress...
                    </div>
                )}
            </div>

            {/* Font Settings Panel */}
            {showPanel && (
                <div className="font-panel" style={{
                    background: darkMode ? '#16213e' : 'var(--bg-card)',
                    border: `1px solid ${darkMode ? '#2d3748' : 'var(--border-light)'}`
                }}>
                    <h4 style={{color: tc}}>Pengaturan Teks</h4>
                    
                    <div style={{marginBottom: 12}}>
                        <div style={{
                            fontSize: 12,
                            color: tc2,
                            marginBottom: 8
                        }}>
                            Ukuran Font
                        </div>
                        <div className="font-size-row">
                            <button className="font-btn" style={{
                                background: darkMode ? '#2d3748' : undefined,
                                color: tc
                            }} onClick={() => handleFontSizeChange(-1)}>
                                A−
                            </button>
                            <span style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: tc
                            }}>
                                {fontSize}px
                            </span>
                            <button className="font-btn" style={{
                                background: darkMode ? '#2d3748' : undefined,
                                color: tc
                            }} onClick={() => handleFontSizeChange(1)}>
                                A+
                            </button>
                        </div>
                    </div>

                    <div style={{marginBottom: 12}}>
                        <div style={{
                            fontSize: 12,
                            color: tc2,
                            marginBottom: 8
                        }}>
                            Font
                        </div>
                        <div style={{display: 'flex', gap: 8}}>
                            {['Poppins', 'Georgia', 'Arial'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFontFamily(f)}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        borderRadius: 6,
                                        border: `1.5px solid ${fontFamily === f ? 'var(--primary)' : darkMode ? '#2d3748' : 'var(--border-light)'}`,
                                        background: fontFamily === f ? 'var(--primary-light)' : 'transparent',
                                        color: fontFamily === f ? 'var(--primary)' : tc2,
                                        fontSize: 12,
                                        fontFamily: f,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="divider" style={{borderColor: darkMode ? '#2d3748' : undefined}}/>

                    <div className="toggle-wrap" style={{
                        border: 'none',
                        padding: '8px 0 0'
                    }}>
                        <div style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: tc
                        }}>
                            Mode Gelap
                        </div>
                        <button className={`toggle${darkMode ? ' on' : ''}`} onClick={() => setDarkMode(!darkMode)}/>
                    </div>
                </div>
            )}
        </div>
    );
}
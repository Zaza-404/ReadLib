function BookCover({ book, size = 'sm', style = {} }) {
    const [err, setErr] = useState(false);
    const sizes = { sm: { width: 64, height: 90 }, md: { width: 80, height: 112 }, lg: { width: 120, height: 170 } };
    const s = sizes[size];
    const colors = ['#DBEAFE', '#DCFCE7', '#FEF3C7', '#FCE7F3', '#F3E8FF', '#FFEDD5'];
    const bg = colors[book.id % colors.length];

    if (err) {
        return (
            <div style={{ ...s, ...style, borderRadius: size === 'lg' ? 12 : 8, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8, flexShrink: 0 }}>
                <span style={{ fontSize: size === 'lg' ? 28 : 20 }}>📖</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: '#374151', textAlign: 'center', marginTop: 4, lineHeight: 1.2 }}>{book.title.slice(0, 12)}</span>
            </div>
        );
    }

    return <img src={book.cover} alt={book.title} className={`book-cover book-cover-${size}`} style={{ ...style, flexShrink: 0 }} onError={() => setErr(true)} />;
}
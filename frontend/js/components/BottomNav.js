function BottomNav({ active, nav }) {
    const items = [
        { id: 'home', label: 'Beranda', icon: icons.home },
        { id: 'search', label: 'Cari', icon: icons.search },
        { id: 'category', label: 'Kategori', icon: icons.category },
        { id: 'library', label: 'Koleksi', icon: icons.library },
        { id: 'profile', label: 'Profil', icon: icons.profile },
    ];

    return (
        <div className="bottom-nav">
            {items.map(item => (
                <div key={item.id} className={`nav-item${active === item.id ? ' active' : ''}`} onClick={() => nav(item.id)}>
                    {item.icon()}
                    <span>{item.label}</span>
                    <div className="nav-dot"/>
                </div>
            ))}
        </div>
    );
}
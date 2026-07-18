function App() {
    const [phase, setPhase] = useState('splash'); // splash|onboard|login|register|app
    const [screen, setScreen] = useState('home'); // home|search|category|library|profile|detail|reader|editProfile|settings|notif|error
    const [selectedBook, setSelectedBook] = useState(null);
    const [collection, setCollection] = useState([3, 6]); // pre-saved books

    const navTo = (s) => {
        if (s === 'back') {
            if (screen === 'reader') { setScreen('detail'); return; }
            if (screen === 'detail') { setScreen('home'); return; }
            if (screen === 'editProfile' || screen === 'settings') { setScreen('profile'); return; }
            if (screen === 'notif') { setScreen('home'); return; }
            setScreen('home');
            return;
        }
        if (s === 'login') { setPhase('login'); return; }
        setScreen(s);
    };

    const openBook = (b) => { setSelectedBook(b); setScreen('detail'); };
    const openReader = () => { setScreen('reader'); };
    const toggleCollection = (id) => { setCollection(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]); };

    if (phase === 'splash') return <div className="phone-shell"><SplashScreen onDone={() => setPhase('onboard')}/></div>;
    if (phase === 'onboard') return <div className="phone-shell"><OnboardingScreen onDone={() => setPhase('login')}/></div>;
    if (phase === 'login') return <div className="phone-shell"><LoginScreen nav={s => s === 'home' ? setPhase('app') : navTo(s)} goRegister={() => setPhase('register')}/></div>;
    if (phase === 'register') return <div className="phone-shell"><RegisterScreen goLogin={() => setPhase('login')}/></div>;

    return (
        <div className="phone-shell">
            {screen === 'home' && <HomeScreen nav={navTo} openBook={openBook} openSearch={() => setScreen('search')}/>}
            {screen === 'search' && <SearchScreen nav={navTo} openBook={openBook}/>}
            {screen === 'category' && <CategoryScreen nav={navTo} openBook={openBook}/>}
            {screen === 'library' && <LibraryScreen nav={navTo} openBook={openBook} collection={collection}/>}
            {screen === 'profile' && <ProfileScreen nav={navTo} openEditProfile={() => setScreen('editProfile')} openSettings={() => setScreen('settings')}/>}
            {screen === 'detail' && <BookDetailScreen book={selectedBook} nav={navTo} openReader={openReader} collection={collection} toggleCollection={toggleCollection}/>}
            {screen === 'reader' && <ReaderScreen book={selectedBook} nav={navTo}/>}
            {screen === 'editProfile' && <EditProfileScreen nav={navTo}/>}
            {screen === 'settings' && <SettingsScreen nav={navTo}/>}
            {screen === 'notif' && <NotificationsScreen nav={navTo}/>}
            {screen === 'error' && <ErrorScreen nav={navTo}/>}
        </div>
    );
}
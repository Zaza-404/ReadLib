function StatusBar({ light }) {
    const [time, setTime] = useState(() => {
        const d = new Date();
        return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const d = new Date();
            setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const c = light ? "rgba(255,255,255,0.9)" : undefined;

    return (
        <div className="status-bar" style={light ? { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 } : {}}>
            <span className="status-time" style={light ? { color: c } : {}}>{time}</span>
            <div className="status-icons" style={light ? { filter: 'brightness(10)' } : {}}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill={light ? "rgba(255,255,255,0.9)" : "var(--text-primary)"}>
                    <rect x="1" y="6" width="18" height="12" rx="2"/>
                    <path d="M23 13v-2"/>
                </svg>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={light ? "rgba(255,255,255,0.9)" : "var(--text-primary)"} strokeWidth="2">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                    <circle cx="12" cy="20" r="1" fill={light ? "rgba(255,255,255,0.9)" : "var(--text-primary)"}/>
                </svg>
            </div>
        </div>
    );
}
function LoginScreen({ nav, goRegister }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        // Check if there's a saved email
        const savedEmail = localStorage.getItem('readlib_email');
        if (savedEmail) {
            setForm(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email wajib diisi';
        if (!re.test(email)) return 'Format email tidak valid';
        return '';
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setForm({ ...form, email: value });
        setEmailError(validateEmail(value));
    };

    const handleLogin = async () => {
        // Validate
        const emailErr = validateEmail(form.email);
        if (emailErr) {
            setEmailError(emailErr);
            return;
        }
        if (!form.password) {
            setError('Password wajib diisi');
            return;
        }
        if (form.password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const data = await login(form.email, form.password);
            
            // Save email if remember me is checked
            if (rememberMe) {
                localStorage.setItem('readlib_email', form.email);
            } else {
                localStorage.removeItem('readlib_email');
            }
            
            // Navigate to home
            nav('home');
            
        } catch (err) {
            console.error('Login error:', err);
            if (err.message.includes('Invalid email or password')) {
                setError('Email atau password salah. Silakan coba lagi.');
            } else if (err.message.includes('Network')) {
                setError('Gagal terhubung ke server. Periksa koneksi internetmu.');
            } else {
                setError(err.message || 'Login gagal. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleForgotPassword = () => {
        alert('Fitur reset password akan segera hadir! 🔜\n\nSilakan hubungi support@readlib.com untuk bantuan.');
    };

    return (
        <div className="screen" style={{background:'#fff'}}>
            <StatusBar/>
            <div style={{
                flex:1,
                overflowY:'auto',
                padding:'20px 28px 40px',
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                gap:24
            }}>
                {/* Logo & Title */}
                <div style={{textAlign:'center',marginBottom:8}}>
                    <div style={{
                        width:72,
                        height:72,
                        borderRadius:20,
                        background:'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        margin:'0 auto 16px',
                        fontSize:36,
                        boxShadow:'0 4px 20px rgba(59,130,246,0.2)'
                    }}>
                        📚
                    </div>
                    <h1 style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:30,
                        fontWeight:700,
                        color:'var(--text-primary)'
                    }}>
                        Selamat Datang
                    </h1>
                    <p style={{fontSize:14,color:'var(--text-secondary)',marginTop:6}}>
                        Masuk ke akun ReadLib kamu
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding:'12px 16px',
                        background:'#FEE2E2',
                        borderRadius:'8px',
                        color:'#DC2626',
                        fontSize:13,
                        display:'flex',
                        alignItems:'center',
                        gap:8
                    }}>
                        <span>⚠️</span>
                        <span style={{flex:1}}>{error}</span>
                        <button 
                            style={{
                                background:'none',
                                border:'none',
                                color:'#DC2626',
                                cursor:'pointer',
                                fontSize:16,
                                padding:'0 4px'
                            }}
                            onClick={() => setError(null)}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Form */}
                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input 
                            className="input-field" 
                            type="email" 
                            placeholder="nama@email.com" 
                            value={form.email} 
                            onChange={handleEmailChange}
                            onKeyPress={handleKeyPress}
                            style={{borderColor: emailError ? 'var(--error)' : undefined}}
                            autoFocus
                        />
                        {emailError && (
                            <div style={{fontSize:11,color:'var(--error)',marginTop:4}}>
                                {emailError}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{position:'relative'}}>
                            <input 
                                className="input-field" 
                                type={showPass ? 'text' : 'password'} 
                                placeholder="Masukkan password" 
                                value={form.password} 
                                onChange={e => setForm({...form, password: e.target.value})}
                                onKeyPress={handleKeyPress}
                                style={{paddingRight:44}}
                            />
                            <button 
                                style={{
                                    position:'absolute',
                                    right:12,
                                    top:'50%',
                                    transform:'translateY(-50%)',
                                    background:'none',
                                    border:'none',
                                    cursor:'pointer',
                                    padding:4,
                                    color:'var(--text-secondary)'
                                }} 
                                onClick={() => setShowPass(!showPass)}
                                type="button"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {showPass ? (
                                        <>
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </>
                                    ) : (
                                        <>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:'var(--text-secondary)'}}>
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                style={{width:16,height:16,cursor:'pointer'}}
                            />
                            Ingat saya
                        </label>
                        <span 
                            style={{
                                fontSize:13,
                                color:'var(--primary)',
                                fontWeight:500,
                                cursor:'pointer'
                            }}
                            onClick={handleForgotPassword}
                        >
                            Lupa password?
                        </span>
                    </div>
                </div>

                {/* Login Button */}
                <button 
                    className="btn-primary" 
                    onClick={handleLogin} 
                    disabled={loading}
                    style={{height:52}}
                >
                    {loading ? (
                        <div className="spinner" style={{width:22,height:22,borderWidth:2}}/>
                    ) : (
                        'Masuk'
                    )}
                </button>

                {/* Divider */}
                <div className="divider-text">
                    <span>atau</span>
                </div>

                {/* Register Link */}
                <div style={{textAlign:'center'}}>
                    <span style={{fontSize:14,color:'var(--text-secondary)'}}>
                        Belum punya akun? 
                    </span>
                    <span 
                        style={{
                            fontSize:14,
                            color:'var(--primary)',
                            fontWeight:600,
                            cursor:'pointer',
                            marginLeft:4
                        }} 
                        onClick={goRegister}
                    >
                        Daftar
                    </span>
                </div>

                {/* Demo Account Hint */}
                <div style={{
                    marginTop:8,
                    padding:'12px',
                    background:'var(--bg-secondary)',
                    borderRadius:'8px',
                    fontSize:12,
                    color:'var(--text-secondary)',
                    textAlign:'center',
                    lineHeight:1.6
                }}>
                    💡 Demo: gunakan <strong>demo@readlib.com</strong> / <strong>password123</strong>
                    <br/>
                    <span style={{fontSize:11,color:'var(--text-disabled)'}}>
                        Atau daftar akun baru untuk menyimpan progress
                    </span>
                </div>
            </div>
        </div>
    );
}
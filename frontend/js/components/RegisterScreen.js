function RegisterScreen({ goLogin }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [touched, setTouched] = useState({});

    const validateField = (field, value) => {
        switch(field) {
            case 'name':
                if (!value.trim()) return 'Nama wajib diisi';
                if (value.trim().length < 3) return 'Nama minimal 3 karakter';
                return '';
            case 'email':
                if (!value) return 'Email wajib diisi';
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(value)) return 'Format email tidak valid';
                return '';
            case 'password':
                if (!value) return 'Password wajib diisi';
                if (value.length < 6) return 'Password minimal 6 karakter';
                if (value.length > 20) return 'Password maksimal 20 karakter';
                return '';
            case 'confirmPassword':
                if (!value) return 'Konfirmasi password wajib diisi';
                if (value !== form.password) return 'Password tidak sama';
                return '';
            default:
                return '';
        }
    };

    const getFieldError = (field) => {
        if (!touched[field]) return '';
        return validateField(field, form[field]);
    };

    const isFieldValid = (field) => {
        if (!touched[field]) return true;
        return !validateField(field, form[field]);
    };

    const calculatePasswordStrength = (pass) => {
        let score = 0;
        if (pass.length >= 6) score++;
        if (pass.length >= 10) score++;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
        if (/\d/.test(pass)) score++;
        if (/[^a-zA-Z0-9]/.test(pass)) score++;
        setPasswordStrength(score);
        return score;
    };

    const handleFieldChange = (field, value) => {
        setForm({...form, [field]: value});
        setTouched({...touched, [field]: true});
        if (field === 'password') {
            calculatePasswordStrength(value);
            if (form.confirmPassword) {
                setTouched({...touched, confirmPassword: true});
            }
        }
        if (field === 'confirmPassword' || field === 'password') {
            setTouched({...touched, [field]: true});
        }
    };

    const handleRegister = async () => {
        // Validate all fields
        const fields = ['name', 'email', 'password', 'confirmPassword'];
        const errors = {};
        let hasError = false;
        
        fields.forEach(f => {
            const err = validateField(f, form[f]);
            if (err) {
                errors[f] = err;
                hasError = true;
            }
        });
        
        if (hasError) {
            setTouched(Object.keys(errors).reduce((acc, key) => ({...acc, [key]: true}), {}));
            setError(Object.values(errors)[0]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const data = await register(
                form.name.trim(),
                form.email,
                form.password,
                form.bio.trim(),
                form.location.trim()
            );
            
            // Registration successful
            goLogin();
            
        } catch (err) {
            console.error('Registration error:', err);
            if (err.message.includes('Email already registered')) {
                setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
            } else if (err.message.includes('Network')) {
                setError('Gagal terhubung ke server. Periksa koneksi internetmu.');
            } else {
                setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStrengthLabel = (score) => {
        const labels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
        const colors = ['#DC2626', '#F59E0B', '#FCD34D', '#22C55E', '#059669'];
        return { label: labels[score] || 'Sangat Lemah', color: colors[score] || '#DC2626' };
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
                gap:20
            }}>
                {/* Back Button */}
                <div>
                    <button className="back-btn" onClick={goLogin}>
                        {icons.back()}
                    </button>
                </div>

                {/* Title */}
                <div>
                    <h1 style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:28,
                        fontWeight:700,
                        color:'var(--text-primary)'
                    }}>
                        Buat Akun
                    </h1>
                    <p style={{
                        fontSize:14,
                        color:'var(--text-secondary)',
                        marginTop:6
                    }}>
                        Mulai perjalanan membacamu hari ini
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
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    <div className="input-group">
                        <label className="input-label">Nama Lengkap *</label>
                        <input 
                            className="input-field" 
                            type="text" 
                            placeholder="John Doe" 
                            value={form.name}
                            onChange={e => handleFieldChange('name', e.target.value)}
                            style={{
                                borderColor: getFieldError('name') ? 'var(--error)' : 
                                            isFieldValid('name') && form.name ? 'var(--success)' : undefined
                            }}
                            autoFocus
                        />
                        {getFieldError('name') && (
                            <div style={{fontSize:11,color:'var(--error)',marginTop:4}}>
                                {getFieldError('name')}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email *</label>
                        <input 
                            className="input-field" 
                            type="email" 
                            placeholder="nama@email.com" 
                            value={form.email}
                            onChange={e => handleFieldChange('email', e.target.value)}
                            style={{
                                borderColor: getFieldError('email') ? 'var(--error)' : 
                                            isFieldValid('email') && form.email ? 'var(--success)' : undefined
                            }}
                        />
                        {getFieldError('email') && (
                            <div style={{fontSize:11,color:'var(--error)',marginTop:4}}>
                                {getFieldError('email')}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password *</label>
                        <div style={{position:'relative'}}>
                            <input 
                                className="input-field" 
                                type={showPass ? 'text' : 'password'} 
                                placeholder="Min. 6 karakter" 
                                value={form.password}
                                onChange={e => handleFieldChange('password', e.target.value)}
                                style={{
                                    paddingRight:44,
                                    borderColor: getFieldError('password') ? 'var(--error)' : 
                                                isFieldValid('password') && form.password ? 'var(--success)' : undefined
                                }}
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
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        {form.password && (
                            <div style={{marginTop:6}}>
                                <div style={{
                                    display:'flex',
                                    gap:4,
                                    marginBottom:4
                                }}>
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} style={{
                                            flex:1,
                                            height:4,
                                            borderRadius:2,
                                            background: i <= passwordStrength ? getStrengthLabel(passwordStrength).color : 'var(--border-light)',
                                            transition:'background 0.3s'
                                        }}/>
                                    ))}
                                </div>
                                <div style={{
                                    fontSize:11,
                                    color: getStrengthLabel(passwordStrength).color
                                }}>
                                    Kekuatan: {getStrengthLabel(passwordStrength).label}
                                </div>
                            </div>
                        )}
                        {getFieldError('password') && (
                            <div style={{fontSize:11,color:'var(--error)',marginTop:4}}>
                                {getFieldError('password')}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Konfirmasi Password *</label>
                        <div style={{position:'relative'}}>
                            <input 
                                className="input-field" 
                                type={showConfirm ? 'text' : 'password'} 
                                placeholder="Ulangi password" 
                                value={form.confirmPassword}
                                onChange={e => handleFieldChange('confirmPassword', e.target.value)}
                                style={{
                                    paddingRight:44,
                                    borderColor: getFieldError('confirmPassword') ? 'var(--error)' : 
                                                isFieldValid('confirmPassword') && form.confirmPassword ? 'var(--success)' : undefined
                                }}
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
                                onClick={() => setShowConfirm(!showConfirm)}
                                type="button"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {showConfirm ? (
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
                        {getFieldError('confirmPassword') && (
                            <div style={{fontSize:11,color:'var(--error)',marginTop:4}}>
                                {getFieldError('confirmPassword')}
                            </div>
                        )}
                        {form.confirmPassword && isFieldValid('confirmPassword') && (
                            <div style={{fontSize:11,color:'var(--success)',marginTop:4}}>
                                ✓ Password cocok
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Bio</label>
                        <textarea 
                            className="input-field" 
                            placeholder="Ceritakan tentang dirimu (opsional)" 
                            value={form.bio}
                            onChange={e => setForm({...form, bio: e.target.value})}
                            style={{resize:'vertical', minHeight:60, paddingTop:12}}
                            maxLength={200}
                        />
                        <div style={{
                            fontSize:11,
                            color:'var(--text-disabled)',
                            textAlign:'right'
                        }}>
                            {form.bio.length}/200 karakter
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Lokasi</label>
                        <input 
                            className="input-field" 
                            type="text" 
                            placeholder="Kota, Negara (opsional)" 
                            value={form.location}
                            onChange={e => setForm({...form, location: e.target.value})}
                        />
                    </div>
                </div>

                {/* Register Button */}
                <button 
                    className="btn-primary" 
                    onClick={handleRegister} 
                    disabled={loading}
                    style={{height:52}}
                >
                    {loading ? (
                        <div className="spinner" style={{width:22,height:22,borderWidth:2}}/>
                    ) : (
                        'Daftar Sekarang'
                    )}
                </button>

                {/* Login Link */}
                <div style={{textAlign:'center'}}>
                    <span style={{fontSize:14,color:'var(--text-secondary)'}}>
                        Sudah punya akun? 
                    </span>
                    <span 
                        style={{
                            fontSize:14,
                            color:'var(--primary)',
                            fontWeight:600,
                            cursor:'pointer',
                            marginLeft:4
                        }} 
                        onClick={goLogin}
                    >
                        Masuk
                    </span>
                </div>

                {/* Terms */}
                <div style={{
                    fontSize:11,
                    color:'var(--text-disabled)',
                    textAlign:'center',
                    lineHeight:1.6,
                    marginTop:4
                }}>
                    Dengan mendaftar, kamu menyetujui{' '}
                    <span style={{color:'var(--primary)',cursor:'pointer'}}>
                        Syarat & Ketentuan
                    </span>
                    {' '}dan{' '}
                    <span style={{color:'var(--primary)',cursor:'pointer'}}>
                        Kebijakan Privasi
                    </span>
                </div>
            </div>
        </div>
    );
}
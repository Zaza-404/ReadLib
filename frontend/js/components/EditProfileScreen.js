function EditProfileScreen({ nav }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        bio: '',
        location: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const profile = await getProfile();
            setForm({
                name: profile.name || '',
                email: profile.email || '',
                bio: profile.bio || '',
                location: profile.location || '',
                avatar: profile.avatar || ''
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Gagal memuat profil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            alert('Nama lengkap tidak boleh kosong');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            await updateProfile({
                name: form.name,
                bio: form.bio,
                location: form.location,
                avatar: form.avatar
            });
            
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                nav('back');
            }, 1000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Gagal menyimpan perubahan. Silakan coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = () => {
        // Simulasi upload gambar
        // Di implementasi nyata, ini akan membuka file picker dan upload ke server
        const colors = ['#DBEAFE', '#DCFCE7', '#FEF3C7', '#FCE7F3', '#F3E8FF', '#FFEDD5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        alert('Fitur upload foto akan segera hadir! 🚀');
        
        // Simulasi perubahan avatar (hanya untuk demo)
        setForm({...form, avatar: `avatar_${Date.now()}`});
    };

    if (loading) {
        return (
            <div className="screen">
                <StatusBar/>
                <div className="header">
                    <button className="back-btn" onClick={() => nav('back')}>
                        {icons.back()}
                    </button>
                    <span className="header-title">Edit Profil</span>
                    <div style={{width:36}}></div>
                </div>
                <div className="state-center">
                    <div className="spinner"/>
                    <div className="state-desc">Memuat profil...</div>
                </div>
            </div>
        );
    }

    // Get initials for avatar
    const getInitials = () => {
        if (!form.name) return '?';
        const parts = form.name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase() || '?';
    };

    return (
        <div className="screen">
            <StatusBar/>
            <div className="header">
                <button className="back-btn" onClick={() => nav('back')}>
                    {icons.back()}
                </button>
                <span className="header-title">Edit Profil</span>
                <button 
                    className="back-btn" 
                    style={{background: 'var(--primary)', marginLeft: 'auto'}} 
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saved ? (
                        <span style={{fontSize:16,color:'#fff'}}>✓</span>
                    ) : saving ? (
                        <div className="spinner" style={{width:20,height:20,borderWidth:2,borderTopColor:'#fff'}}/>
                    ) : (
                        <span style={{fontSize:12,fontWeight:600,color:'#fff',padding:'0 4px'}}>Simpan</span>
                    )}
                </button>
            </div>

            {error && (
                <div style={{
                    margin: '12px 20px',
                    padding: '12px 16px',
                    background: '#FEE2E2',
                    borderRadius: '8px',
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

            <div className="scroll-content" style={{padding:'24px 20px 40px',paddingBottom:80}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:28}}>
                    <div style={{position:'relative'}}>
                        <div className="avatar-lg" style={{
                            background: form.avatar ? '#EFF6FF' : 'var(--primary-light)',
                            border: '3px solid var(--primary)'
                        }}>
                            {getInitials()}
                        </div>
                        <button 
                            style={{
                                position:'absolute',
                                bottom:0,
                                right:0,
                                width:28,
                                height:28,
                                borderRadius:'50%',
                                background:'var(--primary)',
                                border:'2px solid #fff',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                cursor:'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                            onClick={handleImageUpload}
                        >
                            <span style={{color:'#fff',fontSize:16,lineHeight:1}}>📷</span>
                        </button>
                    </div>
                    <span 
                        style={{
                            fontSize:13,
                            color:'var(--primary)',
                            marginTop:10,
                            fontWeight:500,
                            cursor:'pointer'
                        }}
                        onClick={handleImageUpload}
                    >
                        Ganti Foto Profil
                    </span>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                    <div className="input-group">
                        <label className="input-label">Nama Lengkap *</label>
                        <input 
                            className="input-field" 
                            type="text" 
                            placeholder="Nama kamu" 
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input 
                            className="input-field" 
                            type="email" 
                            placeholder="email@contoh.com" 
                            value={form.email} 
                            disabled
                            style={{opacity:0.7, cursor:'not-allowed'}}
                        />
                        <div style={{fontSize:11,color:'var(--text-disabled)',marginTop:4}}>
                            Email tidak dapat diubah
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Bio</label>
                        <textarea 
                            className="input-field" 
                            placeholder="Ceritakan tentang dirimu" 
                            value={form.bio}
                            onChange={e => setForm({...form, bio: e.target.value})}
                            style={{resize:'vertical', minHeight:80, paddingTop:12}}
                            maxLength={200}
                        />
                        <div style={{fontSize:11,color:'var(--text-disabled)',textAlign:'right'}}>
                            {form.bio.length}/200 karakter
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Lokasi</label>
                        <input 
                            className="input-field" 
                            type="text" 
                            placeholder="Kota, Negara" 
                            value={form.location}
                            onChange={e => setForm({...form, location: e.target.value})}
                        />
                    </div>

                    <div style={{
                        marginTop:8,
                        padding: '12px 16px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>ℹ️</span>
                        <span>Perubahan akan langsung diterapkan setelah disimpan</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
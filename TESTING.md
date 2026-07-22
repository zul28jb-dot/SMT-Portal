# SMT Portal - Testing Guide

## Sistem Authentication

### Cara Menguji Login Sementara (Development Mode)

#### 1. **Akses Dashboard Tanpa Token (Test Redirect)**

Buka dashboard.html secara langsung tanpa token:
```
dashboard.html
```

**Hasil yang dijangka:**
- Browser akan redirect ke `index.html` (landing page)
- Console akan menunjukkan log: `[AUTH] Redirecting to login`

#### 2. **Login dengan Token Melalui URL Parameter**

Buka URL berikut dengan token yang sah:
```
dashboard.html?token=user_123456_token
```

**Kriteria Token Sah (Development Mode):**
- Panjang minimum: 10 karakter
- Format: alphanumeric, underscore (_), dash (-) sahaja
- Contoh token yang sah:
  - `user_123456_token`
  - `test-token-dev`
  - `token_2026_user`
  - `ABC123-XYZ789_test`

**Hasil yang dijangka:**
- Dashboard akan dimuatkan
- Token akan disimpan dalam `sessionStorage`
- URL akan di-clean (token parameter dibuang): `dashboard.html`
- Console akan menunjukkan: `[AUTH] Token validation passed (development mode)`

#### 3. **Verify Token dalam Session Storage**

1. Buka Dev Tools (F12 atau Ctrl+Shift+I)
2. Pergi ke tab `Application` atau `Storage`
3. Cari `sessionStorage`
4. Anda akan lihat:
   ```
   Key: smt_portal_token
   Value: user_123456_token
   ```

#### 4. **Test Logout**

Di dashboard, klik button "🚪 Log Keluar" di sidebar footer.

**Hasil yang dijangka:**
- Session storage akan dipadam
- Browser akan redirect ke `index.html`
- Console akan menunjukkan:
  ```
  [AUTH] User logged out
  [AUTH] Redirecting to login: Anda telah log keluar
  ```

#### 5. **Test Login Ulang Selepas Logout**

Selepas logout, anda boleh login semula menggunakan URL parameter:
```
dashboard.html?token=user_123456_token
```

#### 6. **Test Invalid Token**

Buka URL dengan token tidak sah:
```
dashboard.html?token=123
```

**Hasil yang dijangka:**
- Akan redirect ke landing page
- Console akan menunjukkan: `[AUTH] Redirecting to login: Token tidak sah`

Contoh token tidak sah:
- `123` (kurang dari 10 karakter)
- `token@invalid` (mengandung karakter @)
- `token#2026` (mengandung karakter #)

### Console Logs untuk Debugging

Buka Dev Tools Console (F12 → Console) untuk lihat authentication logs:

```
[AUTH] Token validation passed (development mode)    // Token sah
[AUTH] Token saved to session                        // Token disimpan
[AUTH] Logout button initialized                     // Logout button siap
[AUTH] User logged out                               // User log keluar
[AUTH] Redirecting to login                          // Redirect ke landing page
[APP] Landing page initialized                       // Landing page loaded
[APP] Dashboard initialized                          // Dashboard loaded
```

### Struktur Authentication

#### auth.js
- `Auth.init()` - Inisialisasi authentication
- `Auth.verifyAccess()` - Verify token dari URL atau session
- `Auth.validateToken(token)` - Validate format token
- `Auth.saveToken(token)` - Simpan token ke sessionStorage
- `Auth.logout()` - Log keluar user
- `Auth.validateTokenWithAPI(token)` - Placeholder untuk n8n API (future)

#### Integrasi dengan n8n (Future)

Struktur sudah siap untuk integrate dengan n8n API. Ganti function `validateTokenWithAPI()` dengan:

```javascript
const response = await fetch('/api/auth/validate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ token: token })
});
```

### Testing Checklist

- [ ] Dashboard redirect ke landing page kalau tiada token
- [ ] Token sah dari URL diterima dan disimpan
- [ ] URL di-clean selepas token validation
- [ ] Session storage menyimpan token dengan betul
- [ ] Logout button berfungsi dan delete session
- [ ] Redirect ke landing page selepas logout
- [ ] Smooth scroll di landing page berfungsi
- [ ] Dashboard chart dan interactive elements berfungsi

### Setup Local Testing

1. Buka folder project di VS Code
2. Gunakan Live Server extension untuk test:
   - Install extension: Live Server
   - Klik kanan pada `index.html` → "Open with Live Server"
   - Server akan berjalan di `http://localhost:5500`

3. Untuk test dashboard dengan token:
   - Pergi ke: `http://localhost:5500/dashboard.html?token=test_token_2026`

### Notes

- Token disimpan dalam **sessionStorage** (bukan localStorage), bermakna akan hilang apabila tab ditutup
- Validation logic siap untuk ditukar dengan n8n API call tanpa perubahan struktur besar
- Semua logs dalam console untuk debugging purposes
- Tiada keamanan real-world implementation pada fasa development ini

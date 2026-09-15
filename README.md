# MyCuaca ala BMKG

Aplikasi web cuaca Indonesia bergaya BMKG: prakiraan per kelurahan (api.bmkg.go.id), gempa terkini + shakemap (data.bmkg.go.id), maritim gelombang (maritim.bmkg.go.id), citra radar/satelit (RainViewer), plus data global OpenWeather sebagai pelengkap. Dibangun dengan Next.js, TypeScript, Tailwind CSS. Dirancang untuk deploy di Vercel.

> Aplikasi non-resmi. Wajib atribusi: BMKG sebagai sumber data cuaca/gempa/maritim.

## Fitur

| # | Fitur | Keterangan |
|---|-------|-----------|
| 1 | Cuaca saat ini | Suhu, deskripsi, ikon, kelembapan, angin + arah mata angin, tekanan, jarak pandang, sunrise/sunset, suhu terasa seperti |
| 2 | Prakiraan 5 hari | Suhu min–max, ikon, deskripsi, peluang hujan per hari |
| 3 | Geolocation otomatis | Minta izin lokasi saat halaman dibuka; fallback ke Jakarta bila ditolak |
| 4 | Kota favorit | Simpan/hapus kota sebagai daftar (localStorage, maks 8) |
| 5 | Riwayat pencarian | 10 pencarian terakhir di dropdown search (localStorage) |
| 6 | Prakiraan per jam 24 jam | Slicing data forecast 3-jam |
| 7 | Peluang hujan | Field `pop` per jam & per hari |
| 8 | Peringatan ekstrem | Teks hujan deras / angin kencang dari data yang ada |
| 9 | Kualitas udara (AQI) | Endpoint Air Pollution + komponen utama (PM2.5, PM10, O₃, NO₂) |
| 10 | Toggle °C/°F | Preferensi satuan tersimpan di localStorage |
| 11 | Auto-refresh 10 menit | + timestamp "Diperbarui pukul HH:MM" |
| 12 | Peta cuaca | Leaflet + tile layer awan / curah hujan / suhu |
| 13 | Tema tampilan | Toggle Terang, Gelap, atau Sistem di header; pilihan tersimpan di perangkat |
| 14 | Visualisasi hero | Busur matahari, dial kompas angin, dan angka suhu bertransisi |
| 15 | Pita dan kurva suhu | Strip 5 hari skala divergen + kurva per-3-jam hari terpilih |
| 16 | Suhu live favorit | Tiap baris favorit di halaman Kota menampilkan suhu dan ikon terkini |
| 17 | Cuaca BMKG per kelurahan | Proxy `GET /api/bmkg/cuaca?adm4=` → hero + strip 3 hari per 3 jam |
| 18 | Gempa terkini + shakemap | Proxy `GET /api/bmkg/gempa?jenis=all` → terbaru, M5+, dirasakan |
| 19 | Peringatan dini | Aturan lokal dari slot BMKG + gempa M5+ (bukan produk resmi MHEWS) |
| 20 | Maritim gelombang | Proxy meta + prakiraan pelabuhan/perairan `GET /api/bmkg/maritim` |
| 21 | Citra radar + satelit | Proxy frame RainViewer `GET /api/bmkg/citra` → peta animasi Leaflet |

## Tech Stack

- **Next.js 16** (App Router, Route Handlers): framework + API proxy
- **TypeScript**: type safety penuh
- **Tailwind CSS 4**: styling
- **Leaflet**: peta interaktif (satu-satunya dependency tambahan)
- **Plus Jakarta Sans**: font antarmuka yang dipilih karena keterbacaan angka dan teks Indonesia
- **OpenWeather API**: sumber data

## Halaman

Satu halaman (`/`) berisi lima bagian; navigasi header dan tombol pintasan adalah anchor yang scroll ke bagian terkait (scroll-spy menandai bagian aktif):

| Bagian | Anchor | Isi |
|---|---|---|
| Ringkasan | `#ringkasan` | Wilayah BMKG + hero BMKG, kondisi global, fakta kunci, jam ke depan, kota favorit |
| Prakiraan | `#prakiraan` | BMKG 3 hari per 3 jam + pemilih hari 5 hari dan rincian tiga jam (global) |
| Gempa | `#gempa` | Gempa terbaru + shakemap, filter M5+ dan dirasakan |
| Peringatan | `#peringatan` | Peringatan otomatis dari data BMKG + gempa M5+ |
| Maritim | `#maritim` | Gelombang, angin, arus per pelabuhan/perairan |
| Citra | `#citra` | Animasi radar + satelit inframerah |
| Peta | `#peta` | Peta Leaflet: badge suhu + popup detail kota, lima lapisan cuaca, klik titik untuk inspeksi, tombol lokasi saya |
| Udara | `#udara` | Skala AQI, komponen polutan, dan waktu pengukuran |
| Kota | `#kota` | Wilayah BMKG + kota aktif, favorit, riwayat, dan lokasi pengguna |

## Arsitektur

```
app/
├── page.tsx                          # Satu halaman: lima bagian + scroll-spy
├── layout.tsx                        # Metadata, font, provider, footer
├── weather-provider.tsx              # State global kota, satuan, data, favorit, riwayat (OpenWeather)
├── bmkg-provider.tsx                   # State wilayah adm4 + cuaca BMKG + gempa
├── theme-provider.tsx                # Tema terang/gelap/sistem
├── globals.css                       # Tailwind, token tema, smooth scroll
└── api/
    ├── weather/route.ts              # Proxy semua endpoint data (GET ?type=)
    ├── tile/[layer]/[z]/[x]/[y]/route.ts   # Proxy tile peta
    └── bmkg/
        ├── cuaca/route.ts            # Proxy prakiraan-cuaca?adm4= (GET ?adm4=)
        ├── gempa/route.ts            # Proxy autogempa/gempaterkini/gempadirasakan (GET ?jenis=)
        ├── maritim/route.ts          # Proxy meta + prakiraan pelabuhan/perairan
        └── citra/route.ts            # Proxy frame RainViewer (radar + satelit)
components/
├── SiteHeader.tsx                    # Header lengket + pintasan bagian
├── TabNav.tsx                        # Tautan antar-bagian (desktop)
├── CitySearch.tsx                    # Pencarian kota dunia dan riwayat (OpenWeather)
├── WilayahSearch.tsx                 # Pencarian wilayah Indonesia adm4 (BMKG)
├── BmkgHero.tsx                      # Hero navy institusional dari slot BMKG
├── BmkgStrip.tsx                     # Strip BMKG 3 hari per 3 jam
├── GempaScreen.tsx                   # Bagian gempa + shakemap
├── PeringatanScreen.tsx              # Bagian peringatan otomatis
├── MaritimScreen.tsx                 # Bagian gelombang pelabuhan/perairan
├── CitraScreen.tsx                   # Bagian radar + satelit
├── CitraView.tsx                     # Peta animasi Leaflet RainViewer
├── HeaderControls.tsx                # Kapsul gabungan tema + satuan suhu
├── SectionIntro.tsx                  # Judul bagian: eyebrow + judul + deskripsi
├── HomeScreen.tsx                    # Bagian ringkasan
├── SkyHero.tsx                       # Panel kondisi saat ini yang mengikuti cuaca
├── SunArc.tsx                        # Busur perjalanan matahari
├── WindDial.tsx                      # Dial kompas angin
├── KeyFacts.tsx                      # Fakta kunci hari ini
├── HourlyTimeline.tsx                # Linimasa tiga jam
├── WarningList.tsx                   # Teks peringatan cuaca
├── ForecastScreen.tsx                # Bagian prakiraan
├── TempStripes.tsx                   # Strip 5 hari (pilih hari)
├── TempCurve.tsx                     # Kurva suhu per 3 jam
├── MapScreen.tsx                     # Bagian peta
├── MapView.tsx                       # Leaflet dan pemilih lapisan
├── AirScreen.tsx                     # Bagian kualitas udara
├── AqiScale.tsx                      # Skala dan tabel AQI
├── CitiesScreen.tsx                  # Bagian kota
├── CityManager.tsx                   # Favorit, riwayat, dan lokasi
└── Status.tsx                        # Status muat, kosong, galat, dan offline
lib/
├── openweather.ts                    # Tipe TS + fetch helper semua endpoint
├── bmkg.ts                           # Tipe + fetch server BMKG + aturan peringatan
├── wilayah.ts                        # 14 wilayah adm4 terverifikasi + localStorage
├── forecast.ts                       # Agregasi harian dan peringatan
├── format.ts                         # Format jam dan arah mata angin
├── sky.ts                            # Tema hero berdasarkan ikon cuaca
├── theme.ts                          # Penyimpanan preferensi tema
└── storage.ts                        # localStorage: kota, favorit, riwayat, satuan
```

### Keamanan API Key

API key OpenWeather **hanya ada di server-side** (`process.env.OPENWEATHER_API_KEY`). Browser tidak pernah memanggil OpenWeather langsung:

- Data cuaca → `GET /api/weather?type=...` → route handler menambahkan key
- Tile peta → `GET /api/tile/...` → tanpa ini, key akan terekspos di URL gambar (`?appid=`)

Bila lapisan tile gagal (key belum diset di hosting, atau key tidak punya akses **Weather Maps**), `MapView` menampilkan peringatan inline dan peta dasar tetap berfungsi penuh.

### `GET /api/weather`: Parameter

| `type` | Param tambahan | Hasil |
|--------|---------------|-------|
| `geocode` | `q` | Array hasil pencarian kota |
| `reverse` | `lat`, `lon` | Nama kota dari koordinat |
| `current` | `lat`, `lon` | Cuaca saat ini |
| `forecast` | `lat`, `lon` | Prakiraan 5 hari / 3 jam |
| `aqi` | `lat`, `lon` | Kualitas udara |
| `all` | `lat`, `lon` | Ketiganya sekaligus (dipakai UI utama) |

## Setup Lokal

```bash
# 1. Install dependencies
npm install

# 2. Siapkan API key gratis di https://openweathermap.org/api
#    (daftar → API keys tab; key aktif ~10 menit setelah dibuat)

# 3. Salin env lalu isi key Anda
cp .env.example .env.local

# 4. Jalankan dev server
npm run dev
# buka http://localhost:3000
```

## Deploy ke Vercel

1. Push repo ini ke GitHub
2. Di Vercel: **New Project** → import repo
3. **Settings → Environment Variables** → tambahkan `OPENWEATHER_API_KEY` dengan key Anda
4. Deploy: Vercel auto-detect Next.js

Tidak ada konfigurasi lain yang diperlukan.

## Endpoint OpenWeather yang Dipakai

Semua free tier, satu key (limit 60 call/menit, cukup untuk app dengan cache 10 menit):

| Kebutuhan | Endpoint |
|---|---|
| Cuaca saat ini | `GET /data/2.5/weather` |
| Prakiraan 5 hari/3 jam | `GET /data/2.5/forecast` |
| Search kota | `GET /geo/1.0/direct` |
| Reverse geocode | `GET /geo/1.0/reverse` |
| Kualitas udara | `GET /data/2.5/air_pollution` |
| Tile peta | `GET /map/{layer}/{z}/{x}/{y}.png` (butuh akses Weather Maps pada key) |

## Format Response Utama (ringkas)

```jsonc
// /data/2.5/weather
{
  "coord": { "lat": -6.21, "lon": 106.85 },
  "weather": [{ "main": "Clouds", "description": "awan pecah", "icon": "04d" }],
  "main": { "temp": 30.5, "feels_like": 34, "humidity": 70, "pressure": 1010 },
  "wind": { "speed": 3.5, "deg": 200 },
  "sys": { "country": "ID", "sunrise": 1699999999, "sunset": 1700039999 },
  "name": "Jakarta"
}

// /data/2.5/forecast → list[] tiap 3 jam
{
  "list": [{
    "dt": 1699999999, "dt_txt": "2026-09-14 12:00:00",
    "main": { "temp": 31 },
    "weather": [{ "icon": "10d" }],
    "wind": { "speed": 4.2 },
    "pop": 0.6
  }]
}

// /data/2.5/air_pollution
{
  "list": [{ "main": { "aqi": 2 }, "components": { "pm2_5": 12.3, "pm10": 20.1 } }]
}
```

## Keputusan yang Disengaja (YAGNI)

- **Tanpa database / akun**: favorit & riwayat cukup di localStorage
- **Tanpa PWA / push notification**: bisa ditambah nanti via manifest + service worker
- **Tanpa UV index & prakiraan >5 hari**: endpoint One Call 3.0 memerlukan kartu kredit
- **Agregasi forecast client-side**: 5 hari dari data 3-jam, tanpa langganan

## Lisensi

Proyek pribadi: bebas digunakan untuk belajar.

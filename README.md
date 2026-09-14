# MyCuaca

Aplikasi web prakiraan cuaca berbahasa Indonesia, dibangun dengan Next.js, TypeScript, Tailwind CSS, dan OpenWeather API. Dirancang untuk deploy di Vercel.

## Fitur

| # | Fitur | Keterangan |
|---|-------|-----------|
| 1 | Cuaca saat ini | Suhu, deskripsi, ikon, kelembapan, angin + arah, tekanan, jarak pandang, sunrise/sunset, suhu terasa seperti |
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
| 13 | Dark mode | Otomatis mengikuti `prefers-color-scheme` |

## Tech Stack

- **Next.js 16** (App Router, Route Handlers): framework + API proxy
- **TypeScript**: type safety penuh
- **Tailwind CSS 4**: styling
- **Leaflet**: peta interaktif (satu-satunya dependency tambahan)
- **Plus Jakarta Sans**: font antarmuka yang dipilih karena keterbacaan angka dan teks Indonesia
- **OpenWeather API**: sumber data

## Rute

| Rute | Isi |
|---|---|
| `/` | Ringkasan: kondisi saat ini, fakta kunci, beberapa jam ke depan, kota favorit |
| `/prakiraan` | Pemilih hari 5 hari dan rincian tiga jam per hari |
| `/peta` | Peta layar besar dengan lapisan awan, hujan, dan suhu |
| `/udara` | Skala AQI, komponen polutan, dan waktu pengukuran |
| `/kota` | Kota aktif, favorit, riwayat, dan lokasi pengguna |

## Arsitektur

```
app/
├── page.tsx                          # Rute ringkasan (server + HomeScreen)
├── prakiraan/page.tsx                # Rute prakiraan
├── peta/page.tsx                     # Rute peta
├── udara/page.tsx                    # Rute udara
├── kota/page.tsx                     # Rute kota
├── layout.tsx                        # Metadata, font, provider, header, footer
├── weather-provider.tsx              # State global kota, satuan, data, favorit, riwayat
├── globals.css                       # Tailwind dan token tema
└── api/
    ├── weather/route.ts              # Proxy semua endpoint data (GET ?type=)
    └── tile/[layer]/[z]/[x]/[y]/route.ts   # Proxy tile peta
components/
├── SiteHeader.tsx                    # Header, navigasi desktop, navigasi bawah seluler
├── CitySearch.tsx                    # Pencarian kota dan riwayat
├── UnitSwitch.tsx                    # Pilihan satuan suhu
├── HomeScreen.tsx                    # Layar ringkasan
├── SkyHero.tsx                       # Panel kondisi saat ini yang mengikuti cuaca
├── KeyFacts.tsx                      # Fakta kunci hari ini
├── HourlyTimeline.tsx                # Linimasa tiga jam
├── ForecastScreen.tsx                # Layar prakiraan
├── DailySelector.tsx                 # Pemilih hari
├── WarningList.tsx                   # Teks peringatan cuaca
├── MapScreen.tsx                     # Layar peta
├── MapView.tsx                       # Leaflet dan pemilih lapisan
├── AirScreen.tsx                     # Layar kualitas udara
├── AqiScale.tsx                      # Skala dan tabel AQI
├── CitiesScreen.tsx                  # Layar kota
├── CityManager.tsx                   # Favorit, riwayat, dan lokasi
└── Status.tsx                        # Status muat, kosong, galat, dan offline
lib/
├── openweather.ts                    # Tipe TS + fetch helper semua endpoint
├── forecast.ts                       # Agregasi harian dan peringatan
├── sky.ts                            # Tema hero berdasarkan ikon cuaca
└── storage.ts                        # localStorage: kota, favorit, riwayat, satuan
```

### Keamanan API Key

API key OpenWeather **hanya ada di server-side** (`process.env.OPENWEATHER_API_KEY`). Browser tidak pernah memanggil OpenWeather langsung:

- Data cuaca → `GET /api/weather?type=...` → route handler menambahkan key
- Tile peta → `GET /api/tile/...` → tanpa ini, key akan terekspos di URL gambar (`?appid=`)

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
| Tile peta | `GET /map/{layer}/{z}/{x}/{y}.png` |

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

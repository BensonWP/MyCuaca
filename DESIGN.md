# DESIGN.md: MyCuaca

## Identitas

MyCuaca adalah aplikasi cuaca Indonesia ala BMKG. Kepribadiannya institusional tapi ramah: breadcrumb wilayah resmi (Provinsi › Kota › Kecamatan › Kelurahan), hero navy `#0B3D91`, badge kategori resmi (gelombang, gempa, siaga), selalu menyebut sumber dan status non-resmi.

## Palet

- Netral: dua lapis permukaan. Halaman `--background` (putih/zinc-950), kartu `--surface` (zinc-50/zinc-900). Hierarki dibangun lewat latar, bukan border; border hanya untuk kontrol interaktif, popover, dan alert status.
- Institusional BMKG: navy `#0B3D91` untuk hero, tab aktif modul BMKG, dan badge resmi; merah untuk siaga/gempa M5+; ikon cuaca memakai gambar resmi `api-apps.bmkg.go.id`.
- Atribusi wajib: tiap modul BMKG menyebut sumber + "aplikasi non-resmi".
- Efek langit (`WeatherEffects.tsx`): awan drift, hujan, salju, bintang twinkle, sunburst, kabut — murni CSS, `aria-hidden`, mati total saat `prefers-reduced-motion`.
- Latar hero mengikuti kondisi cuaca dari kode ikon OpenWeather (cerah, malam, berawan, hujan, badai, salju, kabut). Gradien vertikal meniru langit (zenith gelap ke horizon terang). Panel hero dan panel kota aktif sengaja theme-independent: salju tetap terang dan malam tetap gelap di kedua tema aplikasi, karena warnanya menceritakan cuaca, bukan tema. Warna teks hero solid (bukan transparan) dan tiap ujung gradien sudah diverifikasi lolos kontras AA.
- Warna semantik (merah, amber, sky) hanya untuk status galat, offline, dan info, selalu disertai teks penjelasan, bukan warna saja.
- Kontrol tema ada di header dengan tiga pilihan: Terang, Gelap, Sistem. Pilihan tersimpan di perangkat dan tema gelap selalu lengkap, bukan sekadar ikut sistem operasi.

## Tipografi

Plus Jakarta Sans untuk seluruh antarmuka. Alasan: keterbacaan angka suhu besar, dukungan latin untuk Bahasa Indonesia, dan karakter yang cocok dengan konteks kota Indonesia. Judul memakai kalimat biasa (sentence case), tanpa label huruf besar berspasi lebar.

## Motif

Satu garis horizon tipis dipakai ulang sebagai pemisah bab: di bawah hero ringkasan dan di bawah judul tiap halaman. Alasan: menghubungkan langit sebagai sumber data dengan linimasa prakiraan dan skala udara.

Visualisasi data sebagai identitas: busur matahari (posisi siang dari sunrise-sunset), dial kompas angin (arah dan kecepatan), pita suhu 5 hari (strip divergen biru-merah yang dinormalisasi dari min-maks periode itu), dan kurva suhu per-3-jam. Alasan: tiap bentuk menjawab satu pertanyaan sekilas dan semuanya digambar dari data OpenWeather yang sama dengan angka di sebelahnya, sehingga tidak ada dekorasi tanpa data.

## Bentuk dan jarak

- Kontrol interaktif: sudut `rounded-lg`, pill `rounded-full` khusus untuk switch tema/satuan, lapisan peta, badge, dan chips kaca hero.
- Kartu saran (`AdviceBanner`): gradien 4 varian (payung biru, panas oranye-rose, angin teal, udara amber-merah) + ikon kotak kaca.
- Skala jarak mengikuti bawaan Tailwind (4, 8, 12, 16, 24, 32, 48, 64). Tidak ada nilai acak.

## Dial

ENERGY 3 / RHYTHM 3 / MOTION 2. Halaman ringkasan ekspresif lewat efek cuaca + suhu besar + kartu saran. Gerakan untuk perubahan status dan efek langit: transisi warna 150ms (kelas `stateful`), keyframes `drift, rainfall, snowfall, twinkle, spin-slow, shimmer`, dimatikan saat `prefers-reduced-motion`.

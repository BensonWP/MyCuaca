# DESIGN.md: MyCuaca

## Identitas

MyCuaca adalah aplikasi cuaca harian berbahasa Indonesia. Kepribadiannya tenang dan membantu: angka besar yang mudah dibaca sekilas, penjelasan secukupnya, tanpa dekorasi yang mengalihkan perhatian dari keputusan pengguna (baju apa, bawa payung atau tidak, kapan keluar rumah).

## Palet

- Netral: dua lapis permukaan. Halaman `--background` (putih/zinc-950), kartu `--surface` (zinc-50/zinc-900). Hierarki dibangun lewat latar, bukan border; border hanya untuk kontrol interaktif, popover, dan alert status.
- Aksen tunggal: sky-700 untuk tindakan utama, tautan aktif, dan penanda.
- Latar hero mengikuti kondisi cuaca dari kode ikon OpenWeather (cerah, malam, berawan, hujan, badai, salju, kabut). Gradien vertikal meniru langit (zenith gelap ke horizon terang). Panel hero dan panel kota aktif sengaja theme-independent: salju tetap terang dan malam tetap gelap di kedua tema aplikasi, karena warnanya menceritakan cuaca, bukan tema. Warna teks hero solid (bukan transparan) dan tiap ujung gradien sudah diverifikasi lolos kontras AA.
- Warna semantik (merah, amber, sky) hanya untuk status galat, offline, dan info, selalu disertai teks penjelasan, bukan warna saja.
- Kontrol tema ada di header dengan tiga pilihan: Terang, Gelap, Sistem. Pilihan tersimpan di perangkat dan tema gelap selalu lengkap, bukan sekadar ikut sistem operasi.

## Tipografi

Plus Jakarta Sans untuk seluruh antarmuka. Alasan: keterbacaan angka suhu besar, dukungan latin untuk Bahasa Indonesia, dan karakter yang cocok dengan konteks kota Indonesia. Judul memakai kalimat biasa (sentence case), tanpa label huruf besar berspasi lebar.

## Motif

Satu garis horizon tipis dipakai ulang sebagai pemisah bab: di bawah hero ringkasan dan di bawah judul tiap halaman. Alasan: menghubungkan langit sebagai sumber data dengan linimasa prakiraan dan skala udara.

Visualisasi data sebagai identitas: busur matahari (posisi siang dari sunrise-sunset), dial kompas angin (arah dan kecepatan), pita suhu 5 hari (strip divergen biru-merah yang dinormalisasi dari min-maks periode itu), dan kurva suhu per-3-jam. Alasan: tiap bentuk menjawab satu pertanyaan sekilas dan semuanya digambar dari data OpenWeather yang sama dengan angka di sebelahnya, sehingga tidak ada dekorasi tanpa data.

## Bentuk dan jarak

- Kontrol interaktif: sudut `rounded-lg`.
- Permukaan dan panel: sudut `rounded-2xl`.
- Tidak ada bentuk pil penuh di elemen mana pun.
- Skala jarak mengikuti bawaan Tailwind (4, 8, 12, 16, 24, 32, 48, 64). Tidak ada nilai acak.

## Dial

ENERGY 2 / RHYTHM 3 / MOTION 1. Halaman ringkasan boleh ekspresif lewat suhu besar dan latar cuaca, ritme tiap halaman berbeda sesuai kebutuhan datanya. Gerakan hanya untuk perubahan status: transisi warna 150ms (kelas `stateful`), dimatikan saat `prefers-reduced-motion`.

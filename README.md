# Albana Clodi Upgrade

## Deskripsi Singkat
Aplikasi manajemen operasional untuk kebutuhan penjualan, produk, customer, laporan, pengeluaran, dan pengaturan toko.

## API Reference
Dokumentasi API yang digunakan:
https://documenter.getpostman.com/view/22814931/2sB2j689my

## Role Yang Tersedia
Berdasarkan skema validasi register, role yang didukung adalah:
- `superadmin`
- `admin`
- `staff`

## Detail Fitur Per Role

Catatan:
- Dokumentasi ini menjelaskan implementasi yang terlihat di sisi frontend saat ini.
- Otorisasi final tetap mengikuti validasi backend/API.

### 1) Superadmin
Fitur utama:
- Akses halaman dashboard dan modul operasional: Dashboard, Order, Product, Customers, Report, Expenses, Settings.
- Melihat seluruh ringkasan keuangan pada halaman laporan.
- Melihat metrik pengeluaran pada statistik laporan.
- Melihat grafik tambahan laporan: grafik order dan grafik pengeluaran.

Detail khusus halaman report:
- Menampilkan `SummaryHeader` (total pendapatan dan laba bersih).
- Menampilkan `ProfitCards` (penjualan/laba kotor dan bersih).
- Menampilkan `expenses` pada `StatsGrid`.
- Menampilkan chart `Grafik Order` dan `Grafik Pengeluaran`.

### 2) Admin
Fitur utama:
- Akses halaman dashboard dan modul operasional: Dashboard, Order, Product, Customers, Report, Expenses, Settings.
- Menggunakan filter laporan dan melihat statistik transaksi umum.
- Melihat grafik customer dan grafik product pada laporan.

Batasan dibanding superadmin (di frontend report):
- Tidak menampilkan ringkasan keuangan tingkat lanjut (`SummaryHeader`, `ProfitCards`).
- Tidak menampilkan metrik `expenses` pada `StatsGrid`.
- Tidak menampilkan chart `Grafik Order` dan `Grafik Pengeluaran`.

### 3) Staff
Fitur utama:
- Akses halaman dashboard dan modul operasional: Dashboard, Order, Product, Customers, Report, Expenses, Settings.
- Menggunakan filter laporan dan melihat statistik transaksi umum.
- Melihat grafik customer dan grafik product pada laporan.

Batasan dibanding superadmin (di frontend report):
- Tidak menampilkan ringkasan keuangan tingkat lanjut (`SummaryHeader`, `ProfitCards`).
- Tidak menampilkan metrik `expenses` pada `StatsGrid`.
- Tidak menampilkan chart `Grafik Order` dan `Grafik Pengeluaran`.

## Ringkasan Matriks Akses (Frontend Saat Ini)

| Modul/Fitur | superadmin | admin | staff |
|---|---|---|---|
| Dashboard | Ya | Ya | Ya |
| Order | Ya | Ya | Ya |
| Product | Ya | Ya | Ya |
| Customers | Ya | Ya | Ya |
| Expenses | Ya | Ya | Ya |
| Settings | Ya | Ya | Ya |
| Report - Filter & statistik transaksi umum | Ya | Ya | Ya |
| Report - Ringkasan keuangan lanjutan | Ya | Tidak | Tidak |
| Report - Metrik expenses pada statistik | Ya | Tidak | Tidak |
| Report - Chart order & pengeluaran | Ya | Tidak | Tidak |
| Report - Chart customer & product | Ya | Ya | Ya |

## Catatan Implementasi
- Halaman `Role Access` saat ini masih placeholder.
- Jika diperlukan pembatasan menu per role di sidebar, perlu penambahan logic role-based rendering pada komponen navigasi.

## Lisensi
license by viery
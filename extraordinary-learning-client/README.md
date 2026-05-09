# ExtraordinaryLMS

Extraordinary Learning Client adalah aplikasi client untuk manajemen pembelajaran jarak jauh, untuk absensi, materi, tugas, ujian sampai rekapitulasi dan analisis. dikemas dengan absensi yang otomatis, chat dan online siswa realtime.

# Features!
Umum
## Dashboard
        - Menampilkan data sekolah
        - Menampilkan informasi
        - Menampilkan kegiatan mendatang
## Administrator
    1. Siswa
        - Tambah siswa
        - Edit siswa
        - Hapus siswa
        - Import siswa excel
    2. Pengajar
        - Tambah pengajar
        - Edit pengajar
        - Hapus pengajar
        - Import pengajar excel
    3. Kelas
        - Tambah kelas
        - Edit kelas
        - Hapus kelas
        - Import kelas
        - Dashboard kelas excel
    4. Mata pelajaran (matpel)
        - Tambah matpel
        - Edit matpel
        - Hapus matpel
        - Import matpel
    5. Informasi
        - Tambah informasi
        - Edit informasi
        - Hapus informasi
    6. Kegiatan
        - Tambah kegiatan
        - Edit kegiatan
        - Hapus kegiatan
    7. Setting
        - Edit data sekolah
## Guru
    1. Kelas
        - Tambah kelas mengajar
        - Hapus kelas mengajar
        - Dashboard kelas
    2. Dashboar kelas
        - Bagikan materi
        - Bagikan tugas
        - Hapus materi
        - Hapus tugas
        - Live kelas
    3. Materi
        - Tambah materi
        - Edit materi
        - Hapus materi
        - Bagikan materi
    4. Tugas
        - Tambah tugas
        - Edit tugas
        - Hapus tugas
        - Bagikan tugas
        - Koreksi tugas
        - Hasil tugas
    5. Banksoal
        - Tambah banksoal
        - Edit banksoal
        - Hapus banksoal
    6. Soal
        - Tambah soal
        - Edit soal
        - Hapus soal
        - Import soal .docx
    7. Jadwal ulangan
        - Tambah jadwal ulangan
        - Edit jadwal ulangan
        - Koreksi (esay)
        - Hasil ulangan
    8. Report absensi
        - Filter tanggal
        - Export excel
        - Print/pdf 
## Siswa
    1. Dashboard kelas
        - Tugas
        - Materi
    2. Materi
        - Daftar materi dibagikan
    3. Tugas
        - Daftar tugas dibagikan
        - Pengumpulan tugas
    4. Ulangan
        - Mengerjakan ulangan
## Tambahan
    1. Notifikasi kepada kelas yang bersangkutan dari telegram saat membagikan materi & tugas
    2. Deadline tugas
    3. Tugas support image/file, esay
    4. Ulangan support type pg, esay
    5. Ulangan support percentage
    6. Live class support youtube, jitsi meet
    7. Realtime absensi
    8. Realtime comment

### Tech

ExtraordinaryLMS uses a number of open source projects to work properly:

* [VueJs] - The Progressive JavaScript Framework.
* [Bootstrap] - The most popular HTML, CSS, and JS library in the world.
* [Vuex] - State management pattern + library for Vue.js applications.
* [Vue-Router] - The official router for Vue.js.
* [CkEditor] - Rock-solid, free WYSIWYG editor with collaborative editing.

### Installation

ExtraordinaryLMS requires [Node.js](https://nodejs.org/) v12+ to run.

make copy .env-example to .env and configure it
``` env
VUE_APP_URL=http://localhost
VUE_APP_SOCKET=http://localhost:3000
VUE_APP_CENTER_SOCKET=
```

Install the dependencies and devDependencies and start the server.

```sh
$ cd extraordinarycbt-learning-client
$ yarn install
$ yarn serve
```

For production environments...

```sh
$ yarn build
```

![Admin](/screenshoot/admin.jpg?raw=true "Tampilan admin")
![Guru](/screenshoot/guru.jpg?raw=true "Tampilan guru")
![Kelas](/screenshoot/kelas.jpg?raw=true "Tampilan kelas")

### Development

Want to contribute? Great!

Dillinger uses Vue+ Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [VueJs]: <http://vuejs.org>
   [Bootstrap]: <https://www.getbootstrap.com>
   [Vuex]: <https://vuex.vuejs.org>
   [Vue-Router]: <https://router.vuejs.org>
   [CkEditor]: <https://ckeditor.com>
Developed by [Shellrean](https://shellrean.com/)
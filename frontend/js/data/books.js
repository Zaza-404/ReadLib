const BOOKS = [
    {id:1, title:"Atomic Habits", author:"James Clear", genre:"Self-Help", rating:4.8, cover:"https://covers.openlibrary.org/b/id/10521270-L.jpg", progress:65, pages:320, synopsis:"Tiny changes, remarkable results. This book will reshape the way you think about progress and success, and give you the tools to transform your habits.", year:2018},
    {id:2, title:"Dune", author:"Frank Herbert", genre:"Sci-Fi", rating:4.9, cover:"https://covers.openlibrary.org/b/id/9255566-L.jpg", progress:30, pages:688, synopsis:"Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, whose family accepts control of the desert planet Arrakis.", year:1965},
    {id:3, title:"The Great Gatsby", author:"F. Scott Fitzgerald", genre:"Classic", rating:4.2, cover:"https://covers.openlibrary.org/b/id/7222246-L.jpg", progress:100, pages:180, synopsis:"A portrayal of the Jazz Age, with its decadence and idealism, set against the backdrop of the American Dream.", year:1925},
    {id:4, title:"1984", author:"George Orwell", genre:"Dystopia", rating:4.7, cover:"https://covers.openlibrary.org/b/id/8575708-L.jpg", progress:0, pages:328, synopsis:"A chilling vision of a totalitarian society where Big Brother watches your every move and free thought is a crime.", year:1949},
    {id:5, title:"Sapiens", author:"Yuval Noah Harari", genre:"History", rating:4.6, cover:"https://covers.openlibrary.org/b/id/10085533-L.jpg", progress:45, pages:443, synopsis:"A brief history of humankind, exploring how Homo sapiens came to dominate the Earth and shape the modern world.", year:2011},
    {id:6, title:"The Alchemist", author:"Paulo Coelho", genre:"Fiction", rating:4.5, cover:"https://covers.openlibrary.org/b/id/8906045-L.jpg", progress:80, pages:197, synopsis:"A magical story about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.", year:1988},
    {id:7, title:"Think and Grow Rich", author:"Napoleon Hill", genre:"Self-Help", rating:4.3, cover:"https://covers.openlibrary.org/b/id/7888361-L.jpg", progress:20, pages:233, synopsis:"The philosophy of achievement and success through studying the lives of more than forty millionaires.", year:1937},
    {id:8, title:"To Kill a Mockingbird", author:"Harper Lee", genre:"Classic", rating:4.8, cover:"https://covers.openlibrary.org/b/id/8231856-L.jpg", progress:0, pages:281, synopsis:"Through the eyes of Scout Finch, the story explores themes of racial inequality and moral growth in the American South.", year:1960},
];

const CATEGORIES = [
    {id:1, name:"Self-Help", icon:"🧠", color:"#EFF6FF", textColor:"#1D4ED8", count:24},
    {id:2, name:"Sci-Fi", icon:"🚀", color:"#F0FDF4", textColor:"#15803D", count:38},
    {id:3, name:"Classic", icon:"📚", color:"#FFF7ED", textColor:"#C2410C", count:52},
    {id:4, name:"Dystopia", icon:"🌑", color:"#F5F3FF", textColor:"#6D28D9", count:16},
    {id:5, name:"History", icon:"🏛️", color:"#FFF1F2", textColor:"#BE123C", count:41},
    {id:6, name:"Fiction", icon:"✨", color:"#ECFDF5", textColor:"#065F46", count:87},
    {id:7, name:"Business", icon:"💼", color:"#FFFBEB", textColor:"#92400E", count:33},
    {id:8, name:"Romance", icon:"💖", color:"#FDF2F8", textColor:"#9D174D", count:29},
    {id:9, name:"Mystery", icon:"🔍", color:"#F0F9FF", textColor:"#0369A1", count:44},
    {id:10, name:"Horror", icon:"👻", color:"#F9FAFB", textColor:"#374151", count:19},
];

const NOTIFICATIONS = [
    {id:1, read:false, title:"Buku baru tersedia!", body:"Atomic Habits – edisi revisi telah ditambahkan.", time:"2 menit lalu", icon:"📚"},
    {id:2, read:false, title:"Pengingat bacaan", body:"Kamu belum membaca hari ini. Yuk lanjutkan Dune!", time:"1 jam lalu", icon:"⏰"},
    {id:3, read:true, title:"Koleksi diperbarui", body:"3 buku baru di kategori Self-Help untukmu.", time:"Kemarin", icon:"✅"},
    {id:4, read:true, title:"Selamat! 🎉", body:"Kamu telah menyelesaikan The Great Gatsby.", time:"2 hari lalu", icon:"🎉"},
    {id:5, read:true, title:"Rekomendasi minggu ini", body:"Berdasarkan bacaanmu, coba '1984' oleh George Orwell.", time:"3 hari lalu", icon:"💡"},
];

const BOOKMARKS = [
    {id:1, bookId:1, bookTitle:"Atomic Habits", page:87, note:"Identitas vs perilaku – sistem lebih penting dari tujuan.", chapter:"Bab 2"},
    {id:2, bookId:2, bookTitle:"Dune", page:203, note:"Kutipan favorit tentang ketakutan – litani melawan ketakutan.", chapter:"Bab 8"},
    {id:3, bookId:5, bookTitle:"Sapiens", page:145, note:"Revolusi kognitif memulai sejarah manusia.", chapter:"Bab 5"},
];

const READER_TEXT = `Paul Atreides berdiri di tepi padang pasir yang membentang hingga cakrawala. Angin membawa butiran-butiran pasir halus yang menggores kulit wajahnya, mengingatkannya pada latihan swordsmanship di bawah terik matahari Caladan.

"Air adalah kehidupan di sini," kata Duncan Idaho, berdiri di sampingnya. "Bukan emas, bukan rempah-rempah, bukan kekuatan militer. Air-lah yang benar-benar berkuasa di Arrakis."

Paul mengangguk. Pelajaran itu sudah terpatri dalam benaknya sejak pertama kali Reverend Mother Gaius Helen Mohiam mengujinya dengan gom jabbar. Rasa sakit adalah ilusi. Ketakutan adalah pikiran-pembunuh. Dan di sini, di planet gurun ini, kelangsungan hidup bergantung pada pemahaman mendalam tentang ekologi—cara air mengalir, cara kehidupan bertahan, cara Fremen menyimpan setiap tetes embun di stillsuit mereka.

Seekor sandworm raksasa muncul di kejauhan, tubuhnya yang panjang berliuk-liuk di atas permukaan pasir seperti gelombang lautan. Paul mengamatinya dengan campuran kekaguman dan hormat. Inilah Shai-Hulud—dewa pasir bagi kaum Fremen, produsen spice melange yang menggerakkan seluruh imperium.

"Kita perlu belajar berjalan di pasir seperti mereka," ujar Paul pelan. "Bukan sebagai penguasa, tapi sebagai bagian dari ekosistem ini."

Duncan menatapnya dengan ekspresi yang sulit dibaca. Ada sesuatu di balik kata-kata itu—sebuah kesadaran yang melampaui usianya. Kadang Duncan bertanya-tanya apakah Paul benar-benar manusia biasa, atau sesuatu yang lebih—Kwisatz Haderach yang telah lama dinantikan oleh Bene Gesserit.`;
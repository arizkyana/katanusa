import { Expert } from './types';

// New data source as provided by the user
const expertSourceData = {
  "judul_dokumen": "Daftar Lengkap Ahli Budaya AI (24 Suku)",
  "tujuan_dokumen": "Dokumen ini berisi usulan nama-nama persona AI yang mewakili 24 suku terbesar di Indonesia, dirancang untuk memberikan sentuhan otentik dan berkarakter khas suku masing-masing. [cite: 20]",
  "daftar_ahli_ai": [
    {
      "no": 1,
      "suku": "Jawa",
      "nama_ahli_ai": "Ki Waskita",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar & Kebijaksanaan",
      "makna_ciri_khas_persona": "Ki (gelar sesepuh), Waskita (bijaksana, tajam penglihatan). Ahli filosofi dan tata krama. "
    },
    {
      "no": 2,
      "suku": "Sunda",
      "nama_ahli_ai": "Ambu Pangeusi",
      "jenis_kelamin": "Wanita",
      "konsep_khas_suku": "Panggilan Hormat & Penjaga",
      "makna_ciri_khas_persona": "Ambu (ibu/wanita dihormati), Pangeusi (penjaga, pengisi). Ahli yang teduh dan mengayomi. "
    },
    {
      "no": 3,
      "suku": "Melayu",
      "nama_ahli_ai": "Tuan Pustaka",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar & Sumber Ilmu",
      "makna_ciri_khas_persona": "Tuan (gelar hormat), Pustaka (kitab/sumber ilmu). Ahli sastra, pantun, dan sejarah. "
    },
    {
      "no": 4,
      "suku": "Batak",
      "nama_ahli_ai": "Oppung Hasian",
      "jenis_kelamin": "Tidak Jelas/Netral (Merujuk Kakek/Nenek)",
      "konsep_khas_suku": "Kekerabatan & Kasih Sayang",
      "makna_ciri_khas_persona": "Oppung (kakek/nenek), Hasian (kesayangan). Ahli silsilah ( tarombo ) dan adat perkawinan. "
    },
    {
      "no": 5,
      "suku": "Madura",
      "nama_ahli_ai": "Ra Tretan",
      "jenis_kelamin": "Tidak Jelas/Netral (Gelar Bangsawan)",
      "konsep_khas_suku": "Kebangsawanan & Persaudaraan",
      "makna_ciri_khas_persona": ""
    },
    {
      "no": 6,
      "suku": "Betawi",
      "nama_ahli_ai": "Encang Jago",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Kekerabatan & Keahlian",
      "makna_ciri_khas_persona": "Encang (paman), Jago (ahli/jawara). Pribadi yang humoris dan ahli dialek Betawi. "
    },
    {
      "no": 7,
      "suku": "Minangkabau",
      "nama_ahli_ai": "Bundo Cadiak",
      "jenis_kelamin": "Wanita",
      "konsep_khas_suku": "Matrilineal & Kecerdasan",
      "makna_ciri_khas_persona": "Bundo (ibu/wanita dihormati), Cadiak (cerdik/bijak). Ahli adat, surau , dan filosofi merantau . "
    },
    {
      "no": 8,
      "suku": "Bugis",
      "nama_ahli_ai": "Datu Lontara",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar & Aksara Kuno",
      "makna_ciri_khas_persona": "Datu (gelar bangsawan), Lontara (aksara/naskah kuno). Ahli pelayaran, navigasi, dan etika. "
    },
    {
      "no": 9,
      "suku": "Banjar",
      "nama_ahli_ai": "Dangsanak Bauntung",
      "jenis_kelamin": "Tidak Jelas/Netral (Saudara)",
      "konsep_khas_suku": "Kekerabatan & Kemakmuran",
      "makna_ciri_khas_persona": "Dangsanak (saudara), Bauntung (beruntung). Ahli pasar terapung dan ritual keagamaan. "
    },
    {
      "no": 10,
      "suku": "Bali",
      "nama_ahli_ai": "Jero Suara",
      "jenis_kelamin": "Tidak Jelas/Netral (Gelar Penghormatan)",
      "konsep_khas_suku": "Penghormatan & Pesan Jelas",
      "makna_ciri_khas_persona": "Jero (gelar penghormatan), Suara (pesan, ujaran). Ahli Tri Hita Karana dan ritual Hindu Bali. "
    },
    {
      "no": 11,
      "suku": "Aceh",
      "nama_ahli_ai": "Teuku Hikayat",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar & Kisah Epos",
      "makna_ciri_khas_persona": "Teuku (gelar kebangsawanan), Hikayat (kisah/legenda). Ahli sejarah heroik dan Syariat Islam. "
    },
    {
      "no": 12,
      "suku": "Dayak",
      "nama_ahli_ai": "Panglima Borneo",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Kepemimpinan & Wilayah",
      "makna_ciri_khas_persona": "Panglima (pemimpin), Borneo (Kalimantan). Ahli alam, obat tradisional, dan seni ukir. "
    },
    {
      "no": 13,
      "suku": "Sasak",
      "nama_ahli_ai": "Inaq Sasak",
      "jenis_kelamin": "Wanita",
      "konsep_khas_suku": "Panggilan Ibu & Identitas",
      "makna_ciri_khas_persona": "Inaq (panggilan ibu), Sasak (identitas suku). Ahli tenun, tradisi pernikahan, dan Gunung Rinjani. "
    },
    {
      "no": 14,
      "suku": "Tionghoa",
      "nama_ahli_ai": "Kongco Kesenian",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar Leluhur & Seni",
      "makna_ciri_khas_persona": "Kongco (panggilan kakek/leluhur), Kesenian (seni/budaya). Ahli perpaduan budaya (akulturasi) dan kuliner. "
    },
    {
      "no": 15,
      "suku": "Makassar",
      "nama_ahli_ai": "Karaeng Pa'bale",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar Raja & Pelaut",
      "makna_ciri_khas_persona": "Karaeng (gelar Raja/pemimpin), Pa'bale (yang berlayar). Ahli maritim, pelabuhan, dan perahu Phinisi. "
    },
    {
      "no": 16,
      "suku": "Cirebon",
      "nama_ahli_ai": "Ki Dalang",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar & Seni Pertunjukan",
      "makna_ciri_khas_persona": "Ki (gelar sesepuh), Dalang (pemain wayang). Ahli wayang, tari Topeng, dan percampuran budaya Jawa-Sunda. "
    },
    {
      "no": 17,
      "suku": "Lampung",
      "nama_ahli_ai": "Penyimbang Sai",
      "jenis_kelamin": "Tidak Jelas/Netral (Gelar Adat)",
      "konsep_khas_suku": "Gelar Adat & Sifat",
      "makna_ciri_khas_persona": "Penyimbang (gelar adat tertinggi), Sai (satu/utuh). Ahli sistem Penyimbang dan Tapis Lampung. "
    },
    {
      "no": 18,
      "suku": "Gorontalo",
      "nama_ahli_ai": "Opu Motololo",
      "jenis_kelamin": "Tidak Jelas/Netral (Panggilan Hormat)",
      "konsep_khas_suku": "Panggilan Hormat & Kesetiaan",
      "makna_ciri_khas_persona": "Opu (panggilan hormat), Motololo (setia, konsisten). Ahli adat pernikahan dan filosofi Adat Bersendikan Syara . "
    },
    {
      "no": 19,
      "suku": "Minahasa",
      "nama_ahli_ai": "Tonaas Waruga",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar Adat & Warisan",
      "makna_ciri_khas_persona": "Tonaas (pemimpin/pembimbing adat), Waruga (kuburan batu). Ahli kuliner pedas, tari Kabasaran, dan peninggalan. "
    },
    {
      "no": 20,
      "suku": "Nias",
      "nama_ahli_ai": "Si Ulu Fa'ulu",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar & Pemimpin Terbaik",
      "makna_ciri_khas_persona": "Si Ulu (pemimpin), Fa'ulu (terbaik/tertinggi). Ahli seni ukir, Hombo Batu , dan sistem kasta tradisional. "
    },
    {
      "no": 21,
      "suku": "Buton",
      "nama_ahli_ai": "Lakina Kamali",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar Raja & Istana",
      "makna_ciri_khas_persona": "Lakina (Raja/Pemimpin), Kamali (Istana). Ahli sejarah Kesultanan Buton dan benteng pertahanan. "
    },
    {
      "no": 22,
      "suku": "Atoni",
      "nama_ahli_ai": "Nai Feto",
      "jenis_kelamin": "Wanita",
      "konsep_khas_suku": "Panggilan Perempuan/Ibu",
      "makna_ciri_khas_persona": "Nai (panggilan ibu/perempuan), Feto (perempuan/wanita). Ahli tenun ikat dan tradisi menjaga lumbung pangan. "
    },
    {
      "no": 23,
      "suku": "Toraja",
      "nama_ahli_ai": "Pong Banne",
      "jenis_kelamin": "Tidak Jelas/Netral (Gelar Kehormatan)",
      "konsep_khas_suku": "Panggilan & Jiwa/Roh",
      "makna_ciri_khas_persona": "Pong (gelar kehormatan), Banne (jiwa/roh). Ahli upacara kematian ( Rambu Solo' ) dan filosofi arsitektur Tongkonan. "
    },
    {
      "no": 24,
      "suku": "Kaili",
      "nama_ahli_ai": "Magau Vunja",
      "jenis_kelamin": "Pria",
      "konsep_khas_suku": "Gelar Raja & Tanah/Asal",
      "makna_ciri_khas_persona": "Magau (Raja/pemimpin), Vunja (tanah/tempat asal). Ahli bahasa Leddo dan seni Tari Lego-lego . "
    }
  ]
};

// New avatar URLs from user, to be repeated across all experts.
const maleAvatar1 = 'https://i.ibb.co/6WkC8Jb/javanese-man.png';
const femaleAvatar1 = 'https://i.ibb.co/3cq2V2z/sundanese-woman.png';
const maleAvatar2 = 'https://i.ibb.co/2K4tTq4/malay-man.png';
const femaleAvatar2 = 'https://i.ibb.co/nMSJzJt/minang-woman.png';


// Previous expert data to preserve IDs, avatars, and specialties for quality.
const legacyExpertData: Pick<Expert, 'id' | 'name' | 'avatarUrl' | 'specialties'>[] = [
  {
    id: 'ki-waskita',
    name: 'Ki Waskita',
    avatarUrl: maleAvatar1,
    specialties: ['Filosofi Jawa', 'Tata Krama', 'Sastra Kuno', 'Kebijaksanaan'],
  },
  {
    id: 'ambu-pangeusi',
    name: 'Ambu Pangeusi',
    avatarUrl: femaleAvatar1,
    specialties: ['Adat Sunda', 'Kearifan Lokal', 'Sastra Lisan', 'Mengayomi'],
  },
  {
    id: 'tuan-pustaka',
    name: 'Tuan Pustaka',
    avatarUrl: maleAvatar2,
    specialties: ['Sastra Melayu', 'Pantun', 'Sejarah Maritim', 'Adab'],
  },
  {
    id: 'oppung-hasian',
    name: 'Oppung Hasian',
    avatarUrl: femaleAvatar1,
    specialties: ['Tarombo (Silsilah)', 'Adat Perkawinan', 'Falsafah Batak', 'Kekerabatan'],
  },
  {
    id: 'ra-tretan',
    name: 'Ra Tretan',
    avatarUrl: maleAvatar1,
    specialties: ['Etos Kerja', 'Tradisi Carok', 'Budaya Pesisir', 'Persaudaraan'],
  },
  {
    id: 'encang-jago',
    name: 'Encang Jago',
    avatarUrl: maleAvatar2,
    specialties: ['Dialek Betawi', 'Lenong', 'Ondel-Ondel', 'Humor Betawi'],
  },
  {
    id: 'bundo-cadiak',
    name: 'Bundo Cadiak',
    avatarUrl: femaleAvatar2,
    specialties: ['Adat Matrilineal', 'Filosofi Merantau', 'Pepatah-Petitih', 'Kuliner Rendang'],
  },
  {
    id: 'datu-lontara',
    name: 'Datu Lontara',
    avatarUrl: maleAvatar1,
    specialties: ['Aksara Lontara', 'Siri Na Pacce', 'Pelayaran', 'Navigasi Tradisional'],
  },
  {
    id: 'dangsanak-bauntung',
    name: 'Dangsanak Bauntung',
    avatarUrl: maleAvatar2,
    specialties: ['Pasar Terapung', 'Arsitektur Banjar', 'Ritual Keagamaan', 'Budaya Sungai'],
  },
  {
    id: 'jero-suara',
    name: 'Jero Suara',
    avatarUrl: femaleAvatar2,
    specialties: ['Tri Hita Karana', 'Ritual Hindu Bali', 'Seni Ukir', 'Subak'],
  },
  {
    id: 'teuku-hikayat',
    name: 'Teuku Hikayat',
    avatarUrl: maleAvatar1,
    specialties: ['Hikayat Aceh', 'Sejarah Heroik', 'Syariat Islam', 'Tari Saman'],
  },
  {
    id: 'panglima-borneo',
    name: 'Panglima Borneo',
    avatarUrl: maleAvatar2,
    specialties: ['Alam & Hutan', 'Obat Tradisional', 'Seni Ukir Dayak', 'Hukum Adat'],
  },
  {
    id: 'inaq-sasak',
    name: 'Inaq Sasak',
    avatarUrl: femaleAvatar1,
    specialties: ['Tenun Songket', 'Tradisi Merariq', 'Legenda Rinjani', 'Kuliner Ayam Taliwang'],
  },
  {
    id: 'kongco-kesenian',
    name: 'Kongco Kesenian',
    avatarUrl: maleAvatar1,
    specialties: ['Akulturasi Budaya', 'Kuliner Peranakan', 'Tradisi Imlek', 'Barongsai'],
  },
  {
    id: 'karaeng-pabale',
    name: 'Karaeng Pa\'bale',
    avatarUrl: maleAvatar2,
    specialties: ['Maritim', 'Perahu Phinisi', 'Budaya Pelabuhan', 'Sejarah Gowa-Tallo'],
  },
  {
    id: 'ki-dalang-cirebon',
    name: 'Ki Dalang Cirebon',
    avatarUrl: maleAvatar1,
    specialties: ['Wayang Cirebon', 'Tari Topeng', 'Batik Megamendung', 'Sintren'],
  },
  {
    id: 'penyimbang-sai',
    name: 'Penyimbang Sai',
    avatarUrl: maleAvatar2,
    specialties: ['Sistem Penyimbang', 'Kain Tapis', 'Aksara Kaganga', 'Piil Pesenggiri'],
  },
  {
    id: 'opu-motololo',
    name: 'Opu Motololo',
    avatarUrl: femaleAvatar2,
    specialties: ['Adat Pernikahan', 'Filosofi Adat', 'Karawo', 'Hukum Islam Lokal'],
  },
  {
    id: 'tonaas-waruga',
    name: 'Tonaas Waruga',
    avatarUrl: maleAvatar1,
    specialties: ['Waruga', 'Tari Kabasaran', 'Kuliner Minahasa', 'Mapalus'],
  },
  {
    id: 'si-ulu-faulu',
    name: 'Si Ulu Fa\'ulu',
    avatarUrl: maleAvatar2,
    specialties: ['Hombo Batu', 'Seni Ukir Nias', 'Sistem Kasta', 'Arsitektur Omo Hada'],
  },
  {
    id: 'lakina-kamali',
    name: 'Lakina Kamali',
    avatarUrl: maleAvatar1,
    specialties: ['Kesultanan Buton', 'Benteng Keraton', 'Martabat Tujuh', 'Sejarah Maritim'],
  },
  {
    id: 'nai-feto',
    name: 'Nai Feto',
    avatarUrl: femaleAvatar1,
    specialties: ['Tenun Ikat Timor', 'Lumbung Pangan', 'Tradisi Lisan', 'Arsitektur Ume Kbubu'],
  },
  {
    id: 'pong-banne',
    name: 'Pong Banne',
    avatarUrl: maleAvatar2,
    specialties: ['Rambu Solo\'', 'Arsitektur Tongkonan', 'Seni Ukir Toraja', 'Filosofi Aluk Todolo'],
  },
  {
    id: 'magau-vunja',
    name: 'Magau Vunja',
    avatarUrl: maleAvatar1,
    specialties: ['Bahasa Leddo', 'Tari Lego-lego', 'Upacara Adat', 'Musik Lalove'],
  }
];

const legacyDataMap = new Map<string, Pick<Expert, 'id' | 'avatarUrl' | 'specialties'>>();
legacyExpertData.forEach(expert => {
    legacyDataMap.set(expert.name, {
        id: expert.id,
        avatarUrl: expert.avatarUrl,
        specialties: expert.specialties,
    });
});

// The single source of truth for experts, generated from the new data structure.
export const EXPERTS: Expert[] = expertSourceData.daftar_ahli_ai.map(sourceExpert => {
    // Handle special case for 'Ki Dalang' from Cirebon to match legacy data.
    let mappingName = sourceExpert.nama_ahli_ai;
    if (sourceExpert.nama_ahli_ai === 'Ki Dalang' && sourceExpert.suku === 'Cirebon') {
        mappingName = 'Ki Dalang Cirebon';
    }

    const legacyData = legacyDataMap.get(mappingName);

    // Fallback bio for Ra Tretan, whose new bio data is empty.
    const raTretanBio = "Ra Tretan merepresentasikan kebangsawanan dan persaudaraan ('Tretan Dhibi'). Ia adalah ahli dalam etos kerja, tradisi Carok, serta budaya pesisir yang kuat dan tegas.";

    const getGender = (genderString: string): 'Pria' | 'Wanita' | 'Netral' => {
        if (genderString === 'Pria') return 'Pria';
        if (genderString === 'Wanita') return 'Wanita';
        return 'Netral';
    };

    return {
        id: legacyData?.id || sourceExpert.nama_ahli_ai.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-'),
        name: sourceExpert.nama_ahli_ai,
        title: `Pakar Budaya ${sourceExpert.suku}`,
        experience: sourceExpert.konsep_khas_suku.trim(),
        bio: sourceExpert.makna_ciri_khas_persona.trim() || (sourceExpert.nama_ahli_ai === 'Ra Tretan' ? raTretanBio : ''),
        avatarUrl: legacyData?.avatarUrl || 'https://via.placeholder.com/128',
        specialties: legacyData?.specialties || [],
        gender: getGender(sourceExpert.jenis_kelamin),
    };
});
/**
 * 🏡 MyFamily Web App - Data Store & LocalStorage Manager
 * Oila a'zolari (Ahil qozoq oilasi):
 * - Dadam: Umirbek Anarboyev 👨
 * - Onam: Maxbuba Anarboyeva 👩
 * - Akam: Sanjarbek Anarboyev 🧑
 * - Men: Asqarbek Aytboyev 🙋
 */

const DEFAULT_FAMILY_MEMBERS = [
  {
    id: 'father',
    name: 'Umirbek Anarboyev',
    role: 'Dadam 👨',
    subRole: 'Oila tayanchi, donishmand oqsoqol va xonadon boshlig‘i',
    birthDate: '1980-12-11',
    age: 46,
    profession: 'Muhandis & Xonadon suyanchi',
    hobbies: ['Dombra tinglash', 'Shaxmat', 'Ot sporti (Ko‘pkari/Bayge)', 'Bog‘dorchilik', 'Tarixiy dostonlar'],
    quote: 'Birlik bar jerde — tirlik bar! Mehnat va halollik — har qanday yutuqning eng mustahkam poydevoridir.',
    image: 'assets/images/father_portrait.jpg',
    favoriteDish: 'Qazili haqiqiy qozoqcha beshbarmoq (et), tandir go‘shti va qimiz',
    character: 'Vazmin, adolatparvar, bag‘rikeng, qozoq milliy an’analariga sodiq va har doim mehribon ota.',
    phone: '+998 90 123-45-67',
    telegram: '@umirbek_anarboyev'
  },
  {
    id: 'mother',
    name: 'Maxbuba Anarboyeva',
    role: 'Onam 👩',
    subRole: 'Xonadonimiz ko‘rki, mehr va oqibat maskani',
    birthDate: '1982-11-03',
    age: 44,
    profession: 'Pedagog & Dizayner',
    hobbies: ['Qozoq milliy pazandachiligi', 'Quroqchilik va tikuvchilik', 'Gulchilik', 'She’riyat'],
    quote: 'Oila — qalbimiz orom topadigan, har doim mehr yog‘ilib turadigan muqaddas o‘choqdir.',
    image: 'assets/images/mother_portrait.jpg',
    favoriteDish: 'Beshbarmoq, tillarang issiq baursaq, qazi-qarta va qurt',
    character: 'Ziyoli, nozikta’b, mehmondo‘st, sabrli va butun oilaning baxt tayanchi.',
    phone: '+998 90 234-56-78',
    telegram: '@maxbuba_anarboyeva'
  },
  {
    id: 'brother',
    name: 'Sanjarbek Anarboyev',
    role: 'Akam 🧑',
    subRole: 'Katta o‘g‘il, maslahatgo‘y va yetakchi akam',
    birthDate: '2006-01-08',
    age: 20,
    profession: 'Software Engineer & DevOps (IT Dasturchi)',
    hobbies: ['Dasturlash (IT)', 'Dombra', 'Futbol', 'Sayohatlar', 'Avtomobillar'],
    quote: 'Talap, miynet, tereñ oy... Orzularga tinimsiz mehnat va zamonaviy bilim bilan yetiladi!',
    image: 'assets/images/brother_portrait.jpg',
    favoriteDish: 'Qo‘y go‘shtli beshbarmoq, quyurdaq va yangi pishirilgan baursaq',
    character: 'Intiluvchan, do‘stona, mard, yuksak mas’uliyatli va zamonaviy yosh muhandis.',
    phone: '+998 90 345-67-89',
    telegram: '@sanjarbek_dev'
  },
  {
    id: 'me',
    name: 'Asqarbek Aytboyev',
    role: 'Men 🙋',
    subRole: 'Kichik o‘g‘il, ijodkor va sayt muallifi',
    birthDate: '2012-05-08',
    age: 14,
    profession: 'Maktab o‘quvchisi & Yosh dasturchi',
    hobbies: ['Fotografiya', 'Veb-dizayn', 'Dombra', 'Suzish', 'Ingliz tili'],
    quote: 'Bizning ahil qozoq xonadonimiz — hayotimdagi eng ulug‘ boylik va bitmas-tuganmas ilhom manbaidir.',
    image: 'assets/images/me_portrait.jpg',
    favoriteDish: 'Issiq baursaqlar, qovurdoq (quyurdaq) va shirin desertlar',
    character: 'Ijodkor, quvnoq, yangilikka chanqoq, oilaning erka va suyukli farzandi.',
    phone: '+998 90 456-78-90',
    telegram: '@asqarbek_aytboyev'
  }
];

const DEFAULT_GALLERY = [
  {
    id: 1,
    title: 'Registon maydonidagi unutilmas kun',
    category: 'travel',
    image: 'assets/images/gallery_travel.jpg',
    date: '2024-08-14',
    location: 'Samarqand shahri',
    likes: 42,
    description: 'Qadimiy moviy gumbazlar fonida Umirbek dadam, Maxbuba onam, Sanjarbek akam va Asqarbek birga.'
  },
  {
    id: 2,
    title: 'Oilaviy bayram va shirin tilaklar',
    category: 'celebration',
    image: 'assets/images/gallery_birthday.jpg',
    date: '2024-12-11',
    location: 'Shinam xonadonimiz',
    likes: 49,
    description: 'Umirbek dadamizning tavallud ayyomi sharafiga dasturxon atrofida yig‘ilgan eng baxtli lahzalar.'
  },
  {
    id: 3,
    title: 'Chimyondagi tog‘ piknigi va salqin shabada',
    category: 'travel',
    image: 'assets/images/gallery_picnic.jpg',
    date: '2024-06-22',
    location: 'Chimyon tog‘lari, Bo‘stonliq',
    likes: 56,
    description: 'Zangori tog‘ daryosi bo‘yida, toza havo va tabiat quchog‘ida o‘tkazilgan ajoyib yakshanba.'
  },
  {
    id: 4,
    title: 'Issiq baursaq va kechki oilaviy choy dasturxoni',
    category: 'daily',
    image: 'assets/images/gallery_dinner.jpg',
    date: '2024-10-05',
    location: 'Shinam uyimiz',
    likes: 47,
    description: 'Maxbuba onamiz tayyorlagan tillarang baursaqlar, shirin taomlar va samovar choyi atrofida kechgan samimiy suhbat.'
  },
  {
    id: 5,
    title: 'Bizning sevimli oilamiz jamuljam',
    category: 'family',
    image: 'assets/images/hero_family_cover.jpg',
    date: '2025-01-01',
    location: 'Yangi yil ostonasida',
    likes: 95,
    description: 'Umirbek ota, Maxbuba ona, Sanjarbek va Asqarbek — birdamlik, mehr va qozoqona mehmondo‘stlik maskani.'
  }
];

const DEFAULT_MEMORIES = [
  {
    id: 1,
    title: 'Samarqand bo‘ylab oilaviy sayohatimiz',
    date: '2024-08-14',
    author: 'Sanjarbek (Akam)',
    location: 'Samarqand shahri',
    tag: 'Sayohat',
    image: 'assets/images/gallery_travel.jpg',
    text: 'Samarqandga tezyurar poyezdda jo‘nadik. Registon maydonida quyosh botishi, Tillakori madrasasining tilla naqshlari va kechki chiroqlar ostida sayr qilish hammamizda unutilmas taassurot qoldirdi. Umirbek dadam har bir tarixiy joy haqida qiziqarli rivoyatlar aytib berdilar, Maxbuba onam milliy liboslar jozibasiga qoyil qoldilar, Asqarbek esa har bir lahzani kameraga muhrladi.',
    likes: 31
  },
  {
    id: 2,
    title: 'Umirbek dadamizning tavallud shodiyonasi',
    date: '2024-12-11',
    author: 'Maxbuba (Onam)',
    location: 'Xonadonimizda',
    tag: 'Tug‘ilgan kun',
    image: 'assets/images/gallery_birthday.jpg',
    text: 'Dadamiz uchun Sanjarbek va Asqarbek bilan birgalikda kutilmagan syurpriz tayyorladik. Asqarbek chiroyli oilaviy fotokitob yaratdi, Sanjarbek esa esdalik video-tabrik hozirladi. Mehribon Umirbek akamizning xursandchilikdan ko‘zlari quvonganini ko‘rish biz uchun eng katta baxt bo‘ldi.',
    likes: 38
  },
  {
    id: 3,
    title: 'Chimyondagi tog‘ sayri va dombra ohanglari',
    date: '2024-06-22',
    author: 'Asqarbek (Men)',
    location: 'Chimyon, Charvoq',
    tag: 'Tabiat',
    image: 'assets/images/gallery_picnic.jpg',
    text: 'Yoz chillasida ertalab barvaqt tog‘ bag‘riga yo‘l oldik. Sharqiragan muzdek tog‘ daryosi bo‘yiga joylashib, onam pishirgan issiq baursaqlar va shirin mevalarni tanovul qildik. Sanjarbek akam bilan dombra chaldik, Umirbek dadam esa yoshliklaridagi qiziqarli rivoyatlarni aytib berdilar. Kechki payt gulxan atrofida butun oilamiz birgalikda qo‘shiq kuyladi.',
    likes: 35
  },
  {
    id: 4,
    title: 'Yangi yil oqshomidagi shirin orzular',
    date: '2024-12-31',
    author: 'Umirbek (Dadam)',
    location: 'Shinam xonadonimiz',
    tag: 'Bayram',
    image: 'assets/images/hero_family_cover.jpg',
    text: 'Soat millari 12 ga yaqinlashganda butun oilamiz dasturxon atrofida jam bo‘ldi. Yil davomida erishgan barcha yutuqlarimiz: Sanjarbekning IT sohasidagi yangi marralari, Asqarbekning o‘qishdagi a’lo natijalari, Maxbuba xonimning mehnati va xonadonimiz fayzi uchun shukronalar aytdik. Yangi yil barchamizga yana-da ko‘proq qut-baraka olib kelsin!',
    likes: 46
  }
];

const DEFAULT_CALENDAR_EVENTS = [
  {
    id: 1,
    title: 'Umirbek dadamning tavallud kuni 🎂',
    date: '2026-12-11',
    category: 'birthday',
    member: 'Umirbek Anarboyev',
    description: 'Dadamizning qutlug‘ tavallud ayyomi! Maxsus syurpriz, sovg‘alar va katta oilaviy dasturxon.'
  },
  {
    id: 2,
    title: 'Maxbuba onamning tavallud kuni 💐',
    date: '2026-11-03',
    category: 'birthday',
    member: 'Maxbuba Anarboyeva',
    description: 'Mehribon onajonimizning tavallud kunlari. Yuksak ehtirom, yangi guldasta va samimiy tilaklar.'
  },
  {
    id: 3,
    title: 'Sanjarbek akamning tavallud kuni 🎁',
    date: '2026-01-08',
    category: 'birthday',
    member: 'Sanjarbek Anarboyev',
    description: 'Sanjarbekning tavallud kuni. Oila va do‘stlar davrasida quvnoq shodiyona.'
  },
  {
    id: 4,
    title: 'Asqarbekning tavallud kuni 🎈',
    date: '2026-05-08',
    category: 'birthday',
    member: 'Asqarbek Aytboyev',
    description: 'Mening tavallud kunim! Sayt uchun yangi fotolar va quvonchli lahzalar.'
  },
  {
    id: 5,
    title: 'Ota-onamizning to‘y yubileyi 💍',
    date: '2026-10-18',
    category: 'anniversary',
    member: 'Umirbek ota & Maxbuba ona',
    description: 'Ota-onamizning qutlug‘ to‘y yubileylari! Butun xonadonimiz uchun eng muqaddas sana.'
  },
  {
    id: 6,
    title: 'Qutlug‘ Nauryz meiramy bayrami 🌱',
    date: '2026-03-21',
    category: 'celebration',
    member: 'Barchamiz',
    description: 'Bahoriy yangilanish bayrami — nauryz-koje, issiq baursaqlar, qimiz va qozoqona milliy xalq sayllari.'
  },
  {
    id: 7,
    title: 'Olmaota va Ostonaga (Qozog‘iston) oilaviy sayohat 🏔️',
    date: '2026-07-25',
    category: 'travel',
    member: 'Barchamiz',
    description: 'Medeu, Chimbuloq, Katta Olmaota ko‘li va go‘zal go‘shalarga unutilmas oilaviy ta’til.'
  },
  {
    id: 8,
    title: 'Haftalik oilaviy beshbarmoq dasturxoni 🍲',
    date: '2026-10-25',
    category: 'dinner',
    member: 'Barchamiz',
    description: 'An’anaviy yakshanba kungi qazili haqiqiy qozoqcha beshbarmoq va samimiy oilaviy choy suhbati.'
  }
];

const DEFAULT_GIFTS = [
  {
    id: 1,
    recipientId: 'mother',
    recipientName: 'Maxbuba Anarboyeva (Onam 👩)',
    senderName: 'Asqarbek (Kichik o‘g‘il)',
    giftIcon: '💐',
    giftTitle: 'Nafis gul dastalari',
    message: 'Mehribon onajonim, yaqinlashayotgan tavallud ayyomingiz qutlug‘ bo‘lsin! Siz bizning baxtimizsiz!',
    date: '2026-10-26'
  },
  {
    id: 2,
    recipientId: 'father',
    recipientName: 'Umirbek Anarboyev (Dadam 👨)',
    senderName: 'Sanjarbek & Asqarbek',
    giftIcon: '🪕',
    giftTitle: 'Milliy naqshli dombra',
    message: 'Qadrdon dadajon, sog‘-omon bo‘ling! Xonadonimizning mustahkam tayanchi va donishmandi bo‘lib yuring!',
    date: '2026-10-25'
  }
];

class FamilyStore {
  constructor() {
    this.STORAGE_KEY = 'MY_FAMILY_STORE_DATA_V7';
    this.AUTH_KEY = 'MY_FAMILY_AUTH_SESSION_V3';
    this.THEME_KEY = 'MY_FAMILY_THEME_V3';
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) {
      this.data = {
        members: DEFAULT_FAMILY_MEMBERS,
        gallery: DEFAULT_GALLERY,
        memories: DEFAULT_MEMORIES,
        events: DEFAULT_CALENDAR_EVENTS,
        gifts: DEFAULT_GIFTS,
        siteTitle: 'MyFamily',
        motto: 'Otan — otbasınan bastaladı (Ahil va mehmondo‘st qozoq oilasi)'
      };
      this.save();
    } else {
      try {
        this.data = JSON.parse(saved);
        if (!this.data.gifts) {
          this.data.gifts = JSON.parse(JSON.stringify(DEFAULT_GIFTS));
          this.save();
        }
      } catch (e) {
        console.error('Error parsing localStorage, resetting to defaults:', e);
        this.resetDefaults();
      }
    }
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  resetDefaults() {
    this.data = {
      members: JSON.parse(JSON.stringify(DEFAULT_FAMILY_MEMBERS)),
      gallery: JSON.parse(JSON.stringify(DEFAULT_GALLERY)),
      memories: JSON.parse(JSON.stringify(DEFAULT_MEMORIES)),
      events: JSON.parse(JSON.stringify(DEFAULT_CALENDAR_EVENTS)),
      gifts: JSON.parse(JSON.stringify(DEFAULT_GIFTS)),
      siteTitle: 'MyFamily',
      motto: 'Otan — otbasınan bastaladı (Ahil va mehmondo‘st qozoq oilasi)'
    };
    this.save();
  }

  // --- Auth methods ---
  isAuthenticated() {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  login(password) {
    if (password === 'oilam2026' || password === 'admin') {
      localStorage.setItem(this.AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
  }

  // --- Family Members CRUD ---
  getMembers() {
    return this.data.members;
  }

  getMember(id) {
    return this.data.members.find(m => m.id === id);
  }

  updateMember(id, updatedFields) {
    const index = this.data.members.findIndex(m => m.id === id);
    if (index !== -1) {
      this.data.members[index] = { ...this.data.members[index], ...updatedFields };
      this.save();
      return this.data.members[index];
    }
    return null;
  }

  // --- Gallery CRUD ---
  getGallery() {
    return this.data.gallery;
  }

  addGalleryItem(item) {
    const newItem = {
      id: Date.now(),
      likes: 0,
      ...item
    };
    this.data.gallery.unshift(newItem);
    this.save();
    return newItem;
  }

  deleteGalleryItem(id) {
    this.data.gallery = this.data.gallery.filter(item => item.id !== id);
    this.save();
  }

  toggleLikeGallery(id) {
    const item = this.data.gallery.find(i => i.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      this.save();
      return item.likes;
    }
    return 0;
  }

  // --- Memories CRUD ---
  getMemories() {
    return this.data.memories;
  }

  addMemory(memory) {
    const newMemory = {
      id: Date.now(),
      likes: 0,
      ...memory
    };
    this.data.memories.unshift(newMemory);
    this.save();
    return newMemory;
  }

  updateMemory(id, updatedFields) {
    const index = this.data.memories.findIndex(m => m.id === id);
    if (index !== -1) {
      this.data.memories[index] = { ...this.data.memories[index], ...updatedFields };
      this.save();
      return this.data.memories[index];
    }
    return null;
  }

  deleteMemory(id) {
    this.data.memories = this.data.memories.filter(m => m.id !== id);
    this.save();
  }

  toggleLikeMemory(id) {
    const item = this.data.memories.find(m => m.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      this.save();
      return item.likes;
    }
    return 0;
  }

  // --- Calendar Events CRUD ---
  getEvents() {
    return this.data.events;
  }

  addEvent(event) {
    const newEvent = {
      id: Date.now(),
      ...event
    };
    this.data.events.push(newEvent);
    // Sort by date
    this.data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
    this.save();
    return newEvent;
  }

  deleteEvent(id) {
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.save();
  }

  // --- Gifts & Birthday Wishes CRUD ---
  getGifts() {
    return this.data.gifts || [];
  }

  addGift(gift) {
    if (!this.data.gifts) this.data.gifts = [];
    const newGift = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...gift
    };
    this.data.gifts.unshift(newGift);
    this.save();
    return newGift;
  }

  deleteGift(id) {
    if (!this.data.gifts) return;
    this.data.gifts = this.data.gifts.filter(g => g.id !== id);
    this.save();
  }

  // --- Theme preference ---
  getTheme() {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  setTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
  }
}

// Global instance
window.familyStore = new FamilyStore();

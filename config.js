/* =============================================================
   IESTATĪJUMI — šeit ir viss, ko tev vajadzēs mainīt.
   (SETTINGS — everything you need to edit is in this one file.)
   ============================================================= */

const CONFIG = {
  // 1) PAROLE — paroli, ar ko aizsargāt lapu.
  //    (The password guests must type to enter.)
  password: "MAINI-MANI",

  // 2) SUPABASE — bezmaksas datu bāze, kas glabā rezervācijas.
  //    Atrodams: Supabase projekts → Project Settings → API.
  //    (Free database that stores who reserved what.
  //     Find these in your Supabase project → Project Settings → API.)
  supabaseUrl: "https://AIZPILDI-MANI.supabase.co",
  supabaseAnonKey: "AIZPILDI-MANI-anon-public-key",

  // 3) TEKSTI — virsraksti lapā. Droši maini! :)
  texts: {
    // Mazās meitenītes vārds (ja vēl nav vārda, atstāj kā "mūsu meitenīte")
    babyName: "mūsu meitenīte",
    eventTitle: "Mazuļa svētki",
    subtitle: "Mēs gaidām meitenīti! 🎀",
    intro:
      "Esam sagatavojuši nelielu vēlmju sarakstu. Ja vēlies mūs iepriecināt ar dāvanu, " +
      "izvēlies kādu no sarakstā un rezervē to, lai citi viesi zinātu, ka tā jau ir izvēlēta. " +
      "Bet vissvarīgākā dāvana mums esi tu — paldies, ka esi kopā ar mums! 💕",
  },

  // 4) DĀVANAS — vēlmju saraksts. Pievieno, dzēs vai maini brīvi.
  //    'id'   : unikāls (nemaini pēc tam, kad cilvēki sākuši rezervēt)
  //    'emoji': mazā ikoniņa kartītē
  //    'name' : dāvanas nosaukums
  //    'note' : papildu apraksts (izmērs, krāsa, saite utt.) — var atstāt tukšu
  //    'link' : saite uz veikalu (neobligāts) — atstāj "" ja nav
  gifts: [
    { id: "g01", emoji: "🧸", name: "Mīkstā rotaļlieta", note: "Maza, mīļojama lācēna draudzene", link: "" },
    { id: "g02", emoji: "👶", name: "Bodiji (56–62 izm.)", note: "Mīkstā kokvilna, rozā vai krēmkrāsā", link: "" },
    { id: "g03", emoji: "🛁", name: "Vanniņa", note: "Ar termometru ūdens temperatūrai", link: "" },
    { id: "g04", emoji: "🍼", name: "Pudelīšu komplekts", note: "Stikla, dažādi izmēri", link: "" },
    { id: "g05", emoji: "🧺", name: "Mazgāšanas grozs", note: "Veļas glabāšanai", link: "" },
    { id: "g06", emoji: "📚", name: "Pasaku grāmatas", note: "Bērnu grāmatiņas pirms miega", link: "" },
    { id: "g07", emoji: "🌸", name: "Gultas veļa", note: "Bērnu gultiņai, rozā toņos", link: "" },
    { id: "g08", emoji: "🧦", name: "Zeķītes un cepurītes", note: "Silti komplekti (0–6 mēn.)", link: "" },
    { id: "g09", emoji: "🚼", name: "Autiņbiksīšu komplekts", note: "1. un 2. izmērs", link: "" },
    { id: "g10", emoji: "🎠", name: "Karuselis gultiņai", note: "Ar maigu mūziku", link: "" },
    { id: "g11", emoji: "🧴", name: "Kopšanas līdzekļi", note: "Bērnu krēms, ziepes, eļļa", link: "" },
    { id: "g12", emoji: "👗", name: "Svinīga kleitiņa", note: "Īpašiem brīžiem (62–68 izm.)", link: "" },
  ],
};

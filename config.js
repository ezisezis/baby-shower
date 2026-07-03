/* =============================================================
   IESTATĪJUMI — šeit ir viss, ko tev vajadzēs mainīt.
   (SETTINGS — everything you need to edit is in this one file.)
   ============================================================= */

const CONFIG = {
  // 1) PAROLE — paroli, ar ko aizsargāt lapu.
  //    (The password guests must type to enter.)
  password: "klavini2026",

  // 2) SUPABASE — bezmaksas datu bāze, kas glabā rezervācijas.
  //    Atrodams: Supabase projekts → Project Settings → API.
  //    (Free database that stores who reserved what.
  //     Find these in your Supabase project → Project Settings → API.)
  supabaseUrl: "https://fcrllvygrghnjjfxfrlt.supabase.co",
  supabaseAnonKey: "sb_publishable_Ap2S8DubCC5Xx-fzVjplVA_xBgUm13T",

  // 3) TEKSTI — virsraksti lapā. Droši maini! :)
  texts: {
    // Mazās meitenītes vārds (ja vēl nav vārda, atstāj kā "mūsu meitenīte")
    babyName: "mūsu meitenīte",
    eventTitle: "Princeses svētki",
    subtitle: "",
    intro:
      "Esam sagatavojuši nelielu vēlmju sarakstu. Dāvana nav obligāta! " +
      "Ja tomēr vēlies mūs iepriecināt, izvēlies kaut ko no saraksta un rezervē to, " +
      "lai citi viesi zina, ka tā jau ir izvēlēta. Ja nekas no saraksta neuzrunā, " +
      "var izvēlēties arī savu variantu, kas šķiet atbilstošs.\n" +
      "Bet vissvarīgākā dāvana mums esi tu — paldies, ka esi kopā ar mums! 💕",
  },

  // 4) DĀVANAS — vēlmju saraksts. Pievieno, dzēs vai maini brīvi.
  //    'id'   : unikāls (nemaini pēc tam, kad cilvēki sākuši rezervēt)
  //    'emoji': mazā ikoniņa kartītē
  //    'name' : dāvanas nosaukums
  //    'note' : papildu apraksts (izmērs, krāsa, saite utt.) — var atstāt tukšu
  //    'link' : saite uz veikalu (neobligāts) — atstāj "" ja nav
  gifts: [
    { id: "d01", emoji: "🛁", name: "Vanniņa", note: "",
      link: "https://www.ikea.com/lv/lv/p/laettsam-zidainu-vannina-balta-krasa-tirkizzila-krasa-10591573/" },

    { id: "d02", emoji: "👕", name: "Bodiju komplekts (56. izm.)", note: "H&M · 5 gab. · der jebkurš variants",
      links: [
        { label: "1. variants →", url: "https://www2.hm.com/en_eur/productpage.0814306075.html" },
        { label: "2. variants →", url: "https://www2.hm.com/en_eur/productpage.0814306072.html" },
      ] },

    { id: "d03", emoji: "👕", name: "Bodiju komplekts (62. izm.)", note: "",
      link: "https://www.next.com.lv/lv/style/su569369/an5395" },

    { id: "d04", emoji: "🧢", name: "Cepurītes", note: "50–62 cm",
      link: "https://www.next.com.lv/lv/style/su569013/ay7912" },

    { id: "d06", emoji: "👗", name: "Komplektiņš (62. izm.)", note: "",
      link: "https://www.next.com.lv/lv/style/su741184/h44313" },

    { id: "d07", emoji: "🧦", name: "Zeķītes", note: "50–62 cm",
      link: "https://www.next.com.lv/lv/style/su368200/f19036" },

    { id: "d08", emoji: "🐻", name: "Plīša kombinezons ar ausīm (62. izm.)", note: "H&M, balts",
      link: "https://www2.hm.com/en_eur/productpage.1230866001.html" },

    { id: "d09", emoji: "🛌", name: "Guļammaiss ratiem", note: "Makaszka Alpaca",
      link: "https://www.babystore.lv/lv/product/155337/makaszka-alpaca-footmuff-art-155337-bernu-gulammaiss-konverts-ratiem" },

    { id: "d10", emoji: "🚼", name: "Autiņbiksītes", note: "Pampers Premium Care, 1. izm. · 2 iepakojumi",
      link: "https://www.ksenukai.lv/p/autinbiksites-pampers-premium-care-1-izmers-2-5-kg-72-gab/pvj0" },

    { id: "d11", emoji: "👶", name: "Philips Avent knupīši", note: "0–6 mēn.",
      link: "https://www.rdveikals.lv/products/lv/2407/898482/sort/5/filter/0_0_0_0/Avent-Ultra-Air-0-6mm-Purple-Yellow-Knup%C4%ABtis.html" },

    { id: "d12", emoji: "👶", name: "MAM knupīši", note: "0–6 mēn.",
      link: "https://www.rimi.lv/e-veikals/lv/produkti/zidainiem-un-berniem/barosanas-un-kopsanas-piederumi/knupisi-un-pudelites/silikona-knupisi-mam-original-0-6men-2gab-/p/7312497" },

    { id: "d13", emoji: "🍼", name: "Pudelīte Philips Avent (125 ml)", note: "",
      link: "https://www.1a.lv/p/bernu-pudelite-philips-avent-natural-response-air-free-vent-125-ml-0-men/j6i3" },

    { id: "d14", emoji: "🍼", name: "Pudelīte Dr Brown's (270 ml)", note: "Ar platu kakliņu",
      link: "https://www.euroaptieka.lv/p/dr-brown-s-pudelite-ar-platu-kaklinu-options-270-ml-maza-birstites-tirisanai" },

    { id: "d15", emoji: "🍼", name: "Pudelīte Dr Brown's (150 ml)", note: "Ar platu kakliņu",
      link: "https://www.euroaptieka.lv/p/dr-brown-s-pudelite-ar-platu-kaklinu-options-150-ml-maza-birstites-tirisanai" },

    { id: "d16", emoji: "🎠", name: "Piekaramā rotaļlieta ratiem", note: "Taf Toys Urban Garden",
      link: "https://www.nordbaby.com/lv/lv/rotallietas/attistosas-rotallietas/taf-toys-ratu-piekarama-rotallieta-urban-garden_129752" },

    { id: "d17", emoji: "🧸", name: "Attīstošā rotaļlieta", note: "Taf Toys Daniel",
      link: "https://www.nordbaby.com/lv/lv/rotallietas/attistosas-rotallietas/taf-toys-attistosa-rotallieta-daniel_135271" },

    { id: "d18", emoji: "🎾", name: "Manas pirmās bumbiņas", note: "Gerardo's Toys · 4 gab.",
      link: "https://www.nordbaby.com/lv/lv/rotallietas/attistosas-rotallietas/gerardos-toys-manas-pirmas-bumbinas-4-gab_130089" },

    { id: "d19", emoji: "🪀", name: "Spēļmantiņa", note: "",
      link: "https://littleandcute.lv/products/uid-4976010" },

    { id: "d21", emoji: "🐰", name: "Moonie zaķis", note: "Miega draugs ar naktslampiņu",
      link: "https://www.9months.lv/moonie-bunny-cream" },

    { id: "d22", emoji: "☁️", name: "Muslīna dvielīši", note: "Little Goose",
      link: "https://www.rocketbaby.lv/products/muslina-kokvilnas-autini-muslin-swaddles-little-goose-little-dutch" },

    { id: "d23", emoji: "☁️", name: "Muslīna autiņi", note: "Meyco · 70×70 cm, 3 gab.",
      link: "https://www.9months.lv/muslina-autins-70x70-3-gab-meyco-baby-21" },

    { id: "d24", emoji: "🧩", name: "Aktivitāšu paklājs", note: "Little Dutch, okeāns (rozā)",
      link: "https://ecoemi.lv/produkti/rotallietas/little-dutch/5/2699/aktivitasu-paklajs---okeana-roza" },
  ],
};

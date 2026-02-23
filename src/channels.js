// ============================================================
// CHANNEL DATABASE — Public IPTV streams
// Sources: iptv-org, Free-TV, public broadcaster CDNs
// Last verified: 2026-02-22
// ============================================================

export const CHANNELS = [
  // ===================== NEWS =====================
  { id: "france24-en", name: "France 24 English", country: "FR", categories: ["news"], languages: ["eng"], logo: "https://static.france24.com/meta_og_twit/F24_logo_EN.png", streamUrl: "https://live.france24.com/hls/live/2037218/F24_EN_HI_HLS/master_2300.m3u8" },
  { id: "france24-es", name: "France 24 Español", country: "FR", categories: ["news"], languages: ["spa"], logo: "https://static.france24.com/meta_og_twit/F24_logo_ES.png", streamUrl: "https://live.france24.com/hls/live/2037220/F24_ES_HI_HLS/master_2300.m3u8" },
  { id: "france24-fr", name: "France 24 Français", country: "FR", categories: ["news"], languages: ["fra"], logo: "https://static.france24.com/meta_og_twit/F24_logo_FR.png", streamUrl: "https://live.france24.com/hls/live/2037179/F24_FR_HI_HLS/master_2300.m3u8" },
  { id: "dw-en", name: "DW News", country: "DE", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8" },
  { id: "dw-es", name: "DW Español", country: "DE", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png", streamUrl: "https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/master.m3u8" },
  { id: "dw-de", name: "DW Deutsch", country: "DE", categories: ["news"], languages: ["deu"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png", streamUrl: "https://dwamdstream106.akamaized.net/hls/live/2017965/dwstream106/master.m3u8" },
  { id: "euronews-en", name: "Euronews English", country: "FR", categories: ["news"], languages: ["eng"], logo: "https://static.euronews.com/website/images/euronews-social-share.jpg", streamUrl: "https://a-cdn.klowdtv.com/live3/euronews_720p/playlist.m3u8" },
  { id: "aljazeera-en", name: "Al Jazeera English", country: "QA", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/200px-Aljazeera_eng.svg.png", streamUrl: "https://live-hls-web-aje-fa.thehlive.com/AJE/index.m3u8" },
  { id: "nhk-world", name: "NHK World Japan", country: "JP", categories: ["news"], languages: ["eng"], logo: "https://www3.nhk.or.jp/nhkworld/common/images/og/nhkworld_og.png", streamUrl: "https://media-tyo.hls.nhkworld.jp/hls/w/live/master.m3u8" },
  { id: "cgtn", name: "CGTN News", country: "CN", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/CGTN_logo.svg/200px-CGTN_logo.svg.png", streamUrl: "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8" },
  { id: "cgtn-es", name: "CGTN Español", country: "CN", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/CGTN_logo.svg/200px-CGTN_logo.svg.png", streamUrl: "https://news.cgtn.com/resource/live/espanol/cgtn-e.m3u8" },
  { id: "trt-world", name: "TRT World", country: "TR", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/TRT_World_logo.svg/200px-TRT_World_logo.svg.png", streamUrl: "https://tv-trtworld.medya.trt.com.tr/master.m3u8" },
  { id: "arirang", name: "Arirang TV", country: "KR", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Arirang_TV_logo.svg/200px-Arirang_TV_logo.svg.png", streamUrl: "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8" },
  { id: "rt-es", name: "RT en Español", country: "RU", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Russia-today-logo.svg/200px-Russia-today-logo.svg.png", streamUrl: "https://rt-esp.rttv.com/dvr/rtesp/playlist.m3u8" },
  { id: "teleSUR", name: "teleSUR", country: "VE", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Logo_de_TeleSUR.svg/200px-Logo_de_TeleSUR.svg.png", streamUrl: "https://mblesmain01.telesur.ultrabase.net/mbliveMain/hd/playlist.m3u8" },
  { id: "canal26", name: "Canal 26", country: "AR", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Logo_de_Canal_26.svg/200px-Logo_de_Canal_26.svg.png", streamUrl: "https://stream-gtlc.telecentro.net.ar/hls/canal26hls/main.m3u8" },
  { id: "milenio-tv", name: "Milenio TV", country: "MX", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Milenio_Televisi%C3%B3n_logo.svg/200px-Milenio_Televisi%C3%B3n_logo.svg.png", streamUrl: "https://mdstrm.com/live-stream-playlist/610178c7db32a4112d994650.m3u8" },

  // ===================== ENTERTAINMENT =====================
  { id: "rtve-la2", name: "La 2 - RTVE", country: "ES", categories: ["entertainment", "culture"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/La_2_logo.svg/200px-La_2_logo.svg.png", streamUrl: "https://d4g9wh8d4wiaw.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-crbrakk0yedqb/La2ES.m3u8" },
  { id: "tve-24h", name: "Canal 24 Horas", country: "ES", categories: ["entertainment", "news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Logo_RTVE_24h.svg/200px-Logo_RTVE_24h.svg.png", streamUrl: "https://d32rw80ytx9uxs.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-vlldndmow4yre/24HES.m3u8" },

  // ===================== SPORTS =====================
  { id: "redbull-tv", name: "Red Bull TV", country: "AT", categories: ["sports"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Red_Bull_TV_logo.svg/200px-Red_Bull_TV_logo.svg.png", streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { id: "tve-tdeporte", name: "Teledeporte - RTVE", country: "ES", categories: ["sports"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Teledeporte_logo.svg/200px-Teledeporte_logo.svg.png", streamUrl: "https://d1cctoeg0n48w5.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-mnixw9wn5ugmv/TeledeporteES.m3u8" },
  { id: "sportitalia", name: "Sportitalia", country: "IT", categories: ["sports"], languages: ["ita"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sportitalia_2018.svg/200px-Sportitalia_2018.svg.png", streamUrl: "https://amg01370-italiansportcom-sportitalia-rakuten-3hmdb.amagi.tv/hls/amagi_hls_data_rakutenAA-sportitalia-rakuten/CDN/master.m3u8" },

  // ===================== MUSIC =====================
  { id: "deluxe-music", name: "Deluxe Music", country: "DE", categories: ["music"], languages: ["deu"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Deluxe_Music_Logo.svg/200px-Deluxe_Music_Logo.svg.png", streamUrl: "https://sdn-global-live-streaming-packager-cache.3qsdn.com/13456/13456_264_live.m3u8" },
  { id: "radio-italia", name: "Radio Italia TV", country: "IT", categories: ["music"], languages: ["ita"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Radio_Italia_TV_logo.svg/200px-Radio_Italia_TV_logo.svg.png", streamUrl: "https://amg00745-radioitailaspa-radioitalia-rakuten-sucsc.amagi.tv/hls/amagi_hls_data_rakutenAA-radioitalia-rakuten/CDN/master.m3u8" },
  { id: "m2o-tv", name: "m2o TV", country: "IT", categories: ["music"], languages: ["ita"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/M2o_logo.svg/200px-M2o_logo.svg.png", streamUrl: "https://4c4b867c89244861ac216426883d1ad0.msvdn.net/live/S85984808/sMiJf9L3xQBn/playlist.m3u8" },

  // ===================== KIDS =====================
  { id: "clan-tve", name: "Clan TVE", country: "ES", categories: ["kids"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Clan_TVE_logo.svg/200px-Clan_TVE_logo.svg.png", streamUrl: "https://dum8zv1rbdjj2.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-x6uutpgph4tpt/ClanES.m3u8" },
  { id: "baby-first", name: "BabyFirst TV", country: "US", categories: ["kids"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/BabyFirst_TV_logo.svg/200px-BabyFirst_TV_logo.svg.png", streamUrl: "https://cfd-v4-service-channel-stitcher-use1-1.prd.pluto.tv/stitch/hls/channel/5f4fb4cf605ddf000748e16f/master.m3u8?appName=web&appVersion=9.19.0&deviceDNT=0&deviceId=8ee99fa9-8924-42ef-bf8b-617216b5b280&deviceMake=firefox&deviceModel=web&deviceType=web&deviceVersion=147.0.0&serverSideAds=false&sid=57af660e-52d2-4a0d-8f16-4a6ebcd413ce" },

  // ===================== DOCUMENTARY =====================
  { id: "rt-doc", name: "RT Documentary", country: "RU", categories: ["documentary"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Russia-today-logo.svg/200px-Russia-today-logo.svg.png", streamUrl: "https://rt-rtd.rttv.com/dvr/rtdoc/playlist.m3u8" },
  { id: "cgtn-doc", name: "CGTN Documentary", country: "CN", categories: ["documentary"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/CGTN_logo.svg/200px-CGTN_logo.svg.png", streamUrl: "https://news.cgtn.com/resource/live/document/cgtn-doc.m3u8" },

  // ===================== GENERAL =====================
  { id: "tv-peru", name: "TV Perú", country: "PE", categories: ["general"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Logo_TV_Per%C3%BA.svg/200px-Logo_TV_Per%C3%BA.svg.png", streamUrl: "https://cdnhd.iblups.com/hls/777b4d4cc0984575a7d14f6ee57dbcaf7.m3u8" },
  { id: "ecuador-tv", name: "Ecuador TV", country: "EC", categories: ["general"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ecuador_TV_2021.svg/200px-Ecuador_TV_2021.svg.png", streamUrl: "https://samson.streamerr.co:8081/shogun/index.m3u8" },
  { id: "canal-tr3ce", name: "Canal Tr3ce", country: "CO", categories: ["general"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Canal_Trece_Colombia_logo.svg/200px-Canal_Trece_Colombia_logo.svg.png", streamUrl: "https://streaming.canal13.com.co:8443/canal13/canal13.stream/playlist.m3u8" },
];

export const STREAMING_SERVICES = [
  { id: "netflix", name: "Netflix", color: "#E50914", icon: "▶", link: "https://www.netflix.com", fireTvPkg: "com.netflix.mediaclient" },
  { id: "disney", name: "Disney+", color: "#113CCF", icon: "✦", link: "https://www.disneyplus.com", fireTvPkg: "com.disney.disneyplus" },
  { id: "prime", name: "Prime Video", color: "#00A8E1", icon: "▷", link: "https://www.primevideo.com", fireTvPkg: "com.amazon.avod" },
  { id: "hbo", name: "Max", color: "#5822B4", icon: "◆", link: "https://www.max.com", fireTvPkg: "com.hbo.hbonow" },
  { id: "apple", name: "Apple TV+", color: "#1D1D1F", icon: "⬡", link: "https://tv.apple.com", fireTvPkg: "com.apple.atve.androidtv.appletv" },
  { id: "paramount", name: "Paramount+", color: "#0164FF", icon: "▲", link: "https://www.paramountplus.com", fireTvPkg: "com.cbs.ott" },
  { id: "crunchyroll", name: "Crunchyroll", color: "#F47521", icon: "◉", link: "https://www.crunchyroll.com", fireTvPkg: "com.crunchyroll.crunchyroid" },
  { id: "pluto", name: "Pluto TV", color: "#2B2B2B", icon: "▸", link: "https://pluto.tv", fireTvPkg: "tv.pluto.android" },
];

export const CATEGORY_META = {
  news: { icon: "📰", label: "Noticias" },
  sports: { icon: "⚽", label: "Deportes" },
  entertainment: { icon: "🎭", label: "Entretenimiento" },
  music: { icon: "🎵", label: "Música" },
  movies: { icon: "🎬", label: "Películas" },
  kids: { icon: "🧸", label: "Kids" },
  documentary: { icon: "🎥", label: "Documentales" },
  general: { icon: "📺", label: "General" },
  culture: { icon: "🎨", label: "Cultura" },
  comedy: { icon: "😂", label: "Comedia" },
};

export const CATEGORIES_ORDER = ["news", "entertainment", "sports", "music", "kids", "documentary", "general"];

export const LANGUAGE_FILTERS = [
  { code: "all", label: "Todos" },
  { code: "spa", label: "Español" },
  { code: "eng", label: "English" },
  { code: "fra", label: "Français" },
  { code: "deu", label: "Deutsch" },
  { code: "ita", label: "Italiano" },
];

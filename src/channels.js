// ============================================================
// CHANNEL DATABASE — Public IPTV streams
// Sources: iptv-org, Free-TV, public broadcaster CDNs
// ============================================================

export const CHANNELS = [
  // ===================== NEWS =====================
  { id: "france24-en", name: "France 24 English", country: "FR", categories: ["news"], languages: ["eng"], logo: "https://static.france24.com/meta_og_twit/F24_logo_EN.png", streamUrl: "https://stream.france24.com/f24/hls/live/en/main/master.m3u8" },
  { id: "france24-es", name: "France 24 Español", country: "FR", categories: ["news"], languages: ["spa"], logo: "https://static.france24.com/meta_og_twit/F24_logo_ES.png", streamUrl: "https://stream.france24.com/f24/hls/live/es/main/master.m3u8" },
  { id: "france24-fr", name: "France 24 Français", country: "FR", categories: ["news"], languages: ["fra"], logo: "https://static.france24.com/meta_og_twit/F24_logo_FR.png", streamUrl: "https://stream.france24.com/f24/hls/live/fr/main/master.m3u8" },
  { id: "dw-en", name: "DW News", country: "DE", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { id: "dw-es", name: "DW Español", country: "DE", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png", streamUrl: "https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/index.m3u8" },
  { id: "dw-de", name: "DW Deutsch", country: "DE", categories: ["news"], languages: ["deu"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png", streamUrl: "https://dwamdstream106.akamaized.net/hls/live/2015530/dwstream106/index.m3u8" },
  { id: "euronews-en", name: "Euronews English", country: "FR", categories: ["news"], languages: ["eng"], logo: "https://static.euronews.com/website/images/euronews-social-share.jpg", streamUrl: "https://rakuten-euronews-en-3.amagi.tv/playlist.m3u8" },
  { id: "euronews-es", name: "Euronews Español", country: "FR", categories: ["news"], languages: ["spa"], logo: "https://static.euronews.com/website/images/euronews-social-share.jpg", streamUrl: "https://rakuten-euronews-es-3.amagi.tv/playlist.m3u8" },
  { id: "nhk-world", name: "NHK World Japan", country: "JP", categories: ["news"], languages: ["eng"], logo: "https://www3.nhk.or.jp/nhkworld/common/images/og/nhkworld_og.png", streamUrl: "https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/domestic/263942/live_wa_s.m3u8" },
  { id: "cgtn", name: "CGTN News", country: "CN", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/CGTN_logo.svg/200px-CGTN_logo.svg.png", streamUrl: "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8" },
  { id: "trt-world", name: "TRT World", country: "TR", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/TRT_World_logo.svg/200px-TRT_World_logo.svg.png", streamUrl: "https://tv-trtworld.live.trt.com.tr/master_720.m3u8" },
  { id: "arirang", name: "Arirang TV", country: "KR", categories: ["news"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Arirang_TV_logo.svg/200px-Arirang_TV_logo.svg.png", streamUrl: "https://amdlive-ch01.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/chunklist.m3u8" },
  { id: "rt-es", name: "RT en Español", country: "RU", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Russia-today-logo.svg/200px-Russia-today-logo.svg.png", streamUrl: "https://rt-esp.rttv.com/dvr/rtesp/playlist.m3u8" },
  { id: "teleSUR", name: "teleSUR", country: "VE", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Logo_de_TeleSUR.svg/200px-Logo_de_TeleSUR.svg.png", streamUrl: "https://d2ajt1gpdtnw25.cloudfront.net/mbliveMain/hd/playlist.m3u8" },
  { id: "c5n", name: "C5N", country: "AR", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/C5N_logo.svg/200px-C5N_logo.svg.png", streamUrl: "https://unlimited1-buenosaires.dps.live/c5n/c5n.smil/playlist.m3u8" },
  { id: "canal26", name: "Canal 26", country: "AR", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Logo_de_Canal_26.svg/200px-Logo_de_Canal_26.svg.png", streamUrl: "https://stream-02.dc3.saintcloud.info/canal26/canal26.smil/playlist.m3u8" },
  { id: "todo-noticias", name: "Todo Noticias", country: "AR", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/TN_Todo_Noticias_logo.svg/200px-TN_Todo_Noticias_logo.svg.png", streamUrl: "https://live-01-02-tn.vodgc.net/live/smil:tn.smil/playlist.m3u8" },
  { id: "milenio-tv", name: "Milenio TV", country: "MX", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Milenio_Televisi%C3%B3n_logo.svg/200px-Milenio_Televisi%C3%B3n_logo.svg.png", streamUrl: "https://mdstrm.com/live-stream-playlist/574463697b9817cf0886fc17.m3u8" },
  { id: "ntn24", name: "NTN24", country: "CO", categories: ["news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/NTN24_logo.svg/200px-NTN24_logo.svg.png", streamUrl: "https://d1nmqgphjn0y4.cloudfront.net/live/ntn24/ntn24.smil/playlist.m3u8" },

  // ===================== ENTERTAINMENT =====================
  { id: "rtve-la1", name: "La 1 - RTVE", country: "ES", categories: ["entertainment"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/La_1_logo.svg/200px-La_1_logo.svg.png", streamUrl: "https://rtvelivestream.akamaized.net/rtvesec/la1/la1_main.m3u8" },
  { id: "rtve-la2", name: "La 2 - RTVE", country: "ES", categories: ["entertainment", "culture"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/La_2_logo.svg/200px-La_2_logo.svg.png", streamUrl: "https://rtvelivestream.akamaized.net/rtvesec/la2/la2_main.m3u8" },
  { id: "tve-24h", name: "Canal 24 Horas", country: "ES", categories: ["entertainment", "news"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Logo_RTVE_24h.svg/200px-Logo_RTVE_24h.svg.png", streamUrl: "https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main.m3u8" },
  { id: "once-tv", name: "Canal Once", country: "MX", categories: ["entertainment", "culture"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Canal_Once_logo_2016.svg/200px-Canal_Once_logo_2016.svg.png", streamUrl: "https://live-channel11.tvonce.gob.mx/live/smil:canal11.smil/playlist.m3u8" },
  { id: "canal22-mx", name: "Canal 22", country: "MX", categories: ["entertainment", "culture"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Canal22.svg/200px-Canal22.svg.png", streamUrl: "https://live-canal22.tvonce.gob.mx/live/smil:canal22.smil/playlist.m3u8" },
  { id: "tv-publica-ar", name: "TV Pública Argentina", country: "AR", categories: ["entertainment"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Logo_TVP_2021.svg/200px-Logo_TVP_2021.svg.png", streamUrl: "https://cntv7-live.cdn.vustreams.com/live/cntv7/ngrp:cntv7_all/playlist.m3u8" },
  { id: "caracol-tv", name: "Caracol TV", country: "CO", categories: ["entertainment"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Logo_de_Caracol_TV.svg/200px-Logo_de_Caracol_TV.svg.png", streamUrl: "https://mdstrm.com/live-stream-playlist/574463697b9817cf0886fc17.m3u8" },
  { id: "venezolana-tv", name: "Venezolana de TV", country: "VE", categories: ["entertainment"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Logo_vtv.svg/200px-Logo_vtv.svg.png", streamUrl: "https://d2ajt1gpdtnw25.cloudfront.net/vtv/smil:vtv.smil/playlist.m3u8" },

  // ===================== SPORTS =====================
  { id: "redbull-tv", name: "Red Bull TV", country: "AT", categories: ["sports"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Red_Bull_TV_logo.svg/200px-Red_Bull_TV_logo.svg.png", streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BossRoGR/master_264.m3u8" },
  { id: "tve-tdeporte", name: "Teledeporte - RTVE", country: "ES", categories: ["sports"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Teledeporte_logo.svg/200px-Teledeporte_logo.svg.png", streamUrl: "https://rtvelivestream.akamaized.net/rtvesec/tdp/tdp_main.m3u8" },
  { id: "tyc-sports", name: "TyC Sports Play", country: "AR", categories: ["sports"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/TyC_Sports_logo.svg/200px-TyC_Sports_logo.svg.png", streamUrl: "https://live-01-02-tycsports.vodgc.net/live/smil:tycsports.smil/playlist.m3u8" },
  { id: "sportitalia", name: "Sportitalia", country: "IT", categories: ["sports"], languages: ["ita"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sportitalia_2018.svg/200px-Sportitalia_2018.svg.png", streamUrl: "https://di-kzbxhbfz.vo.lswcdn.net/sportitalia/sihls/live.m3u8" },
  { id: "edgesport", name: "EDGEsport", country: "SI", categories: ["sports"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Edgesport.svg/200px-Edgesport.svg.png", streamUrl: "https://live-edge1.nmdn.net/edgesport/edgesport.smil/playlist.m3u8" },

  // ===================== MUSIC =====================
  { id: "deluxe-music", name: "Deluxe Music", country: "DE", categories: ["music"], languages: ["deu"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Deluxe_Music_Logo.svg/200px-Deluxe_Music_Logo.svg.png", streamUrl: "https://sdn-global-live-streaming-packager-cache.3qsdn.com/13456/13456_264_live.m3u8" },
  { id: "radio-italia", name: "Radio Italia TV", country: "IT", categories: ["music"], languages: ["ita"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Radio_Italia_TV_logo.svg/200px-Radio_Italia_TV_logo.svg.png", streamUrl: "https://radioitalia-hls.akamaized.net/radioitalia/radioitalia.isml/.m3u8" },
  { id: "m2o-tv", name: "m2o TV", country: "IT", categories: ["music"], languages: ["ita"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/M2o_logo.svg/200px-M2o_logo.svg.png", streamUrl: "https://4c4b867c89244861ac216426883d1ad0.msvdn.net/live/S85984808/sMiJf9L3xQBn/playlist.m3u8" },

  // ===================== MOVIES =====================
  { id: "pluto-cine", name: "Pluto TV Cine", country: "US", categories: ["movies"], languages: ["spa"], logo: "https://images.pluto.tv/assets/images/default/plutotv-og.jpg", streamUrl: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5dcddf1e6f338f0009b0c529/master.m3u8" },
  { id: "pluto-accion", name: "Pluto TV Acción", country: "US", categories: ["movies"], languages: ["spa"], logo: "https://images.pluto.tv/assets/images/default/plutotv-og.jpg", streamUrl: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5dcdded36f338f0009b0c517/master.m3u8" },
  { id: "pluto-terror", name: "Pluto TV Terror", country: "US", categories: ["movies"], languages: ["spa"], logo: "https://images.pluto.tv/assets/images/default/plutotv-og.jpg", streamUrl: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5dcde00bfef1900009e15c18/master.m3u8" },
  { id: "pluto-comedia", name: "Pluto TV Comedia", country: "US", categories: ["movies", "comedy"], languages: ["spa"], logo: "https://images.pluto.tv/assets/images/default/plutotv-og.jpg", streamUrl: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5dcddff36f338f0009b0c543/master.m3u8" },

  // ===================== KIDS =====================
  { id: "clan-tve", name: "Clan TVE", country: "ES", categories: ["kids"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Clan_TVE_logo.svg/200px-Clan_TVE_logo.svg.png", streamUrl: "https://rtvelivestream.akamaized.net/rtvesec/clan/clan_main.m3u8" },
  { id: "pakapaka", name: "Pakapaka", country: "AR", categories: ["kids"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Logo_pakapaka.svg/200px-Logo_pakapaka.svg.png", streamUrl: "https://cntv6-live.cdn.vustreams.com/live/cntv6/ngrp:cntv6_all/playlist.m3u8" },
  { id: "baby-first", name: "BabyFirst TV", country: "US", categories: ["kids"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/BabyFirst_TV_logo.svg/200px-BabyFirst_TV_logo.svg.png", streamUrl: "https://bfrstream.babyfirsttv.com/bfr1/playlist.m3u8" },

  // ===================== DOCUMENTARY =====================
  { id: "rt-doc", name: "RT Documentary", country: "RU", categories: ["documentary"], languages: ["eng"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Russia-today-logo.svg/200px-Russia-today-logo.svg.png", streamUrl: "https://rt-doc.rttv.com/dvr/rtdoc/playlist.m3u8" },

  // ===================== GENERAL =====================
  { id: "tv-peru", name: "TV Perú", country: "PE", categories: ["general"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Logo_TV_Per%C3%BA.svg/200px-Logo_TV_Per%C3%BA.svg.png", streamUrl: "https://cdnh9.iblups.com/hls/0x2u1ddj1n/index.m3u8" },
  { id: "ecuador-tv", name: "Ecuador TV", country: "EC", categories: ["general"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ecuador_TV_2021.svg/200px-Ecuador_TV_2021.svg.png", streamUrl: "https://samson.streamerr.co:8443/ecuadortv/index.m3u8" },
  { id: "bolivia-tv", name: "Bolivia TV", country: "BO", categories: ["general"], languages: ["spa"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Logo_de_Bolivia_TV.svg/200px-Logo_de_Bolivia_TV.svg.png", streamUrl: "https://video1.getstreamhosting.com:19360/8210/8210.m3u8" },
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

export const CATEGORIES_ORDER = ["news", "entertainment", "sports", "movies", "music", "kids", "documentary", "general"];

export const LANGUAGE_FILTERS = [
  { code: "all", label: "Todos" },
  { code: "spa", label: "Español" },
  { code: "eng", label: "English" },
  { code: "fra", label: "Français" },
  { code: "deu", label: "Deutsch" },
  { code: "ita", label: "Italiano" },
];

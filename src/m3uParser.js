// ============================================================
// M3U/M3U8 Playlist Parser
// Parses #EXTM3U format into channel objects
// ============================================================

export function parseM3U(content, playlistId) {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const channels = [];
  let idx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('#EXTINF:')) {
      const name = extractName(line);
      const logo = extractAttr(line, 'tvg-logo');
      const group = extractAttr(line, 'group-title') || 'movies';
      const lang = extractAttr(line, 'tvg-language');

      // Next non-comment line is the URL
      let url = '';
      for (let j = i + 1; j < lines.length; j++) {
        if (!lines[j].startsWith('#')) {
          url = lines[j];
          i = j;
          break;
        }
      }

      if (url) {
        channels.push({
          id: `${playlistId}_${idx}`,
          name: name || `Stream ${idx + 1}`,
          country: 'XX',
          categories: [normalizeCategory(group)],
          languages: lang ? [lang.slice(0, 3).toLowerCase()] : ['spa'],
          logo: logo || '',
          streamUrl: url,
        });
        idx++;
      }
    } else if (!line.startsWith('#') && (line.startsWith('http://') || line.startsWith('https://'))) {
      // Bare URL without #EXTINF
      channels.push({
        id: `${playlistId}_${idx}`,
        name: `Stream ${idx + 1}`,
        country: 'XX',
        categories: ['movies'],
        languages: ['spa'],
        logo: '',
        streamUrl: line,
      });
      idx++;
    }
  }

  return channels;
}

function extractName(extinfLine) {
  const commaIdx = extinfLine.lastIndexOf(',');
  if (commaIdx === -1) return '';
  return extinfLine.slice(commaIdx + 1).trim();
}

function extractAttr(extinfLine, attr) {
  const regex = new RegExp(`${attr}="([^"]*)"`, 'i');
  const match = extinfLine.match(regex);
  return match ? match[1] : '';
}

const CATEGORY_MAP = {
  movies: 'movies', movie: 'movies', peliculas: 'movies', cine: 'movies', films: 'movies',
  series: 'entertainment', entertainment: 'entertainment', entretenimiento: 'entertainment',
  sports: 'sports', deportes: 'sports',
  news: 'news', noticias: 'news',
  music: 'music', musica: 'music',
  kids: 'kids', infantil: 'kids', children: 'kids',
  documentary: 'documentary', documentales: 'documentary',
};

function normalizeCategory(group) {
  const key = group.toLowerCase().trim();
  return CATEGORY_MAP[key] || 'movies';
}

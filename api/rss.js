/**
 * Vercel Serverless Function — Proxy RSS sans cache
 * Appelé par : /api/rss?url=URL_DU_FLUX
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'Paramètre url manquant' });
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return res.status(400).json({ error: 'URL invalide' });
  }

  try {
    /* Timestamp dans l'URL pour forcer le contenu frais
       même si un CDN intermédiaire ou CERT-FR met en cache */
    const sep     = url.includes('?') ? '&' : '?';
    const bustUrl = url + sep + '_=' + Date.now();

    const response = await fetch(bustUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma':        'no-cache',
        'Expires':       '0',
        'User-Agent':    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept':        'application/rss+xml, application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Flux RSS : ' + response.status });
    }

    const xml = await response.text();

    res.setHeader('Content-Type',      'application/xml; charset=utf-8');
    res.setHeader('Cache-Control',     'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma',            'no-cache');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('CDN-Cache-Control', 'no-store');
    return res.status(200).send(xml);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

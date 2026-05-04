/**
 * Vercel Serverless Function — Proxy RSS
 * Appelé par : /api/rss?url=URL_DU_FLUX
 * Retourne le XML du flux RSS sans CORS ni cache.
 */
export default async function handler(req, res) {
  // Autoriser les requêtes depuis n'importe quelle origine (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Paramètre url manquant' });
  }

  // Vérification basique : n'autoriser que des URLs http/https
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return res.status(400).json({ error: 'URL invalide' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Se présenter comme un navigateur pour éviter les blocages
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      // Pas de cache côté Vercel — toujours le contenu frais
      cache: 'no-store'
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Le flux RSS a répondu ' + response.status });
    }

    const xml = await response.text();

    // Retourner le XML brut avec les bons headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Surrogate-Control', 'no-store');
    return res.status(200).send(xml);

  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur : ' + err.message });
  }
}

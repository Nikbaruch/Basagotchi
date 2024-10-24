const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Répond directement pour les requêtes OPTIONS
    return;
  }

  return await fn(req, res);
};

const handler = async (req, res) => {
  try {
    // Remplace par l'URL de ton endpoint Alchemy
    const alchemyResponse = await fetch(`https://base-mainnet.g.alchemy.com/v2/DawI2TgDeyVcz8cH_OE6WZ6RQvKxPRE5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body), // Envoyer les données reçues au proxy
    });

    const data = await alchemyResponse.json(); // Convertir la réponse en JSON
    res.status(200).json(data); // Renvoyer la réponse au front-end
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la requête Alchemy' });
  }
};

module.exports = allowCors(handler); // Appliquer le middleware CORS

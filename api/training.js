export default async function handler(req, res) {
  const { keyword, zip, radius = 25 } = req.query;
  if (!keyword || !zip) return res.status(400).json({ error: 'keyword and zip are required' });
  const userId = process.env.CAREERONESTOP_USER_ID;
  const token = process.env.CAREERONESTOP_TOKEN;
  if (!userId || !token) return res.status(500).json({ error: 'missing credentials' });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const url = `https://api.careeronestop.org/v1/Training/${userId}/${encodeURIComponent(keyword)}/${zip}/${radius}/0/0/0/0/0/0/asc/0/10`;
  try {
    const text = await (await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })).text();
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}

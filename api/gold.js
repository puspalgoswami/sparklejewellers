export default async function handler(req, res) {
  try {
    const API_KEY = process.env.GOLD_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "GOLD_API_KEY is missing.",
      });
    }

    const headers = {
      "x-access-token": API_KEY,
      "Content-Type": "application/json",
    };

    // Fetch Gold, Silver and USD→INR simultaneously
    const [goldRes, silverRes, forexRes] = await Promise.all([
      fetch("https://www.goldapi.io/api/XAU/USD", { headers }),
      fetch("https://www.goldapi.io/api/XAG/USD", { headers }),
      fetch("https://open.er-api.com/v6/latest/USD"),
    ]);

    if (!goldRes.ok || !silverRes.ok || !forexRes.ok) {
      throw new Error("Failed to fetch external APIs.");
    }

    const gold = await goldRes.json();
    const silver = await silverRes.json();
    const forex = await forexRes.json();

    // Cache on Vercel's CDN for 24 hours
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate"
    );

    return res.status(200).json({
      gold,
      silver,
      usdToInr: forex.rates.INR,
      updated: new Date().toISOString(),
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Unable to fetch metal prices.",
    });

  }
}
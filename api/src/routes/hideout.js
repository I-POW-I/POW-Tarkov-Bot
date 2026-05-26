
// Get all crafts with profit calculation
router.get('/crafts/profitable', async (req, res) => {
  const supabase = req.app.locals.supabase;

  try {
    const { min_profit, station_id, max_duration } = req.query;

    // Get all crafts
    const { data: crafts, error: craftsError } = await supabase
      .from('crafts_cache')
      .select('id, station_id, station_name, level_required, duration_seconds, required_items, reward_items, source');

    if (craftsError) throw craftsError;

    // Get item prices
    const { data: items } = await supabase
      .from('items_cache')
      .select('id, name, short_name, avg_24h_price, base_price, icon_url');

    const priceMap = new Map(items?.map(i => [i.id, i.avg_24h_price || i.base_price || 0]) || []);
    const itemMap = new Map(items?.map(i => [i.id, i]) || []);

    // Calculate profit for each craft
    const withProfit = crafts.map(craft => {
      let costPrice = 0;
      let rewardPrice = 0;
      const hours = Math.ceil((craft.duration_seconds || 0) / 3600);

      if (craft.required_items) {
        craft.required_items.forEach(item => {
          const itemId = item.item?.id || item.id;
          const count = item.count || item.quantity || 1;
          costPrice += (priceMap.get(itemId) || 0) * count;
        });
      }

      if (craft.reward_items) {
        craft.reward_items.forEach(item => {
          const itemId = item.item?.id || item.id;
          const count = item.count || item.quantity || 1;
          rewardPrice += (priceMap.get(itemId) || 0) * count;
        });
      }

      const profit = rewardPrice - costPrice;
      const profitPercent = costPrice > 0 ? ((profit / costPrice) * 100) : 0;
      const profitPerHour = hours > 0 ? profit / hours : profit;

      // Get reward item details
      const rewardItem = craft.reward_items?.[0]?.item || craft.reward_items?.[0];
      const rewardItemDetails = rewardItem?.id ? itemMap.get(rewardItem.id) : null;

      return {
        ...craft,
        cost_price: costPrice,
        reward_price: rewardPrice,
        profit,
        profit_percent: parseFloat(profitPercent.toFixed(2)),
        profit_per_hour: Math.round(profitPerHour),
        duration_hours: hours,
        reward_item: rewardItemDetails,
      };
    });

    // Filter by station
    let filtered = withProfit;
    if (station_id) {
      filtered = filtered.filter(c => c.station_id === station_id);
    }

    // Filter by max duration
    if (max_duration) {
      filtered = filtered.filter(c => c.duration_hours <= parseInt(max_duration));
    }

    // Sort by profit descending
    let sorted = filtered.sort((a, b) => b.profit - a.profit);

    // Filter by minimum profit
    if (min_profit) {
      sorted = sorted.filter(c => c.profit >= parseInt(min_profit));
    }

    res.json(sorted.slice(0, 100));
  } catch (error) {
    console.error('Profitable crafts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profitable crafts' });
  }
});

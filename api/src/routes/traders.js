
// Search all barters across all traders
router.get('/barters/search', async (req, res) => {
  const supabase = req.app.locals.supabase;

  try {
    const { item_id, item_name, trader_id, min_level, max_level } = req.query;

    let query = supabase
      .from('barters_cache')
      .select(`
        id,
        trader_id,
        trader_name,
        level_required,
        required_items,
        reward_items,
        task_unlock_id,
        task_unlock_name,
        traders_cache(name, image_url)
      `);

    if (trader_id) {
      query = query.eq('trader_id', trader_id);
    }

    if (min_level) {
      query = query.gte('level_required', min_level);
    }

    if (max_level) {
      query = query.lte('level_required', max_level);
    }

    const { data, error } = await query.order('trader_name').order('level_required');

    if (error) throw error;

    // Filter by item if provided
    let filtered = data || [];

    if (item_name) {
      filtered = filtered.filter(barter => {
        const reqMatch = JSON.stringify(barter.required_items).toLowerCase().includes(item_name.toLowerCase());
        const rewardMatch = JSON.stringify(barter.reward_items).toLowerCase().includes(item_name.toLowerCase());
        return reqMatch || rewardMatch;
      });
    }

    if (item_id) {
      filtered = filtered.filter(barter => {
        const reqMatch = JSON.stringify(barter.required_items).includes(item_id);
        const rewardMatch = JSON.stringify(barter.reward_items).includes(item_id);
        return reqMatch || rewardMatch;
      });
    }

    res.json(filtered);
  } catch (error) {
    console.error('Barter search error:', error);
    res.status(500).json({ error: 'Failed to search barters' });
  }
});

// Get all barters with profit calculation
router.get('/barters/profitable', async (req, res) => {
  const supabase = req.app.locals.supabase;

  try {
    const { min_profit } = req.query;

    // Get all barters
    const { data: barters, error } = await supabase
      .from('barters_cache')
      .select('*');

    if (error) throw error;

    // Get item prices
    const { data: items } = await supabase
      .from('items_cache')
      .select('id, avg_24h_price, base_price');

    const priceMap = new Map(items?.map(i => [i.id, i.avg_24h_price || i.base_price || 0]) || []);

    // Calculate profit for each barter
    const withProfit = barters.map(barter => {
      let costPrice = 0;
      let rewardPrice = 0;

      if (barter.required_items) {
        barter.required_items.forEach(item => {
          const itemId = item.item?.id || item.id;
          const count = item.count || item.quantity || 1;
          costPrice += (priceMap.get(itemId) || 0) * count;
        });
      }

      if (barter.reward_items) {
        barter.reward_items.forEach(item => {
          const itemId = item.item?.id || item.id;
          const count = item.count || item.quantity || 1;
          rewardPrice += (priceMap.get(itemId) || 0) * count;
        });
      }

      const profit = rewardPrice - costPrice;
      const profitPercent = costPrice > 0 ? ((profit / costPrice) * 100) : 0;

      return {
        ...barter,
        cost_price: costPrice,
        reward_price: rewardPrice,
        profit,
        profit_percent: parseFloat(profitPercent.toFixed(2)),
      };
    });

    // Sort by profit descending
    let sorted = withProfit.sort((a, b) => b.profit - a.profit);

    // Filter by minimum profit
    if (min_profit) {
      sorted = sorted.filter(b => b.profit >= parseInt(min_profit));
    }

    res.json(sorted.slice(0, 50)); // Top 50 profitable barters
  } catch (error) {
    console.error('Profitable barters fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profitable barters' });
  }
});

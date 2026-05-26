
  searchBarters: (params = {}) => api.get('/api/traders/barters/search', { params }),
  getProfitableBarters: (params = {}) => api.get('/api/traders/barters/profitable', { params }),
  getProfitableCrafts: (params = {}) => api.get('/api/hideout/crafts/profitable', { params }),
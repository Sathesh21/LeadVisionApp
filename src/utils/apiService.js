// Enterprise-level API service with proper error handling and caching
import { MOCK_CHAT_RESPONSES, MOCK_LEADS } from '../constants/mockData';

class ApiService {
  constructor() {
    this.baseURL = 'https://api.leadvision.com';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
  }

  // Simulate network delay
  delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic API call with error handling
  async apiCall(endpoint, options = {}) {
    try {
      await this.delay(Math.random() * 1000 + 500); // Simulate network delay
      
      // Check cache first
      const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Simulate API response based on endpoint
      let response;
      switch (endpoint) {
        case '/leads/search':
          response = this.searchLeads(options.query);
          break;
        case '/leads/nearby':
          response = this.getNearbyLeads(options.location);
          break;
        case '/leads/allocate':
          response = this.allocateLeads(options.userId);
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      // Cache the response
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });

      return response;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw new ApiError(error.message, endpoint);
    }
  }

  // Search leads based on query
  searchLeads(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check for predefined responses
    for (const [key, leads] of Object.entries(MOCK_CHAT_RESPONSES)) {
      if (normalizedQuery.includes(key)) {
        return {
          success: true,
          data: leads,
          query: normalizedQuery,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Default search in all leads
    const filteredLeads = MOCK_LEADS.filter(lead =>
      lead.name.toLowerCase().includes(normalizedQuery) ||
      lead.location.toLowerCase().includes(normalizedQuery) ||
      lead.company.toLowerCase().includes(normalizedQuery)
    );

    return {
      success: true,
      data: filteredLeads,
      query: normalizedQuery,
      timestamp: new Date().toISOString()
    };
  }

  // Get nearby leads based on location
  getNearbyLeads(userLocation) {
    const nearbyLeads = MOCK_LEADS
      .map(lead => ({
        ...lead,
        calculatedDistance: this.calculateDistance(userLocation, lead.coordinates)
      }))
      .filter(lead => lead.calculatedDistance < 5)
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance);

    return {
      success: true,
      data: nearbyLeads,
      userLocation,
      timestamp: new Date().toISOString()
    };
  }

  // Allocate leads to user
  allocateLeads(userId) {
    return {
      success: true,
      data: MOCK_LEADS,
      userId,
      timestamp: new Date().toISOString()
    };
  }

  // Calculate distance between two coordinates
  calculateDistance(coord1, coord2) {
    const R = 6371;
    const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
    const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.latitude)) *
      Math.cos(this.deg2rad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  clearCache() {
    this.cache.clear();
  }
}

class ApiError extends Error {
  constructor(message, endpoint) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }
}

export default new ApiService();
export { ApiError };
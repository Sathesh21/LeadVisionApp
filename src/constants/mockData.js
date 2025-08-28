// Mock data for the application
export const MOCK_LEADS = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    location: 'T. Nagar, Chennai, Tamil Nadu',
    matchScore: 95,
    distance: 0.5,
    phone: '+91 98400 12345',
    email: 'rajesh.kumar@email.com',
    company: 'Chennai Tech Solutions',
    status: 'hot',
    lastContact: '2024-01-15',
    coordinates: { latitude: 13.0827, longitude: 80.2707 }
  },
  {
    id: '2',
    name: 'Priya Sharma',
    location: 'Anna Nagar, Chennai, Tamil Nadu',
    matchScore: 87,
    distance: 1.2,
    phone: '+91 98765 43210',
    email: 'priya.sharma@email.com',
    company: 'Madras Marketing Pro',
    status: 'warm',
    lastContact: '2024-01-14',
    coordinates: { latitude: 13.0850, longitude: 80.2101 }
  },
  {
    id: '3',
    name: 'Arjun Krishnan',
    location: 'Velachery, Chennai, Tamil Nadu',
    matchScore: 78,
    distance: 2.1,
    phone: '+91 99400 56789',
    email: 'arjun.krishnan@email.com',
    company: 'Tamil Finance Corp',
    status: 'cold',
    lastContact: '2024-01-12',
    coordinates: { latitude: 12.9750, longitude: 80.2200 }
  },
  {
    id: '4',
    name: 'Meera Devi',
    location: 'Adyar, Chennai, Tamil Nadu',
    matchScore: 92,
    distance: 0.8,
    phone: '+91 98840 32109',
    email: 'meera.devi@email.com',
    company: 'Chennai Healthcare Plus',
    status: 'hot',
    lastContact: '2024-01-16',
    coordinates: { latitude: 13.0067, longitude: 80.2206 }
  },
  {
    id: '5',
    name: 'Suresh Babu',
    location: 'Tambaram, Chennai, Tamil Nadu',
    matchScore: 65,
    distance: 3.5,
    phone: '+91 99625 43210',
    email: 'suresh.babu@email.com',
    company: 'Chennai Real Estate Pro',
    status: 'cold',
    lastContact: '2024-01-10',
    coordinates: { latitude: 12.9249, longitude: 80.1000 }
  }
];

export const MOCK_CHAT_RESPONSES = {
  'nearby leads': MOCK_LEADS.filter(lead => lead.distance < 2),
  'hot leads': MOCK_LEADS.filter(lead => lead.status === 'hot'),
  'high score leads': MOCK_LEADS.filter(lead => lead.matchScore > 80),
  'all leads': MOCK_LEADS
};

export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    leadName: 'Rajesh Kumar',
    location: 'T. Nagar, Chennai, Tamil Nadu',
    matchScore: 95,
    type: 'new_lead',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    leadName: 'Meera Devi',
    location: 'Adyar, Chennai, Tamil Nadu',
    matchScore: 92,
    type: 'hot_lead',
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
];

export const DECLINED_LEADS_KEY = '@declined_leads';
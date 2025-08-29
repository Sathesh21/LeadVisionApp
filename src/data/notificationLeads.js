// Pool of leads for notifications
export const NOTIFICATION_LEADS = [
  {
    id: 'lead_001',
    name: 'Rajesh Kumar',
    location: 'T. Nagar, Chennai, Tamil Nadu',
    matchScorePercent: 94,
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com'
  },
  {
    id: 'lead_002', 
    name: 'Priya Sharma',
    location: 'Anna Nagar, Chennai, Tamil Nadu',
    matchScorePercent: 88,
    phone: '+91 87654 32109',
    email: 'priya.sharma@email.com'
  },
  {
    id: 'lead_003',
    name: 'Arjun Patel',
    location: 'Adyar, Chennai, Tamil Nadu', 
    matchScorePercent: 76,
    phone: '+91 76543 21098',
    email: 'arjun.patel@email.com'
  },
  {
    id: 'lead_004',
    name: 'Sneha Reddy',
    location: 'Velachery, Chennai, Tamil Nadu',
    matchScorePercent: 91,
    phone: '+91 65432 10987',
    email: 'sneha.reddy@email.com'
  },
  {
    id: 'lead_005',
    name: 'Vikram Singh',
    location: 'Mylapore, Chennai, Tamil Nadu',
    matchScorePercent: 83,
    phone: '+91 54321 09876',
    email: 'vikram.singh@email.com'
  }
];

// Track shown leads to avoid repetition
let shownLeads = [];

export const getNextNotificationLead = () => {
  if (shownLeads.length >= NOTIFICATION_LEADS.length) {
    shownLeads = [];
  }
  
  const availableLeads = NOTIFICATION_LEADS.filter(lead => !shownLeads.includes(lead.id));
  
  const randomIndex = Math.floor(Math.random() * availableLeads.length);
  const selectedLead = availableLeads[randomIndex];
  
  shownLeads.push(selectedLead.id);
  
  return selectedLead;
};

export const resetShownLeads = () => {
  shownLeads = [];
};
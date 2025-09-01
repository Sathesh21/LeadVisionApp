export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateID = (id) => {
  return id && id.trim().length >= 4 && /^[A-Za-z0-9]+$/.test(id.trim());
};

export const validateDate = (date) => {
  const dateRegex = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/;
  return dateRegex.test(date);
};

export const validateConfidence = (confidence) => {
  const num = Number(confidence);
  return !isNaN(num) && num >= 0 && num <= 100 ? Math.round(num) : 70;
};

export const validateCoordinates = (lat, lng) => {
  const latitude = Number(lat);
  const longitude = Number(lng);
  
  return !isNaN(latitude) && !isNaN(longitude) &&
         latitude >= -90 && latitude <= 90 &&
         longitude >= -180 && longitude <= 180;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!validateCoordinates(lat1, lon1) || !validateCoordinates(lat2, lon2)) {
    return 0;
  }
  
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return isNaN(distance) ? 0 : Number(distance.toFixed(2));
};

export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[<>]/g, '');
};

export const validateMatchScore = (score) => {
  const num = Number(score);
  return !isNaN(num) && num >= 0 && num <= 100 ? Math.round(num) : 0;
};

export default {
  validateEmail,
  validatePhone,
  validateName,
  validateID,
  validateDate,
  validateConfidence,
  validateCoordinates,
  calculateDistance,
  sanitizeText,
  validateMatchScore,
};
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const validateSeatIds = (seatIds) => {
  return Array.isArray(seatIds) && seatIds.length > 0;
};

const validateRouteData = (data) => {
  const { busId, origin, destination, departureTime, arrivalTime, fareAmount } = data;
  return busId && origin && destination && departureTime && arrivalTime && fareAmount;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateSeatIds,
  validateRouteData
};
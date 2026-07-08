const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const generateBookingReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const calculateTotalAmount = (fareAmount, seatCount) => {
  return fareAmount * seatCount;
};

const getSeatStatus = (seat) => {
  if (!seat.is_available) return 'booked';
  return 'available';
};

module.exports = {
  formatDate,
  generateBookingReference,
  calculateTotalAmount,
  getSeatStatus
};
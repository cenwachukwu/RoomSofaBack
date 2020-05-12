module.exports = {
  getAmount: async () => {
    return (Math.random() * 100 + 1).toFixed(2);
  },
  getDate: async () => {
    return new Date().toISOString().substring(0, 10);
  },
};

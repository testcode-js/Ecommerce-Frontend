import API from '../api/axios';

const initiatePayment = async (payload) => {
  const { data } = await API.post('/payments/initiate', payload);
  return data;
};

const confirmPayment = async (payload) => {
  const { data } = await API.post('/payments/confirm', payload);
  return data;
};

const getPaymentStatus = async (sessionId) => {
  const { data } = await API.get(`/payments/status/${sessionId}`);
  return data;
};

export default {
  initiatePayment,
  confirmPayment,
  getPaymentStatus,
};

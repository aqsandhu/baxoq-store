import API from './api';

// Newsletter service functions
const subscribeToNewsletter = async (email: string, preferences?: string[]) => {
  const response = await API.post('/newsletter/subscribe', { email, preferences });
  return response.data;
};

const unsubscribeFromNewsletter = async (email: string) => {
  const response = await API.post('/newsletter/unsubscribe', { email });
  return response.data;
};

const newsletterService = {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
};

export default newsletterService;

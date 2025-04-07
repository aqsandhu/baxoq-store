import API from './api';

// Contact service functions
const submitContactForm = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const response = await API.post('/contact', contactData);
  return response.data;
};

const getContactSubmissions = async () => {
  const response = await API.get('/contact');
  return response.data;
};

const contactService = {
  submitContactForm,
  getContactSubmissions,
};

export default contactService;

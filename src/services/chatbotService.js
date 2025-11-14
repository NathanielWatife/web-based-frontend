import api from './api';

export const chatbotService = {
  sendMessage: (message, context = {}) => {
    return api.post('/chatbot/message', { message, context });
  },
};

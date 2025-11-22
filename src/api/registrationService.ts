import api from './axios';
import type { Registration } from '../types/registration'

const RegistrationService = {
  getMyRegistrations: async (): Promise<Registration[]> => {
    const response = await api.get<Registration[]>('/registrations/me');
    console.log("Registrations: " + JSON.stringify(response.data))
    return response.data;
  },

  cancelRegistration: async (eventId: string): Promise<void> => {
    await api.patch(`/registrations/${eventId}/cancel`);
  },

  registerForEvent: async (eventId: string, userId: string): Promise<Registration> => {
    const response = await api.post('/registrations', { eventId, userId });
    return response.data;
  },

  downloadCertificate: async (eventId: string): Promise<void> => {
    const response = await api.get(`/registrations/${eventId}/certificate`, {
      responseType: 'blob' // Importante para baixar arquivos
    });

    // Cria um link temporário para forçar o download no navegador
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `certificado_${eventId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export default RegistrationService;
import api from './axios';
import type { UserData, UserUpdatePayload } from '../types/user';

const UserService = {
    update: async (id: string, data: UserUpdatePayload): Promise<UserData> => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    me: async (): Promise<UserData> => {
        const response = await api.get<UserData>('/users/me');
        return response.data;
    }
};

export default UserService;
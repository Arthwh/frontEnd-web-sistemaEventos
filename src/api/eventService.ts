import api from './axios';

import type { EventData } from '../types/event';

const EventService = {

    getEventsData: async (): Promise<EventData[]> => {
        const response = await api.get<EventData[]>('/events');
        console.log("Event Data: " + + JSON.stringify(response.data));

        return response.data;
    },

    getEventDataById: async (id: string): Promise<EventData> => {
        const response = await api.get<EventData>(`events/${id}`);
        return response.data
    }

}

export default EventService;
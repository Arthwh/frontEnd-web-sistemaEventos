export interface Registration {
    id: string;
    eventId: string;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'ABSENT' | 'COMPLETED' | 'CANCELED' | 'DELETED';
    checkIn?: string;
    createdAt: string;
}
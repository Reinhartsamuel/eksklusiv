import { DocumentData, Timestamp } from 'firebase/firestore'

export interface Channel extends DocumentData {
    id: string;
    accountHolder: string;
    accountNumber: string;
    channelName: string;
    channelOwnerUid: string;
    channelOwnerEmail:string;
    channelOwnerName:string;
    createdAt?: Timestampstring;
    description: string;
    banner: string | null;
    avatar: string | null;
    discountedPrice?: numberstring;
    price: numberstring;
    thumbnail: string | null;
    telegram: string | null;
    whatsapp: string | null;
}


export interface Payments extends DocumentData {
    id: string;
    accountHolder: string;
    accountNumber: string;
    amount: number;
    channelOwnerUid: string;
    channelOwnerName: string;
    channelOwnerEmail: string;
    channelName: string;
    name: string;
    email: string;
    channelTelegram: string;
    userTelegram: string | null;
    userWhatsapp: string | null;
    uid: string | null;
    receiptUrl: string;
    userAvatar: string | null;
    createdAt: Timestamp;
    status: string;
}
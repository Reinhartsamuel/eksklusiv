import { DocumentData, Timestamp } from 'firebase/firestore'

export interface Channel extends DocumentData {
    id: string;
    accountHolder: string;
    accountNumber: string;
    name: string;
    email: string;
    channelOwnerUid: string;
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


export interface Payments {
    id: string;
    accountHolder: string;
    accountNumber: string;
    amount: numberstring;
    channelOwnerUid: string;
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
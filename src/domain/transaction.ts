import { ObjectId } from 'mongodb';

export interface Transaction {
    _id?: string;
    userEmail: string;
    amount: number;
    type: TransactionType;
    createdAt?: Date;
}

export interface TransactionEntity {
    _id: ObjectId;
    userEmail: string;
    amount: number;
    type: string;
    createdAt: Date;
}

export enum TransactionType {
    SEND = 'send',
    RECEIVE = 'receive'
}

export interface TransactionSearchCriteria {
    userEmail: string;
    type?: TransactionType;
    sortField?: keyof Transaction;
}

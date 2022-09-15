import { ObjectId } from 'mongodb';
import {
    Transaction,
    TransactionEntity,
    TransactionSearchCriteria,
    TransactionType
} from '../../../../src/domain/transaction';

export const transaction: Transaction = {
    amount: 1234,
    type: TransactionType.SEND,
    userEmail: 'email@gmail.com'
};

export const insertedTransactionEntity: TransactionEntity = {
    _id: new ObjectId(),
    amount: 1234,
    type: TransactionType.SEND,
    userEmail: 'email@gmail.com',
    createdAt: new Date()
};

export const accountTransactions: Transaction[] = [
    {
        _id: '1',
        type: TransactionType.SEND,
        userEmail: 'mike@gmail.com',
        createdAt: new Date(),
        amount: 2345
    },
    {
        _id: '2',
        type: TransactionType.RECEIVE,
        userEmail: 'mike@gmail.com',
        createdAt: new Date(),
        amount: 1200
    },
    {
        _id: '3',
        type: TransactionType.RECEIVE,
        userEmail: 'mike@gmail.com',
        createdAt: new Date(),
        amount: 3322
    }
];

export const transactionSearchCriteria: TransactionSearchCriteria = {
    userEmail: 'email@gmail.com'
};

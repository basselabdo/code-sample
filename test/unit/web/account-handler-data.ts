import { Account, AccountStatus } from '../../../src/domain/account';
import { Transaction, TransactionType } from '../../../src/domain/transaction';
export const req: any = {
    query: {
        userEmail: 'email@gmail.com'
    },
    params: {
        id: '1234'
    },
    body: {
        status: AccountStatus.LOCKED
    }
};

export const reqTransaction: any = {
    query: {
        userEmail: 'email@gmail.com'
    },
    params: {
        id: '1234'
    },
    body: {
        amount: 1234,
        type: TransactionType.SEND,
        userEmail: 'email@gmail.com'
    }
};

export const insertedTransaction: Transaction = {
    _id: '1',
    type: TransactionType.SEND,
    userEmail: 'mike@gmail.com',
    createdAt: new Date(),
    amount: 1234
};

export const account: Account = {
    _id: '1234',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: AccountStatus.ACTIVE,
    userEmail: 'email@gmail.com',
    balance: 23454
};

import { Transaction } from '../../../../src/domain/transaction';
import {
    AccountSearchCriteria,
    Account,
    AccountStatus
} from '../../../../src/domain/account';
import { TransactionType } from '../../../../src/domain/transaction';

export const searchCriteriaEmail: AccountSearchCriteria = {
    userEmail: 'basel@gmail.com'
};
export const searchCriteriaId: AccountSearchCriteria = {
    _id: 'id-123'
};

export const searchCriteriaIdCreatingTransaction: AccountSearchCriteria = {
    _id: 'id-123-create-transaction'
};

export const searchCriteriaIdLocked: AccountSearchCriteria = {
    _id: 'id-123-locked'
};

export const searchCriteriaIdLowBalance: AccountSearchCriteria = {
    _id: 'id-123-lowBalance'
};
export const searchCriteriaIdWithNullReturn: AccountSearchCriteria = {
    _id: 'id-123-null'
};

export const searchCriteriaIdWithoutTransactions: AccountSearchCriteria = {
    _id: 'id-123-no-transaction'
};

export const accountByEmail: Account = {
    _id: '1234',
    createdAt: new Date('2020-08-26T21:49:06.149Z'),
    updatedAt: new Date('2022-09-13T03:46:00.673+0000'),
    status: AccountStatus.ACTIVE,
    userEmail: 'basel@gmail.com'
};
export const accountById: Account = {
    _id: 'id-123',
    createdAt: new Date('2020-08-26T21:49:06.149Z'),
    updatedAt: new Date('2022-09-13T03:46:00.673+0000'),
    status: AccountStatus.ACTIVE,
    userEmail: 'mike@gmail.com'
};

export const accountByIdGoodBalance: Account = {
    _id: 'id-123-create-transaction',
    createdAt: new Date('2020-08-26T21:49:06.149Z'),
    updatedAt: new Date('2022-09-13T03:46:00.673+0000'),
    status: AccountStatus.ACTIVE,
    userEmail: 'mike@gmail.com',
    balance: 1000
};

export const accountByIdNoTransactions: Account = {
    _id: 'id-123-no-transaction',
    createdAt: new Date('2020-08-26T21:49:06.149Z'),
    updatedAt: new Date('2022-09-13T03:46:00.673+0000'),
    status: AccountStatus.ACTIVE,
    userEmail: 'no-transactions@gmail.com',
    balance: 1000
};

export const accountByIdLowBalance: Account = {
    _id: 'id-123-lowBalance',
    createdAt: new Date('2020-08-26T21:49:06.149Z'),
    updatedAt: new Date('2022-09-13T03:46:00.673+0000'),
    status: AccountStatus.ACTIVE,
    userEmail: 'mike@gmail.com',
    balance: 100
};

export const accountByIdLocked: Account = {
    _id: 'id-123-locked',
    createdAt: new Date('2020-08-26T21:49:06.149Z'),
    updatedAt: new Date('2022-09-13T03:46:00.673+0000'),
    status: AccountStatus.LOCKED,
    userEmail: 'mike@gmail.com'
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

export const sendTransaction: Transaction = {
    type: TransactionType.SEND,
    userEmail: 'mike@gmail.com',
    amount: 3000
};
export const receiveTransaction: Transaction = {
    type: TransactionType.RECEIVE,
    userEmail: 'mike@gmail.com',
    amount: 1000
};
export const succeededTransaction: Transaction = {
    type: TransactionType.SEND,
    userEmail: 'mike@gmail.com',
    amount: 1000,
    _id: '1234',
    createdAt: new Date()
};

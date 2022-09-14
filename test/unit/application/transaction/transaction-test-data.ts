import {
    Transaction,
    TransactionSearchCriteria,
    TransactionType
} from '../../../../src/domain/transaction';

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
export const sendTransactionFail: Transaction = {
    type: TransactionType.SEND,
    userEmail: 'fail@gmail.com',
    amount: 4000
};
export const succeededTransaction: Transaction = {
    type: TransactionType.SEND,
    userEmail: 'mike@gmail.com',
    amount: 3000,
    _id: '1234',
    createdAt: new Date()
};

export const transactionsSearchCriteriaSuccess: TransactionSearchCriteria = {
    userEmail: 'testuser@gmail.com'
};

export const transactionsSearchCriteriaFail: TransactionSearchCriteria = {
    userEmail: 'failtestuser@gmail.com'
};

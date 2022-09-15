import { ObjectId } from 'mongodb';
import {
    Account,
    AccountSearchCriteria,
    AccountStatus
} from '../../../../src/domain/account';

export const foundAccount: Account = {
    _id: '631fab413b2d5f8a4abbe3bc',
    createdAt: new Date(),
    status: AccountStatus.ACTIVE,
    updatedAt: new Date(),
    userEmail: 'userActive@gmail.com'
};
export const findByEmailCriteria: AccountSearchCriteria = {
    userEmail: 'findbyEmail@gmail.com'
};

export const findByIdCriteria: AccountSearchCriteria = {
    _id: '631fab413b2d5f8a4abbe3bc'
};

export const accountToUpdate: Partial<Account> = {
    status: AccountStatus.LOCKED
};

export const foundAccountEntity = {
    _id: new ObjectId('631fab413b2d5f8a4abbe3bc'),
    createdAt: '2019-12-25T18:07:05.231Z',
    status: 'active',
    updatedAt: '2022-09-12T22:09:12.995+0000',
    userEmail: 'userActive@gmail.com'
};

export const foundAccountEntityNoId = {
    createdAt: '2019-12-25T18:07:05.231Z',
    status: 'active',
    updatedAt: '2022-09-12T22:09:12.995+0000',
    userEmail: 'userActive@gmail.com'
};

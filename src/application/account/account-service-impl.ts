import AccountRepository from './account-repository';
import AccountService from './account-service';
import {
    Account,
    AccountSearchCriteria,
    AccountStatus
} from '../../domain/account';
import TransactionRepository from '../transaction/transaction-repository';
import { Transaction, TransactionType } from '../../domain/transaction';
import _ from 'lodash';

export default class AccountServiceImpl implements AccountService {
    public constructor(
        private accountRepo: AccountRepository,
        private transactionRepo: TransactionRepository
    ) {}

    async createTransaction(
        accountId: string,
        transaction: Partial<Transaction>
    ): Promise<Transaction> {
        try {
            const account = await this.getAccountBy({
                _id: accountId
            });
            if (account.status === AccountStatus.LOCKED) {
                throw new Error(`The Account is locked!`);
            }
            const simulatedTransactionBalance =
                transaction.type === TransactionType.SEND
                    ? account.balance - transaction.amount
                    : account.balance + transaction.amount;

            if (simulatedTransactionBalance < 0) {
                throw new Error(
                    `Error! Account balance can not be less than 0!`
                );
            }
            return await this.transactionRepo.insertTransaction(transaction);
        } catch (error) {
            throw new Error(`Failed creating transaction! Message: ${error}`);
        }
    }

    async updateAccount(
        accountSearchCriteria: AccountSearchCriteria,
        account: Partial<Account>
    ): Promise<Partial<Account>> {
        try {
            // checking if the account exists before updating.
            const acct = await this.accountRepo.getAccountBy(
                accountSearchCriteria
            );
            if (!acct) {
                throw new Error(`Error! Account does not exist!`);
            }
            return await this.accountRepo.updateAccount(
                accountSearchCriteria,
                account
            );
        } catch (error) {
            throw new Error(`Error updating account! Message: ${error}`);
        }
    }

    async getAccountBy(
        accountsSearchCriteria?: AccountSearchCriteria
    ): Promise<Account> {
        const account = await this.accountRepo.getAccountBy(
            accountsSearchCriteria // this object has _id or userEmail to get the account by one of them
        );
        if (!account) {
            throw new Error(
                `Account (${JSON.stringify(
                    _.omitBy(accountsSearchCriteria, _.isNil)
                )}) doest not exist!`
            );
        }
        try {
            const accountTransactions = await this.transactionRepo.getAccountTransactions(
                { userEmail: account.userEmail }
            );
            let balance = 0; 
            // calcualting the final balance of the account by getting the account's transactions and iterating through them to either (+) or (-) based on the transaction.type.
            accountTransactions.forEach(transaction => {
                switch (transaction.type) {
                    case TransactionType.SEND: {
                        balance -= transaction.amount;
                        break;
                    }
                    case TransactionType.RECEIVE: {
                        balance += transaction.amount;
                        break;
                    }
                }
            });
            account.balance = balance;
            return account;
        } catch (error) {
            throw new Error('Failed getting account transactions!');
        }
    }
}

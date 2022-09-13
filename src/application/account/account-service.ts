import { Transaction } from '../../domain/transaction';
import { Account, AccountSearchCriteria } from '../../domain/account';

export default interface AccountService {
    getAccountBy(
        accountSearchCriteria?: AccountSearchCriteria
    ): Promise<Account>;
    createTransaction(
        accountId: string,
        transaction: Partial<Transaction>
    ): Promise<Transaction>;
    updateAccount(
        accountSearchCriteria: AccountSearchCriteria,
        account: Partial<Account>
    ): Promise<Partial<Account>>;
}

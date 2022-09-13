import { Account, AccountSearchCriteria } from '../../domain/account';

export default interface AccountRepository {
    getAccountBy(
        accountSearchCriteria: AccountSearchCriteria
    ): Promise<Account>;
    updateAccount(
        accountSearchCriteria: AccountSearchCriteria,
        account: Partial<Account>
    ): Promise<Partial<Account>>;
}

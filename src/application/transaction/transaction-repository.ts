import {
    Transaction,
    TransactionSearchCriteria
} from '../../domain/transaction';

export default interface TransactionRepository {
    getAccountTransactions(
        transactionSearchCriteria?: TransactionSearchCriteria
    ): Promise<Transaction[]>;

    insertTransaction(transaction: Partial<Transaction>): Promise<Transaction>;
}

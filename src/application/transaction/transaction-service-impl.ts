import TransactionRepository from './transaction-repository';
import TransactionService from './transaction-service';
import {
    Transaction,
    TransactionSearchCriteria
} from '../../domain/Transaction';

export default class TransactionServiceImpl implements TransactionService {
    public constructor(private transactionRepo: TransactionRepository) {}
    async getAccountTransactions(
        transactionsSearchCriteria?: TransactionSearchCriteria
    ): Promise<Transaction[]> {
        return await this.transactionRepo.getAccountTransactions(
            transactionsSearchCriteria
        );
    }

    async insertTransaction(
        transaction: Partial<Transaction>
    ): Promise<Transaction> {
        return await this.transactionRepo.insertTransaction(transaction);
    }
}

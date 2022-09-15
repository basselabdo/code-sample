import Config from '../../common/config/config';
import TransactionRepository from '../../application/transaction/transaction-repository';
import {
    Transaction,
    TransactionEntity,
    TransactionSearchCriteria,
    TransactionType
} from '../../domain/transaction';
import _ from 'lodash';
import { Collection, Db, ObjectId, InsertOneResult, WithId } from 'mongodb';

export default class TransactionRepositoryImpl
    implements TransactionRepository {
    constructor(private mongoDb: Db, private appConfig: Config) {}

    private getCollection(): Collection {
        return this.mongoDb.collection(
            this.appConfig.get<string>('mongoDb.transactionsCollection')
        );
    }

    private toTransactionEntity(transaction: Transaction): TransactionEntity {
        let transactionEntity: TransactionEntity;
        const { _id, createdAt, ...transactionObjct } = transaction;
        transactionEntity = {
            ...transactionObjct,
            createdAt: new Date(),
            _id: new ObjectId()
        };
        transactionEntity.type = transactionEntity.type.toLocaleLowerCase();
        return transactionEntity;
    }

    private toTransaction(transaction: TransactionEntity): Transaction {
        let transactionObject: Transaction;
        const { _id, type, ...transactionEntity } = transaction;
        transactionObject = {
            ...transactionEntity,
            type: (type as any) as TransactionType,
            _id: _id.toString()
        };
        return transactionObject;
    }

    async insertTransaction(transaction: Transaction): Promise<Transaction> {
        let transactionInsertResult: InsertOneResult<
            WithId<TransactionEntity>
        > = null;
        const transacationEntityObject = this.toTransactionEntity(transaction);
        try {
            transactionInsertResult = await this.getCollection().insertOne(
                transacationEntityObject
            );
            if (!transactionInsertResult.insertedId) {
                throw new Error(`No insertedId!`);
            }
        } catch (error) {
            throw new Error(
                `Failed to insert transaction ${JSON.stringify(
                    transaction
                )}, Message: ${error}`
            );
        }
        return this.toTransaction(transacationEntityObject);
    }
    async getAccountTransactions(
        transactionSearchCriteria?: TransactionSearchCriteria
    ): Promise<Transaction[]> {
        try {
            let foundTransactions: Transaction[];
            const query = {
                userEmail: transactionSearchCriteria.userEmail
            };
            foundTransactions = await this.getCollection()
                .find<Transaction>(query, { sort: { createdAt: 1 } })
                .toArray();
            return foundTransactions;
        } catch (error) {
            throw new Error(
                `Failed to get transaction for criteria: ${JSON.stringify(
                    transactionSearchCriteria
                )}, Error: ${error}`
            );
        }
    }
}

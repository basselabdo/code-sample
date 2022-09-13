import Config from '../../common/config/config';
import AccountRepository from '../../application/account/account-repository';
import { Account, AccountSearchCriteria } from '../../domain/account';
import _ from 'lodash';
import { Collection, Db, ObjectId, WithId } from 'mongodb';
import { flattenObject } from '../../common/utils/utils';
export default class AccountRepositoryImpl implements AccountRepository {
    constructor(private mongoDb: Db, private appConfig: Config) {}

    private getCollection(): Collection {
        return this.mongoDb.collection(
            this.appConfig.get<string>('mongoDb.accountsCollection')
        );
    }
    private toAccountObject({
        _id,
        ...entity
    }: WithId<Account>): Partial<Account> {
        const obj: Partial<Account> = {
            _id,
            ...entity
        };
        if (_id) {
            obj._id = _id.toString();
        }
        return obj;
    }
    private buildMongoQuery(accountSearchCriteria: AccountSearchCriteria) {
        const { _id, sortField, ...rest } = accountSearchCriteria;
        const query: any = flattenObject(rest);
        query._id = _id ? new ObjectId(_id) : undefined;
        return _.omitBy(query, _.isNil);
    }

    async updateAccount(
        accountSearchCriteria: AccountSearchCriteria,
        account: Partial<Account>
    ): Promise<Partial<Account>> {
        try {
            account.updatedAt = new Date();
            const result = await this.getCollection().findOneAndUpdate(
                this.buildMongoQuery(accountSearchCriteria),
                { $set: flattenObject(account) },
                { returnDocument: 'after' }
            );
            return this.toAccountObject((result.value as any) as WithId<
                Account
            >);
        } catch (error) {
            throw new Error(`Failed to update an account! Message: ${error}`);
        }
    }

    async getAccountBy(
        accountSearchCriteria: AccountSearchCriteria
    ): Promise<Account> {
        try {
            let foundAccount: Account;
            const query = this.buildMongoQuery(accountSearchCriteria);
            foundAccount = await this.getCollection().findOne<Account>(query);
            return foundAccount;
        } catch (error) {
            throw new Error(
                `Failed to get Account for criteria: ${JSON.stringify(
                    accountSearchCriteria
                )}, Error: ${error}`
            );
        }
    }
}

import { NextFunction, Request, Response } from 'express';
import { Account, AccountSearchCriteria } from '../domain/account';
import AccountService from '../application/account/account-service';
import _ from 'lodash';
import { JsonFormatter } from './json-formatter';
import { Transaction } from '../domain/transaction';

export default class AccountHandler {
    constructor(private accountService: AccountService) {}

    public async handleGetAccountBy(
        req: Request,
        res: Response & JsonFormatter,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userEmail }: AccountSearchCriteria = req.query;
            const _id = req.params.id;
            const accountSearchCriteria: AccountSearchCriteria = {
                _id,
                userEmail
            };
            const account = await this.accountService.getAccountBy(
                _.omitBy(accountSearchCriteria, _.isNil)
            );
            res.formattedJson(undefined, account);
        } catch (err) {
            next(err);
        }
    }
    public async handleUpdateAccount(
        req: Request,
        res: Response & JsonFormatter,
        next: NextFunction
    ): Promise<void> {
        try {
            const searchCriteria: AccountSearchCriteria = {
                _id: req.params.id
            };
            const account: Partial<Account> = req.body;
            const result = await this.accountService.updateAccount(
                searchCriteria,
                account
            );
            res.formattedJson(undefined, result);
        } catch (err) {
            next(err);
        }
    }
    public async handleCreateTransaction(
        req: Request,
        res: Response & JsonFormatter,
        next: NextFunction
    ): Promise<void> {
        try {
            const _id: string = req.params.id;
            const transaction: Partial<Transaction> = req.body;
            const result = await this.accountService.createTransaction(
                _id,
                transaction
            );
            res.formattedJson(undefined, result);
        } catch (err) {
            next(err);
        }
    }
}

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import AccountHandler from '../../../src/web/account-handler';
import AccountServiceMock from '../../mock/application/account/account-service.mock';
import { Response } from 'express';
import { JsonFormatter } from '../../../src/web/json-formatter';
import {
    account,
    req,
    reqTransaction,
    insertedTransaction
} from './account-handler-data';
chai.use(sinonChai);

describe('AccountHandler', () => {
    let accountHandler: AccountHandler;
    const sandbox = createSandbox();
    const accountService: AccountServiceMock = new AccountServiceMock(sandbox);
    const res: Response & JsonFormatter = {
        formattedJson: sandbox.stub()
    } as any;
    const next: any = sandbox.stub();
    beforeEach(() => {
        accountHandler = new AccountHandler(accountService);
    });
    afterEach(() => {
        sandbox.reset();
    });

    describe('handleGetAccountBy', () => {
        describe('When operation is successfull!', () => {
            beforeEach(() => {
                accountService.getAccountBy.resolves(account);
            });
            it('should return account', async () => {
                await accountHandler.handleGetAccountBy(req, res, next);
                expect(res.formattedJson).to.have.been.calledWith(
                    undefined,
                    account
                );
            });
        });
        describe('When the operation fails', () => {
            beforeEach(() => accountService.getAccountBy.rejects('oops!'));

            it('should call next()', async () => {
                await accountHandler.handleGetAccountBy(req, res, next);
                expect(next).to.have.callCount(1);
            });
        });
    });
    describe('handleUpdateAccount', () => {
        describe('When operation is successfull!', () => {
            beforeEach(() => {
                accountService.updateAccount.resolves(account);
            });
            it('should return accounts', async () => {
                await accountHandler.handleUpdateAccount(req, res, next);
                expect(res.formattedJson).to.have.been.calledWith(
                    undefined,
                    account
                );
            });
        });
        describe('When the operation fails', () => {
            beforeEach(() => accountService.updateAccount.rejects('oops!'));

            it('should call next()', async () => {
                await accountHandler.handleUpdateAccount(req, res, next);
                expect(next).to.have.callCount(1);
            });
        });
    });
    describe('handleCreateTransaction', () => {
        describe('When operation is successfull!', () => {
            beforeEach(() => {
                accountService.createTransaction.resolves(insertedTransaction);
            });
            it('should return accounts', async () => {
                await accountHandler.handleCreateTransaction(
                    reqTransaction,
                    res,
                    next
                );
                expect(res.formattedJson).to.have.been.calledWith(
                    undefined,
                    insertedTransaction
                );
            });
        });
        describe('When the operation fails', () => {
            beforeEach(() => accountService.createTransaction.rejects('oops!'));

            it('should call next()', async () => {
                await accountHandler.handleCreateTransaction(
                    reqTransaction,
                    res,
                    next
                );
                expect(next).to.have.callCount(1);
            });
        });
    });
});

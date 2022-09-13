export interface Account {
    _id: string;
    userEmail: string;
    status: AccountStatus;
    createdAt: Date;
    updatedAt: Date;
    balance?: number;
}

export enum AccountStatus {
    ACTIVE = 'active',
    LOCKED = 'locked'
}

export interface AccountSearchCriteria {
    _id?: string;
    userEmail?: string;
    status?: string;
    sortField?: keyof Account;
}

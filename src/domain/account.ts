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
    status?: string; // optional field to filter accounts by (not used now, just in case if needed in the future)
    sortField?: keyof Account; // optional field to sort accounts by (not used now, just in case if needed in the future)
}

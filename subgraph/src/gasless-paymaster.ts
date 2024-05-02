/**
 * Copyright Clave - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BigInt } from '@graphprotocol/graph-ts';

import { FeeSponsored as FeeSponsoredEvent } from '../generated/GaslessPaymaster/GaslessPaymaster';
import { ClaveAccount, ClaveTransaction } from '../generated/schema';
import {
    getOrCreateMonth,
    getOrCreateMonthAccount,
    getOrCreateWeek,
    getOrCreateWeekAccount,
    getTotal,
} from './helpers';

export function handleFeeSponsored(event: FeeSponsoredEvent): void {
    const transaction = new ClaveTransaction(event.transaction.hash);
    const week = getOrCreateWeek(event.block.timestamp);
    const month = getOrCreateMonth(event.block.timestamp);
    const total = getTotal();
    const account = ClaveAccount.load(event.params.user);
    if (account != null) {
        const weekAccount = getOrCreateWeekAccount(account, week);
        weekAccount.save();
        const monthAccount = getOrCreateMonthAccount(account, month);
        monthAccount.save();

        week.transactions = week.transactions + 1;
        month.transactions = month.transactions + 1;
        total.transactions = total.transactions + 1;

        transaction.sender = event.transaction.from;
        if (event.transaction.to) {
            transaction.to = event.transaction.to;
        }
        transaction.value = event.transaction.value;
        let gasUsed = BigInt.fromI32(0);
        const receipt = event.receipt;
        if (receipt != null) {
            gasUsed = receipt.gasUsed;
        }
        const gasCost = event.transaction.gasPrice.times(gasUsed);
        total.gasSponsored = total.gasSponsored.plus(gasCost);
        transaction.gasCost = gasCost;
        transaction.paymaster = 'Gasless';
        transaction.date = event.block.timestamp;

        account.txCount = account.txCount + 1;
        account.save();
    }

    week.save();
    month.save();
    total.save();
    transaction.save();
}

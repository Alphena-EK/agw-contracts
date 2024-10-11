/**
 * Copyright Clave - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import type { ec } from 'elliptic';
import type { Contract, Provider } from 'zksync-ethers';
import { utils } from 'zksync-ethers';

import { prepareEOATx, prepareTeeTx } from '../transactions';
import { HDNodeWallet } from 'ethers';

export async function upgradeTx(
    provider: Provider,
    account: Contract,
    validator: Contract,
    newImplementation: Contract,
    wallet: HDNodeWallet,
): Promise<void> {
    const upgradeTx = await account.upgradeTo.populateTransaction(
        await newImplementation.getAddress(),
    );
    const tx = await prepareEOATx(
        provider,
        account,
        upgradeTx,
        await validator.getAddress(),
        wallet,
    );
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

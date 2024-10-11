/**
 * Copyright Clave - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import type { ec } from 'elliptic';
import { concat, HDNodeWallet } from 'ethers';
import type { Contract, Provider } from 'zksync-ethers';
import { utils } from 'zksync-ethers';

import { prepareEOATx, prepareTeeTx } from '../transactions';

export async function addModule(
    provider: Provider,
    account: Contract,
    validator: Contract,
    module: Contract,
    initData: string,
    wallet: HDNodeWallet,
): Promise<void> {
    const moduleAndData = concat([await module.getAddress(), initData]);

    const addModuleTx = await account.addModule.populateTransaction(
        moduleAndData,
    );
    const tx = await prepareEOATx(
        provider,
        account,
        addModuleTx,
        await validator.getAddress(),
        wallet,
    );
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

export async function removeModule(
    provider: Provider,
    account: Contract,
    validator: Contract,
    module: Contract,
    wallet: HDNodeWallet,
): Promise<void> {
    const removeModuleTx = await account.removeModule.populateTransaction(
        await module.getAddress(),
    );

    const tx = await prepareEOATx(
        provider,
        account,
        removeModuleTx,
        await validator.getAddress(),
        wallet,
    );

    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

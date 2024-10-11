/**
 * Copyright Clave - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import type { ec } from 'elliptic';
import type { BytesLike, HDNodeWallet } from 'ethers';
import type { Contract, Provider } from 'zksync-ethers';
import { utils } from 'zksync-ethers';

import type { HOOKS } from '../names';
import { prepareEOATx, prepareTeeTx } from '../transactions';

export async function addHook(
    provider: Provider,
    account: Contract,
    validator: Contract,
    hook: Contract,
    isValidation: HOOKS,
    wallet: HDNodeWallet,
    hookData: Array<BytesLike> = [],
): Promise<void> {
    const addHookTx = await account.addHook.populateTransaction(
        await hook.getAddress(),
        isValidation == 1 ? true : false,
    );
    const tx = await prepareEOATx(
        provider,
        account,
        addHookTx,
        await validator.getAddress(),
        wallet,
        hookData,
    );
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

export async function removeHook(
    provider: Provider,
    account: Contract,
    validator: Contract,
    hook: Contract,
    isValidation: HOOKS,
    wallet: HDNodeWallet,
    hookData: Array<BytesLike> = [],
): Promise<void> {
    const removeHookTx = await account.removeHook.populateTransaction(
        await hook.getAddress(),
        isValidation == 1 ? true : false,
    );
    const tx = await prepareEOATx(
        provider,
        account,
        removeHookTx,
        await validator.getAddress(),
        wallet,
        hookData,
    );
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

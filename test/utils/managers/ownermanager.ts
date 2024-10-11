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

export async function addR1Key(
    provider: Provider,
    account: Contract,
    validator: Contract,
    newPublicKey: string,
    wallet: HDNodeWallet,
    ecKeyPair?: ec.KeyPair,
): Promise<void> {
    const addOwnerTx = await account.r1AddOwner.populateTransaction(
        newPublicKey,
    );
    let tx;
    if (ecKeyPair) {
        tx = await prepareTeeTx(
            provider,
            account,
            addOwnerTx,
            await validator.getAddress(),
            ecKeyPair,
        );
    } else {
        tx = await prepareEOATx(
            provider,
            account,
            addOwnerTx,
            await validator.getAddress(),
            wallet,
        );
    }

    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

export async function addK1Key(
    provider: Provider,
    account: Contract,
    validator: Contract,
    newK1Address: string,
    wallet: HDNodeWallet,
    ecKeyPair?: ec.KeyPair,
): Promise<void> {
    const addOwnerTx = await account.k1AddOwner.populateTransaction(
        newK1Address,
    );
    let tx;
    if (ecKeyPair) {
        tx = await prepareTeeTx(
            provider,
            account,
            addOwnerTx,
            await validator.getAddress(),
            ecKeyPair,
        );
    } else {
        tx = await prepareEOATx(
            provider,
            account,
            addOwnerTx,
            await validator.getAddress(),
            wallet,
        );
    }
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

export async function removeR1Key(
    provider: Provider,
    account: Contract,
    validator: Contract,
    removingPublicKey: string,
    wallet: HDNodeWallet,
    ecKeyPair?: ec.KeyPair,
): Promise<void> {
    const removeOwnerTxData = await account.r1RemoveOwner.populateTransaction(
        removingPublicKey,
    );
    let tx;
    if (ecKeyPair) {
        tx = await prepareTeeTx(
            provider,
            account,
            removeOwnerTxData,
            await validator.getAddress(),
            ecKeyPair,
        );
    } else {
        tx = await prepareEOATx(
            provider,
            account,
            removeOwnerTxData,
            await validator.getAddress(),
            wallet,
        );
    }
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

export async function removeK1Key(
    provider: Provider,
    account: Contract,
    validator: Contract,
    removingAddress: string,
    wallet: HDNodeWallet,
): Promise<void> {
    const removeOwnerTx = await account.k1RemoveOwner.populateTransaction(
        removingAddress,
    );
    const tx = await prepareEOATx(
        provider,
        account,
        removeOwnerTx,
        await validator.getAddress(),
        wallet,
    );
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

export async function resetOwners(
    provider: Provider,
    account: Contract,
    validator: Contract,
    newPublicKey: string,
    wallet: HDNodeWallet,
    ecKeyPair?: ec.KeyPair,
): Promise<void> {
    const resetOwnersTx = await account.resetOwners.populateTransaction(
        newPublicKey,
    );

    let tx;
    if (ecKeyPair) {
        tx = await prepareTeeTx(
            provider,
            account,
            resetOwnersTx,
            await validator.getAddress(),
            ecKeyPair,
        );
    } else {
        tx = await prepareEOATx(
            provider,
            account,
            resetOwnersTx,
            await validator.getAddress(),
            wallet,
        );
    }
    const txReceipt = await provider.broadcastTransaction(
        utils.serializeEip712(tx),
    );
    await txReceipt.wait();
}

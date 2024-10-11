/**
 * Copyright Clave - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import type { Contract } from 'zksync-ethers';

import type { ClaveDeployer } from './deployer';
import { VALIDATORS } from './names';
import { HDNodeWallet } from 'ethers';

export type fixtureTypes = [
    batchCaller: Contract,
    registry: Contract,
    implementation: Contract,
    factory: Contract,
    validator: Contract,
    account: Contract,
    wallet: HDNodeWallet,
];

export const fixture = async (
    deployer: ClaveDeployer,
    validatorOption: VALIDATORS = VALIDATORS.MOCK,
): Promise<fixtureTypes> => {
    const wallet = HDNodeWallet.createRandom();

    const batchCaller = await deployer.batchCaller();
    const registry = await deployer.registry();
    const implementation = await deployer.implementation(batchCaller);
    const factory = await deployer.factory(implementation, registry);
    const validator = await deployer.validator(validatorOption);
    const account = await deployer.account(wallet, factory, validator);

    return [
        batchCaller,
        registry,
        implementation,
        factory,
        validator,
        account,
        wallet,
    ];
};

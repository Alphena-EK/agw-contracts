/**
 * Copyright Clave - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { ZeroAddress, zeroPadValue } from 'ethers';
import * as hre from 'hardhat';
import { Contract, Wallet, utils } from 'zksync-ethers';
import { deployContract, getWallet, verifyContract } from '../deploy/utils';
import type { CallStruct } from '../typechain-types/contracts/batch/BatchCaller';

// Global variables
let fundingWallet: Wallet;
let batchCaller: Contract;
let eoaValidator: Contract;
let implementation: Contract;
let factory: Contract;
let registry: Contract;

/**
 * Deployment script for Clave contracts.
 * Now includes enhanced logging, configuration, and execution timing.
 */
export default async function (): Promise<void> {
    console.time("Deployment Total Time");

    try {
        // Initialize wallet
        fundingWallet = getWallet(hre);
        const initialOwner = fundingWallet.address;

        console.log("Funding Wallet Address:", fundingWallet.address);

        // Deploy contracts
        console.time("BatchCaller Deployment");
        batchCaller = await deployContract(hre, 'BatchCaller', undefined, { wallet: fundingWallet, silent: false }, 'create');
        console.timeEnd("BatchCaller Deployment");

        console.time("EOAValidator Deployment");
        eoaValidator = await deployContract(hre, 'EOAValidator', undefined, { wallet: fundingWallet, silent: false }, 'create2');
        console.timeEnd("EOAValidator Deployment");

        console.time("ClaveImplementation Deployment");
        implementation = await deployContract(
            hre,
            'ClaveImplementation',
            [await eoaValidator.getAddress()],
            { wallet: fundingWallet, silent: false },
            'create2',
        );
        console.timeEnd("ClaveImplementation Deployment");

        console.time("ClaveRegistry Deployment");
        registry = await deployContract(hre, 'ClaveRegistry', [initialOwner], { wallet: fundingWallet, silent: false }, 'create2');
        console.timeEnd("ClaveRegistry Deployment");

        // Deploy ClaveProxy to validate artifact
        console.time("ClaveProxy Deployment");
        await deployContract(
            hre,
            'ClaveProxy',
            [await implementation.getAddress()],
            { wallet: fundingWallet, silent: true, noVerify: true },
            'create2',
        );
        console.timeEnd("ClaveProxy Deployment");

        // Prepare bytecode and deploy AccountFactory
        const accountProxyArtifact = await hre.zksyncEthers.loadArtifact('ClaveProxy');
        const bytecodeHash = utils.hashBytecode(accountProxyArtifact.bytecode);

        console.time("AccountFactory Deployment");
        factory = await deployContract(
            hre,
            'AccountFactory',
            [
                await implementation.getAddress(),
                await registry.getAddress(),
                bytecodeHash,
                fundingWallet.address,
                initialOwner,
            ],
            { wallet: fundingWallet, silent: false },
            'create2',
        );
        console.timeEnd("AccountFactory Deployment");

        // Set factory in registry
        await registry.setFactory(await factory.getAddress());

        // Prepare and deploy account
        const salt = initialOwner.padEnd(66, '0');
        console.log("Salt:", salt);

        const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();
        const call: CallStruct = {
            target: ZeroAddress,
            allowFailure: false,
            value: 0,
            callData: '0x',
        };

        const initializer =
            '0xb4e581f5' +
            abiCoder
                .encode(
                    [
                        'address',
                        'address',
                        'bytes[]',
                        'tuple(address target,bool allowFailure,uint256 value,bytes calldata)',
                    ],
                    [
                        initialOwner,
                        await eoaValidator.getAddress(),
                        [],
                        [call.target, call.allowFailure, call.value, call.callData],
                    ],
                )
                .slice(2);

        console.time("Account Deployment");
        const tx = await factory.deployAccount(salt, initializer);
        await tx.wait();
        console.timeEnd("Account Deployment");

        const accountAddress = await factory.getAddressForSalt(salt);
        console.log("Account Address:", accountAddress);

        // Verify the deployed account
        await verifyContract(hre, {
            address: accountAddress,
            contract: "contracts/ClaveProxy.sol:ClaveProxy",
            constructorArguments: zeroPadValue(accountAddress, 32),
            bytecode: accountProxyArtifact.bytecode,
        });

        console.log("Contract verification completed successfully.");
    } catch (error) {
        console.error("Deployment failed with error:", error);
    } finally {
        console.timeEnd("Deployment Total Time");
    }
}

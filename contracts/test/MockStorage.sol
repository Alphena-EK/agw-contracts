// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

library MockStorage {
    //keccak256('agw.contracts.AGWStorage') - 1
    bytes32 private constant AGW_STORAGE_SLOT =
        0x67641650ff26a63f6b1fb8b1cb96de5bac5c28fcfcca35c9518ea6966d32d42d;

    struct Layout {
        // ┌───────────────────┐
        // │   Ownership Data  │
        mapping(bytes => bytes) r1Owners;
        mapping(address => address) k1Owners;
        uint256[50] __gap_0;
        // └───────────────────┘

        // ┌───────────────────┐
        // │     Fallback      │
        address defaultFallbackContract;
        uint256[49] __gap_1;
        // └───────────────────┘

        // ┌───────────────────┐
        // │        Test       │
        uint256 testNumber;
        // └───────────────────┘

        // ┌───────────────────┐
        // │     Validation    │
        mapping(address => address) r1Validators;
        mapping(address => address) k1Validators;
        uint256[50] __gap_2;
        // └───────────────────┘

        // ┌───────────────────┐
        // │       Module      │
        mapping(address => address) modules;
        uint256[50] __gap_3;
        // └───────────────────┘

        // ┌───────────────────┐
        // │       Hooks       │
        mapping(address => address) validationHooks;
        mapping(address => address) executionHooks;
        mapping(address => mapping(bytes32 => bytes)) hookDataStore;
        uint256[50] __gap_4;
        // └───────────────────┘
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = AGW_STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}

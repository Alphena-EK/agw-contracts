// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

interface IAGWRegistry {
    function register(address account) external;

    function isAGW(address account) external view returns (bool);
}

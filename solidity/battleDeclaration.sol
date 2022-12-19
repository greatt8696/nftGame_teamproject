// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// This is saved 'battleDeclaration.sol'

enum NftType {
    Unit,
    Weapon,
    Helmet
}

struct Nft {
    uint256 id;
    NftType nftType;
}

struct BattleSlot {
    address owner;
    Nft[] nftType;
}

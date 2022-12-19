// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "battleDeclaration.sol";

contract Battle {
    mapping(address => Nft[]) public ownedNfts;

    constructor() {
        ownedNfts[msg.sender].push(Nft(1, NftType.Unit));
        ownedNfts[msg.sender].push(Nft(1, NftType.Unit));
    }

    function mint() public {}

    function getNfts() public view returns (Nft[] memory) {
        return ownedNfts[msg.sender];
    }

    function applyBattleSquad(uint256[] memory nfts)
        public
        view
        returns (Nft[] memory)
    {
        for (uint256 _i = 0; _i < nfts.length; _i++) {}
        return ownedNfts[msg.sender];
    }
}

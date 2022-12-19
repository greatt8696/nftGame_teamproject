// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";

contract Multicall {
    uint256 _number;
    BattleSlot[] _battleSlot;
    mapping(address => Nft[]) ownedNfts;

    constructor() {
        ownedNfts[msg.sender].push(Nft(1, NftType.Unit));
    }

    function getSelector(uint256 x, uint256 y)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSelector(Calc.func1.selector, x, y);
    }

    function multicall(bytes[] calldata data)
        external
        virtual
        returns (bytes[] memory results)
    {
        results = new bytes[](data.length);
        for (uint256 i = 0; i < data.length; i++) {
            (bool ok, bytes memory res) = address(this).delegatecall(data[i]);
            results[i] = res;
        }
        return results;
    }
}

contract Calc is Multicall {
    event Log(address caller, string func, uint256 i);

    function func1(uint256 x, uint256 y) external returns (bytes memory) {
        emit Log(msg.sender, "func1", x + y);
        _number += x + y;
        return abi.encodePacked(_number);
    }

    function getNumber() public view returns (uint256) {
        return _number;
    }
}

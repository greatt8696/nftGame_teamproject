// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        // uint256 _value; // default: 0
        mapping(address => uint256[]) _ownedNfts;
        uint256 _value; // default: 0
    }

    function getOwnedNftsByAddress(Counter storage counter, address account)
        public
        view
        returns (uint256[] memory)
    {
        return counter._ownedNfts[account];
    }

    function addNft(
        Counter storage counter,
        address account,
        uint256 nftId
    ) public {
        counter._ownedNfts[account].push(nftId);
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract MyToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenCounter;

    constructor() ERC721("MyToken", "MTK") {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenCounter.current();
        _tokenCounter.increment();
        _tokenCounter.addNft(to, tokenId);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function getAllOwnedNftsURI(address account)
        public
        view
        returns (string[] memory )
    {
        uint256[] memory _allOwnedNfts = _tokenCounter.getOwnedNftsByAddress(
            account
        );
        uint256 lenght = _allOwnedNfts.length;
        string[] memory myNftsURI = new string[](lenght);
        for (uint256 _i = 0; _i < _allOwnedNfts.length; _i++) {
            myNftsURI[_i] = tokenURI(_i);
        }

        return myNftsURI;
    }

    function getAllOwnedNfts(address account)
        public
        view
        returns (uint256[] memory myNfts)
    {
        return _tokenCounter.getOwnedNftsByAddress(account);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

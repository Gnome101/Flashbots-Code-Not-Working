// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ValueStore {
    uint256[] numArray;

    function addNum(uint256 newItem) public payable {
        numArray.push(newItem);
        block.coinbase.transfer(msg.value);
    }

    function getArray() public view returns (uint256[] memory) {
        return numArray;
    }

    function refreshArray() public {
        delete numArray;
    }

    receive() external payable {}
}

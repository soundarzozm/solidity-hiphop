// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
	uint256 totalWaves;
    address[] walletAddresses;

	constructor() {
		console.log("Yo, we the smart contract and we smart as hell!");
	}

	function wave() public {
		totalWaves += 1;
        walletAddresses.push(msg.sender);
		console.log("%s has waved!", msg.sender); // msg.sender is the wallet address.
	}

	function getTotalWaves() public view returns (uint256) {
		console.log("We have %d total waves!", totalWaves);
		return totalWaves;
	}

    function getWalletAddresses() public view returns (address[] memory) {
        console.log("These are the wallet addresses!");
        return walletAddresses;
    }
}

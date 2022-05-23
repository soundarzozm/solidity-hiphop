// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
	uint256 totalWaves;
	address[] walletAddresses;

	event NewWave(address indexed from, uint256 timestamp, string message);

	struct Wave {
		address waver;
		string message;
		uint256 timestamp;
	}

	Wave[] waves;

	constructor() payable {
		console.log("Yo, we the smart contract and we smart as hell!");
	}

	function wave(string memory _message) public {
		totalWaves += 1;
		console.log("%s waved w/ message %s", msg.sender, _message); // msg.sender is the wallet address.

		waves.push(Wave(msg.sender, _message, block.timestamp));
		emit NewWave(msg.sender, block.timestamp, _message);

		uint256 prizeAmount = 0.0001 ether;
		require(
			prizeAmount <= address(this).balance, // balance of the contract itself.
			"Trying to withdraw more money than the contract has."
		);
		(bool success, ) = (msg.sender).call{value: prizeAmount}("");
		require(success, "Failed to withdraw money from contract.");
	}

	function getAllWaves() public view returns (Wave[] memory) {
		return waves;
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

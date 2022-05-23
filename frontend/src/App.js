import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import abi from "./utils/WavePortal.json";
import "./App.css";

const App = () => {
	const [waves, setWaves] = useState(0);
	const [currentAccount, setCurrentAccount] = useState("");
	const [allWaves, setAllWaves] = useState([]);
	const [message, setMessage] = useState("");

	const contractAddress = "0x074737bA78F7f16bE3bd53d0Df6392d3735c1230";
	const contractABI = abi.abi;

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log("Make sure you have metamask!");
				return;
			} else {
				console.log("We have the ethereum object", ethereum);
			}

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account:", account);
				setCurrentAccount(account);
				getAllWaves();
			} else {
				console.log("No authorized account found.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const getWaveCount = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count:", count.toNumber());
				setWaves(count.toNumber());
			} else {
				console.log("Ethereum object does not exist.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const wave = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count:", count.toNumber());
				setWaves(count.toNumber());

				const waveTxn = await wavePortalContract.wave(message);
				console.log("Mining...", waveTxn.hash);

				await waveTxn.wait();
				console.log("Mined --", waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count:", count.toNumber());
				setWaves(count.toNumber());
			} else {
				console.log("Ethereum object does not exist.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getAllWaves = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				const waves = await wavePortalContract.getAllWaves();

				let wavesCleaned = [];
				waves.forEach((wave) => {
					wavesCleaned.push({
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message,
					});
				});
				setAllWaves(wavesCleaned);
			} else {
				console.log("Ethereum object does not exist.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
		getWaveCount();
	}, []);

	useEffect(() => {
		let wavePortalContract;

		const onNewWave = (from, timestamp, message) => {
			console.log("NewWave", from, timestamp, message);
			setAllWaves((prevState) => [
				...prevState,
				{
					address: from,
					timestamp: new Date(timestamp * 1000),
					message: message,
				},
			]);
			setMessage("");
		};

		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			wavePortalContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);
			wavePortalContract.on("NewWave", onNewWave);
		}

		return () => {
			if (wavePortalContract) {
				wavePortalContract.off("NewWave", onNewWave);
			}
		};
	}, []);

	useEffect(() => {
		getAllWaves();
	}, [currentAccount]);

	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">hey friend.</div>

				{currentAccount != "" ? (
					<>
						<div className="bio">drop a link.</div>
						<div className="bio">count: {waves}</div>
						<input
							className="inputField"
							style={{ textAlign: "center" }}
							value={message}
							placeholder="spotify link here."
							onChange={(e) => {
								setMessage(e.target.value);
							}}
						/>

						<button className="waveButton" onClick={wave}>
							send.
						</button>
					</>
				) : null}

				{!currentAccount && (
					<button className="waveButton" onClick={connectWallet}>
						connect wallet.
					</button>
				)}

				{allWaves.map((wave, index) => {
					return (
						<div
							key={index}
							style={{ marginTop: "16px", padding: "8px" }}
						>
							<div>address: {wave.address}</div>
							<div>time: {wave.timestamp.toString()}</div>
							<div>message: {wave.message}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default App;

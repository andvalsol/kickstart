import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We're running the browser and metamask is running, so hijack the current provider
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    // We're on the server  *OR* the user is not using metamask, so grab the provider from Infura
    const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/566789e052894ffc934f58879f4002e2");

    web3 = new Web3(provider);
}

export default web3;

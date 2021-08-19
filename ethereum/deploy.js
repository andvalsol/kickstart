const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const factory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    "",
    // remember to change this to your own phrase!
    ""
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    const result = await new web3.eth.Contract(JSON.parse(factory.interface))
        .deploy({ data: factory.bytecode })
        .send({ gas: "1000000", from: accounts[0], gasPrice: '5000000000' });

    // Get the address of the deployed contract
    console.log("Contract deployed to", result.options.address);
};
deploy();

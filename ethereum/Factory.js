import web3 from "./web3"; // We're using our own web3 object
import CampaignFactory from "./build/CampaignFactory.json"

// Create a contract instance
const CampaignFactoryContract = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),
    '0x80809cd3CB4006e8C0E611d0eCfFfB93a2D11EE2');

export default CampaignFactoryContract;

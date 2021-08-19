const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider()); // In order to add the ethereum providers

const compiledFactory = require('../../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../../ethereum/build/Campaign.json');

let accounts;
let manager;
let factory;

let campaign;
let campaignAddress;

beforeEach(async () => {
    // Get the list of accounts
    accounts = await web3.eth.getAccounts();

    manager = accounts[0];

    // Remember that we will only create a factory and each user will create their own campaign
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
            from: manager,
            gas: '1000000', // TODO this is an arbitrary number, se which number should be added here
        });

    /*
    * Although we want the user to create their separate campaign, we need to test how this contact works.
    * Use the factory to create an instance of a campaign
    * */
    await factory.methods.deployCampaign(web3.utils.toWei('0.01', 'ether')).send({
        from: manager,
        gas: '1000000' // TODO this is sent as a string?
    });

    // Use array destructuring and set the campaign address as the first argument passed
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); // Use call since the function is a view function

    // When we pass the address then we tell web3 that there´s already an existent address, without it, it will create an address
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Tests for the Campaign.sol file', () => {
    it('Deploys a factory and a campaign', () => {
        // If a contract has an address it means that it was deployed
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();

        assert.equal(manager, manager);
    });

    it('Allows people to contribute and mark them as contributors', async () => {
        const user = accounts[1];

        await campaign.methods.contribute().send({
            value: web3.utils.toWei('0.02', 'ether'),
            from: user
        });

        // Get access to the contributors mapping object and check if user is inside the mapping
        const isContributor = await campaign.methods.contributors(user).call();

        assert(isContributor);
    });

    it('Requires a minimum contribution', async () => {
       let failed = undefined;
        try {
            await campaign.methods.contribute().send({
                value: web3.utils.toWei('0.001', 'ether'),
                from: manager
            });

            failed = false;
        } catch (_) {
            failed = true;
        }

        assert(failed);
    });

    it('Allows a manager to create a campaign request', async () => {
       const description = 'Buy batteries';

       await campaign.methods.createRequest(description, web3.utils.toWei('0.0001', 'ether'), accounts[1]).send({
          from: manager,
          gas: '1000000'
       });

       // Get the first index since Solidity returns us only one value
       const request = await campaign.methods.requests(0).call();

       assert.equal(request.description, description);
    });

    it('Processes the request', async () => {
       const contributor = accounts[1];

       await campaign.methods.contribute().send({
          value: web3.utils.toWei('10', 'ether'),
          from: contributor
       });

       await campaign.methods.createRequest('Buy wires', web3.utils.toWei('5', 'ether'), accounts[1]).send({
          from: manager,
          gas: '1000000'
       });

       await campaign.methods.approveRequest(0).send({
          from: contributor,
          gas: '1000000'
       });

       let contributorPreviousBalance = await web3.eth.getBalance(contributor);
       contributorPreviousBalance = web3.utils.fromWei(contributorPreviousBalance, 'ether');

      await campaign.methods.finalizeRequest(0).send({
         from: manager,
         gas: '1000000'
      });

      // Retrieve the balance of the contributor
       let contributorAfterBalance = await web3.eth.getBalance(contributor);
       contributorAfterBalance = web3.utils.fromWei(contributorAfterBalance, 'ether');
       contributorAfterBalance = parseFloat(contributorAfterBalance);

       assert(contributorPreviousBalance < contributorAfterBalance);
    });
});


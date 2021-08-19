pragma solidity ^0.4.17;


// This contract will be in charge of pushing new Campaigns
contract CampaignFactory {
    address[] public deployedCampaigns;

    function deployCampaign(uint minimumContribution) public {
        address deployedAddress = new Campaign(minimumContribution, msg.sender);

        deployedCampaigns.push(deployedAddress);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // NOTE: Structs don't have the public accessibility modifier
    struct Request {
        string description;
        address recipient;
        uint value;
        bool complete;
        uint32 approvalCount;
        mapping(address => bool) approvers;
    }

    // NOTE: The following variables are stored in the storage
    address public manager;

    uint public minContribution;

    mapping(address => bool) public contributors;

    uint32 contributorsCount;

    Request[] public requests;

    modifier isManager() {
        require(manager == msg.sender);
        _;
    }

    constructor(uint contribution, address msgSender) public {
        manager = msgSender;
        minContribution = contribution;
    }

    function contribute() public payable {
        // Make sure that the user has sent more or equal to the minimum contribution
        require(msg.value >= minContribution, 'The amount to contribute must be equal or greater that the minimum contribution');

        // Add the user to the array of contributors
        contributors[msg.sender] = true;

        contributorsCount++;
    }

    function createRequest(string description, uint value, address recipient) public isManager { // Only a manager should be able to create a request
        // Create a new request and add it into the requests array
        Request memory request = Request({ // We don't use new since is not a contract
        description: description,
        recipient: recipient,
        value: value, // TODO use the value of the contract itself
        complete: false,
        approvalCount: 0 // We don't have to initialize a reference type, like for example a mapping
        });

        requests.push(request);
    }

    function approveRequest(uint requestIndex) public {
        // We have to check that the person has already donated to the Campaign
        require(contributors[msg.sender], "Need to be a contributor first");

        // Add storage since we want to manipulate the storage instance of the request
        Request storage request = requests[requestIndex];

        // Check if the person already voted
        require(!request.approvers[msg.sender], "Can't vote a second time");

        // Add the persons address to the approvers
        request.approvalCount++;

        request.approvers[msg.sender] = true;
    }

    function finalizeRequest(uint requestIndex) public isManager {
        Request storage request = requests[requestIndex];

        // Check if the request is has not been finalized/complete
        require(!request.complete, "Sorry but the request has already been finalized");
        require(request.approvalCount >= contributorsCount / 2, "Need to have at least 50% of the contributors to approve the request");

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}

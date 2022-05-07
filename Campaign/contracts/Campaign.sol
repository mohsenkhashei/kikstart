// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract CampaignFactory {
    address[] public deployedCampaigns;

    
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}


contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    // array of request
    uint256 numRequests;
    mapping (uint256 => Request) public requests;
    // manager address
    address public manager;
    // minimu amount to contribute
    uint public minimumContribution;
    // map of approvers 
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }   

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }
    

    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage r = requests[numRequests++];
            r.description = description;
            r.value = value;
            r.recipient = recipient;
            r.complete = false;
            r.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        // cheking exsitense of approver
        require(approvers[msg.sender]);

        // cheking address exist inside of mapping
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        //check request are not mark as complete
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete = true;

    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return numRequests;
    }
}
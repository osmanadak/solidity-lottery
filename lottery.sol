pragma solidity ^0.4.18;


contract EvenOddGame {
    uint nonce = 0;
    
    address public ownerAddress;
    
    event UserWon(address player, uint generatedNumber);
    //event UserLost(address player, uint generatedNumber);
    
    address[] public participants;
    address[] public winners;
    uint numberOfParticipants = 5;
    uint public sequence = 0;
    
    function () public payable {}
    
    constructor(uint _numberOfParticipants) {
        numberOfParticipants = _numberOfParticipants;
    }
    
    function bet() public payable {
        require(msg.value == 1 ether);
        participants.push(msg.sender);
        if(participants.length == numberOfParticipants) {
            uint randomNumber = uint(keccak256(now, nonce)) % numberOfParticipants;
            nonce++;
            participants[randomNumber].transfer(msg.value*(numberOfParticipants - 1));
            winners.push(msg.sender);
            UserWon(participants[randomNumber], randomNumber);
            sequence = 0;
            participants = new address[](0);
        }else{
            sequence++;
        }
    }
    
    function withdrawTotalBalance () public payable {
        ownerAddress.transfer(address(this).balance);
    }
    
    function setOwnerAddress(address newOwnerAddress) public {
        ownerAddress = newOwnerAddress;
    }
    
    function getContractBalance () public view returns(uint256) {
        return this.balance;
    }
    
    function getParticipantsCount () public view returns(uint256) {
        return participants.length;
    }
    
    function getOwnerAddress () public view returns(address) {
        return ownerAddress;
    }
}

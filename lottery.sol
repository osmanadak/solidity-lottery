pragma solidity ^0.4.18;

contract Lottery {
    uint nonce = 0;
    
    address public ownerAddress;
    address[] public participants;
    address[] public winners;
    uint numberOfParticipants;
    uint public sequence = 0;
    
    event Draw(address player, uint generatedNumber);
    
    
    function () public payable {}
    
    constructor(uint _numberOfParticipants, address _ownerAddress) public {
        numberOfParticipants = _numberOfParticipants;
        ownerAddress = _ownerAddress;
    }
    
    function buyTicket() public payable {
        require(msg.value == 1 ether);
        participants.push(msg.sender);
        if(participants.length == numberOfParticipants) {
            uint randomNumber = uint(keccak256(now, nonce)) % numberOfParticipants;
            nonce++;
            participants[randomNumber].transfer(msg.value*(numberOfParticipants - 1));
            winners.push(participants[randomNumber]);
            emit Draw(participants[randomNumber], randomNumber);
            sequence = 0;
            participants = new address[](0);
        }else{
            sequence++;
        }
    }
    
    function withdrawTotalBalance () public payable {
        require(sequence == 0); //Cant withdraw when participants wait
        ownerAddress.transfer(address(this).balance);
    }
    
    function setOwnerAddress(address newOwnerAddress) public {
        require(msg.sender == ownerAddress);
        ownerAddress = newOwnerAddress;
    }
    
    function getContractBalance () public view returns(uint256) {
        return address(this).balance;
    }
    
    function getParticipantsCount () public view returns(uint256) {
        return participants.length;
    }
    
    function getOwnerAddress () public view returns(address) {
        return ownerAddress;
    }
}

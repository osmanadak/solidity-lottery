pragma solidity ^0.4.18;

contract Lottery {
    uint nonce = 0;
    
    address private _ownerAddress;
    address[] private _participants;
    address[] private _winners;
    uint private _numberOfParticipants;
    uint private _sequence = 0;
    
    event Draw(address player, uint generatedNumber);
    
    
    function () public payable {}
    
    constructor(uint numberOfParticipants, address ownerAddress) public {
        _numberOfParticipants = numberOfParticipants;
        _ownerAddress = ownerAddress;
    }
    
    function buyTicket() public payable {
        require(msg.value == 0.1 ether);
        _participants.push(msg.sender);
        if(_participants.length == _numberOfParticipants) {
            uint randomNumber = uint(keccak256(now, nonce)) % _numberOfParticipants;
            nonce++;
            _participants[randomNumber].transfer(msg.value*(_numberOfParticipants - 1));
            _winners.push(_participants[randomNumber]);
            emit Draw(_participants[randomNumber], randomNumber);
            _sequence = 0;
            _participants = new address[](0);
        }else{
            _sequence++;
        }
    }
    
    function withdrawTotalBalance () public payable {
        require(_sequence == 0); //Cant withdraw when participants wait
        _ownerAddress.transfer(address(this).balance);
    }
    
    function setOwnerAddress(address newOwnerAddress) public {
        require(msg.sender == _ownerAddress);
        _ownerAddress = newOwnerAddress;
    }
    
    function getContractBalance () public view returns(uint256) {
        return address(this).balance;
    }
    
    function getOwnerAddress () public view returns(address) {
        return _ownerAddress;
    }
    
    function getWinners () public view returns(address[]) {
        return _winners;
    }
    
    function getParticipants () public view returns(address[]) {
        return _participants;
    }
}

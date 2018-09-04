$(document).ready(function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    console.log("metamask");
    web3js = new Web3(web3.currentProvider);


    // Gets networks name
    web3js.version.getNetwork((err, netId) => {
      console.log("Netid " + netId);
      if(!!err){
        alert(err);
      }
      if(netId != 3){
        alert("Please connect to Ropsten Network");
      }
      switch (netId) {
        case "1":
          console.log('This is mainnet')
          break
        case "2":
          console.log('This is the deprecated Morden test network.')
          break
        case "3":
          console.log('This is the ropsten test network.')
          break
        default:
          console.log('This is an unknown network.')
      }
    });
  } else {
    // Handle the case where the user doesn't have web3. Probably
    // show them a message telling them to install Metamask in
    // order to use our app.
    // For example
    web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    alert("Please install metamask");
    return false;
  }
  abi = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"generatedNumber","type":"uint256"}],"name":"Draw","type":"event"},{"constant":false,"inputs":[],"name":"buyTicket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwnerAddress","type":"address"}],"name":"setOwnerAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawTotalBalance","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"numberOfParticipants","type":"uint256"},{"name":"ownerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"getContractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwnerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getParticipants","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getParticipantsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getWinners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"}]');
  Lottery = web3js.eth.contract(abi).at('0x7cdaf39d6a2331aa85633479b90f5e20bb2e8c1f');

  getOwnerAddress();
  getBalance();
});

function getBalance(){
  Lottery.getContractBalance(function (error, result) {
      if (!error)
          $('#totalBalance').text(web3.fromWei(result))
      else
          console.error(error);
  });
}
function getOwnerAddress(){
  Lottery.getOwnerAddress(function (error, result) {
      if (!error)
          $('#ownerAddress').text(result);
      else
          console.error(error);
  });
}

function playGame() {
  Lottery.playGame({value: web3.toWei('0.01', 'ether')},function(error, result) {
    if (!error)
          console.log(result);
      else
          console.error(error);
  });
}

function changeContractOwner() {
  owner = $('#owner').val();
  Lottery.setOwnerAddress(owner, function(error, result) {
    if (!error){
        console.log(result);
        getOwnerAddress();
        $('#owner').val('');
      }else{
        console.error(error);
      }
  });
}

function withdrawAll() {
  Lottery.withdrawTotalBalance(function (error, result) {
      if (!error){
        console.log(result);
      }else{
        console.error(error);
      }
  });
}

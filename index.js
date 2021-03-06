function appStart() {
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
          //1-Mainnet 3-Ropsten
          $('#content').html('<h1>Please connect to Ropsten Network</h1>');
          return false;
        }
      });
    } else {
      // Handle the case where the user doesn't have web3. Probably
      // show them a message telling them to install Metamask in
      // order to use our app.
      // For example
      web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      $('#content').html('<h1>Please install metamask</h1>');
      return false;
    }
    abi = JSON.parse('[{"constant":true,"inputs":[],"name":"getOwnerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwnerAddress","type":"address"}],"name":"setOwnerAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getParticipants","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getContractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getWinners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawTotalBalance","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"buyTicket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"numberOfParticipants","type":"uint256"},{"name":"ownerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"generatedNumber","type":"uint256"}],"name":"Draw","type":"event"}]');
    Lottery = web3js.eth.contract(abi).at('0xe0343bea59c5bfc4a908d2302924caf03716e8b9');
  
    getOwnerAddress();
    getBalance();
    getWinners();
    getParticipants();
  }

  $(document).ready(function(){
      appStart();
  });
  
  function getWinners(){
    Lottery.getWinners(function (error, result) {
        if (!error){
            if(result.length > 0){
                $('#winners').html('<h3>Winners</h3>');
                for (var i = 0; i < result.length; i++) {
                    $('#winners').append("<div class='col-md-12'>"+(i+1)+" - "+result[i]+"</div>");
                }
            }else{
                $('#winners').html(''); 
            } 
        }else{
            console.error(error);
        }
    });
  }
  
  function getParticipants(){
    Lottery.getParticipants(function (error, result) {
        if (!error){
            if(result.length > 0){
                $('#participants').html('<h3>Participants of Current Round</h3>');
                for (var i = 0; i < result.length; i++) {
                    $('#participants').append("<div class='col-md-12'>"+(i+1)+" - "+result[i]+"</div>");
                }
            }else{
                $('#participants').html(''); 
            }   
        }else{
            console.error(error);
        }
    });
  }
  
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
  
  function buyTicket() {
    Lottery.buyTicket({value: web3.toWei('0.1', 'ether')},function(error, result) {
      if (!error){
          var txHash = result;
          console.log(txHash);
          buyTicketMined(txHash);
      }else{
        console.error(error);
      }
    });
  }

  function buyTicketMined(txHash) {
      console.log("callWhenMined is started.");
      
      web3js.eth.getTransactionReceipt(txHash, function(error, rcpt){
        if(error){
            console.error(error);
        }else{
            if(rcpt == null){
                setTimeout(function(){
                    buyTicketMined(txHash);
                },500);
            }else{
                getParticipants();
                getWinners();
            }
        }
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

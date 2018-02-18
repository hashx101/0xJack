 // import { BigNumber } from 'bignumber.js';
 // import { Aqueduct } from 'aqueduct';
 // import { MarketOrder } from '../market-order';
 //

var BigNumber = require('bignumber.js');
const TESTRPC_NETWORK_ID = 50;


	if (typeof web3 !== 'undefined') {
		web3Provider = web3.currentProvider;
	} else {
		// if no web3, fall back to Ganache port 7545
		web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
	}
	web3 = new Web3(web3Provider);
	var walletAddress = web3.eth.accounts[0];

	// Instantiate 0x.js instance
	const configs = {
	    networkId: TESTRPC_NETWORK_ID,
	};
	const zeroEx = new ZeroEx.ZeroEx(web3Provider, configs);

function reset(){

	getBalance(walletAddress);

	// Reset
	$(".dealer-cards").html("<div class='card card1'></div><div class='card card2 flipped'></div><div class='new-cards'></div><div class='clear'></div><div id='dealerTotal' class='dealer-total'></div>");

	$(".player-cards").html("<div class='card card1'></div><div class='card card2'></div><div class='new-cards'></div><div class='clear'></div><div id='playerTotal' class='player-total'></div>");

	var reloadGame = "<button type='button' class='btn btn-primary' id='hit'>Hit</button><button type='button' class='btn btn-primary' id='stand'>Stand</button>";
	$(".buttons").html(reloadGame);

	$(".dealer-cards").css("width","");
	$(".player-cards").css("width","");

	$("#playerTotal").html('');
	$("#dealerTotal").html('');
	$("#message").html('');

	var money = parseInt($("#money").html());
	$("#money").html(money);

}

function getBalance (address) {
  return web3.eth.getBalance(address, function (error, result) {
    if (!error) {
      console.log(result.toNumber());
			var balance = result.toNumber();
			var ethBalance = web3.fromWei(balance, 'ether').toString();
			$("#wallet-address").html(walletAddress);

			$("#eth-balance").html(ethBalance);

    } else {
      console.error(error);
    }
  })
}


function ethOut() {
	$("#eth-out").click(function(){
		// Convert all Credits to ETH
		var credits = parseInt($("#money").html());
		console.log(credits);
		//var zrxAmount = parseFloat((credits/50).toFixed(6));
		var ethAmount = 0;
		// TODO: grab real-time exchange rate from relayers
		if (credits > 0)
		{
			ethAmount = parseFloat((credits*0.001245).toFixed(6));
		}

		// TODO: Fill order to trade all ZRX to ETH and insert to user wallet address;

		// if success, empty game credits balance;
		// Log transactions if success and Zrx is not 0

		if (ethAmount == 0 || ethAmount == 'NaN')
		{
			ethAmount = 0;
			console.log('0');
			return false;
		}

		$("#money").html('0');


		$("#transactions").append( "Your ETH-out balance is: "+ ethAmount + " ETH.</br>");


		// update wallet balance
		// getBalance(walletAddress);


		// hard code for now:
		var temp_eth_bal = $("#eth-balance").html();
		var final_eth_bal = parseFloat(parseFloat(temp_eth_bal) + parseFloat(ethAmount)).toFixed(6);
		$("#eth-balance").html(final_eth_bal);
		$("#transactions").append( "Total final ETH balance is: "+ final_eth_bal + " ETH.</br>");


	});
}

/*function fileMarketOrderBuyInZRX(zrxAmount){
	Aqueduct.Initialize();

	(async () => {
		const txHash = await new MarketOrder({
			account: walletAddress,
			baseTokenSymbol: 'ZRX',
			quoteTokenSymbol: 'WETH',
			// buy zrx
			quantityInWei: ZeroEx.ZeroEx.toBaseUnitAmount(new BigNumber(zrxAmount), 18),
			nodeUrl: 'http://localhost:8545',
			type:'buy'
		}).execute();
		console.log(`market order placed - txHash: ${txHash}`);

		$("#transactions").append(`market order placed for ${zrxAmount} ZRX.  txHash: ${txHash}`);

		process.exit(0);

	}) ();
}*/


// Number of decimals to use (for ETH and ZRX)
const DECIMALS = 18;

/**
$ testrpc -p 8545 --networkId 50 --db ./0x_testrpc_snapshot -m "${npm_package_config_mnemonic}"
EthereumJS TestRPC v6.0.3 (ganache-core: 2.0.2)

Available Accounts
==================
(0) 0x5409ed021d9299bf6814279a6a1411a7e866a631
(1) 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb
(2) 0xe36ea790bc9d7ab70c55260c66d52b1eca985f84
(3) 0xe834ec434daba538cd1b9fe1582052b880bd7e63
(4) 0x78dc5d2d739606d31509c31d654056a45185ecb6
(5) 0xa8dda8d7f5310e4a9e24f8eba77e091ac264f872
(6) 0x06cef8e666768cc40cc78cf93d9611019ddcb628
(7) 0x4404ac8bd8f9618d27ad2f1485aa1b2cfd82482d
(8) 0x7457d5e02197480db681d3fdf256c7aca21bdc12
(9) 0x91c987bf62d25945db517bdaa840a6c661374402

*/
function fileOrder(ethBuyInAmount, creditAmount) {
  (async () => {
      // Addresses
      const WETH_ADDRESS = zeroEx.etherToken.getContractAddressIfExists().toString(); // The wrapped ETH token contract
			console.log('WETH Address: ' + WETH_ADDRESS);

			const ZRX_ADDRESS = zeroEx.exchange.getZRXTokenAddress(); // The ZRX token contract
			console.log('ZRX Address: ' + ZRX_ADDRESS);

      // The Exchange.sol address (0x exchange smart contract)
      const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();

      // Getting list of accounts
      const accounts = await zeroEx.getAvailableAddressesAsync();
      console.log('accounts: ', accounts);
      // Set our addresses
      //const [makerAddress, takerAddress] = accounts;
			const makerAddress = accounts[0];
			const takerAddress = makerAddress;
			//const makerAddress = walletAddress;
			//const takerAddress = '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb';


			console.log('makeraddress; ' + makerAddress);
			console.log('takerAddress: ' + takerAddress);

      // Unlimited allowances to 0x proxy contract for maker and taker
      const setMakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, makerAddress);
      await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash);

      const setTakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress);
      await zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash);
      console.log('Taker allowance mined...');

      // Deposit WETH
      const ethAmount = new BigNumber(ethBuyInAmount);
      const ethToConvert = ZeroEx.ZeroEx.toBaseUnitAmount(ethAmount, DECIMALS); // Number of ETH to convert to WETH

      const convertEthTxHash = await zeroEx.etherToken.depositAsync(WETH_ADDRESS, ethToConvert, takerAddress);
      await zeroEx.awaitTransactionMinedAsync(convertEthTxHash);
      console.log(`${ethAmount} ETH -> WETH conversion mined...`);

      // Generate order
      const order = {
          maker: makerAddress,
          taker: ZeroEx.ZeroEx.NULL_ADDRESS,
          feeRecipient: ZeroEx.ZeroEx.NULL_ADDRESS,
          makerTokenAddress: ZRX_ADDRESS,
          takerTokenAddress: WETH_ADDRESS,
          exchangeContractAddress: EXCHANGE_ADDRESS,
          salt: ZeroEx.ZeroEx.generatePseudoRandomSalt(),
          makerFee: new BigNumber(0),
          takerFee: new BigNumber(0),
          makerTokenAmount: ZeroEx.ZeroEx.toBaseUnitAmount(new BigNumber(0.2), DECIMALS), // Base 18 decimals
          takerTokenAmount: ZeroEx.ZeroEx.toBaseUnitAmount(new BigNumber(0.3), DECIMALS), // Base 18 decimals
          expirationUnixTimestampSec: new BigNumber(Date.now() + 3600000), // Valid for up to an hour
      };

      // Create orderHash
      const orderHash = ZeroEx.ZeroEx.getOrderHashHex(order);
			console.log('orderHash: ' + orderHash);

			// TODO:
			/*
      // Signing orderHash -> ecSignature
      const shouldAddPersonalMessagePrefix = false;
      const ecSignature = await zeroEx.signOrderHashAsync(orderHash, makerAddress, shouldAddPersonalMessagePrefix);

      // Appending signature to order
      const signedOrder = {
          ...order,
          ecSignature,
      };

      // Verify that order is fillable
      await zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder);

      // Try to fill order
      const shouldThrowOnInsufficientBalanceOrAllowance = true;
      const fillTakerTokenAmount = ZeroEx.ZeroEx.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);

      // Filling order
      const txHash = await zeroEx.exchange.fillOrderAsync(
          signedOrder,
          fillTakerTokenAmount,
          shouldThrowOnInsufficientBalanceOrAllowance,
          takerAddress,
      );

      // Transaction receipt
      const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);

      console.log('FillOrder transaction receipt: ', txReceipt);
			*/
			//$("#transactions").html('');
			$("#transactions").append("Buy-in Game Credits: " + creditAmount + " Order filed: " + orderHash + "</br>");
      //$("#transactions").append("Order Filed for txHash: " + txHash + " Transaction receipt:  " + txReceipt);


			var money = parseInt($("#money").html()) + parseInt(creditAmount);
			$("#money").html(money);

	}) ();
}

function deal(){

	reset();
	ethOut();

/// Store cards in array
	var cards = ["ace-of-clubs","two-of-clubs","three-of-clubs","four-of-clubs","five-of-clubs","six-of-clubs","seven-of-clubs","eight-of-clubs","nine-of-clubs","ten-of-clubs","jack-of-clubs","queen-of-clubs","king-of-clubs","ace-of-spades","two-of-spades","three-of-spades","four-of-spades","five-of-spades","six-of-spades","seven-of-spades","eight-of-spades","nine-of-spades","ten-of-spades","jack-of-spades","queen-of-spades","king-of-spades","ace-of-hearts","two-of-hearts","three-of-hearts","four-of-hearts","five-of-hearts","six-of-hearts","seven-of-hearts","eight-of-hearts","nine-of-hearts","ten-of-hearts","jack-of-hearts","queen-of-hearts","king-of-hearts","ace-of-diamonds","two-of-diamonds","three-of-diamonds","four-of-diamonds","five-of-diamonds","six-of-diamonds","seven-of-diamonds","eight-of-diamonds","nine-of-diamonds","ten-of-diamonds","jack-of-diamonds","queen-of-diamonds","king-of-diamonds"];

	/// Store correlating values in an array
	var values = [11,2,3,4,5,6,7,8,9,10,10,10,10,11,2,3,4,5,6,7,8,9,10,10,10,10,11,2,3,4,5,6,7,8,9,10,10,10,10,11,2,3,4,5,6,7,8,9,10,10,10,10];

	/// Zero out dealer total
	var dealerTotal = 0;
	$(".dealer-cards .card").each(function(){

		// TODO: improve card dealing randomness
		var num = Math.floor(Math.random()*cards.length);
		var cardClass = cards[num];

		$(this).addClass(cardClass);

		$(this).attr("data-value",values[num]);

		dealerTotal = parseInt(dealerTotal) + parseInt(values[num]);

		if(dealerTotal>21){
			$(".dealer-cards .card")
      .each(function(){
				if($(this).attr("data-value")==11){
					dealerTotal = parseInt(dealerTotal) - 10;
					$(this).attr("data-value", 1);
				}
			});
		}

		$("#dealerTotal").html(dealerTotal);

		cards.splice(num, 1);
		values.splice(num, 1);
	});

	/// Zero out player total
	var playerTotal = 0;
	$(".player-cards .card").each(function(){

		var num = Math.floor(Math.random()*cards.length);
		var cardClass = cards[num];

		$(this).addClass(cardClass);

		$(this).attr("data-value",values[num]);

		playerTotal = parseInt(playerTotal) + parseInt(values[num]);

		if(playerTotal>21){
			$(".player-cards .card").each(function(){
				if($(this).attr("data-value")==11){
					playerTotal = parseInt(playerTotal) - 10;
					$(this).attr("data-value",1);
				}
			});
		}

		$("#playerTotal").html(playerTotal);

		cards.splice(num, 1);
		values.splice(num, 1);

	});

	// Buy Credits
	$("#buy-50").click(function(){
		if ($("#money").html() == ''){
			$("#money").html('0');
		}
		// TODO: Call aqeduct API to buy 1 ZRX with WETH
		//fileMarketOrderBuyInZRX(1);
			fileOrder(0.063, 50);

			// if success:
			// first


			// print smart contract address under Transactions

			// console.log("Buy in not successful.");
			// $("#message").html("Buy-in 50 not successful.");


		// else : console.log, show message transaction failed.
	});

	$("#buy-100").click(function(){
		if ($("#money").html() == ''){
			$("#money").html('0');
		}
		fileOrder(0.126, 100);


		// TODO: Call aqeduct API to buy 2 ZRX with WETH
		// if success:
		// var money = parseInt($("#money").html()) + parseInt(100);
		// $("#money").html(money);
		// print smart contract address under Transactions

		// else : console.log, show message transaction failed.
	});

	$("#buy-500").click(function(){
		if ($("#money").html() == ''){
			$("#money").html('0');
		}

		// TODO: Call aqeduct API to buy 10 ZRX with WETH
		// if success:
		fileOrder(0.63, 500);

		// var money = parseInt($("#money").html()) + parseInt(500);
		// $("#money").html(money);
		// print smart contract address under Transactions

		// else : console.log, show message transaction failed.
	});

	$("#buy-1000").click(function(){
		if ($("#money").html() == ''){
			$("#money").html('0');
		}

		// TODO: Call aqeduct API to buy 20 ZRX with WETH
		// if success:
		fileOrder(1.26, 1000);

		// var money = parseInt($("#money").html()) + parseInt(1000);
		// $("#money").html(money);
		// print smart contract address under Transactions

		// else : console.log, show message transaction failed.
	});

	/// If player hits
	$("#hit").click(function(){
		var num = Math.floor(Math.random()*cards.length);
		var cardClass = cards[num];

		var newCard = "<div class='card " +  cardClass + "' data-value='" + values[num] + "'></div>";
		$(".player-cards .new-cards").append(newCard);

		playerTotal = parseInt(playerTotal) + parseInt(values[num]);

		if(playerTotal>21){
			$(".player-cards .card").each(function(){
				if($(this).attr("data-value")==11){
					playerTotal = parseInt(playerTotal) - 10;
					$(this).attr("data-value",1);
				}
			});
		}

		cards.splice(num, 1);
		values.splice(num, 1);

		$("#playerTotal").html(playerTotal);
		$(".player-cards").width($(".player-cards").width()+84);


		if(playerTotal>21){
			$("#message").html('Bust!');
			var reloadGame = "<button class='btn btn-primary' id='deal'>Deal</button>";
			$(".buttons").html(reloadGame);

			/// Pay up
			$("#bet").html('0');
			return false;
		}
	});

	/// If player stands
	$("#stand").click(function(){

		$("#dealerTotal").css("visibility","visible");
		$(".card2").removeClass("flipped");

		//// Keep adding a card until over 17 or dealer busts
		var keepDealing = setInterval(function(){

			var dealerTotal = $("#dealerTotal").html();
			var playerTotal = $("#playerTotal").html();

			/// If there are aces
			if(dealerTotal>21){
				$(".dealer-cards .card").each(function(){

					//// and check if still over 21 in the loop
					if($(this).attr("data-value")==11 && dealerTotal>21){
						dealerTotal = parseInt(dealerTotal) - 10;
						$(this).attr("data-value",1);
					}
				});
			}

			if(dealerTotal>21){
				$("#message").html('Dealer Bust!');
				var reloadGame = "<button type='button' class='btn btn-primary' id='deal'>Deal</button>";
				$(".buttons").html(reloadGame);
				clearInterval(keepDealing);
				/// Pay up
				var bet = $("#bet").html();
				var money = $("#money").html();
				var winnings = bet * 2;
				$("#bet").html('0');
				$("#money").html(parseInt(winnings) + parseInt(money));
				return false;
			}


			if(dealerTotal>=17){
				/// You Win
				if(playerTotal>dealerTotal){

					$("#message").html('You Win!');

					/// Pay up
					var bet = $("#bet").html();
					var money = $("#money").html();
					var winnings = bet * 2;
					$("#bet").html('0');
					$("#money").html(parseInt(winnings) + parseInt(money));
				}

				/// You Lose
				if(playerTotal<dealerTotal){

					$("#message").html('You Lose!');
					/// Pay up
					var bet = $("#bet").html();
					var money = $("#money").html();
					$("#bet").html('0');
					$("#money").html(parseInt(money) - parseInt(bet));
				}
				if(playerTotal==dealerTotal){
					$("#message").html('Push!');
					var bet = $("#bet").html();
					var money = $("#money").html();
					$("#money").html(parseInt(bet) + parseInt(money));
					$("#bet").html('0');
				}
				var reloadGame = "<button type='button' class='btn btn-primary' id='deal'>Deal</button>";
				$(".buttons").html(reloadGame);
				clearInterval(keepDealing);
				return false;
			}

			// TODO: improve randomness of card dealing
			var num = Math.floor(Math.random()*cards.length);
			var cardClass = cards[num];

			var newCard = "<div class='card " +  cardClass + "' data-value='" + values[num] + "'></div>";
			$(".dealer-cards .new-cards").append(newCard);

			dealerTotal = parseInt(dealerTotal) + parseInt(values[num]);

			$("#dealerTotal").html(dealerTotal);
			$(".dealer-cards").width($(".dealer-cards").width()+84)


			cards.splice(num, 1);
			values.splice(num, 1);

			}, 300);
	});
}

$(document).ready(function(){

	deal();

	//// Bet
	$("#more").click(function(){

		var bet = 10;
		var currentBet = $("#bet").html();
		var money = $("#money").html();
		if(money==0) return false;
		if(currentBet){

			$("#bet").html(parseInt(currentBet) + bet);

			} else {

			$("#bet").html(bet);

		}

		$("#money").html(money-bet);

	});

	$("#less").click(function(){

		var bet = -10;
		var currentBet = $("#bet").html();
		if(currentBet==0) return false;

		var money = $("#money").html();

		if(currentBet){

			$("#bet").html(parseInt(currentBet) + bet);

			} else {

			$("#bet").html(bet);

		}

		$("#money").html(money-bet);

	});

	setInterval(function(){
		$("#deal").unbind('click');
		$("#deal").click(function(){
			/// location.reload();
			deal();

		});
 	}, 200);


});

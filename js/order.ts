import { BigNumber } from 'bignumber.js';
import { Aqueduct, MarketOrder } from 'aqueduct';
import { ZeroEx } from '0x.js';
import * as ws from 'ws';
//global.WebSocket = ws;

// Initialize the Aqueduct client
Aqueduct.Initialize();

(async () => {
  const txHash = await new MarketOrder({
    account: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    baseTokenSymbol: 'ZRX',
    quoteTokenSymbol: 'WETH',
    // buying .1 ZRX
    quantityInWei: ZeroEx.toBaseUnitAmount(new BigNumber(.1), 18),
    nodeUrl: 'http://localhost:7545',
    type: 'buy'
  }).execute();

  console.log(`market order placed - txHash: ${txHash}`);
  process.exit(0);
})();

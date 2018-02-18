# OxJack
Blackjack gambling powered by 0x

### Wanna win some cryptos?

Play Blackjack on 0xJack, we offer buy-in directly with ETH from your metamask wallet at your convenience!

You could also claim back ETH any time when you have earned enough tokens!

0.063 ETH = 50 0xJack Game Credits
1 0xJack Game Credit is equivalent to 1 ZRX.
In future, the plan is to allow betting directly with the ERC20 tokens.

From 0x white paper, applying 0x protocol could be a good use case for turn-based games like Blackjack:

```
"State channels are ideal for “bar tab” applications where numerous intermediate state changes may be
accumulated off-chain before being settled by a single on-chain transaction (i.e. day trading, poker,
turn-based games). If one of the channel participants leaves the channel or attempts to cheat, there is a
challenge period during which the other participant may publish the most recent message they received
from the offender. It follows that channel participants must always be online to challenge a dishonest
counterparty and the participants are therefore vulnerable to DDOS attacks. While state channels
drastically reduce the number of on-chain transactions for specific use cases, the numerous on-chain
transactions and security deposit required to open and safely close a state channel make them inefficient
for one-time transactions."
```

# How to run the project?
set up the ethereum-testrpc network:
```
> yarn testrpc
```

use another terminal to start:
```
> npm start
```

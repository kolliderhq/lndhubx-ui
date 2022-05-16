# Zonic 

Zonic is an Umbrel app that allows users to open a synthetic USD account directly from their LND node. 

## Main Concept

Zonic looks and feels like a wallet that allows you to swap Lightning Bitcoin to USD. And for the most part it is just an interface to your LND node. That is, the Bitcoin balance you see is the channel balance of your Node. However, when you convert your Bitcoin into USD Zonic will trigger a sell order on Kollider to lock in USD value. Conversely if a user wants to convert USD to Bitcoin Zonic will trigger a Buy order. It is as easy as that.

## Why? 
We've talked and posted about why this functionality might be useful. 

- [LnHedgehog: Protect your Lightning Channel Balances during Bear Markets](https://kollider.medium.com/lnhedgehog-protect-your-lightning-channel-balances-during-bear-markets-680a88979514)
- [Synthetic Stable Coins](https://twitter.com/kollider_trade/status/1496507594214723590)

## Goal 
We believe that stable coins play a fundamental role in making Bitcoin a global payment network that people can rely on. Zonic showcases how one can achieve a fiat peg without ever having to sell their Bitcoin. In the future we're envisioning other wallets to implement a similar functionality to offer a service akin to Zonic to their users. 

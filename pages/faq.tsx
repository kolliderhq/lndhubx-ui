import { Header } from "components/layout/Header"
import { useEffect, useState } from "react"
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md"

export default function FAQ() {
	const [openTabs, setOpenTabs] = useState({
		tab1: false,
		tab2: false,
		tab3: false,
		tab4: false
	})

	const onOpenTab = (tab) => {
		setOpenTabs({...openTabs, [tab]: openTabs[tab]? false: true})
	}

	return (
		<div className="w-full bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600 flex flex-col h-screen overflow-auto">
			<Header/>
			<div className="w-2/3 mx-auto h-full">
			<div className="flex flex-col fixed relative overflow-auto">
				<div className="w-full flex">
					<div className="mx-auto">
						<h1>FAQ</h1>
					</div>
				</div>
				<div className="grid lg:grid-cols-2 grid-cols-1 gap-24 mt-8 mx-auto w-full">
					<div className="">
						<div className="flex">
							<div className="cursor-pointer flex" onClick={() => onOpenTab("tab1")}>
								<div className="text-xl font-bold">What are Synthetic Fiat Accounts?</div>
								<div className="m-auto text-3xl">
									{
										openTabs["tab1"]? (
											<MdKeyboardArrowDown/>
										): (
											<MdKeyboardArrowRight/>
										)
									}
								</div>
							</div>
						</div>
						{
							openTabs["tab1"] && (
								<div className="mt-4">
									<p className="text-sm">Synthetic fiat accounts are accounts that maintain a constant fiat value while having a variable Bitcoin value.</p> <br/>
									<p className="text-sm"><span className="font-bold">For example</span> if you deposit 10,000 Sats into your synthetic USD account when the Bitcoin price is $10,000, you'll receive $1 of synthetic USD.
									Now if the price falls to $5,000 and you withdraw your $1 of synthetic USD you will receive 20,000 Sats. However if the price of Bitcoin increases to $20,000 you'll only receive
									5000 Sats. So while your USD value stays the same, the Bitcoin value of this account fluctuates.
									</p>
								</div>
							)
						}
					</div>
					<div className="">
						<div className="flex">
							<div className="cursor-pointer flex" onClick={() => onOpenTab("tab2")}>
								<div className="text-xl font-bold">How does it work?</div>
								<div className="m-auto text-3xl">
									{
										openTabs["tab2"]? (
											<MdKeyboardArrowDown/>
										): (
											<MdKeyboardArrowRight/>
										)
									}
								</div>
							</div>
						</div>
						{
							openTabs["tab2"] && (
								<div className="mt-4">
									<p className="text-sm">Synthetic fiat accounts are short positions in an inversely price perpetual swap that is settled in Bitcoin. Kollider Pay uses the open source
									project Lndhubx to provide this functionality. In essence Lndhubx is nothing more than an accouting system as well as connection to the Kollider exchange to buy and sell these
									perpetual swaps.
									</p><br/>

									<p className="text-sm"><span className="font-bold">For example: </span> 
									 On the Kollider Exchange one BTC/USD perpetual swap contract is always worth $1. If the current Bitcoin price is $10,000 then you would need to send (1 / 10000 * 100,000,000) = 10,000 Sats
									to sell (short) 1 contract. This would be the same if you were to buy a contract (long). However, since Kollider Pay is all about shorting we only talk about the short side here.
									Now, if the price of Bitcoin goes down to $5,000 then your position would make a profit of ((1/5,000 - 1/10,000) * 100,000,000) = 10,000 Sats and when you close it you would get 
									20,000 Sats (10,000 initial margin + 10,000 profit). You can see that 20,000 Sats are exaclty worth $1 at a Bitcoin price of $5,000 so you maintained the same dollar value in Bitcoin.
									Conversely, if the Bitcoin price goes up to $20,000 then your loss would be ((1/20,000 - 1/10,000) * 100,000,000) = 5,000 Sats. If you close the position at this point you would be returned
									5,000 Sats (10,000 initial margin - 5,000 loss). However, at a Bitcoin price of $20,000, 5,000 Sats are exactly worth $1 so you again maintained the same dollar value in Bitcoin.
									</p>
									<br/>
									<p className="text-sm">
										So all Kollider Pay does is to short these contracts on the users behalve and manages the position until the users wants to withdraw the funds.
									</p>
								</div>
							)
						}
					</div>
					<div className="">
						<div className="flex">
							<div className="cursor-pointer flex" onClick={() => onOpenTab("tab3")}>
								<div className="text-xl font-bold">What are the risks?</div>
								<div className="m-auto text-3xl">
									{
										openTabs["tab2"]? (
											<MdKeyboardArrowDown/>
										): (
											<MdKeyboardArrowRight/>
										)
									}
								</div>
							</div>
						</div>
						{
							openTabs["tab3"] && (
								<div className="mt-4">
									<p className="text-sm"> 
									Holding synthetic fiat is tied to three main risk factors.
									</p><br/>
									<h3 className="text-lg font-bolt">Counter Party Risk</h3>
									<p>Since Kollider Pay is custodial you're ultimately relying on the security of our hot wallets as well as on the integrity of the team that runs 
										the platform. At Kollider we believe that security of funds is paramount and takes priority above all. Nevertheless, it is impossible to design
										a system that is 100% fault tollerant and hacks can never be rulled out. By settling every trade instantly we try to mitigate this risk to an absolute
										minimum.
									</p>
									<br/>
									<h3 className="text-lg font-bolt">Liquidity Risk</h3>
									<p>Since synthetic fiat is nothing more than a short position of an inversely price perpetual swap traded on the Kollider perpetual
										futures exchange you're relying on the fact that there always needs to be a counterparty that allows you to unwind your position.
										In times of extreme market conditions it is possible that liquidity on the buy side (needed to convert your synthetic fiat back into Bitcoin)
										dries up and unwinding your position becomes impossible. If this isn't connecte to a sudden drop in price this is generally not a problem as
										you're synthetic fiat will maintain its peg.
									</p>
									<br/>
									<h3 className="text-lg font-bolt">Market Risk</h3>
									<p>Mechanically this is the biggest risk that synthetic fiat positions face. If there is a sharp drop in price it can happen that long positions
										(users that hold the other side of our synthetic fiat) are getting liquidated. Even with a leverage of 1x longs can get liquiditated whilst
										shorts cannot. This is not a problem until there is not enough taker appetite to take these long positions on. Kolliders risk engine tries to
										mitgate this risk by starting the liquidation process well in advance to find another user to take on the risk. However, if this is not possible
										our insurance fund will chip in and pay for the difference. If the insurance fund gets depleted Kollider has a last resort strategy to unwind 
										bad position which is called auto deleveraging. At this point we have to sell your synthetic fiat and you will returned your Bitcoin. In otherwords
										your fiat will be force sold in order neutralise the riks. 
									</p>
									<h3></h3>
								</div>
							)
						}
					</div>
				</div>
			</div>
			</div>
		</div>
	)
}
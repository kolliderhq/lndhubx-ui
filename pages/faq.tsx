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
		<div className="w-full bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600 h-screen flex flex-col">
			<Header/>
			<div className="w-2/3 mx-auto h-full">
			<div className="flex flex-col fixed relative">
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
				</div>
			</div>
			</div>
		</div>
	)
}
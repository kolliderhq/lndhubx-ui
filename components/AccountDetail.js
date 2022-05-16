import { VIEWS } from "consts"
import { storeDispatch } from "contexts"
import { setView } from "contexts/modules/layout"
import Img from "react-cool-img"
import { ImArrowLeft2 } from "react-icons/im"
import { UI } from "consts";
import { useAppSelector } from "hooks"
import { useEffect, useState } from "react"
import { CURRENCY_SYMBOL_MAP } from "consts/misc/currency"
import { roundDecimal } from "utils/format"

export const AccountDetail = () => {
	const [selectedWallet, wallets] = useAppSelector(state => [state.wallets.selectedWallet, state.wallets.wallets])
	const [walletBalance, setWalletBalance] = useState(0);
	const [txs, setTxs] = useState([]);

	useEffect(() => {
		let balance = wallets[selectedWallet] ? wallets[selectedWallet].balance : 0;
		setWalletBalance(roundDecimal(balance, 8));
	}, [selectedWallet, wallets])
	return (
		<div className="flex flex-col h-full p-8 relative">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="">
					<button onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}>
						<ImArrowLeft2 />
					</button>
				</div>
			</div>
			<div className="text-black mt-4">
				<div className="flex">
					<Img src={UI.RESOURCES.getCurrencySymbol(selectedWallet.toLowerCase())} className="h-10 w-10" />
					<div className="text-2xl text-black my-auto ml-4">{selectedWallet}</div>
				</div>
				<div className="text-2xl text-black my-auto text-left mt-6">{walletBalance}</div>
				<div className="flex flex-row mt-6">
					<div className="m-auto">
						<button className="border rounded-lg px-8 py-2 w-40">Send</button>
					</div>
					<div className="m-auto">
						<button className="border rounded-lg px-8 py-2 w-40" onClick={() => storeDispatch(setView(VIEWS.RECEIVE))}>Receive</button>
					</div>
				</div>
				<div className="mt-4 text-left border-b pb-2 border-gray-50">Transactions</div>
				<div className="flex h-full">
					{
						txs.length !== 0 ? (
							<div></div>
						) : (
							<div className="m-auto">
								<div className="text-xl font-bold">Add funds to get started</div>
								<div className="text-sm">Send Bitcoin from another wallet by creating an invoice.</div>
								<button className="w-3/4 border py-2 rounded-lg mt-10" onClick={() => storeDispatch(setView(VIEWS.RECEIVE))}>Receive Bitcoin</button>
							</div>
						)
					}
				</div>
			</div>
		</div>
	)
}
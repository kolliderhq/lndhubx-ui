import { VIEWS } from "consts"
import { storeDispatch } from "contexts"
import { setView } from "contexts/modules/layout"
import Img from "react-cool-img"
import { ImArrowLeft2 } from "react-icons/im"
import { MdFileDownload, MdSend } from "react-icons/md"
import { UI } from "consts";
import { useAppSelector } from "hooks"
import { useEffect, useMemo, useState } from "react"
import { CURRENCY_SYMBOL_MAP } from "consts/misc/currency"
import { roundDecimal } from "utils/format"
import useSWR from "swr"
import { API_NAMES } from "consts"
import { formatDayHour } from "utils/time"
import cn from 'clsx';

export const AccountDetail = () => {
	const [selectedWallet, wallets] = useAppSelector(state => [state.wallets.selectedWallet, state.wallets.wallets])
	const [walletBalance, setWalletBalance] = useState(0);
	const [txs, setTxs] = useState([]);

	const { data: newTxs } = useSWR([API_NAMES.TXS, selectedWallet]);

	useEffect(() => {
		if (!newTxs) return
		if (selectedWallet === "BTC") {
			newTxs = newTxs.filter(e => (e.inboundCurrency === "BTC" && e.outboundCurrency === "BTC") || e.txType === "Internal");
		}
		setTxs(newTxs.sort((a, b) => (a.createdAt < b.createdAt)))
	})

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
						<button className="border rounded-lg px-8 py-2 w-40 flex" onClick={() => storeDispatch(setView(VIEWS.SEND))}>
							<div className="mx-auto flex">
								<div className="">
									Send
								</div>

								<div className="my-auto text-lg ml-2">
									<MdSend />
								</div>
							</div>
						</button>
					</div>
					<div className="m-auto">
						<button className="border rounded-lg px-8 py-2 w-40 flex" onClick={() => storeDispatch(setView(VIEWS.RECEIVE))}>
							<div className="mx-auto flex">
								<div className="">
									Receive
								</div>
								<div className="my-auto text-lg ml-2">
									<MdFileDownload />
								</div>
							</div>
						</button>

					</div>
				</div>
				<div className="mt-4 text-left border-b pb-2 border-gray-50">Transactions</div>
				<div className="flex h-full">
					{
						txs.length !== 0 ? (
							<Table txs={txs} />
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

const Table = ({ txs }) => {
	return (
		<div className="overflow-auto w-full">
			<div className="w-full h-32">
				{
					txs.map(tx => (
						<TableCell tx={tx} />
					))
				}
			</div>
		</div>
	)
}

const TableCell = ({ tx }) => {
	const [action, setAction] = useState("");
	const [isPayment, setIsPayment] = useState(false);
	const [currencyIcon, setCurrencyIcon] = useState("");
	const [isFiat, setIsFiat] = useState(false)
	const [imageClass, setImageClass] = useState(cn("h-8 w-8"))
	const [outgoingSwap, setOutGoingSwap] = useState(false);

	const [selectedWallet, whoAmI] = useAppSelector(state => [state.wallets.selectedWallet, state.user.meta]);

	useMemo(() => {
		if (tx.outboundUid === 23193913) {
			setAction("Received")
		} else if (tx.inboundUid === 23193913) {
			setAction("Send")
		} else if (tx.inboundUid !== tx.outboundUid) {
			if (tx.outboundUid === whoAmI.uid) {
				setAction("Send")
			} else {
				setAction("Received");
			}
		} else if (tx.inboundUid === tx.outboundUid) {
			if (tx.outboundCurrency === selectedWallet) {
				setOutGoingSwap(true);
			} else {
				setOutGoingSwap(false);
			}
			setAction("Swap")
		} else {
			setAction("?")
		}

		if (tx.inboundCurrency === tx.outboundCurrency) {
			setCurrencyIcon(UI.RESOURCES.getCurrencySymbol("btc"))
		}
		if ((tx.inboundCurrency === "EUR" || tx.outboundCurrency === "EUR") && tx.txType === "Internal" && tx.inboundUid === tx.outboundUid) {
			setCurrencyIcon(UI.RESOURCES.getCurrencySymbol("btceur"))
			setImageClass(cn("h-5 w-8"));
		}

		if ((tx.inboundCurrency === "EUR" || tx.outboundCurrency === "EUR") && tx.txType === "External") {
			setCurrencyIcon(UI.RESOURCES.getCurrencySymbol("eur"))
			setImageClass(cn("h-8 w-8"));
		}

		if ((tx.inboundCurrency === "USD" || tx.outboundCurrency === "USD") && tx.txType === "Internal" && tx.inboundUid === tx.outboundUid) {
			setCurrencyIcon(UI.RESOURCES.getCurrencySymbol("btcusd"))
			setImageClass(cn("h-5 w-8"));
		}

		if ((tx.inboundCurrency === "USD" || tx.outboundCurrency === "USD") && tx.txType === "External") {
			setCurrencyIcon(UI.RESOURCES.getCurrencySymbol("usd"))
			setImageClass(cn("h-8 w-8"));
		}

		if ((tx.inboundCurrency === "USD" || tx.outboundCurrency === "USD") && tx.txType === "Internal" && tx.inboundUid !== tx.outboundUid) {
			setCurrencyIcon(UI.RESOURCES.getCurrencySymbol("usd"))
			setImageClass(cn("h-8 w-8"));
		}

		if ((tx.inboundCurrency === "EUR" || tx.outboundCurrency === "EUR") && tx.txType === "Internal" && tx.inboundUid !== tx.outboundUid) {
			setCurrencyIcon(UI.RESOURCES.getCurrencySymbol("usd"))
			setImageClass(cn("h-8 w-8"));
		}

	}, [tx])
	return (
		<div className="h-16 bg-gray-25 rounded-lg mt-2">
			<div className="flex grid grid-cols-2 h-full">
				<div className="my-auto ml-4 flex">
					<div className="my-auto">
						<Img src={currencyIcon} className={imageClass} />
					</div>
					<div className="flex flex-col text-left">
						<div className="ml-2 font-bolt text-sm my-auto">{action}</div>
						<div className="ml-2 font-light text-xs my-auto">{formatDayHour(tx.createdAt)}</div>
					</div>
				</div>
				{
					action === "Received" && (
						<div className="my-auto text-green-400">
							+{roundDecimal(Number(tx.inboundAmount), 8)}
						</div>
					)
				}
				{
					action === "Send" && (
						<div className="my-auto text-red-400">
							-{roundDecimal(Number(tx.outboundAmount), 8)}
						</div>
					)
				}
				{
					action === "Swap" && outgoingSwap && (
						<div className="my-auto text-red-400">
							- {roundDecimal(Number(tx.outboundAmount), 8)}
						</div>
					)
				}
				{
					action === "Swap" && !outgoingSwap && (
						<div className="my-auto text-green-400">
							+ {roundDecimal(Number(tx.inboundAmount), 8)}
						</div>
					)
				}
			</div>
		</div>
	)
}
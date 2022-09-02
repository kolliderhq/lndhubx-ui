import { MdClose, MdOutlineArrowDropDown } from "react-icons/md";
import { storeDispatch } from "contexts";
import { VIEWS } from "consts";
import { setView } from "contexts/modules/layout";
import { setSelectedWallet } from "contexts/modules/wallet";
import { useEffect, useState } from "react";
import { useAppSelector } from "hooks";
import Img from "react-cool-img"
import useSWR from 'swr';
import { UI } from "consts";
import { API_NAMES } from "consts";
import { getRequest } from "utils/api";
import { QrCode } from "./QrCode";
import { roundDecimal } from "utils/format";
import { displayToast, TOAST_LEVEL } from "utils/toast";
import { FormatCurrency, FormatCurrencyInput } from "./Currency";

export const Receive = () => {
	const [invoice, setInvoice] = useState("");
	const [selectedWallet] = useAppSelector(state => [state.wallets.selectedWallet])
	const [isSats, setIsSats] = useState(true);

	// useEffect(() => {
	// }, [selectedWallet])

	const onCreateInvoice = async (amount, memo) => {
		if (isSats && selectedWallet === "BTC") {
			amount = amount / 100000000
		}
		amount = amount.toString()
		let currency = selectedWallet ? selectedWallet : "BTC";
		const data = await getRequest(API_NAMES.ADD_INVOICE, [amount, currency, memo])
		if (data.error) {
			displayToast(`${data.error}`, {
				type: 'error',
				level: TOAST_LEVEL.CRITICAL,
				toastId: 'copy-invoice',
			});
		} else {
			setInvoice(data.paymentRequest)
		}
	}

	const resetInovice = () => {
		setInvoice("");
	}

	const onQrCodeClick = () => {
		navigator.clipboard.writeText(invoice)
		displayToast('Invoice Copied!', {
			type: 'success',
			level: TOAST_LEVEL.CRITICAL,
			toastId: 'copy-invoice',
		});
	}

	return (
		<div className="flex flex-col h-full p-8 relative text-white">
			<div className="relative w-full">
				<div className="absolute top-0 right-0 h-16 w-16 text-4xl text-gray-600">
					<div>
						<button onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}>
							<MdClose />
						</button>
					</div>
				</div>
			</div>
			<div className="mt-4">
				<div className="mt-4 text-xl">Receive</div>
				<div className="text-left mt-8">
					Account
					<div className="mt-2">
						<DropDown resetInovice={resetInovice} />
					</div>
				</div>
				{
					invoice ? (
						<div className="flex flex-col h-full w-full">
							<div className="mx-auto mt-10 border bg-white rounded-xl p-2" onClick={() => onQrCodeClick()}>
								<QrCode value={invoice} wrapperClass={"border-radius: 32px"} size={256} imageSettings={{ src: UI.RESOURCES.getCurrencySymbol(selectedWallet.toLowerCase()), x: null, y: null, height: 48, width: 48, excavate: true }} />
							</div>
							<button className="h-12 w-32 border mx-auto rounded-lg mt-8 border-gray-600 text-white" onClick={() => onQrCodeClick()}>
								Copy
							</button>
						</div>
					) : (
						<InvoiceForm onCreateInvoice={onCreateInvoice} currency={selectedWallet} />
					)
				}
			</div>
		</div>
	)
}

const InvoiceForm = ({ onCreateInvoice, currency }) => {
	const [amount, setAmount] = useState(0);
	const [satsAmount, setSatsAmount] = useState(0);
	const [memo, setMemo] = useState("");
	const { data: newQuote } = useSWR(currency !== "BTC" ? [API_NAMES.QUOTE, currency, "BTC", amount] : null);

	useEffect(() => {
		if (!newQuote) return
		if (currency !== "BTC") {
			setSatsAmount(roundDecimal(amount * Number(newQuote.rate) * 100000000, 2))
		}
	}, [newQuote])
	return (
		<div>
			<div className="text-left mt-8">
				<div className="">
					Amount <span className="text-xs">(in {currency === "BTC" ? "sats" : currency})</span>
					<div className="border border-1 mt-1 rounded-md w-full border-gray-600">
						<FormatCurrencyInput value={amount} symbol={currency} style={"input-default inline-block w-full border rounded-md border-transparent h-14 bg-gray-700"} onValueChange={(values) => setAmount(values.value)}/>
					</div>
				</div>
				{
					currency !== "BTC" && (
						<div>{satsAmount} sats</div>
					)
				}
				<div className="mt-8">
					Description <span className="text-xs">(optional)</span>
					<div className="border border-1 border-gray-600 mt-1 rounded-md w-full relative">
						<input
							value={memo}
							onInput={e => setMemo(e.target.value)}
							placeholder="Add description"
							type="text"
							style={{ textAlign: 'left' }}
							className="input-default inline-block w-full border rounded-md border-transparent h-14 bg-gray-700"
						/>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => onCreateInvoice(amount, memo)}
					className="border-gray-600 border-2 hover:bg-gray-700 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3 text-white">
					<p>Create Invoice</p>
				</button>
			</div>
		</div>
	)
}

const DropDown = ({ resetInovice }) => {
	const [showDropDown, setShowDropDown] = useState(false);

	const [wallets, selectedWallet] = useAppSelector(state => [state.wallets.wallets, state.wallets.selectedWallet]);

	const [walletBalance, setWalletBalance] = useState(0);

	useEffect(() => {
		let balance = wallets[selectedWallet] ? wallets[selectedWallet].balance : 0;
		setWalletBalance(balance)
	}, [wallets, selectedWallet]);

	const onClickDropDown = () => {
		if (showDropDown) {
			setShowDropDown(false)
			resetInovice()
		} else {
			setShowDropDown(true)
		}
	}
	return (
		<div className="relative">
			<div className="w-full border border-gray-600 p-4 rounded-md grid grid-cols-2 cursor-pointer" onClick={() => onClickDropDown()}>
				<div className="flex">
					<Img src={UI.RESOURCES.getCurrencySymbol(selectedWallet.toLowerCase())} className="h-6 w-6" />
					<div className="my-auto ml-2">
						{selectedWallet}
					</div>
				</div>
				<div className="grid justify-items-end">
					<div className="flex">
						<div>
							<FormatCurrency value={walletBalance} symbol={selectedWallet} style={"bg-transparent w-full truncate ... text-right"}/>
						</div>
						<div className="my-auto text-2xl">
							<MdOutlineArrowDropDown className="text-right" />
						</div>
					</div>
				</div>
			</div>
			{
				showDropDown && (
					<Dropped onClickDropDown={onClickDropDown} />
				)
			}
		</div>
	)
}

const Dropped = ({ onClickDropDown }) => {
	const [availableWallets, wallets] = useAppSelector(state => [state.wallets.availableWallets, state.wallets.wallets])

	const onSelect = (currency) => {
		onClickDropDown();
		storeDispatch(setSelectedWallet(currency))
	}

	return (
		<div className="border-l border-r border-b border-gray-600 rounded-b-md grid grid-cols-1 divide-y divide-gray-600 absolute w-full">
			{
				availableWallets.map(currency => (
					<div className="flex p-4 cursor-pointer rounded-b-md bg-gray-700 hover:bg-gray-800" onClick={() => onSelect(currency)}>
						<div>
							<Img src={UI.RESOURCES.getCurrencySymbol(currency.toLowerCase())} className="h-6 w-7" />
						</div>
						<div className="my-auto ml-2">
							{currency}
						</div>

						<div className="grid justify-items-end w-full">
							<div className="flex">
								<div>
									{/* {wallets[currency] ? roundDecimal(wallets[currency].balance, 8) : 0} */}
									<FormatCurrency value={wallets[currency].balance} symbol={currency} style={"bg-transparent w-full text-right truncate ..."}/>
								</div>
							</div>
						</div>
					</div>
				))
			}
		</div>
	)
}
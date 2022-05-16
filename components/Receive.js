import { MdClose, MdOutlineArrowDropDown } from "react-icons/md";
import { storeDispatch } from "contexts";
import { VIEWS } from "consts";
import { setView } from "contexts/modules/layout";
import { setSelectedWallet } from "contexts/modules/wallet";
import { useEffect, useState } from "react";
import { useAppSelector } from "hooks";
import Img from "react-cool-img"
import { UI } from "consts";
import { API_NAMES } from "consts";
import { getRequest } from "utils/api";
import { QrCode } from "./QrCode";
import { roundDecimal } from "utils/format";
import { displayToast, TOAST_LEVEL } from "utils/toast";

export const Receive = () => {
	const [invoice, setInvoice] = useState("");
	const [selectedWallet] = useAppSelector(state => [state.wallets.selectedWallet])

	// useEffect(() => {
	// }, [selectedWallet])

	const onCreateInvoice = async (amount, memo) => {
		amount = amount.toString()
		let currency = selectedWallet ? selectedWallet : "BTC";
		const data = await getRequest(API_NAMES.ADD_INVOICE, [amount, currency, memo])
		console.log(data);
		setInvoice(data.paymentRequest)
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
		<div className="flex flex-col h-full p-8 relative">
			<div className="relative w-full">
				<div className="absolute top-0 right-0 h-16 w-16 text-4xl text-gray-600">
					<div>
						<button onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}>
							<MdClose />
						</button>
					</div>
				</div>
			</div>
			<div className="text-black mt-4">
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
							<div className="mx-auto mt-10 border-4 border-gray-400 rounded-xl p-2" onClick={() => onQrCodeClick()}>
								<QrCode value={invoice} wrapperClass={"border-radius: 32px"} size={256} imageSettings={{ src: UI.RESOURCES.getCurrencySymbol(selectedWallet.toLowerCase()), x: null, y: null, height: 48, width: 48, excavate: true }} />
							</div>
							<button className="h-12 w-32 border mx-auto rounded-lg mt-8" onClick={() => onQrCodeClick()}>
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
	const [memo, setMemo] = useState("");
	return (
		<div>
			<div className="text-left mt-8">
				<div className="">
					Amount <span className="text-xs">(in {currency})</span>
					<div className="border border-2 mt-1 rounded-md w-full">
						<input
							value={amount}
							onInput={e => setAmount(e.target.value)}
							placeholder=""
							type="number"
							style={{ textAlign: 'left' }}
							className="input-default inline-block w-full border rounded-md border-transparent h-14"
						/>
					</div>
				</div>
				<div className="mt-8">
					Discription <span className="text-xs">(optional)</span>
					<div className="border border-2 mt-1 rounded-md w-full relative">
						<input
							value={memo}
							onInput={e => setMemo(e.target.value)}
							placeholder="Add description"
							type="text"
							style={{ textAlign: 'left' }}
							className="input-default inline-block w-full border rounded-md border-transparent h-14"
						/>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => onCreateInvoice(amount, memo)}
					className="border-gray-600 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-5/6 px-5 py-3">
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
		setWalletBalance(roundDecimal(balance, 8))
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
			<div className="w-full border p-4 rounded-md grid grid-cols-2 cursor-pointer" onClick={() => onClickDropDown()}>
				<div className="flex">
					<Img src={UI.RESOURCES.getCurrencySymbol(selectedWallet.toLowerCase())} className="h-6 w-6" />
					<div className="my-auto ml-2">
						{selectedWallet}
					</div>
				</div>
				<div className="grid justify-items-end">
					<div className="flex">
						<div>{walletBalance}</div>
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
		<div className="border-l border-r border-b rounded-b-md grid grid-cols-1 divide-y absolute w-full">
			{
				availableWallets.map(currency => (
					<div className="flex p-4 cursor-pointer rounded-b-md bg-white" onClick={() => onSelect(currency)}>
						<div>
							<Img src={UI.RESOURCES.getCurrencySymbol(currency.toLowerCase())} className="h-6 w-7" />
						</div>
						<div className="my-auto ml-2">
							{currency}
						</div>

						<div className="grid justify-items-end w-full">
							<div className="flex">
								<div>{wallets[currency] ? roundDecimal(wallets[currency].balance, 8) : 0}</div>
							</div>
						</div>
					</div>
				))
			}
		</div>
	)
}
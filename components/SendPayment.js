import { MdClose, MdOutlineArrowDropDown, MdEast } from 'react-icons/md';

import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { useAppDispatch } from 'hooks';
import { storeDispatch } from 'contexts';
import ligtningPayReq from 'bolt11';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'hooks';
import Img from 'react-cool-img';
import { UI } from 'consts';
import { setSelectedWallet } from 'contexts';
import { roundDecimal } from 'utils/format';
import { postRequest } from 'utils/api';
import { API_NAMES } from 'consts';

export const SendPayment = () => {

	const [selectedWallet] = useAppSelector(state => [state.wallets.selectedWallet]);

	const [invoice, setInvoice] = useState("");
	const [currency, setCurrency] = useState("");
	const [isPaymentComplete, setIsPaymentComplete] = useState(false);
	const [paymentObj, setPaymentObj] = useState({ amount: 0, currency: "BTC", rate: 1, paymentRequest: "" })

	const onPayInvoice = async () => {
		if (!invoice) return
		if (!currency) return
		const res = await postRequest(API_NAMES.PAY, [], { paymentRequest: invoice, currency: currency });
		if (res.success) {
			setIsPaymentComplete(true)
		}
	}

	useEffect(() => {
		if (!selectedWallet) return
		setCurrency(selectedWallet);
	}, [selectedWallet])

	// useEffect(() => {
	// 	if (!invoice) return
	// 	try {
	// 		let decoded = ligtningPayReq.decode(invoice)
	// 		console.log(decoded)
	// 		setDecodedInvoice(decoded)
	// 		setAmount((decoded.millisatoshis / 1000).toString())
	// 		let time = new Date(decoded.timeExpireDate)
	// 		setExpiry(time.toUTCString())
	// 	} catch (err) {
	// 		setDecodedInvoice(null)
	// 		setAmount("")
	// 		setExpiry("")
	// 	}
	// }, [invoice, amount, expiry])

	return (
		<div className="flex flex-col h-full p-8 relative text-black">
			<div className="relative w-full">
				<div className="absolute top-0 right-0 h-16 w-16 text-4xl text-gray-600">
					<div>
						<button onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}>
							<MdClose />
						</button>
					</div>
				</div>
			</div>
			<div className="text-xl mt-8">Send Payment</div>
			<div className="mt-2">
				<DropDown />
			</div>
			<div className="h-full w-full">
				{
					isPaymentComplete ? (
						<PaymentComplete paymentObj={paymentObj} />
					) : (
						<InvoiceForm invoice={invoice} setInvoice={setInvoice} onPayInvoice={onPayInvoice} />
					)
				}
			</div>
		</div>
	);
};
const InvoiceForm = ({ invoice, setInvoice, onPayInvoice }) => {
	return (
		<div>
			<div className="text-left mt-8">
				<div className="">
					Invoice
					<div className="border border-2 mt-1 rounded-md w-full">
						<input
							value={invoice}
							onInput={e => setInvoice(e.target.value)}
							placeholder="Paste you invoice here."
							type="text"
							style={{ textAlign: 'left' }}
							className="input-default inline-block w-full border rounded-md border-transparent h-14"
						/>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => onPayInvoice()}
					className="border-gray-600 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-5/6 px-5 py-3">
					<div className="flex flex-row">
						<div className="mx-auto w-32 flex">
							<div className="mx-auto">Pay</div>
						</div>
					</div>
				</button>
			</div>
		</div>
	)
}

const DropDown = () => {
	const [showDropDown, setShowDropDown] = useState(false);

	const [wallets, selectedWallet] = useAppSelector(state => [state.wallets.wallets, state.wallets.selectedWallet]);

	const [walletBalance, setWalletBalance] = useState(0);

	useEffect(() => {
		let balance = wallets[selectedWallet] ? wallets[selectedWallet].balance : 0;
		setWalletBalance(roundDecimal(balance, 8));
	}, [wallets, selectedWallet]);

	const onClickDropDown = () => {
		if (showDropDown) {
			setShowDropDown(false)
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

const PaymentComplete = ({ paymentObj }) => {
	return (
		<div className="flex flex-col h-full relative">
			<div className="h-3/4 flex">
				<div className="m-auto w-full">
					<div>Payment Send</div>
				</div>
			</div>

			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}
					className="border-gray-600 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-5/6 px-5 py-3">
					<p>Complete</p>
				</button>
			</div>
		</div>
	)
}
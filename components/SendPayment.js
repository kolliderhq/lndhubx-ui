import { MdClose, MdOutlineArrowDropDown, MdEast } from 'react-icons/md';

import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { storeDispatch } from 'contexts';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'hooks';
import Img from 'react-cool-img';
import { UI } from 'consts';
import { setSelectedWallet } from 'contexts';
import { getTime, roundDecimal } from 'utils/format';
import { postRequest } from 'utils/api';
import { API_NAMES } from 'consts';
import bolt from 'bolt11';
import useSWR from 'swr';
import { CURRENCY_SYMBOL_MAP } from 'consts/misc/currency';
import { displayToast, TOAST_LEVEL } from 'utils/toast';
import Loader from './Loader';

export const SendPayment = () => {

	const [selectedWallet, wallets] = useAppSelector(state => [state.wallets.selectedWallet, state.wallets.wallets]);

	const [invoice, setInvoice] = useState("");
	const [currency, setCurrency] = useState("");
	const [isPaymentComplete, setIsPaymentComplete] = useState(false);
	const [paymentObj, setPaymentObj] = useState({ amount: 0, currency: "BTC", rate: 1, paymentRequest: "", fees: 0 })
	const [amount, setAmount] = useState(0);
	const [balance, setBalance] = useState(0);
	const [isPaying, setIsPaying] = useState(false);

	const onPayInvoice = async () => {
		if (!invoice) return
		if (!currency) return
		setIsPaying(true);
		try {
			const res = await postRequest(API_NAMES.PAY, [], { paymentRequest: invoice, currency: currency });
			setPaymentObj(res);
			setIsPaying(false);
			if (res.success) {
				setIsPaymentComplete(true)
			} else {
				displayToast('Payment Failed', {
					type: 'error',
					level: TOAST_LEVEL.CRITICAL,
					toastId: 'copy-invoice',
				});
			}
		} catch (err) {
			setIsPaying(false)
		}
	}

	useEffect(() => {
		if (!selectedWallet) return
		setCurrency(selectedWallet);
	}, [selectedWallet])

	useEffect(() => {
		if (!selectedWallet || !wallets) return
		setBalance(wallets[selectedWallet].balance)

	}, [wallets])

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
				<div className="text-left mb-2 font-light">
					Send From
				</div>
				<DropDown />
			</div>
			{
				isPaying ? (
					<div className="m-auto text-gray-500">
						<Loader color={"gray"} />
						Paying
					</div>
				) : (
					<div className="h-full w-full">
						{
							isPaymentComplete ? (
								<PaymentComplete paymentObj={paymentObj} />
							) : (
								<InvoiceForm invoice={invoice} setInvoice={setInvoice} onPayInvoice={onPayInvoice} currency={selectedWallet} balance={balance} />
							)
						}
					</div>
				)
			}
		</div>
	);
};
const InvoiceForm = ({ invoice, setInvoice, onPayInvoice, currency, balance }) => {
	const [amount, setAmount] = useState(0);
	const [fiatAmount, setFiatAmount] = useState(0);
	const [nodeKey, setNodeKey] = useState("");
	const [expiry, setExpiry] = useState(null);
	const [maxFee, setMaxFee] = useState(0);
	const [maxFeeFiat, setMaxFeeFiat] = useState(0);
	const [invoiceValid, setInvoiceValid] = useState(false);
	const [quote, setQuote] = useState(1);
	const [hasSufficienFunds, setHasSufficientFunds] = useState(true);
	
	const [bankInfo] = useAppSelector(state => [state.bank.info])

	const { data: newQuote } = useSWR(currency !== "BTC" ? [API_NAMES.QUOTE, currency, "BTC", amount] : null);

	useEffect(() => {
		if (!invoice) return
		try {
			let decoded = bolt.decode(invoice);
			setAmount(decoded.satoshis / 100000000);
			setNodeKey(decoded.payeeNodeKey);
			setExpiry(decoded.timeExpireDate);
			setInvoiceValid(true)
			console.log(decoded);
		} catch (err) {
			setInvoiceValid(false)
		}
	}, [invoice])

	useEffect(() => {
		if (!newQuote) return
		setQuote(newQuote);
		setFiatAmount(roundDecimal(amount / Number(newQuote.rate), 8))
	}, [newQuote])

	useEffect(() => {
		if (currency === "BTC" && balance < amount) {
			setHasSufficientFunds(false);
		} else if (currency !== "BTC" && balance < fiatAmount) {
			setHasSufficientFunds(true);
		} else {
			setHasSufficientFunds(true);
		}

	}, [amount, balance])

	useEffect(() => {
		console.log(bankInfo)
		console.log(amount)
		if (!bankInfo || !amount) return 
		console.log("hello")
		setMaxFee(amount * Number(bankInfo.lnNetworkMaxFee));
		setMaxFeeFiat(fiatAmount * Number(bankInfo.lnNetworkMaxFee));
	}, [amount, bankInfo])

	return (
		<div>
			<div className="text-left mt-8">
				<div className="">
					<div className="font-light">
						Send To
					</div>
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
			<div className="grid grid-cols-2 gap-2 mt-8 p-4 font-light">
				<div className="text-left w-full">Amount</div>
				<div className="text-right w-full">
					<div>
						{amount} BTC
					</div>
					{
						currency !== "BTC" && (
							<div> {CURRENCY_SYMBOL_MAP[currency]} {fiatAmount}</div>
						)
					}
				</div>

				<div className="text-left w-full">Max Fee</div>
				<div className="text-right w-full">
					<div>
						{roundDecimal(maxFee, 8)} BTC
					</div>
					{
						currency !== "BTC" && (
							<div> {CURRENCY_SYMBOL_MAP[currency]} {roundDecimal(maxFeeFiat, 8)}</div>
						)
					}
				</div>

				<div className="text-left w-full">NodeKey</div>
				<div className="text-right w-full truncate ...">{nodeKey ? nodeKey : "-"} </div>

				<div className="text-left w-full">Expiry</div>
				<div className="text-right w-full truncate ...">{expiry ? getTime(expiry * 1000) : "-"} </div>
			</div>
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				{
					hasSufficienFunds ? (
						<button
							onClick={() => onPayInvoice()}
							className="border-green-500 text-green-500 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-5/6 px-5 py-3">
							<div className="flex flex-row">
								<div className="mx-auto w-32 flex">
									<div className="mx-auto">Pay</div>
								</div>
							</div>
						</button>
					) : (
						<button
							// onClick={}
							className="border-red-600 border-2 text-red-600 hover:opacity-80 cursor-pointer border rounded-lg w-5/6 px-5 py-3">
							<div className="flex flex-row">
								<div className="mx-auto w-32 flex">
									<div className="mx-auto">Insufficient Funds</div>
								</div>
							</div>
						</button>
					)
				}
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
		<div className="flex flex-col h-full">
			<div className="h-3/4 flex flex-col mt-24">
				<div className="mx-auto w-full">
					<div>Payment Send</div>
				</div>
				<div className="grid grid-cols-2 p-4">
					<div className="text-left">LN Fees:</div>
					<div className="text-right">{Number(paymentObj.fees)} sats</div>

					<div className="text-left">Bank Fees:</div>
					<div className="text-right">{Number(0)} sats</div>
				</div>
			</div>

			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}
					className="border-gray-600 border-2 hover:bg-gray-600 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
					<p>Complete</p>
				</button>
			</div>
		</div>
	)
}
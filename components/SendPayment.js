import { MdClose, MdOutlineArrowDropDown, MdEast, MdOutlineFiberManualRecord } from 'react-icons/md';

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
import { getRequest } from 'utils/api';
import { QrCode } from './QrCode';
import {
	defaultLocalStore,
} from 'contexts';
import { CONTEXTS } from 'consts';
import { FormatCurrency, FormatCurrencyInput } from './Currency';

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
			if (res.success) {
				displayToast(`Successfully send payment.`, {
					type: 'success',
					level: TOAST_LEVEL.INFO,
					toastId: 'copy-invoice',
				});
				setPaymentObj(res);
				setIsPaymentComplete(true)
			} else {
				let text = `Payment Failed: ${res.error}`
				displayToast(text, {
					type: 'error',
					level: TOAST_LEVEL.CRITICAL,
					toastId: 'copy-invoice',
				});
			}
			setIsPaying(false);
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
		console.log(selectedWallet)
		console.log(wallets);
		setBalance(wallets[selectedWallet] ? wallets[selectedWallet].balance : 0)

	}, [wallets, selectedWallet])

	return (
		<div className="flex flex-col h-full p-8 relative text-white">
			<div className="relative w-full">
				<div className="absolute top-0 right-0 h-16 w-16 text-4xl text-white">
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
	const [maxAmountSend, setMaxAmountSend] = useState(0);
	const [maxFeeFiat, setMaxFeeFiat] = useState(0);
	const [invoiceValid, setInvoiceValid] = useState(false);
	const [quote, setQuote] = useState(1);
	const [hasSufficienFunds, setHasSufficientFunds] = useState(true);

	const [isLnurlWithdrawal, setIsLnurlWithdrawal] = useState(true);
	const [isPayUser, setIsPayUser] = useState(false);
	const [isPayManual, setIsPayManual] = useState(false);
	const [lnurlWithdrawalAmount, setLnurlWithdrawalAmount] = useState(0);
	const [lnurlWithdrawal, setLnurlWithdrawal] = useState("");
	const [receipientUsername, setReceipientUsername] = useState("");

	const [isSats, setIsSats] = useState(true);

	const [bankInfo, selectedWallet] = useAppSelector(state => [state.bank.info, state.wallets.selectedWallet])

	const { data: newQuote } = useSWR(currency !== "BTC" ? [API_NAMES.QUOTE, currency, "BTC", amount] : null);

	const btcUnit = defaultLocalStore.cookieGet(CONTEXTS.LOCAL_STORAGE.DISPLAY_BTC_IN);


	const onCreateLnurlWithdrawal = async () => {
		let amount = selectedWallet == "BTC" && isSats ? (lnurlWithdrawalAmount / 100000000).toString() : lnurlWithdrawalAmount.toString()
		let currency = selectedWallet ? selectedWallet : "BTC";
		const data = await getRequest(API_NAMES.CREATE_LNURL_WITHDRAWAL, [amount, currency])
		if (data.error) {
			displayToast(`${data.error}`, {
				type: 'error',
				level: TOAST_LEVEL.CRITICAL,
				toastId: 'copy-invoice',
			});
		} else {
			console.log(data.lnurl)
			setLnurlWithdrawal(data.lnurl)
		}
	}

	const onPayKolliderUser = async () => {
		let amount = (selectedWallet === "BTC" && isSats? lnurlWithdrawalAmount / 100000000: lnurlWithdrawalAmount).toString();
		let username = receipientUsername;
		let currency = selectedWallet ? selectedWallet : "BTC";
		if (!currency) return
		try {
			const res = await postRequest(API_NAMES.PAY, [], { paymentRequest: invoice, currency: currency, amount: amount, receipient: username });
			if (res.success) {
				displayToast(`Successfully send payment to ${username}`, {
					type: 'success',
					level: TOAST_LEVEL.INFO,
					toastId: 'copy-invoice',
				});
				storeDispatch(setView(VIEWS.OVERVIEW))
			} else {
				let text = `Payment Failed: ${res.error}`
				displayToast(text, {
					type: 'error',
					level: TOAST_LEVEL.CRITICAL,
					toastId: 'copy-invoice',
				});
			}
		} catch (err) {
			console.log(err);
		}
	}

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
		const networkFee = 0.01;
		if (currency !== "BTC") {
			setMaxAmountSend(roundDecimal(balance * Number(quote.rate) * (1 - networkFee), 8))
		} else {
			setMaxAmountSend(roundDecimal(balance * 100000000 - (balance * 100000000 * networkFee), 2))
		}
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

	const onManual = () => {
		setIsPayUser(false)
		setIsLnurlWithdrawal(false)
		setIsPayManual(true)
	}

	const onPayUser = () => {
		setIsLnurlWithdrawal(false);
		setIsPayManual(false);
		setIsPayUser(true);
	}

	const onLnurlWithdrawal = () => {
		setIsPayManual(false);
		setIsPayUser(false);
		setIsLnurlWithdrawal(true)
	}

	const onMaxAmount = () => {
		setLnurlWithdrawalAmount(currency === "BTC" ? balance * 100000000 * 0.99 : balance * 0.99)
	}

	useEffect(() => {
		console.log(bankInfo)
		console.log(amount)
		if (!bankInfo || !amount) return
		setMaxFee(amount * Number(bankInfo.lnNetworkMaxFee));
		setMaxFeeFiat(fiatAmount * Number(bankInfo.lnNetworkMaxFee));
	}, [amount, bankInfo])

	return (
		<div>
			{
				isLnurlWithdrawal || isPayUser ? (
					<div>
						<div className="text-left mt-8">
							<div className="">
								{
									lnurlWithdrawal ? (
										<div className="flex w-full">
											<div className="m-auto border bg-white rounded-lg p-2">
												<QrCode value={lnurlWithdrawal} wrapperClass={"border-radius: 32px"} size={256} imageSettings={{ src: UI.RESOURCES.getCurrencySymbol(selectedWallet.toLowerCase()), x: null, y: null, height: 48, width: 48, excavate: true }} />
											</div>
										</div>
									) : (
										<div>
											<div className="font-light">
												Amount you want to send {btcUnit}
											</div>
											<div className="border border-1 mt-1 rounded-md w-full border-gray-600">
												<FormatCurrencyInput value={lnurlWithdrawalAmount} symbol={selectedWallet} style={"input-default inline-block w-full border rounded-md border-transparent h-14 bg-gray-700"} onValueChange={(values) => setLnurlWithdrawalAmount(values.value)}/>
											</div>
											{
												isPayUser && (
													<div>
														<div className="mt-2 font-light text-md">Username </div>
														<div className="border border-1 mt-1 rounded-md w-full border-gray-600">
															<input
																value={receipientUsername}
																onInput={e => setReceipientUsername(e.target.value)}
																placeholder="Kollider username"
																type="text"
																style={{ textAlign: 'left' }}
																className="input-default inline-block w-full rounded-md h-14 bg-gray-700"
															/>
														</div>
													</div>
												)
											}
											<div className="w-full flex flex-row">
												<div className="border border-gray-600 rounded-md px-2 py-1 w-12 mt-2 cursor-pointer" onClick={() => onMaxAmount()}>Max</div>
												{
													isLnurlWithdrawal ? (

														<div className="border border-gray-600 flex rounded-md px-2 py-1 w-36 mt-2 cursor-pointer ml-2" onClick={() => onPayUser()}>
															<div className="mx-auto">
																Pay Username
															</div>
														</div>
													) : (
														<div className="border border-gray-600 flex rounded-md px-2 py-1 w-36 mt-2 cursor-pointer ml-2" onClick={() => onLnurlWithdrawal()}>
															<div className="mx-auto">
																Pay Lnurl
															</div>
														</div>
													)
												}
												<div className="border border-gray-600 flex rounded-md px-2 py-1 w-24 mt-2 cursor-pointer ml-2" onClick={() => onManual()}>
													<div className="mx-auto">
														Manual
													</div>
												</div>
											</div>
										</div>
									)
								}
							</div>
						</div>
					</div>
				) : (
					<div>
						<div className="text-left mt-8">
							<div className="">
								<div className="font-light">
									Send To
								</div>
								<div className="border mt-1 rounded-md w-full border-gray-600">
									<input
										value={invoice}
										onInput={e => setInvoice(e.target.value)}
										placeholder="Paste you invoice here."
										type="text"
										style={{ textAlign: 'left' }}
										className="input-default inline-block w-full rounded-md border-transparent h-14 bg-gray-700"
									/>
								</div>
								<div className="mt-2 px-2">Max Amount to send: {maxAmountSend} sats</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2 mt-2 p-4 font-light">
							<div className="text-left w-full">Amount</div>
							<div className="text-right w-full">
								<div>
									{amount*100000000} sats
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
									{roundDecimal(maxFee*100000000, 2)} sats
								</div>
								{
									currency !== "BTC" && (
										<div> {CURRENCY_SYMBOL_MAP[currency]} {roundDecimal(maxFeeFiat, 8)}</div>
									)
								}
							</div>

						</div>

						<div className="w-full flex">
							<div className="m-auto border border-gray-600 text-gray-400 font-light hover:bg-gray-700 flex rounded-md px-2 py-1 mt-2 cursor-pointer ml-2" onClick={() => onLnurlWithdrawal()}>
								<div className="mx-auto">
									Lnurl Withdrawal
								</div>
							</div>
						</div>
					</div>
				)
			}
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				{
					hasSufficienFunds ? (

						<div>
							{
								isLnurlWithdrawal && (
									<button
										onClick={() => { onCreateLnurlWithdrawal()}}
										className="border-gray-600 hover:bg-gray-700 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
										<div className="flex flex-row">
											<div className="mx-auto w-32 flex text-white">
												<div className="mx-auto">Create</div>
											</div>
										</div>
									</button>

								)
							}
							{
								isPayUser && (
									<button
										onClick={() => { onPayKolliderUser()}}
										className="border-gray-600 hover:bg-gray-700 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
										<div className="flex flex-row">
											<div className="mx-auto w-32 flex text-white">
												<div className="mx-auto">Pay</div>
											</div>
										</div>
									</button>
								)
							}
							{
								isPayManual && (
									<button
										onClick={() => { onPayInvoice() }}
										className="border-gray-600 hover:bg-gray-700 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
										<div className="flex flex-row">
											<div className="mx-auto w-32 flex text-white">
												<div className="mx-auto">Pay Invoice</div>
											</div>
										</div>
									</button>
								)
							}
						</div>
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
		setWalletBalance(balance);
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
		<div className="border-l border-r border-b border-gray-600 rounded-b-md grid grid-cols-1 divide-y divide-gray-600 absolute w-full bg-gray-700">
			{
				availableWallets.map(currency => (
					<div className="flex p-4 cursor-pointer rounded-b-md hover:bg-gray-800" onClick={() => onSelect(currency)}>
						<div>
							<Img src={UI.RESOURCES.getCurrencySymbol(currency.toLowerCase())} className="h-6 w-7" />
						</div>
						<div className="my-auto ml-2">
							{currency}
						</div>

						<div className="grid justify-items-end w-full">
							<div className="flex">
								<div>
									<FormatCurrency value={wallets[currency].balance} symbol={currency} style={"bg-transparent w-full text-right truncate ..."}/>
									{/* {wallets[currency] ? roundDecimal(wallets[currency].balance, 8) : 0} */}
								</div>
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
					className="border-gray-600 border hover:bg-gray-600 hover:text-white cursor-pointer rounded-lg w-5/6 px-5 py-3">
					<p>Complete</p>
				</button>
			</div>
		</div>
	)
}
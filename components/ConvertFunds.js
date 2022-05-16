import { useEffect, useMemo, useState } from 'react';
import { MdClose, MdEast, MdOutlineArrowDropDown } from 'react-icons/md';

import { API_NAMES } from 'consts';
import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { storeDispatch } from 'contexts';
import Img from 'react-cool-img';
import { UI } from 'consts';
import { postRequest } from 'utils/api';
import useSWR from 'swr';
import { getSWROptions } from 'utils/fetchers';

import Loader from './Loader';
import { useAppSelector } from 'hooks';
import { CURRENCY_SYMBOL_MAP } from 'consts/misc/currency';
import { roundDecimal } from 'utils/format';

export const ConvertFunds = () => {

	const [isSwapComplete, setisSwapComplete] = useState(false);
	const [swapObj, setSwapObj] = useState({ fromCurrency: "BTC", toCurrency: "USD", fromAmount: 0, toAmount: 0 });

	const onSwap = async ({ fromCurrency, fromAmount, toCurrency, toAmount }) => {

		const res = await postRequest(API_NAMES.SWAP, [], { fromCurrency: fromCurrency, toCurrency: toCurrency, amount: fromAmount});

		setSwapObj({
			fromCurrency: fromCurrency,
			toCurrency: toCurrency,
			fromAmount: fromAmount,
			toAmount: roundDecimal(Number(res.amount) * Number(res.rate), 8)
		})

		if (res.success) {
			setisSwapComplete(true)
		}
	}

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
			<div className="text-xl mt-8">Swap</div>
			{
				isSwapComplete ? (
					<SwapComplete swapObj={swapObj} />
				) : (

					<SwapForm onSwap={onSwap} />
				)
			}
		</div>
	);
};

const SwapForm = ({ onSwap }) => {
	const [fromAmount, setFromAmount] = useState(0);
	const [toAmount, setToAmount] = useState(0);
	const [fromCurrency, setFromCurrency] = useState("BTC");
	const [toCurrency, setToCurrency] = useState("USD");
	const [availableToCurrencies, setAvailableToCurrencies] = useState([]);
	const [lastQuote, setLastQuote] = useState(0);


	const { data: quote} = useSWR(fromAmount !== 0 && fromCurrency !== toCurrency ? [API_NAMES.QUOTE, fromCurrency, toCurrency, fromAmount]: null);

	const [fromBalance, setFromBalance] = useState(0);

	const [wallets, availableWallets] = useAppSelector(state => [state.wallets.wallets, state.wallets.availableWallets]);

	useMemo(() => {
		if (!quote) return 
		console.log(quote)
		setLastQuote(Number(quote.rate))
	}, [quote])

	useMemo(() => {
		if (fromCurrency !== "BTC") {
			setAvailableToCurrencies(["BTC"])
			setToCurrency("BTC")
		} else {
			setAvailableToCurrencies(availableWallets)
		}
	}, [fromCurrency, toCurrency, availableWallets])

	useMemo(() => {
		let n = roundDecimal(lastQuote * fromAmount, 8)
		setToAmount(n)
	}, [fromCurrency, toCurrency, fromAmount, lastQuote])

	useEffect(() => {
		if (!wallets) return
		let balance = wallets[fromCurrency] ? wallets[fromCurrency].balance : 0;
		setFromBalance(roundDecimal(balance, 8))
	}, [wallets, fromCurrency])

	const onClickSwap = () => {
		onSwap({fromCurrency: fromCurrency, toCurrency: toCurrency, fromAmount: fromAmount, toAmount: toAmount})
	}

	return (
		<div>
			<div className="text-left mt-8">
				<div className="">
					From
					<div className="flex border border-2 mt-1 rounded-md w-full">
						<div>
							<input
								value={fromAmount}
								onInput={e => setFromAmount(e.target.value)}
								placeholder=""
								type="number"
								style={{ textAlign: 'left' }}
								className="input-default inline-block w-full border rounded-md border-transparent h-14"
							/>
						</div>
						<div>
							<DropDown setCurrency={setFromCurrency} currency={fromCurrency} availableCurrencies={availableWallets} />
						</div>
					</div>
					<div className="text-xs mt-2">{CURRENCY_SYMBOL_MAP[fromCurrency]} {fromBalance} available</div>

				</div>
				<div className="mt-8">
					To
					<div className="flex border border-2 mt-1 rounded-md w-full">
						<div>
							<input
								value={toAmount}
								onInput={e => setToAmount(e.target.value)}
								placeholder=""
								type="number"
								style={{ textAlign: 'left' }}
								className="input-default inline-block w-full border rounded-md border-transparent h-14"
							/>
						</div>
						<div>
							<DropDown setCurrency={setToCurrency} currency={toCurrency} availableCurrencies={availableToCurrencies} />
						</div>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => onClickSwap()}
					className="border-gray-600 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-5/6 px-5 py-3">
					<p>Swap</p>
				</button>
			</div>
		</div>
	)
}

const DropDown = ({ setCurrency, currency, availableCurrencies }) => {
	const [showDropDown, setShowDropDown] = useState(false);
	const [droppedCurrencies, setDroppedCurrencies] = useState([])

	const onClickDropDown = () => {
		if (showDropDown) {
			setShowDropDown(false)
		} else {
			setShowDropDown(true)
		}
	}

	useMemo(() => {
		if (!availableCurrencies) return
		let dc = availableCurrencies.filter(c => c !== currency);
		setDroppedCurrencies(dc);

	}, [availableCurrencies, currency])


	return (
		<div className="w-32 z-50">
			<div className="p-4 rounded-md grid grid-cols-2 cursor-pointer" onClick={() => onClickDropDown()}>
				<div className="flex">
					<Img src={UI.RESOURCES.getCurrencySymbol(currency.toLowerCase())} className="h-6 w-6" />
					<div className="my-auto ml-2">
						{currency}
					</div>
				</div>
				<div className="grid justify-items-end">
					<div className="flex">
						<div className="my-auto text-2xl">
							<MdOutlineArrowDropDown className="text-right" />
						</div>
					</div>
				</div>
			</div>
			{
				showDropDown && (
					<Dropped onClickDropDown={onClickDropDown} setCurrency={setCurrency} availableCurrencies={droppedCurrencies} />
				)
			}
		</div>
	)
}

const Dropped = ({ setCurrency, onClickDropDown, availableCurrencies }) => {

	const onSelect = (currency) => {
		onClickDropDown();
		setCurrency(currency)
	}

	return (
		<div className="border-l border-r border-b rounded-b-md grid grid-cols-1 divide-y absolute w-32">
			{
				availableCurrencies.map(currency => (
					<div className="flex p-4 cursor-pointer rounded-b-md bg-white" onClick={() => onSelect(currency)}>
						<div>
							<Img src={UI.RESOURCES.getCurrencySymbol(currency.toLowerCase())} className="h-6 w-7" />
						</div>
						<div className="my-auto ml-2">
							{currency}
						</div>
					</div>
				))
			}
		</div>
	)
}

const SwapComplete = ({ swapObj }) => {
	return (
		<div className="flex flex-col h-full relative">
			<div className="m-auto flex flex-col w-full">
				<div>Swap Complete</div>
				<div className="m-auto w-5/6 h-24 border rounded-xl mt-4">
					<div className="grid grid-cols-3 flex h-full">
						<div className="m-auto flex flex-col">
							<div>
								{swapObj.fromCurrency}
							</div>
							<div>
								{swapObj.fromAmount}
							</div>
						</div>
						<div className="m-auto">
							<MdEast />
						</div>
						<div className="m-auto flex flex-col">
							<div>
								{swapObj.toCurrency}
							</div>
							<div>
								{swapObj.toAmount}
							</div>
						</div>

					</div>
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
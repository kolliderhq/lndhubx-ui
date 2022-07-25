import { useEffect, useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { MdArrowForwardIos, MdOutlineArrowBackIos } from 'react-icons/md';
import { RiBitCoinLine, RiDownloadLine, RiExchangeLine, RiSendPlane2Line } from 'react-icons/ri';

import { CURRENCY_NAME_MAP } from 'consts/misc/currency';
import { useAppDispatch, useAppSelector } from 'hooks';
import { roundDecimal } from 'utils/format';
import { setSelectedWallet } from 'contexts/modules/wallet';
import { setView } from 'contexts/modules/layout';
import { API_NAMES, UI, VIEWS } from 'consts';

import useSWR from 'swr';
import { getSWROptions } from 'utils/fetchers';
import { setAvailableWallets, storeDispatch } from 'contexts';
import Img from 'react-cool-img';

export const WalletCard = () => {
	const [wallets, availableWallets, selectedWallet] = useAppSelector(state => [
		state.wallets.wallets,
		state.wallets.availableWallets,
		state.wallets.selectedWallet,
	]);
	const dispatch = useAppDispatch();
	const [selectedWalletData, setSelectedWalletData] = useState({});
	const [walletsLoaded, setWalletsLoaded] = useState(false)
	const [selectedWalletBalance, setSelectedWalletBalance] = useState(0)

	useEffect(() => {
	}, [availableWallets])

	useEffect(() => {
		if (!wallets) return
		setWalletsLoaded(true)
		let wallet = wallets[selectedWallet] ? wallets[selectedWallet] : { balance: 0, currency: selectedWallet }
		console.log(wallet)
		setSelectedWalletData(wallet)
		setSelectedWalletBalance(wallet.balance)
	}, [wallets, selectedWallet])

	const renderIcon = currency => {
		if (currency === 'BTC') {
			return <RiBitCoinLine className="mx-auto" />;
		} else if (currency === 'USD') {
			return '🇺🇸';
		} else if (currency === 'EUR') {
			return '🇪🇺'
		}
	};

	const renderAcconutList = () => {
		return availableWallets.forEach(currency => {
			let wallet = wallet ? wallet[currency] : { currency: currency, balance: 0 }
			console.log(wallet)
			return AccountListItem(currency, wallet)
		})
	}

	return (
		<div className="relative p-8 text-black">
			<div className="text-lg flex flex-row">
				<div className='m-auto flex'>
					<div className="mx-auto">
						<Img src="/assets/logos/kollider_icon_gradient.png" className="w-10 animate-pulse" />
					</div>
				</div>
			</div>
			<div className="border-b border-gray-50 pb-2 text-left mt-8">Accounts</div>
			<div></div>
			{
				walletsLoaded ? availableWallets.map(currency => (
					AccountListItem(currency, wallets[currency] ? wallets[currency] : { balance: 0, currency: currency })
				)) : (
					<div>Loading ...</div>
				)
			}
		</div>
	);
};

const AccountListItem = (currency, wallet) => {

	const onSelectAccout = () => {
		storeDispatch(setView(VIEWS.ACCOUNT_DETAIL));
		storeDispatch(setSelectedWallet(currency));
	}

	return (
		<div className="w-full h-20 bg-gray-25 hover:bg-gray-50 rounded-xl mt-3 text-left cursor-pointer" onClick={() => onSelectAccout()}>
			<div className="grid grid-cols-3 h-full text-black">
				<div className="m-auto w-full">
					<div className="grid grid-cols-2 w-full flex">
						<div className="ml-3 w-full">
							<Img width={40} height={40} src={UI.RESOURCES.getCurrencySymbol(currency.toLowerCase())} />
						</div>
						<div className="my-auto">
							{CURRENCY_NAME_MAP[currency]}
							{
								currency !== "BTC" && (
									<div className="flex text-xs font-light rounded-xl bg-purple-500 text-white w-20">
										<div className="m-auto">
											Synthetic
										</div>
									</div>
								)
							}
						</div>
					</div>
				</div>
				<div>
				</div>
				<div className="m-auto">
					<p className="truncate ...">
						{
							roundDecimal(wallet.balance, 8)
						}
					</p>
				</div>
			</div>
		</div>
	)
}

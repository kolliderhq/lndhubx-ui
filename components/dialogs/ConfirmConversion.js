import React, { useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';

import cn from 'clsx';
import toNumber from 'lodash-es/toNumber';
import Img from 'next/image';

// import { baseUmbrelSocketClient } from 'classes/UmbrelSocketClient';
import Loader from 'components/Loader';
import { TABS } from 'consts';
import { Side } from 'contexts';
import { setDialogClose, setTab } from 'contexts/modules/layout';
import { useAppDispatch, useAppSelector, useSymbolData, useSymbols } from 'hooks';
import { useMarkPrice } from 'hooks/useMarkPrice';
import { applyDp, roundDecimal } from 'utils/format';
import { displayToast } from 'utils/toast';
import { TOAST_LEVEL } from 'utils/toast';

export const ConfirmConversion = ({ quantity, isBuying, show }) => {
	const dispatch = useAppDispatch();
	const markPrice = useMarkPrice();

	const [fees, setFees] = useState(0);
	const [cost, setCost] = useState(0);
	const [price, setPrice] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let amountInDollar = isBuying ? quantity : -1 * quantity;
		// baseUmbrelSocketClient.makeConversion({ amountInDollar, isStaged: true }, res => {
		// 	setFees(res.data.fees);
		// 	setCost(res.data.btc_value);
		// 	setPrice(applyDp(res.data.estimated_fill_price, 1));
		// });
	}, []);

	const placeOrder = () => {
		let amountInDollar = isBuying ? quantity : -1 * quantity;
		setIsLoading(true);
		// baseUmbrelSocketClient.makeConversion(
		// 	{ amountInDollar, isStaged: false },
		// 	res => {
		// 		setIsLoading(false);
		// 		dispatch(setTab(TABS.OVERVIEW));
		// 		displayToast('Conversion successful.', {
		// 			type: 'success',
		// 			level: TOAST_LEVEL.INFO,
		// 		});
		// 	},
		// 	{ once: true, type: 'fill' }
		// );
	};

	return (
		<div className="flex w-full h-full mt-5">
			{isLoading ? (
				<div className="m-auto">
					<Loader color={'black'} text={'Processing'} />
				</div>
			) : (
				<div className="h-full flex flex-col">
					<div className="absolute cursor-pointer text-4xl font-bolt" onClick={() => show(false)}>
						<IoClose className="text-gray-600" />
					</div>
					<div className="flex items-center w-full justify-center gap-2 text-lg font-bold text-gray-600">Confirm Conversion</div>
					<div className="flex h-full">
						<div className="m-auto">
							<div className="text-2xl">
								You are about to {isBuying ? 'buy' : 'sell'} <span className="text-gray-700">${quantity}</span> for{' '}
								<span className="text-gray-700">{roundDecimal(cost, 0)} Sats</span>.
							</div>
							<div className="grid grid-cols-2 divide-x mt-4">
								<div className="text-sm">Est. Fill Price: <div className="text-xl">${price}</div></div>
								<div className="text-sm">Total fees: <div className="text-xl">{roundDecimal(fees, 0)} Sats</div></div>
							</div>
						</div>
					</div>
					<div>
						<button
							className="px-3 py-2 border-2 text-theme-main border-theme-main rounded-lg w-full"
							onClick={() => placeOrder()}>
							{' '}
							Do it.{' '}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

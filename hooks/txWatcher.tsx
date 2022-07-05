import React, {useEffect, useState} from 'react';
import useSWR from 'swr';
import { getSWROptions } from 'utils/fetchers';
import { API_NAMES } from 'consts';
import { displayToast, TOAST_LEVEL } from 'utils/toast';
import { useAppDispatch, useAppSelector} from './redux';
import { setView } from 'contexts/modules/layout';
import { VIEWS } from 'consts';
import { fixed } from 'utils/Big';
import { roundDecimal } from 'utils/format';



export default function useTxWatcher() {

	const [isLoggedIn, wallets, meta] = useAppSelector(state => [
		state.connection.isLoggedIn,
		state.wallets.wallets,
		state.user.meta,
		// state.wallets.txs,
	]);

	let dispatch = useAppDispatch();
	const [txs, setTxs] = useState([]);
	const [txsFirstLoaded, setTxsFirstLoaded] = useState(true);

	const { data: newTxs } = useSWR(isLoggedIn ? [API_NAMES.TXS, null] : null, getSWROptions(API_NAMES.TXS));

	useEffect(() => {
		if (!newTxs) return;
		if (txsFirstLoaded && newTxs.length !== 1) {
			setTxs(newTxs);
			setTxsFirstLoaded(false);
		} else {
			setTxsFirstLoaded(false);
			console.log(newTxs.length);
			console.log(txs.length);
			if (newTxs.length > txs.length) {
				let diff = newTxs.length - txs.length;
				for (let i = diff; i > 0; i--) {
					let tx = newTxs[newTxs.length - i];
					if (tx.txType === 'External' && tx.inboundUid === meta.uid) {
						displayToast(
							<div className="flex flex-row">
								{/* <div className="">
									<Img src={UI.RESOURCES.getCurrencySymbol(tx.inboundCurrency.toLowerCase())} className="h-6 w-6" />
								</div> */}
								<p>{` 💸 Received ${roundDecimal(tx.inboundAmount, 8)} ${tx.inboundCurrency} deposit! 💸`}</p>
							</div>,
							{
								type: 'info',
								level: TOAST_LEVEL.CRITICAL,
							}
						);
						dispatch(setView(VIEWS.OVERVIEW))
					}

					if (tx.txType === 'External' && tx.outboundUid === meta.uid) {
						displayToast(
							<div className="flex flex-row">
								{/* <div className="">
									<Img src={UI.RESOURCES.getCurrencySymbol(tx.inboundCurrency.toLowerCase())} className="h-6 w-6" />
								</div> */}
								<p>{` 💸 Send ${roundDecimal(tx.outboundAmount, 8)} ${tx.inboundCurrency} successfully! 💸`}</p>
							</div>,
							{
								type: 'info',
								level: TOAST_LEVEL.CRITICAL,
							}
						);
						dispatch(setView(VIEWS.OVERVIEW))
					}
				}
				setTxs(newTxs);
			}
		}
	}, [newTxs]);
}

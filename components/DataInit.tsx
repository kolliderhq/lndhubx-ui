import React from 'react';
import { useEffect, useMemo } from 'react';

import empty from 'is-empty';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { API_NAMES } from 'consts';
import { setMeta, setTxs, setWallet, setWallets, storeDispatch } from 'contexts';
import { setAvailableWallets } from 'contexts';
import useAutoLogout from 'hooks/init/useAutoLogout';
import { useCheckIpLocation } from 'hooks/init/useCheckIpLocation';
import useGetMiscData from 'hooks/init/useGetMiscData';
import { useInitialize } from 'hooks/init/useInitialize';
import useQuerySideEffects from 'hooks/init/useQuerySideEffects';
import { useWebln } from 'hooks/init/useWebln';
import { useAppSelector } from 'hooks/redux';
import { useStatusChecker } from 'hooks/useStatusChecker';
import { getSWROptions } from 'utils/fetchers';
import bank, { setBankInfo } from 'contexts/modules/bank';

export const DataInit = () => {
	const [loaded, setLoaded] = React.useState(false);
	const [isLoggedIn, wallets] = useAppSelector(state => [
		state.connection.isLoggedIn,
		state.wallets.wallets,
		// state.wallets.txs,
	]);
	React.useEffect(() => {
		setLoaded(true);
	}, []);

	useGetMiscData();
	useStatusChecker();

	const { data: availableCurrencies } = useSWR(
		isLoggedIn ? [API_NAMES.AVAILABLE_CURRENCIES] : null,
		getSWROptions(API_NAMES.AVAILABLE_CURRENCIES)
	);
	const { data: userWallets } = useSWR(isLoggedIn ? [API_NAMES.BALANCES] : null, getSWROptions(API_NAMES.BALANCES));
	// const { data: newTxs } = useSWR(isLoggedIn ? [API_NAMES.TXS] : []);
	const { data: whoAmI} = useSWR(isLoggedIn ? [API_NAMES.WHOAMI] : null);
	const { data: bankInfo} = useSWR(isLoggedIn ? [API_NAMES.BANK_INFO] : null);

	useEffect(() => {
		if (availableCurrencies) {
			storeDispatch(setAvailableWallets(availableCurrencies));
		}
	}, [availableCurrencies]);

	useEffect(() => {
		if (userWallets) {
			storeDispatch(setWallets(userWallets));
		}
	}, [userWallets]);

	useEffect(() => {
		if (whoAmI) {
			console.log(whoAmI)
			storeDispatch(setMeta(whoAmI));
		}
	}, [whoAmI]);

	useEffect(() => {
		if (bankInfo) {
			console.log(bankInfo)
			storeDispatch(setBankInfo(bankInfo));
		}
	}, [bankInfo]);

	// useMemo(() => {
	// 	if (!newTxs) return;
	// 	// console.log(newTxs)
	// 	newTxs.sort((a, b) => (a.createdAt < b.createdAt));
	// 	// console.log(txs);
	// 	if (txs.length > 0) {
	// 		console.log(newTxs);
	// 	}
	// 	storeDispatch(setTxs(newTxs));
	// }, [newTxs]);

	const afterhydration = React.useMemo(() => {
		if (!loaded) return;
		return <RunOnHydration />;
	}, [loaded]);

	const history = useRouter();
	const afterHistoryLoad = React.useMemo(() => {
		if (!history.isReady) return;
		return <RunOnHistoryLoad />;
	}, [history.isReady]);

	const symbolData = useAppSelector(state => state.symbols.symbolData);

	return (
		<>
			{afterhydration}
			{afterHistoryLoad}
		</>
	);
};

const RunOnHydration = () => {
	useQuerySideEffects(); //  parse url queries
	useCheckIpLocation();
	return <></>;
};

const RunOnHistoryLoad = () => {
	useInitialize(); //	authenticate user -> done before loading screen
	return <></>;
};

const Webln = () => {
	useWebln();
	return <></>;
};
// const Umbrel = () => {
// 	useUmbrel();
// 	React.useEffect(() => {
// 		if (process.env.NEXT_PUBLIC_UMBREL === '1' && window.location.hostname !== 'umbrel.local') {
// 			alert('Zonic only supports being loaded from umbrel.local:4243');
// 		}
// 		auth.logoutUser()
// 	}, []);
// 	return (
// 		<WrapHasLightClient loaderElement={<></>}>
// 			<></>
// 		</WrapHasLightClient>
// 	);
// };

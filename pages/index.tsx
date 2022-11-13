import React, { useEffect, useState } from 'react';

import Head from 'next/head';

import { ConvertFunds } from 'components/ConvertFunds';
import { Dialogs } from 'components/dialogs/DIalogs';
import { Header } from 'components/layout/Header';
import { Overview } from 'components/Overview';
import { SendPayment } from 'components/SendPayment';
import { VIEWS } from 'consts';
import { storeDispatch } from 'contexts';
import { setView } from 'contexts/modules/layout';
import { useAppSelector } from 'hooks';
import useTxWatcher from 'hooks/txWatcher';

import { AccountDetail } from '../components/AccountDetail';
import { Create } from '../components/Create';
import { CreatePassword } from '../components/CreatePassword';
import { Info } from '../components/Info';
import { Login } from '../components/Login';
import { Receive } from '../components/Receive';
import { Settings } from '../components/Settings';
import { Welcome } from '../components/Welcome';
import { displayToast, TOAST_LEVEL } from 'utils/toast';

export default function Home() {
	const [selectedView, isLoggedIn, allowedIp] = useAppSelector(state => [
		state.layout.selectedView,
		state.connection.isLoggedIn,
		state.misc.allowedIp
	]);

	const [disableUi, setDisableUi] = useState(false);

	useEffect(() => {
		if (!isLoggedIn) {
			storeDispatch(setView(VIEWS.WELCOME));
		} else {
			storeDispatch(setView(VIEWS.OVERVIEW));
		}
	}, [isLoggedIn]);

	useEffect(() => {
		if (allowedIp === false) {
			// displayToast
			// 	displayToast(<p>You're accessing Kollider Pay from an origin that don't comply with our terms of serivce.</p>, {
			// 	type: 'error',
			// 	level: TOAST_LEVEL.CRITICAL,
			// });
			setDisableUi(true)
		}
	}, [allowedIp])

	useTxWatcher();

	return (
		// bg-gradient-to-br from-indigo-500 to-indigo-800
		<div className="w-full sm:grid sm:grid-rows sm:px-4 pt-3 lg:h-sceen relative bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600">
			<Dialogs />
			<Header />
			<div className="lg:h-screen h-full w-full">
				<div className='mx-auto w-80 bg-yellow-500 text-center rounded mb-4 p-2 animate-pulse font-bold text-black'>
					This app is sunset and will stop working soon. We will release a new version of Kollider Wallet in form of a browser extension.
					Please withdraw all your funds!
				</div>
				<div className="flex h-full">
					<div className="bg-white font-semibold mx-auto text-center rounded-3xl h-128 w-128 shadow-2xl shadow-indigo-500/50 bg-gradient-to-r from-purple-500 to-pink-500 p-1">
						<div className="w-full h-full bg-gray-800 rounded-3xl">
								{/* {
									disableUi? (
										<div className="flex h-full">
											<div className="m-auto text-center p-6">
											Unfortunately Kollider Pay is not available in your country. 😔
											</div>
										</div>
									): ( */}
										<div className="h-full">
									{selectedView === VIEWS.WELCOME && <Welcome />}
									{selectedView === VIEWS.LOGIN && <Login />}
									{selectedView === VIEWS.CREATE && <Create />}
									{selectedView === VIEWS.CREATE_PASSWORD && <CreatePassword />}
									{selectedView === VIEWS.INFO && <Info />}

									{selectedView === VIEWS.ACCOUNT_DETAIL && <AccountDetail />}
									{selectedView === VIEWS.RECEIVE && <Receive />}
									{selectedView === VIEWS.OVERVIEW && <Overview />}
									{selectedView === VIEWS.SEND && <SendPayment />}
									{selectedView === VIEWS.CONVERT && <ConvertFunds />}
									{selectedView === VIEWS.SETTINGS && <Settings />}
										</div>
									{/* )
								} */}
							</div>
					</div>
				</div>
			</div>
		</div>
	);
}

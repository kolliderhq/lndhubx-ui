import React, { useEffect, useState } from 'react';

import { ConvertFunds } from 'components/ConvertFunds';
import { Dialogs } from 'components/dialogs/DIalogs';
import { Header } from 'components/layout/Header';
import { Overview } from 'components/Overview';
import { SendPayment } from 'components/SendPayment';
import { VIEWS } from 'consts';
import { storeDispatch } from 'contexts';
import { setView } from 'contexts/modules/layout';
import { useAppSelector } from 'hooks';

import { AccountDetail } from '../components/AccountDetail';
import { Create } from '../components/Create';
import { CreatePassword } from '../components/CreatePassword';
import { Info } from '../components/Info';
import { Login } from '../components/Login';
import { Receive } from '../components/Receive';
import { Settings } from '../components/Settings';
import { Welcome } from '../components/Welcome';
import useTxWatcher from 'hooks/txWatcher';

export default function Home() {
	const [selectedView, isLoggedIn] = useAppSelector(state => [
		state.layout.selectedView,
		state.payments.paymentInTransit,
		state.connection.isLoggedIn,
	]);

	useEffect(() => {
		if (!isLoggedIn) {
			storeDispatch(setView(VIEWS.WELCOME));
		} else {
			storeDispatch(setView(VIEWS.OVERVIEW));
		}
	}, [isLoggedIn]);

	useTxWatcher();

	return (
		// bg-gradient-to-br from-indigo-500 to-indigo-800
		<div className="w-full sm:grid sm:grid-rows sm:px-4 pt-3 lg:h-sceen relative bg-white">
			<Dialogs />
			<Header />
			<div className="lg:h-screen h-full w-full">
				<div className="flex h-full">
					<div className="bg-white font-semibold mx-auto text-center rounded-3xl h-128 w-128 shadow-2xl shadow-indigo-500/50">
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
					</div>
				</div>
			</div>
		</div>
	);
}

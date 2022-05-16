import { combineReducers } from '@reduxjs/toolkit';

import connectionReducers from './connection';
import invoicesReducers from './invoices';
import layoutReducers from './layout';
import miscReducers from './misc';
import notificationsReducers from './notifications';
import pricesReducers from './prices';
import settingsReducers from './settings';
import symbolsReducers from './symbols';
import umbrelReducers from './umbrel';
import userReducers from './user';
import paymentsReducers from './payments';
import currencyReducers from './currency';
import walletReducers from './wallet';

const rootReducer = combineReducers({
	prices: pricesReducers,
	symbols: symbolsReducers,
	connection: connectionReducers,
	invoices: invoicesReducers,
	misc: miscReducers,
	user: userReducers,
	notifications: notificationsReducers,
	settings: settingsReducers,
	layout: layoutReducers,
	umbrel: umbrelReducers,
	payments: paymentsReducers,
	currencies: currencyReducers,
	wallets: walletReducers,
});

export default rootReducer;
export type RootReducerState = ReturnType<typeof rootReducer>;

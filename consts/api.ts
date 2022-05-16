import { DeepReadonly } from 'ts-essentials';

import { TIME } from 'consts/time';
import { applyOptionalParams, deepFreeze } from 'utils/scripts';

import { I_API } from './types/api';

const multiplier = 1;

export const API_TIME: Record<string, DeepReadonly<number>> = {
	NONE: 0,
	SHORTEST: 5 * TIME.SECOND * multiplier,
	SHORTER: 12 * TIME.SECOND * multiplier,
	SHORT: 30 * TIME.SECOND * multiplier,
	LONG: TIME.MINUTE * multiplier,
	LONGER: TIME.MINUTE * 5 * multiplier,
	ONE_TIME: 30 * TIME.MINUTE * multiplier,
	HOUR: 60 * TIME.MINUTE * multiplier,
};

let back;
if (process.env.NEXT_PUBLIC_BACK_ENV === 'production') {
	back = 'https://lndhubx.kollider.xyz/api';
	// back = 'http://api.staging.kollider.internal/v1';
	// TODO : remove after you debug the issue

	(() => {
		let method;
		const noop = function noop() {};
		// TODO : uncomment methods when out of beta
		let methods = [
			'assert',
			'clear',
			'count',
			// 'debug',
			'dir',
			'dirxml',
			// 'error',
			// 'exception',
			'group',
			'groupCollapsed',
			'groupEnd',
			'info',
			'log',
			'markTimeline',
			'profile',
			'profileEnd',
			'table',
			'time',
			'timeEnd',
			'timeStamp',
			// 'trace',
			'warn',
		];
		let length = methods.length;

		while (length--) {
			method = methods[length];
			console[method] = noop;
		}
	})();
} else {
	back = 'http://127.0.0.1:8080';
	// back = 'https://api.kollider.xyz/v1';
}

const END_POINTS: Record<string, string> = Object.freeze({
	BACK: back,
	RAW_GITHUB: 'https://raw.githubusercontent.com/kolliderhq/resources/main',
	SERVERLESS: '/api',
});

export const RAW_GEOLOCATION: Readonly<string> = 'https://geoip.kollider.xyz/';

const postOptions: {
	revalidateOnReconnect: boolean;
	revalidateOnFocus: boolean;
	onErrorRetry: () => void;
} = {
	revalidateOnReconnect: false,
	revalidateOnFocus: false,
	onErrorRetry: () => null,
};

const API: I_API = {
	BASE: END_POINTS,
	API: {
		// STATUS: {
		// 	route: () => `/status`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.SHORTEST,
		// 	allowNull: true,
		// },
		REGISTER: {
			route: () => `/create`,
			method: 'post',
			base: END_POINTS.BACK,
			stale: API_TIME.NONE,
			createBody: params => ({
				username: params.username,
				password: params.password,
			}),
			customOptions: {
				...postOptions,
				dedupingInterval: 0,
				onError: (error, key, config) => {
					return error;
				},
			},
		},
		LOGIN: {
			route: () => `/auth`,
			method: 'post',
			base: END_POINTS.BACK,
			stale: API_TIME.NONE,
			createBody: params => ({
				username: params.username,
				password: params.password,
			}),
			customOptions: {
				...postOptions,
				dedupingInterval: 0,
				onError: (error, key, config) => {
					return error;
				},
			},
		},
		AVAILABLE_CURRENCIES: {
			route: () => `/getavailablecurrencies`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.SHORTER,
			allowNull: true,
		},
		BALANCES: {
			route: () => `/balance`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.SHORTER,
			allowNull: true,
		},
		ADD_INVOICE: {
			route: (amount, currency, meta) =>
				`/addinvoice?amount=${amount}&currency=${currency}&meta=${meta}`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.NONE,
			allowNull: true,
		},
		SWAP: {
			route: () => `/swap`,
			method: 'post',
			base: END_POINTS.BACK,
			stale: API_TIME.NONE,
			allowNull: true,
			createBody: params => ({
				from_currency: params.fromCurrency,
				to_currency: params.toCurrency,
				amount: params.amount,
			}),
			customOptions: {
				...postOptions,
				dedupingInterval: 0,
				onError: (error, key, config) => {
					return error;
				},
			},
		},
		// WHOAMI: {
		// 	route: () => `/auth/whoami`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// },
		// PRODUCTS: {
		// 	route: () => `/market/products`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// },
		// WALLET_DEPOSIT: {
		// 	route: () => `/wallet/deposit`,
		// 	method: 'post',
		// 	createBody: params => ({ ...params }),
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// 	customOptions: {
		// 		...postOptions,
		// 	},
		// },
		// HISTORICAL_OHLC: {
		// 	route: (symbol, intervalSize, start, end) =>
		// 		`/market/historical_ohlc?symbol=${symbol}&interval_size=${intervalSize}${applyOptionalParams(
		// 			{ start, end },
		// 			false
		// 		)}`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.HOUR,
		// },
		// REFRESH_JWT: {
		// 	route: () => `/auth/refresh_token`,
		// 	method: 'post',
		// 	createBody: params => ({ ...params }),
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// 	customOptions: {
		// 		...postOptions,
		// 	},
		// },
		// HISTORICAL_INDEX_PRICES: {
		// 	route: (symbol, intervalSize, start, end) =>
		// 		`/market/historic_index_prices?symbol=${symbol}&interval_size=${intervalSize}&start=${start}&end=${end}`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// 	allowNull: true,
		// },
		// USER_ACCOUNT: {
		// 	route: () => `/user/account`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// },
		// MULTI_USER_DATA: {
		// 	route: () => `/users`,
		// 	method: 'post',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// 	createBody: params => ({ ...params }),
		// 	customOptions: {
		// 		dedupingInterval: 0,
		// 		revalidateOnFocus: false,
		// 		revalidateOnMount: true,
		// 	},
		// },
		// TRADE_LEADERBOARD: {
		// 	route: (symbol, start, end) => `/market/trade_leaderboard?${applyOptionalParams({ symbol, start, end }, true)}`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.LONGER,
		// },
		// HISTORICAL_MARK_PRICES: {
		// 	route: (symbol, intervalSize, start, end) =>
		// 		`/market/historical_mark_price?symbol=${symbol}&interval_size=${intervalSize}&start=${start}&end=${end}`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.HOUR,
		// 	allowNull: true,
		// },
		// HISTORIC_ASSET_VALUES: {
		// 	route: (start, end, granularity, symbol) =>
		// 		`/user/historic_asset_values?${applyOptionalParams({ start, end, symbol, interval_size: granularity }, true)}`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.ONE_TIME,
		// 	allowNull: true,
		// },
		// GET_ORDERS: {
		// 	route: (symbol, start, end, limit) =>
		// 		`/orders?${applyOptionalParams({ start, end, symbol, limit}, true)}`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.ONE_TIME,
		// 	allowNull: true,
		// },
		// HISTORICAL_TRADES: {
		// 	route: (symbol, start, end, limit) =>
		// 		`/user/trades?${applyOptionalParams({ start, end, symbol, limit: 100}, true)}`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.SHORTEST,
		// 	allowNull: true,
		// },
		// TRADE_SUMMARY: {
		// 	route: () => `/user/trade_summary`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.NONE,
		// 	customOptions: {
		// 		dedupingInterval: 10,
		// 		initialSize: 1,
		// 		revalidateAll: false,
		// 		persistSize: false,
		// 	},
		// },
		// CHECK_VERSION: {
		// 	route: () => `/version`,
		// 	method: 'get',
		// 	base: END_POINTS.SERVERLESS,
		// 	stale: API_TIME.LONG,
		// 	simple: true, //  just to display that this does not have a refiner
		// },
		// AUTH_LNURL: {
		// 	route: () => `/auth/lnurl_auth`,
		// 	method: 'get',
		// 	base: END_POINTS.BACK,
		// 	stale: API_TIME.ONE_TIME,
		// },
	},
};
deepFreeze(API);
const API_NAMES: Record<keyof typeof API.API, string> = {};
Object.keys(API.API).forEach(apiName => (API_NAMES[apiName] = apiName));
export { API_NAMES, API };

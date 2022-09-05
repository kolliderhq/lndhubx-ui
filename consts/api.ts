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
		PRESIGNUP: {
			route: () => `/presignup`,
			method: 'post',
			base: END_POINTS.BACK,
			stale: API_TIME.NONE,
			createBody: params => ({
				email: params.email,
			}),
			customOptions: {
				...postOptions,
				dedupingInterval: 0,
				onError: (error, key, config) => {
					return error;
				},
			},
		},
		WHOAMI: {
			route: () => `/whoami`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.LONGER,
			allowNull: true,
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
			stale: API_TIME.SHORTEST,
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
		QUERY_ROUTE: {
			route: (payment_request) =>
				`/query_route?payment_request=${payment_request}`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.SHORTEST,
			allowNull: true,
		},
		QUOTE: {
			route: (fromCurrency, toCurrency, amount) =>
				`/quote?amount=${amount}&from_currency=${fromCurrency}&to_currency=${toCurrency}`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.SHORTEST,
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
		PAY: {
			route: () => `/payinvoice`,
			method: 'post',
			base: END_POINTS.BACK,
			stale: API_TIME.NONE,
			allowNull: true,
			createBody: params => ({
				payment_request: params.paymentRequest,
				currency: params.currency,
				amount: params?.amount,
				receipient: params?.receipient,
			}),
			customOptions: {
				...postOptions,
				dedupingInterval: 0,
				onError: (error, key, config) => {
					return error;
				},
			},
		},
		TXS: {
			route: (currency) => {
				if (currency) {
					return `/gettxs?currency=${currency}`
				} else {
					return `/gettxs`
				}
			},
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.SHORTEST,
			allowNull: true,
		},
		BANK_INFO: {
			route: () => `/nodeinfo`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.SHORT,
			allowNull: true,
		},
		CREATE_LNURL_WITHDRAWAL: {
			route: (amount, currency) => `/lnurl_withdrawal/create?currency=${currency}&amount=${amount}`,
			method: 'get',
			base: END_POINTS.BACK,
			stale: API_TIME.ONE_TIME,
			allowNull: true,
		}
	},
};
deepFreeze(API);
const API_NAMES: Record<keyof typeof API.API, string> = {};
Object.keys(API.API).forEach(apiName => (API_NAMES[apiName] = apiName));
export { API_NAMES, API };

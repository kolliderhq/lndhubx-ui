import { sort } from 'fast-sort';
import each from 'lodash-es/each';
import filter from 'lodash-es/filter';
import identity from 'lodash-es/identity';
import includes from 'lodash-es/includes';
import isArray from 'lodash-es/isArray';
import isFunction from 'lodash-es/isFunction';
import isNil from 'lodash-es/isNil';
import isObject from 'lodash-es/isObject';
import keys from 'lodash-es/keys';
import map from 'lodash-es/map';
import pickBy from 'lodash-es/pickBy';

import { API, API_NAMES } from 'consts/api';
import { reduxStore } from 'contexts';
import { divide } from 'utils/Big';
import { LOG, LOG2, LOG4 } from 'utils/debug';

import { CustomError } from '../error';
import { camelCaseAllKeys } from '../format';
import { mapKeyValues } from '../scripts';
import { parseTime } from '../time';
import { KeysToCamelCase, Nullable } from '../types/utils';

const refiner = new Map();

interface IStatus {
	msg: string;
	next_maintenance: Nullable<number>;
	status: string;
}
refiner.set(API_NAMES.STATUS, (data: IStatus) => {
	const ret = camelCaseAllKeys(data);
	if (ret?.nextMaintenance) ret.nextMaintenance = parseTime(ret.nextMaintenance);
	return ret;
});

refiner.set(API_NAMES.REGISTER, data => {
	return { success: true };
});

interface ILogin {
	token: string;
	refresh: string;
}
refiner.set(API_NAMES.LOGIN, (data: ILogin) => {
	return {
		token: data.token,
		refresh: data.refresh,
	};
});

refiner.set(API_NAMES.AVAILABLE_CURRENCIES, data => {
	console.log({data: camelCaseAllKeys(data)})
	const dataArr = sort(data.currencies).asc();
	return camelCaseAllKeys(dataArr);
});

refiner.set(API_NAMES.ADD_INVOICE, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

refiner.set(API_NAMES.BALANCES, data => {
	console.log({data: camelCaseAllKeys(data)})
	const arr = mapKeyValues(data.accounts, (k, v) => v);
	const dataArr = sort(arr).asc(v => v.symbol);
	const wallets = {};
	// console.log('products data Array >>>>>', dataArr);
	each(dataArr, v => {
		wallets[v.currency] = {
			currency: v.currency,
			balance: Number(v.balance),
			accountId: v.account_id,
		};
	});
	return {wallets: wallets};
});

refiner.set(API_NAMES.SWAP, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

refiner.set(API_NAMES.QUERY_ROUTE, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

refiner.set(API_NAMES.QUOTE, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

refiner.set(API_NAMES.PAY, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

refiner.set(API_NAMES.TXS, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});
refiner.set(API_NAMES.WHOAMI, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});
refiner.set(API_NAMES.BANK_INFO, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

refiner.set(API_NAMES.PRESIGNUP, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

refiner.set(API_NAMES.CREATE_LNURL_WITHDRAWAL, data => {
	console.log({data: camelCaseAllKeys(data)})
	return camelCaseAllKeys(data);
});

export const apiRefiner = (name, data) => {
	let refinerFunc = null;
	if (refiner.has(name)) {
		refinerFunc = refiner.get(name);
	}
	if (!isFunction(refinerFunc)) {
		console.log('no refiner api', data);
		throw new CustomError(`CRITICAL - refiner function for ${name} is non-existent`);
	}
	let ret = data;
	try {
		ret = refinerFunc(data);
		console.log(ret);
		console.log(name)
		// LOG2(ret, `refiner - ${name}`);
		validateDataFilled(ret, name); //  throws when missing value
	} catch (ex) {
		ret = new CustomError('refiner Error', ex);
	}
	return ret;
};

// throws if any value is nil
// export const validateDataFilled = (data: unknown, key: string) => {
export const validateDataFilled = (data, key) => {
	if (API.API[key]?.allowNull && !isNil(data)) return; //  no checks
	if (isArray(data)) {
		each(data, value => {
			validateDataFilled(value, key);
		});
	} else if (isObject(data)) {
		mapKeyValues(data as Record<any, any>, (key, value) => {
			validateDataFilled(value, key);
		});
	} else {
		if (isNil(data)) {
			LOG4(`key not defined [${key}]`, `apiRefiner`);
			throw new Error(`key not defined [${key}]`);
		}
	}
};

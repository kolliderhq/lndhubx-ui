/*
 * state is kept in redux
 * all processes related to authentication will be in this class
 */

import React from 'react';

import each from 'lodash-es/each';
import { v4 as uuidv4, v4 } from 'uuid';

import { Processor } from 'classes/Processor';
import { API_NAMES, CONTEXTS, DIALOGS, SETTINGS, USER_TYPE, VIEWS } from 'consts';
import {
	defaultLocalStore,
	reduxStore,
	setApiKey,
	setInitNotifications,
	setUserData,
	setUserLogout,
	storeDispatch,
	setIsLoggedIn,
} from 'contexts';
import { setDialog, setView } from 'contexts/modules/layout';
import { postRequest } from 'utils/api';
import { LOG, LOG3, LOG5 } from 'utils/debug';
import { jwtGetExp } from 'utils/jwt';
import { getMsFromNow } from 'utils/time';
import { TOAST_LEVEL, displayToast } from 'utils/toast';
import user from 'contexts/modules/user';

class Auth {
	public static instance = this;
	public static loginCount = 0;

	private _userType: USER_TYPE;
	private _processor: Processor;
	public constructor() {
		this._userType = USER_TYPE.NULL;
		this._processor = new Processor();
	}

	set userType(newUserType: USER_TYPE) {
		this._userType = newUserType;
	}

	public loadLocalData() {
		if (this._userType !== USER_TYPE.NULL) return false;
		this._processor.requestProcess({
			processFunc: loadLocalDataProcessFunc,
		});
	}

	public persistLogin() {
		if (this._userType !== USER_TYPE.NULL) return false;
		this._processor.requestProcess({
			processFunc: persistLoginProcessFunc,
		});
	}

	public proUserLogin(data: any) {
		this._processor.requestProcess({
			processFunc: () => proUserLoginProcessFunc(data),
		});
	}

	public lightClientLogin() {
		if (this._userType !== USER_TYPE.NULL) return false;
		this._processor.requestProcess({
			processFunc: () => lightClientLoginProcessFunc(),
		});
	}

	public logoutUser() {
		// if (this._userType === USER_TYPE.NULL) return false;
		this._processor.requestProcess({
			processFunc: logOutFunc,
		});
	}
}

const proUserLoginProcessFunc = data => {
	storeDispatch(setDialog(DIALOGS.NONE));
	storeDispatch(setApiKey(data.accessToken));
	const userData = {
		token: data?.accessToken,
		email: '',
		type: USER_TYPE.PRO,
	};

	displayToast(<p>Login Success</p>, {
		type: 'success',
		level: TOAST_LEVEL.CRITICAL,
	});
	storeDispatch(setUserData(userData));
	defaultLocalStore.cookieSet(CONTEXTS.LOCAL_STORAGE.FULL_USER, { ...userData });
	if (data?.refreshToken) defaultLocalStore.cookieSet(CONTEXTS.LOCAL_STORAGE.FULL_USER_REFRESH, data.refreshToken);
};

const logOutFunc = () => {
	storeDispatch(setInitNotifications());
	defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.USER);
	// defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.FULL);
	storeDispatch(setUserLogout());
	storeDispatch(setApiKey(''));
	storeDispatch(setIsLoggedIn(false));
	storeDispatch(setView(VIEWS.WELCOME));
	// storeDispatch(setIsWsAuthenticated(false));
	displayToast(<p>Successfully Logged Out</p>, {
		type: 'success',
		level: TOAST_LEVEL.IMPORTANT,
	});
};

const loadLocalDataProcessFunc = () => {
	if (defaultLocalStore.has(CONTEXTS.LOCAL_STORAGE.FULL_USER)) {
		if (!defaultLocalStore.has(CONTEXTS.LOCAL_STORAGE.HAS_LOGGED_IN)) {
			defaultLocalStore.set(CONTEXTS.LOCAL_STORAGE.HAS_LOGGED_IN, true);
		}

		//  check token expire and delete localStorage if expired
		const fullUser = defaultLocalStore.get(CONTEXTS.LOCAL_STORAGE.FULL_USER);
		console.log('fullUser', fullUser);
		const exp = jwtGetExp(fullUser?.token);
		// console.log(getMsFromNow(exp * 1000));
		if (getMsFromNow(exp * 1000) * -1 < SETTINGS.LIMITS.JWT_REQUEST_THRESHOLD) {
			LOG('expired, delete', 'token');
			defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.FULL_USER);
			defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.FULL_USER_REFRESH);
		}
	}
};

//	returns true if pro login successful, false if not.
const persistLoginProcessFunc = async () => {
	if (defaultLocalStore.has(CONTEXTS.LOCAL_STORAGE.USER)) {
		console.log("User found")
		if (!defaultLocalStore.has(CONTEXTS.LOCAL_STORAGE.HAS_LOGGED_IN)) {
			defaultLocalStore.set(CONTEXTS.LOCAL_STORAGE.HAS_LOGGED_IN, true);
		}
		//  check token expire and delete localStorage if expired
		const refreshToken = defaultLocalStore.cookieGet(CONTEXTS.LOCAL_STORAGE.USER.refresh);

		const userObj = defaultLocalStore.cookieGet(CONTEXTS.LOCAL_STORAGE.USER);
		storeDispatch(setApiKey(userObj.token));
		storeDispatch(setUserData(userObj));
		storeDispatch(setIsLoggedIn(true));
		storeDispatch(setView(VIEWS.OVERVIEW));

		// const exp = jwtGetExp(refreshToken);
		// if (getMsFromNow(exp * 1000) > SETTINGS.LIMITS.JWT_REQUEST_THRESHOLD * -1) {
		// 	LOG('expired, delete', 'token');
		// 	defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.FULL_USER);
		// 	defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.FULL_USER_REFRESH);
		// } else {
		// 	const refresh = defaultLocalStore.cookieGet(CONTEXTS.LOCAL_STORAGE.FULL_USER_REFRESH);
		// 	//  if no refresh, skip over to light login
		// 	if (refresh) {
		// 		//  full user login
		// 		const userObj = defaultLocalStore.cookieGet(CONTEXTS.LOCAL_STORAGE.FULL_USER);

		// 		const exp = jwtGetExp(userObj.token);
		// 		//  can use for less than than 5 minutes - considered expired

		// 		if (getMsFromNow(exp * 1000) > SETTINGS.LIMITS.JWT_REQUEST_THRESHOLD * -1) {
		// 			try {
		// 				const res = await postRequest(API_NAMES.REFRESH_JWT, [], { refresh });
		// 				userObj.token = res.token;
		// 				storeDispatch(setApiKey(userObj.token));
		// 				storeDispatch(setUserData(userObj));
		// 				return true;
		// 			} catch (ex) {
		// 				LOG5('error on refresh jwt - resetting login status', ex);
		// 				defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.FULL_USER);
		// 				defaultLocalStore.cookieUnset(CONTEXTS.LOCAL_STORAGE.FULL_USER_REFRESH);
		// 				return false;
		// 			}
		// 		} else {
		// 			storeDispatch(setApiKey(userObj.token));
		// 			storeDispatch(setUserData(userObj));
		// 			return true;
		// 		}
		// 	}
		// }
	}
	return false;
};

const lightClientLoginProcessFunc = async () => {
	console.log('login process');
	if (Auth.loginCount > 0) {
		resetStores();
	}
	Auth.loginCount++;
	//  light client already exists
	if (defaultLocalStore.has(CONTEXTS.LOCAL_STORAGE.ANON_USER)) {
		const userObj = defaultLocalStore.cookieGet(CONTEXTS.LOCAL_STORAGE.ANON_USER);
		console.log('anon user', userObj);
		LOG3(userObj.token, 'retrieve token');
		storeDispatch(setApiKey(userObj.token));
		storeDispatch(setUserData(userObj));
		return;
	}
	try {
		const userObj = await registerAnonUser();
		LOG(userObj, 'register anon res');
		storeDispatch(setApiKey(userObj.token));
		storeDispatch(setUserData(userObj));
	} catch (ex) {
		// displayToast('Server Unavailable', 'error', { position: 'top-right', autoClose: false }, 'Critical Error');
		// TODO
		//  retry logic
		//  display error
	}
};

function resetStores() {
	const store = reduxStore.getState();
	const obj = {};
	const symbols = store.symbols.symbols;
	each(symbols, v => {
		obj[v] = null;
	});
	// reinit invoices
}


export async function loginUser(loginData) {
	try {
		const res = await postRequest(API_NAMES.LOGIN, [], { username: loginData.username, password: loginData.password });
		let userObj = {
			"username": loginData.username,
			"token": res.token,
			"refresh": res.refresh
		}
		defaultLocalStore.cookieSet(CONTEXTS.LOCAL_STORAGE.USER, userObj);
		storeDispatch(setApiKey(userObj.token));
		storeDispatch(setUserData(userObj));
		storeDispatch(setIsLoggedIn(true));
		storeDispatch(setView(VIEWS.OVERVIEW));
		return res
	} catch (ex) {
		throw new Error(ex.data);
	}
}

export async function registerUser(loginData) {
	try {
		const resRegister = await postRequest(API_NAMES.REGISTER, [], { username: loginData.username, password: loginData.password });
		const resLogin = await postRequest(API_NAMES.LOGIN, [], { username: loginData.username, password: loginData.password });
		let userObj = {
			"username": loginData.username,
			"token": resLogin.token,
			"refresh": resLogin.refresh
		}
		defaultLocalStore.cookieSet(CONTEXTS.LOCAL_STORAGE.USER, userObj);
		storeDispatch(setApiKey(userObj.token));
		storeDispatch(setUserData(userObj));
		storeDispatch(setIsLoggedIn(true));
		storeDispatch(setView(VIEWS.OVERVIEW));

		return resLogin
	} catch (ex) {
		LOG5('anon user registration failed', 'Login');
		console.error(ex);
		throw new Error('anon user generation failed');
	}
}

// async function registerUser(registerData) {
// 	// const userObj = createAnonymousUser();
// 	try {
// 		await postRequest(API_NAMES.REGISTER, [], registerData);
// 		const res = await postRequest(API_NAMES.LOGIN, [], { email: userObj.email, password: userObj.password });
// 		LOG(res, 'light login result');
// 		if (res?.refresh) {
// 			defaultLocalStore.cookieSet(CONTEXTS.LOCAL_STORAGE.ANON_USER_REFRESH, res.refresh);
// 		}
// 		if (!res?.token) throw new Error('token was not returned from login');
// 		LOG3(res.token, 'new token');
// 		const retObj = {
// 			token: res.token,
// 			email: userObj.email,
// 			type: USER_TYPE.LIGHT,
// 		};
// 		defaultLocalStore.cookieSet(CONTEXTS.LOCAL_STORAGE.ANON_USER, retObj);
// 		return retObj;
// 	} catch (ex) {
// 		LOG5('anon user registration failed', 'Login');
// 		console.error(ex);
// 		throw new Error('anon user generation failed');
// 	}
// }

/**
 * @returns {{password: string, email: string, username: string}}
 */
const createAnonymousUser = () => {
	const id = v4();
	return {
		username: 'username-' + id,
		email: id + '@zonic.xyz',
		password: id.substring(1, 16) + '$.S',
		user_type: USER_TYPE.LIGHT,
	};
};

export const auth = new Auth();

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { auth } from 'classes/Auth';
import { USER_TYPE } from 'consts';
import { AnyRecord } from 'dns';

interface IUserState {
	data: {
		username: string;
		token: string;
		refresh: string;
	};
	meta: {
		uid: number
	};
	logout: boolean;
}
const initialState: IUserState = {
	data: {
		username: '',
		token: '',
		refresh: '',
	},
	meta: {
		uid: 0,
	},
	logout: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData: (state, action: PayloadAction<{ username: string, token: string; refresh: string}>) => {
			state.data = action.payload;
			state.logout = false;
		},
		setMeta: (state, action: PayloadAction<AnyRecord>) => {
			state.meta = action.payload;
		},
		setUserLogout: state => {
			state.data = { ...initialState.data };
			auth.userType = USER_TYPE.NULL;
			state.logout = true;
		},
	},
});

export const { setUserData, setUserLogout, setMeta} = userSlice.actions;

export default userSlice.reducer;

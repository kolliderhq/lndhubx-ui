import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { auth } from 'classes/Auth';
import { USER_TYPE } from 'consts';

interface IUserState {
	data: {
		username: string;
		token: string;
		refresh: string;
	};
	logout: boolean;
}
const initialState: IUserState = {
	data: {
		username: '',
		token: '',
		refresh: '',
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
		setUserLogout: state => {
			state.data = { ...initialState.data };
			auth.userType = USER_TYPE.NULL;
			state.logout = true;
		},
	},
});

export const { setUserData, setUserLogout} = userSlice.actions;

export default userSlice.reducer;

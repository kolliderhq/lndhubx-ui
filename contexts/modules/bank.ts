import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Bank {
	info: Record<string, string>;
}

const initialState: Bank = {
	info: {},
};

export const bankSlice = createSlice({
	name: 'bank',
	initialState,
	reducers: {
		setBankInfo: (state, action: PayloadAction<Record<string, string>>) => {
			state.info = action.payload;
		},
	},
});

export const { setBankInfo } = bankSlice.actions;
export default bankSlice.reducer;
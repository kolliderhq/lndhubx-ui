import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StoreCurrencyState {
	availableCurrencies: Array<string>;
	selectedCurrencyIndex: number;
}
const initialState: StoreCurrencyState = {
	selectedCurrencyIndex: 0,
	availableCurrencies: ["BTC", "USD"]
};

export const currencySlice = createSlice({
	name: 'currencies',
	initialState,
	reducers: {
		setSelectedCurrencyIndex: (state, action: PayloadAction<number>) => {
			state.selectedCurrencyIndex = action.payload
		},
	},
});

export const { setSelectedCurrencyIndex } = currencySlice.actions;
export default currencySlice.reducer;
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Wallet {
	balance: number;
	currency: string;
	account_id: string;
	account_type: string;
}

export interface Wallets {
	wallets: Record<string, Wallet>;
	availableWallets: Array<string>;
	selectedWallet: string;
}

const initialState: Wallets = {
	wallets: {},
	availableWallets: [],
	selectedWallet: 'BTC',
};

export const walletSlice = createSlice({
	name: 'wallets',
	initialState,
	reducers: {
		setWallets: (state, action: PayloadAction<{ wallets: Record<string, Wallet> }>) => {
			state.wallets = action.payload.wallets;
		},
		setWallet: (state, action: PayloadAction<{ currencySymbol: string; wallet: Wallet }>) => {
			state.wallets = { ...state.wallets, [action.payload.currencySymbol]: action.payload.wallet };
		},
		setWalletBalance: (state, action: PayloadAction<{ currency: string; balance: number }>) => {
			state.wallets = {
				...state.wallets,
				[action.payload.currency]: { ...state.wallets[action.payload.currency], ['balance']: action.payload.balance },
			};
		},
		setAvailableWallets: (state, action: PayloadAction<Array<string>>) => {
			state.availableWallets = action.payload;
		},
		setSelectedWallet: (state, action: PayloadAction<string>) => {
			state.selectedWallet = action.payload;
		},
	},
});

export const { setWallets, setWallet, setWalletBalance, setAvailableWallets, setSelectedWallet } = walletSlice.actions;
export default walletSlice.reducer;

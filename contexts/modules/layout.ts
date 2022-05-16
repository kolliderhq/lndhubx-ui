import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { DIALOGS, POPUPS, VIEWS, SELECTED_WALLET } from 'consts';

interface InitLayout {
	dialog: DIALOGS;
	popup: POPUPS;
	selectedView: VIEWS,
}

const initialState: InitLayout = {
	dialog: DIALOGS.NONE,
	popup: POPUPS.NONE,
	selectedView: VIEWS.OVERVIEW,
};

export const layoutSlice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		setDialog: (state, action: PayloadAction<DIALOGS>) => {
			state.dialog = action.payload;
		},
		setDialogClose: state => {
			state.dialog = DIALOGS.NONE;
		},

		setPopup: (state, action: PayloadAction<POPUPS>) => {
			state.popup = action.payload;
		},
		setPopupClose: state => {
			state.popup = POPUPS.NONE;
		},

		setView: (state, action: PayloadAction<VIEWS>) => {
			state.selectedView = action.payload;
		},
	},
});

export const { setDialog, setDialogClose, setPopup, setView, setPopupClose } = layoutSlice.actions;

export default layoutSlice.reducer;

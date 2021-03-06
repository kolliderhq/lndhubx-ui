import React, { ReactNode } from 'react';

import { WrapBaseDialog } from 'components/dialogs/base';
import { SettingsDialog } from 'components/dialogs/Settings';
import { DIALOGS } from 'consts';
import { setDialogClose } from 'contexts/modules/layout';
import { useAppDispatch, useAppSelector } from 'hooks';

// Add dialogs that don't really situate in a particular component here
export const Dialogs = () => {
	const dispatch = useAppDispatch();
	const currentDialog = useAppSelector(state => state.layout.dialog);
	const close = React.useCallback(() => dispatch(setDialogClose()), []);
	return (
		<>
			<WrapBaseDialog isOpen={currentDialog === DIALOGS.SETTINGS} close={close}>
				<SettingsDialog />
			</WrapBaseDialog>
		</>
	);
};

// Used to add dialogs directly to a component. Usually confirmation related that need to pass props
export const DialogWrapper = ({ children, dialogType }: { children: ReactNode; dialogType: DIALOGS }) => {
	const dispatch = useAppDispatch();
	const currentDialog = useAppSelector(state => state.layout.dialog);
	const close = React.useCallback(() => dispatch(setDialogClose()), []);
	return (
		<WrapBaseDialog isOpen={currentDialog === dialogType} close={close}>
			{children}
		</WrapBaseDialog>
	);
};

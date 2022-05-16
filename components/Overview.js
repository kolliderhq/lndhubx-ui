import { MainButtons } from './MainButtons';
import { TxTable } from './TxTable';
import { WalletCard } from './WalletCard ';

export const Overview = () => {
	return (
		<div className="h-full relative w-full">
			<div className="w-full">
				<WalletCard />
			</div>
			<div className="absolute bottom-3 mb-1 h-16 w-full">
				<MainButtons />
			</div>
		</div>
	);
};

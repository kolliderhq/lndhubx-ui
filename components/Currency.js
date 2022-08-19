import CurrencyFormat from "react-currency-format"


export const FormatCurrency = ({value, symbol, style, disableSymbol=false, isSats=true}) => {

	value = Number(value).toFixed(10)

	if (isSats && symbol === "BTC") {
		value = value * 100000000
		symbol = "SATS"
	}

	const decimals = {
		SATS: 0,
		BTC: 8,
		USD: 4,
		EUR: 4,
		GBP: 4,
	};

	const symb = {
		SATS: ' Sats',
		BTC: ' BTC',
		USD: '$',
		EUR: '€',
		GBP: '£'
	};
	let isFixedDecimal = isSats ? false: true;

	let isCrypto = symbol === 'BTC' || symbol === 'SATS';

	let prefix = !isCrypto && !disableSymbol ? symb[symbol]: '';
	let suffix = isCrypto && !disableSymbol ? symb[symbol]: '';

	let dec = decimals[symbol]
	
	return (
		<CurrencyFormat displayType={'text'} fixedDecimalScale={isFixedDecimal} value={value} className={style} thousandSpacing={true} suffix={suffix} prefix={prefix} decimalScale={dec}/>
	)
}

export const FormatCurrencyInput = ({value, onValueChange, symbol, style, isSats=true}) => {

	if (isSats && symbol === "BTC") {
		symbol = "SATS"
	}
	const decimals = {
		SATS: 0,
		BTC: 8,
		USD: 4,
		EUR: 4,
		GBP: 4,
	};

	let dec = decimals[symbol]

	return (
		<CurrencyFormat displayType={'number'} fixedDecimalScale={false} value={value} onValueChange={onValueChange} className={style} thousandSeparator={true} thousandSpacing={true} decimalScale={dec}/>
	)
}
import currencies from "currency-formatter";

const money = (data = 0) => {
   return currencies.format(data, {
      code: "IDR",
      symbol: "IDR",
      // @ts-ignore
      decimalDigits: 2,
      decimalSeparator: ",",
      thousandsSeparator: ".",
      spaceBetweenAmountAndSymbol: true,
      symbolOnLeft: true,
      format: "%s %v",
   });
};

export default money;

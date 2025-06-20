"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const designSystem = require("@strapi/design-system");
const chart_js = require("chart.js");
const dayjs = require("dayjs");
const react = require("react");
const reactChartjs2 = require("react-chartjs-2");
const reactIntl = require("react-intl");
const currencies = require("currency-formatter");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const dayjs__default = /* @__PURE__ */ _interopDefault(dayjs);
const currencies__default = /* @__PURE__ */ _interopDefault(currencies);
function OrderItem({ orderId, createdAt, status }) {
  const getStatus = (data = 0) => {
    const data_status = {
      0: "Pending",
      1: "Paid",
      2: "Shipped",
      3: "Canceled",
      4: "Expired",
      5: "Canceled Admin",
      999: "Need Verification"
    };
    return data_status[data];
  };
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { margin: 2, style: { width: "100%" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Card, { style: { width: "100%" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardBody, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.CardContent, { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", children: orderId }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "secondary", children: getStatus(status) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", children: dayjs__default.default(createdAt).format("DD MMM YYYY") })
  ] }) }) }) });
}
const money = (data = 0) => {
  return currencies__default.default.format(data, {
    code: "IDR",
    symbol: "IDR",
    // @ts-ignore
    decimalDigits: 2,
    decimalSeparator: ",",
    thousandsSeparator: ".",
    spaceBetweenAmountAndSymbol: true,
    symbolOnLeft: true,
    format: "%s %v"
  });
};
chart_js.Chart.register(
  chart_js.LinearScale,
  chart_js.CategoryScale,
  chart_js.BarElement,
  chart_js.PointElement,
  chart_js.LineElement,
  chart_js.Legend,
  chart_js.Tooltip,
  chart_js.LineController,
  chart_js.BarController
);
const HomePage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const [startDate, setStartDate] = react.useState(dayjs__default.default().subtract(7, "day"));
  const [endDate, setEndDate] = react.useState(dayjs__default.default());
  const [chart, setChart] = react.useState(null);
  const [sales, setSales] = react.useState(0);
  const [countOrder, setCountOrder] = react.useState(0);
  const [countPaidOrder, setCountPaidOrder] = react.useState(0);
  const [countPendingOrder, setCountPendingOrder] = react.useState(0);
  const [countExpiredOrder, setCountExpiredOrder] = react.useState(0);
  const [loading, setLoading] = react.useState(false);
  const [loadingOrders, setLoadingOrders] = react.useState(false);
  const [lastOrders, setLastOrders] = react.useState([]);
  const fetchApi = async (start, end) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/strapi-5-plugin-dashboard/chart?start=${start}&end=${end}`);
      const responseJson = await response.json();
      if (responseJson) {
        setChart(responseJson.chart);
        setCountOrder(responseJson.orders);
        setCountPaidOrder(responseJson.orders_paid);
        setCountPendingOrder(responseJson.orders_pending);
        setCountExpiredOrder(responseJson.orders_expired);
        setSales(responseJson.sales);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message, " | err fetch api chart");
      setLoading(false);
    }
  };
  const fetchOrder = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch("/api/strapi-5-plugin-dashboard/orders");
      const result = await response.json();
      if (result) {
        setLastOrders(result);
        setLoadingOrders(false);
      }
    } catch (error) {
      console.log(error.message, " | error get last order");
      setLoadingOrders(false);
    }
  };
  const handleStart = (value) => {
    setStartDate(dayjs__default.default(value));
  };
  const handleEnd = (value) => {
    setEndDate(dayjs__default.default(value));
  };
  const handleApply = react.useCallback(() => {
    fetchApi(startDate.toISOString(), endDate.toISOString());
  }, [startDate, endDate]);
  const handleExport = react.useCallback(async () => {
    try {
      const response = await fetch("/api/strapi-5-plugin-dashboard/export-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          start: startDate.toISOString(),
          end: endDate.toISOString()
        })
      });
      const result = await response.blob();
      if (result) {
        const url = window.URL.createObjectURL(result);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders.xlsx";
        a.click();
      }
    } catch (error) {
      console.log(error);
    }
  }, [startDate, endDate]);
  react.useEffect(() => {
    fetchApi(startDate.toISOString(), endDate.toISOString());
    fetchOrder();
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Main, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { direction: "column", marginTop: 7, marginLeft: 5, marginRight: 5, marginBottom: 7, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "alpha", children: "Dashboard" }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { marginTop: 3, marginBottom: true, gap: 3, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Card, { style: { width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardTitle, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: "Sales" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: money(sales) }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Card, { style: { width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardTitle, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: "Orders" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: countOrder }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3 }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 3, marginTop: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            designSystem.Field.Root,
            {
              id: "start_date",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: "Date Start" }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.DatePicker, { value: startDate, onChange: handleStart, id: "start_date" }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {}),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            designSystem.Field.Root,
            {
              id: "end_date",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: "Date End" }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.DatePicker, { value: endDate, onChange: handleEnd, id: "end_date" }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {}),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 3, marginTop: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { onClick: handleExport, variant: "secondary", fullWidth: true, children: "Export Orders" }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { onClick: handleApply, fullWidth: true, children: "Apply" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { marginTop: 5, marginBottom: true, gap: 3, children: [
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Item, { alignItems: loading ? "center" : "start", justifyContent: loading ? "center" : "flexStart", direction: "column", gap: 5, col: 9, background: "neutral100", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 3, style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Card, { style: { width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardTitle, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: "Order Pending" }) }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: countPendingOrder }) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Card, { style: { width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardTitle, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: "Order Paid" }) }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: countPaidOrder }) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Card, { style: { width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardTitle, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: "Order Expired" }) }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: countExpiredOrder }) }) })
          ] }) })
        ] }),
        loading && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { loading }),
        !loading && chart && /* @__PURE__ */ jsxRuntime.jsx(reactChartjs2.Chart, { type: "bar", data: chart }),
        !loading && !chart && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: "Error !" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, alignItems: "start", children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Card, { style: { display: "flex", flexDirection: "column", width: "100%", height: "100%" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardTitle, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: "Last Orders" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.CardContent, { style: { flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: loadingOrders ? "center" : "flex-start", gap: 5, overflowY: "scroll" }, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", style: { width: "100%", paddingLeft: 8, paddingRight: 8 }, children: [
          loadingOrders && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { loading: loadingOrders }),
          lastOrders && lastOrders.length > 0 && lastOrders.map((item, i) => /* @__PURE__ */ jsxRuntime.jsx(OrderItem, { orderId: item.order_id, status: item.status, createdAt: item.createdAt }, i)),
          (!lastOrders || lastOrders.length === 0) && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", children: "Empty" })
        ] }) })
      ] }) })
    ] })
  ] }) });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(HomePage, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: /* @__PURE__ */ jsxRuntime.jsx(admin.Page.Error, {}) })
  ] });
};
exports.App = App;

import { jsx, jsxs } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { Flex, Card, CardBody, CardContent, Typography, Button, Main, Box, Grid, CardHeader, CardTitle, Field, DatePicker, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Chart as Chart$1, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController } from "chart.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState, useCallback, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import { useIntl } from "react-intl";
import currencies from "currency-formatter";
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
  return /* @__PURE__ */ jsx(Flex, { margin: 2, style: { width: "100%" }, children: /* @__PURE__ */ jsx(Card, { style: { width: "100%" }, children: /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsxs(CardContent, { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", children: [
      /* @__PURE__ */ jsx(Typography, { variant: "omega", children: orderId }),
      /* @__PURE__ */ jsx(Button, { variant: "secondary", children: getStatus(status) })
    ] }),
    /* @__PURE__ */ jsx(Typography, { variant: "pi", children: dayjs(createdAt).format("DD MMM YYYY") })
  ] }) }) }) });
}
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
    format: "%s %v"
  });
};
dayjs.extend(utc);
Chart$1.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);
const HomePage = () => {
  const { formatMessage } = useIntl();
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day").startOf("day").toDate());
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toDate());
  const [status, setStatus] = useState("all");
  const [chart, setChart] = useState(null);
  const [sales, setSales] = useState(0);
  const [countOrder, setCountOrder] = useState(0);
  const [countPaidOrder, setCountPaidOrder] = useState(0);
  const [countPendingOrder, setCountPendingOrder] = useState(0);
  const [countShippedOrder, setCountShippedOrder] = useState(0);
  const [countExpiredOrder, setCountExpiredOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [lastOrders, setLastOrders] = useState([]);
  const fetchApi = async (start, end) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/strapi-5-plugin-dashboard/chart?start=${start}&end=${end}`);
      const responseJson = await response.json();
      console.log({ responseJson });
      if (responseJson) {
        setChart(responseJson.chart);
        setCountOrder(responseJson.orders);
        setCountPaidOrder(responseJson.orders_paid);
        setCountPendingOrder(responseJson.orders_pending);
        setCountShippedOrder(responseJson.orders_shipped);
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
  const normalizeDate = (date) => {
    if (!date) return null;
    return dayjs(date).hour(12).minute(0).second(0).millisecond(0).toDate();
  };
  const handleStart = (value) => {
    setStartDate(normalizeDate(value));
  };
  const handleEnd = (value) => {
    setEndDate(normalizeDate(value));
  };
  const handleStatus = (value) => {
    setStatus(value);
  };
  const toStartOfDayISO = (date) => dayjs(date).startOf("day").toISOString();
  const toEndOfDayISO = (date) => dayjs(date).endOf("day").toISOString();
  const handleApply = useCallback(() => {
    fetchApi(toStartOfDayISO(startDate), toEndOfDayISO(endDate));
  }, [startDate, endDate]);
  const handleExport = useCallback(async () => {
    try {
      const response = await fetch("/api/strapi-5-plugin-dashboard/export-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          status
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
  useEffect(() => {
    fetchApi(startDate.toISOString(), endDate.toISOString());
    fetchOrder();
  }, []);
  return /* @__PURE__ */ jsx(Main, { children: /* @__PURE__ */ jsxs(Box, { direction: "column", marginTop: 7, marginLeft: 5, marginRight: 5, marginBottom: 7, children: [
    /* @__PURE__ */ jsx(Typography, { variant: "alpha", children: "Dashboard" }),
    /* @__PURE__ */ jsxs(Grid.Root, { marginTop: 3, marginBottom: true, gap: 3, children: [
      /* @__PURE__ */ jsx(Grid.Item, { col: 3, children: /* @__PURE__ */ jsxs(Card, { style: { width: "100%" }, children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { padding: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Sales" }) }) }),
        /* @__PURE__ */ jsx(CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: money(sales) }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(Grid.Item, { col: 3, children: /* @__PURE__ */ jsxs(Card, { style: { width: "100%" }, children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { padding: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Orders" }) }) }),
        /* @__PURE__ */ jsx(CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: countOrder }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(Grid.Item, { col: 3 }),
      /* @__PURE__ */ jsx(Grid.Item, { col: 3, children: /* @__PURE__ */ jsxs(Box, { children: [
        /* @__PURE__ */ jsxs(Flex, { gap: 3, marginTop: 2, children: [
          /* @__PURE__ */ jsxs(
            Field.Root,
            {
              id: "start_date",
              children: [
                /* @__PURE__ */ jsx(Field.Label, { children: "Date Start" }),
                /* @__PURE__ */ jsx(DatePicker, { value: startDate, onChange: handleStart, id: "start_date" }),
                /* @__PURE__ */ jsx(Field.Error, {}),
                /* @__PURE__ */ jsx(Field.Hint, {})
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Field.Root,
            {
              id: "end_date",
              children: [
                /* @__PURE__ */ jsx(Field.Label, { children: "Date End" }),
                /* @__PURE__ */ jsx(DatePicker, { value: endDate, onChange: handleEnd, id: "end_date" }),
                /* @__PURE__ */ jsx(Field.Error, {}),
                /* @__PURE__ */ jsx(Field.Hint, {})
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Field.Root,
            {
              id: "filter",
              children: [
                /* @__PURE__ */ jsx(Field.Label, { children: "Filter Status Export" }),
                /* @__PURE__ */ jsxs(SingleSelect, { withTags: true, value: status, onChange: handleStatus, children: [
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "all", children: "All Status" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "0", children: "Pending" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "1", children: "Paid" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "2", children: "shipped" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "3", children: "Canceled" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "4", children: "Expired" }),
                  /* @__PURE__ */ jsx(SingleSelectOption, { value: "5", children: "Canceled admin" })
                ] }),
                /* @__PURE__ */ jsx(Field.Error, {}),
                /* @__PURE__ */ jsx(Field.Hint, {})
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Flex, { gap: 3, marginTop: 2, children: [
          /* @__PURE__ */ jsx(Button, { onClick: handleExport, variant: "secondary", fullWidth: true, children: "Export Orders" }),
          /* @__PURE__ */ jsx(Button, { onClick: handleApply, fullWidth: true, children: "Apply" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Grid.Root, { marginTop: 5, marginBottom: true, gap: 3, children: [
      /* @__PURE__ */ jsxs(Grid.Item, { alignItems: loading ? "center" : "start", justifyContent: loading ? "center" : "flexStart", direction: "column", gap: 5, col: 9, background: "neutral100", children: [
        /* @__PURE__ */ jsxs(Grid.Root, { gap: 3, style: { width: "100%" }, children: [
          /* @__PURE__ */ jsx(Grid.Item, { col: 3, children: /* @__PURE__ */ jsxs(Card, { style: { width: "100%" }, children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { padding: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Order Pending" }) }) }),
            /* @__PURE__ */ jsx(CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: countPendingOrder }) }) })
          ] }) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 3, children: /* @__PURE__ */ jsxs(Card, { style: { width: "100%" }, children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { padding: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Order Paid" }) }) }),
            /* @__PURE__ */ jsx(CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: countPaidOrder }) }) })
          ] }) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 3, children: /* @__PURE__ */ jsxs(Card, { style: { width: "100%" }, children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { padding: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Order Shipped" }) }) }),
            /* @__PURE__ */ jsx(CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: countShippedOrder }) }) })
          ] }) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 3, children: /* @__PURE__ */ jsxs(Card, { style: { width: "100%" }, children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { padding: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Order Expired" }) }) }),
            /* @__PURE__ */ jsx(CardBody, { style: { alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: countExpiredOrder }) }) })
          ] }) })
        ] }),
        loading && /* @__PURE__ */ jsx(Button, { loading }),
        !loading && chart && /* @__PURE__ */ jsx(Chart, { type: "bar", data: chart }),
        !loading && !chart && /* @__PURE__ */ jsx(Typography, { children: "Error !" })
      ] }),
      /* @__PURE__ */ jsx(Grid.Item, { col: 3, alignItems: "start", children: /* @__PURE__ */ jsxs(Card, { style: { display: "flex", flexDirection: "column", width: "100%", height: "100%" }, children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { padding: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Last Orders" }) }) }),
        /* @__PURE__ */ jsx(CardContent, { style: { flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: loadingOrders ? "center" : "flex-start", gap: 5, overflowY: "scroll" }, children: /* @__PURE__ */ jsxs(Flex, { direction: "column", style: { width: "100%", paddingLeft: 8, paddingRight: 8 }, children: [
          loadingOrders && /* @__PURE__ */ jsx(Button, { loading: loadingOrders }),
          lastOrders && lastOrders.length > 0 && lastOrders.map((item, i) => /* @__PURE__ */ jsx(OrderItem, { orderId: item.order_id, status: item.order_status, createdAt: item.createdAt }, i)),
          (!lastOrders || lastOrders.length === 0) && /* @__PURE__ */ jsx(Typography, { variant: "delta", children: "Empty" })
        ] }) })
      ] }) })
    ] })
  ] }) });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
  ] });
};
export {
  App
};
//# sourceMappingURL=App-CfAVDKPg.mjs.map

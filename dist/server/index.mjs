import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
const bootstrap = ({ strapi }) => {
};
const destroy = ({ strapi }) => {
};
const register = ({ strapi }) => {
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const XLSX = require("xlsx");
require("fs");
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("strapi-5-plugin-dashboard").service("service").getWelcomeMessage();
  },
  async getChartController(ctx) {
    const { start, end } = ctx.request.query;
    try {
      ctx.body = await strapi.plugin("strapi-5-plugin-dashboard").service("service").getChart({ start, end });
    } catch (error) {
      ctx.send({ message: error.message }, 500);
    }
  },
  async ExportController(ctx) {
    const { start, end } = ctx.request.body;
    try {
      const entry_order = await strapi.plugin("strapi-5-plugin-dashboard").service("service").exportOrders({ start, end });
      console.log(entry_order);
      const worksheet = XLSX.utils.json_to_sheet(entry_order);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Order");
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      ctx.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      ctx.set("Content-Disposition", 'attachment; filename="orders.xlsx"');
      ctx.body = buffer;
    } catch (error) {
      ctx.send({ message: error.message }, 500);
    }
  },
  async getOrdersController(ctx) {
    try {
      ctx.body = await strapi.documents("api::order.order").findMany({
        sort: "createdAt:desc",
        limit: 10,
        start: 0,
        fields: ["order_id", "status", "createdAt"]
      });
    } catch (error) {
      ctx.send({ message: error.message }, 500);
    }
  }
});
const controllers = {
  controller
};
const middlewares = {};
const policies = {};
const contentAPIRoutes = [
  {
    method: "GET",
    path: "/",
    // name of the controller file & the method.
    handler: "controller.index",
    config: {
      policies: []
    }
  },
  {
    method: "GET",
    path: "/chart",
    handler: "controller.getChartController",
    config: {
      auth: false,
      policies: []
    }
  },
  {
    method: "GET",
    path: "/orders",
    handler: "controller.getOrdersController",
    config: {
      auth: false,
      policies: []
    }
  },
  {
    method: "POST",
    path: "/export-orders",
    handler: "controller.ExportController",
    config: {
      auth: false,
      policies: []
    }
  }
];
const routes = {
  "content-api": {
    type: "content-api",
    routes: contentAPIRoutes
  }
};
dayjs.extend(customParseFormat);
const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  },
  async getChart({ start, end }) {
    const dates = [];
    const dates_day = [];
    const startDate = dayjs(start).startOf("day");
    const endDate = dayjs(end).endOf("day");
    let sales = 0;
    let countOrders = 0;
    let countOrdersPaid = 0;
    let countOrdersPending = 0;
    let countOrdersExpired = 0;
    let currentDate = startDate;
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
      dates.push(currentDate.format("D MMM YYYY"));
      dates_day.push([currentDate.startOf("day").toISOString(), currentDate.endOf("day").toISOString()]);
      currentDate = currentDate.add(1, "day");
    }
    let count_sales_day = [];
    let count_orders_day = [];
    let count_orders_paid_day = [];
    let count_orders_pending_day = [];
    let count_orders_expired_day = [];
    let result = {
      labels: dates,
      datasets: [
        {
          type: "line",
          label: "Sales",
          borderColor: "rgb(0, 128, 255)",
          backgroundColor: "rgb(0, 128, 255)",
          borderWidth: 2,
          fill: false,
          yAxisID: "y",
          data: count_sales_day
        },
        {
          type: "bar",
          label: "Orders",
          backgroundColor: "rgb(255, 165, 0)",
          yAxisID: "y1",
          data: count_orders_day
        },
        {
          type: "bar",
          label: "Order Pending",
          yAxisID: "y1",
          backgroundColor: "rgb(255, 193, 7)",
          data: count_orders_pending_day
        },
        {
          type: "bar",
          label: "Order Paid",
          yAxisID: "y1",
          backgroundColor: "rgb(0, 200, 100)",
          data: count_orders_paid_day
        },
        {
          type: "bar",
          label: "Order Expired",
          backgroundColor: "rgb(220, 53, 69)",
          yAxisID: "y1",
          data: count_orders_expired_day
        }
      ]
    };
    for (const date_time of dates_day) {
      try {
        const order_count = await strapi.documents("api::order.order").count({
          filters: {
            createdAt: { $between: date_time }
          }
        });
        const order_pending_count = await strapi.documents("api::order.order").count({
          filters: {
            $and: [
              {
                createdAt: { $between: date_time }
              },
              {
                status: { $eq: 0 }
              }
            ]
          }
        });
        const order_paid_count = await strapi.documents("api::order.order").count({
          filters: {
            $and: [
              {
                createdAt: { $between: date_time }
              },
              {
                status: { $eq: 1 }
              }
            ]
          }
        });
        const order_expired_count = await strapi.documents("api::order.order").count({
          filters: {
            $and: [
              {
                createdAt: { $between: date_time }
              },
              {
                status: { $eq: 4 }
              }
            ]
          }
        });
        const order_sales = await strapi.documents("api::order.order").findMany({
          filters: {
            $and: [
              {
                createdAt: { $between: date_time }
              },
              {
                status: { $eq: 1 }
              }
            ]
          }
        });
        count_orders_day.push(order_count);
        count_orders_pending_day.push(order_pending_count);
        count_orders_paid_day.push(order_paid_count);
        count_orders_expired_day.push(order_expired_count);
        const grandTotal = Array.isArray(order_sales) && order_sales.length > 0 ? order_sales.reduce((sum, item) => sum + item.grand_total, 0) : 0;
        console.log(grandTotal);
        count_sales_day.push(grandTotal);
      } catch (error) {
        console.log(error.message, " | err order day");
      }
    }
    try {
      const order_count = await strapi.documents("api::order.order").count({
        filters: {
          createdAt: { $between: [startDate, endDate] }
        }
      });
      const order_paid_count = await strapi.documents("api::order.order").count({
        filters: {
          $and: [
            {
              createdAt: { $between: [startDate, endDate] }
            },
            {
              status: { $eq: 1 }
            }
          ]
        }
      });
      const order_pending_count = await strapi.documents("api::order.order").count({
        filters: {
          $and: [
            {
              createdAt: { $between: [startDate, endDate] }
            },
            {
              status: { $eq: 0 }
            }
          ]
        }
      });
      const order_expired_count = await strapi.documents("api::order.order").count({
        filters: {
          $and: [
            {
              createdAt: { $between: [startDate, endDate] }
            },
            {
              status: { $eq: 4 }
            }
          ]
        }
      });
      const order_sales = await strapi.documents("api::order.order").findMany({
        filters: {
          $and: [
            {
              createdAt: { $between: [startDate, endDate] }
            },
            {
              status: { $eq: 1 }
            }
          ]
        }
      });
      countOrders = order_count;
      countOrdersPending = order_pending_count;
      countOrdersPaid = order_paid_count;
      countOrdersExpired = order_expired_count;
      sales = Array.isArray(order_sales) && order_sales.length > 0 ? order_sales.reduce((sum, item) => sum + item.grand_total, 0) : 0;
    } catch (error) {
      console.log(error.message, " | err order count");
    }
    return {
      sales,
      orders: countOrders,
      orders_paid: countOrdersPaid,
      orders_pending: countOrdersPending,
      orders_expired: countOrdersExpired,
      chart: result
    };
  },
  async exportOrders({ start, end }) {
    const startDate = dayjs(start).startOf("day");
    const endDate = dayjs(end).endOf("day");
    const orders = [];
    try {
      const entry_order = await strapi.documents("api::order.order").findMany({
        filters: {
          createdAt: { $between: [startDate, endDate] }
        },
        populate: {
          order_item: true
        }
      });
      if (!entry_order || entry_order.length === 0) return [];
      for (const order of entry_order) {
        if (order.order_item.length > 0) {
          for (const orderItem of order.order_item) {
            orders.push({
              order_id: order.order_id,
              uuid: order.uuid,
              status: getStatus(order.status),
              name: order.name,
              email: order.email,
              address: order.address,
              mobile: order.mobile,
              country: order.country,
              province: order.province,
              city: order.city,
              district: order.district,
              subdistrict: order.subdistrict,
              postal_code: order.postal_code,
              user_id: order.user_id,
              payment_gateway: order.payment_gateway,
              airwaybill_no: order.airwaybill_no,
              bank: order.bank,
              shipping_id: order.shipping_id,
              shipping_service: order.shipping_service,
              shipping_total_weight: order.shipping_total_weight + " kg",
              product_sku: orderItem.sku,
              product_name: orderItem.name,
              product_regular_price: orderItem.regular_price,
              product_sale_price: orderItem.sale_price,
              product_qty: orderItem.qty,
              product_subtotal: orderItem.subtotal,
              shipping_cost: order.shipping_cost,
              insurance_amount: order.insurance_amount,
              promo_code: order.promo_code,
              discount: order.discount,
              total: order.total,
              grand_total: order.grand_total
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message, " | error get order export");
    }
    return orders;
  }
});
const getStatus = (data = 0) => {
  const data_status = {
    0: "pending",
    1: "paid",
    2: "shipped",
    3: "canceled",
    4: "expired",
    5: "canceled-admin",
    999: "Need Verification"
  };
  return data_status[data];
};
const services = {
  service
};
const index = {
  bootstrap,
  destroy,
  register,
  config,
  controllers,
  contentTypes,
  middlewares,
  policies,
  routes,
  services
};
export {
  index as default
};

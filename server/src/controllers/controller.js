const XLSX = require('xlsx');
const fs = require('fs');

const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-5-dashboard')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  async getChartController(ctx) {
    const { start, end } = ctx.request.query
    try {
      ctx.body = await strapi
        .plugin('strapi-5-dashboard')
        .service('service')
        .getChart({ start, end });
    } catch (error) {
      ctx.send({ message: error.message }, 500)
    }
  },
  async ExportController(ctx) {
    const { start, end } = ctx.request.body
    try {
      const entry_order = await strapi
        .plugin('strapi-5-dashboard')
        .service('service')
        .exportOrders({ start, end });
      console.log(entry_order)
      const worksheet = XLSX.utils.json_to_sheet(entry_order);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Order');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      ctx.set('Content-Disposition', 'attachment; filename="orders.xlsx"');
      ctx.body = buffer;
    } catch (error) {
      ctx.send({ message: error.message }, 500)
    }
  },
  async getOrdersController(ctx) {
    try {
      ctx.body = await strapi.documents('api::order.order').findMany({
        sort: "createdAt:desc",
        limit: 10,
        start: 0,
        fields: ["order_id", "status", "createdAt"]
      })
    } catch (error) {
      ctx.send({ message: error.message }, 500)
    }
  },
});

export default controller;

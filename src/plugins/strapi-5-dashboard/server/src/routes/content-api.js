export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/chart',
    handler: 'controller.getChartController',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/orders',
    handler: 'controller.getOrdersController',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/export-orders',
    handler: 'controller.ExportController',
    config: {
      auth: false,
      policies: [],
    },
  },
];

const XLSX = require('xlsx');
const controller = require('../controller').default;

// Mock XLSX
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn().mockReturnValue({}),
    book_new: jest.fn().mockReturnValue({}),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn().mockReturnValue(Buffer.from('test')),
}));

describe('Dashboard Controller', () => {
  let strapi;
  let ctx;
  let dashboardController;

  beforeEach(() => {
    // Mock Strapi instance
    strapi = {
      plugin: jest.fn().mockReturnThis(),
      service: jest.fn().mockReturnThis(),
      getWelcomeMessage: jest.fn().mockReturnValue('Welcome to Dashboard'),
      getChart: jest.fn().mockResolvedValue({ data: 'chart data' }),
      exportOrders: jest.fn().mockResolvedValue([
        { id: 1, order_id: 'ORD001', status: 'pending' },
        { id: 2, order_id: 'ORD002', status: 'completed' },
      ]),
      documents: jest.fn().mockReturnThis(),
      findMany: jest.fn().mockResolvedValue([
        { order_id: 'ORD001', status: 'pending', createdAt: '2024-01-01' },
        { order_id: 'ORD002', status: 'completed', createdAt: '2024-01-02' },
      ]),
    };

    // Mock context
    ctx = {
      body: null,
      request: {
        query: {},
        body: {},
      },
      send: jest.fn(),
      set: jest.fn(),
    };

    // Initialize controller with mocked strapi
    dashboardController = controller({ strapi });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return welcome message', () => {
      dashboardController.index(ctx);

      expect(strapi.plugin).toHaveBeenCalledWith('strapi-5-plugin-dashboard');
      expect(strapi.service).toHaveBeenCalledWith('service');
      expect(strapi.getWelcomeMessage).toHaveBeenCalled();
      expect(ctx.body).toBe('Welcome to Dashboard');
    });
  });

  describe('getChartController', () => {
    it('should return chart data successfully', async () => {
      ctx.request.query = { start: '2024-01-01', end: '2024-01-31' };

      await dashboardController.getChartController(ctx);

      expect(strapi.getChart).toHaveBeenCalledWith({ 
        start: '2024-01-01', 
        end: '2024-01-31' 
      });
      expect(ctx.body).toEqual({ data: 'chart data' });
    });

    it('should handle errors and return 500 status', async () => {
      ctx.request.query = { start: '2024-01-01', end: '2024-01-31' };
      const errorMessage = 'Chart service error';
      strapi.getChart.mockRejectedValue(new Error(errorMessage));

      await dashboardController.getChartController(ctx);

      expect(ctx.send).toHaveBeenCalledWith(
        { message: errorMessage },
        500
      );
    });
  });

  describe('ExportController', () => {
    it('should export orders to Excel successfully', async () => {
      ctx.request.body = { start: '2024-01-01', end: '2024-01-31' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await dashboardController.ExportController(ctx);

      expect(strapi.exportOrders).toHaveBeenCalledWith({ 
        start: '2024-01-01', 
        end: '2024-01-31' 
      });
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.write).toHaveBeenCalled();
      expect(ctx.set).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(ctx.set).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="orders.xlsx"'
      );
      expect(ctx.body).toBeInstanceOf(Buffer);

      consoleSpy.mockRestore();
    });

    it('should handle export errors', async () => {
      ctx.request.body = { start: '2024-01-01', end: '2024-01-31' };
      const errorMessage = 'Export service error';
      strapi.exportOrders.mockRejectedValue(new Error(errorMessage));

      await dashboardController.ExportController(ctx);

      expect(ctx.send).toHaveBeenCalledWith(
        { message: errorMessage },
        500
      );
    });
  });

  describe('getOrdersController', () => {
    it('should fetch recent orders successfully', async () => {
      await dashboardController.getOrdersController(ctx);

      expect(strapi.documents).toHaveBeenCalledWith('api::order.order');
      expect(strapi.findMany).toHaveBeenCalledWith({
        sort: 'createdAt:desc',
        limit: 10,
        start: 0,
        fields: ['order_id', 'status', 'createdAt'],
      });
      expect(ctx.body).toEqual([
        { order_id: 'ORD001', status: 'pending', createdAt: '2024-01-01' },
        { order_id: 'ORD002', status: 'completed', createdAt: '2024-01-02' },
      ]);
    });

    it('should handle order fetching errors', async () => {
      const errorMessage = 'Database error';
      strapi.findMany.mockRejectedValue(new Error(errorMessage));

      await dashboardController.getOrdersController(ctx);

      expect(ctx.send).toHaveBeenCalledWith(
        { message: errorMessage },
        500
      );
    });
  });
});
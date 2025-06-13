// Server test setup
// Set test environment
process.env.NODE_ENV = 'test';

// Mock Strapi global if needed
global.strapi = {
  plugin: jest.fn((name) => ({
    service: jest.fn(() => ({})),
    controller: jest.fn(() => ({})),
  })),
  log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
};

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
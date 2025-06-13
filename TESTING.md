# Testing Guide for Strapi 5 Plugin Dashboard

This document provides guidelines for testing the Strapi 5 Dashboard Plugin.

## Table of Contents
- [Overview](#overview)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Structure](#test-structure)
- [CI/CD Integration](#cicd-integration)

## Overview

This project uses Jest as the testing framework with:
- **React Testing Library** for testing React components
- **Node.js testing** for server-side code
- **GitHub Actions** for continuous integration

## Running Tests

### Install Dependencies
First, install all dependencies including test dependencies:
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Tests in CI Mode
```bash
npm run test:ci
```

## Writing Tests

### Frontend Tests (React Components)

Place component tests in `admin/src/components/__tests__/` directory.

Example test structure:
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Backend Tests (Server Code)

Place server tests in the corresponding `__tests__` directories:
- Controllers: `server/src/controllers/__tests__/`
- Services: `server/src/services/__tests__/`

Example test structure:
```javascript
const controller = require('../controller').default;

describe('Controller Name', () => {
  let strapi;
  let ctx;

  beforeEach(() => {
    // Setup mocks
    strapi = { /* mock strapi */ };
    ctx = { /* mock context */ };
  });

  it('should handle request correctly', async () => {
    // Test implementation
  });
});
```

## Test Structure

```
├── admin/
│   └── src/
│       ├── components/
│       │   └── __tests__/      # Frontend component tests
│       └── tests/
│           ├── setup.js        # Jest setup for React
│           └── __mocks__/      # Mock files for assets
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── __tests__/      # Controller tests
│   │   └── services/
│   │       └── __tests__/      # Service tests
│   └── tests/
│       └── setup.js            # Jest setup for Node.js
├── jest.config.js              # Jest configuration
└── .babelrc                    # Babel configuration for Jest
```

## Best Practices

### 1. Test Naming
- Use descriptive test names that explain what is being tested
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Mock External Dependencies
- Mock Strapi services and plugins
- Mock external libraries (e.g., XLSX)
- Mock API calls and database operations

### 3. Test Coverage
- Aim for at least 70% code coverage
- Focus on critical business logic
- Test both success and error scenarios

### 4. Component Testing Tips
- Test user interactions
- Test conditional rendering
- Verify props are handled correctly
- Use data-testid for complex selections

### 5. Server Testing Tips
- Test all controller methods
- Mock Strapi context (ctx)
- Test error handling
- Verify response structure

## CI/CD Integration

The project includes GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. **Runs on**: Push to main/develop branches and pull requests
2. **Test Matrix**: Tests against Node.js 18.x and 20.x
3. **Steps**:
   - Linting verification
   - Unit tests execution
   - Coverage report generation
   - Build verification
   - Code quality checks
   - Security audit

### Build Verification

The CI pipeline verifies that:
- The `dist` directory is created
- Admin bundle exists at `dist/admin/index.js`
- Server bundle exists at `dist/server/index.js`

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure all dependencies are installed: `npm install`
   - Check that babel presets are properly configured

2. **React component test failures**
   - Verify mocks are properly set up in `admin/src/tests/setup.js`
   - Check that all Strapi dependencies are mocked

3. **Coverage threshold failures**
   - Run `npm run test:coverage` locally to identify uncovered code
   - Add tests for uncovered branches and functions

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Strapi Plugin Development](https://docs.strapi.io/dev-docs/plugins/development)
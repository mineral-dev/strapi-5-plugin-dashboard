import React from 'react';
import { render } from '@testing-library/react';
import { PluginIcon } from '../PluginIcon';

// Mock the Strapi icons
jest.mock('@strapi/icons', () => ({
  Coffee: () => <div data-testid="coffee-icon">Coffee Icon</div>,
}));

describe('PluginIcon', () => {
  it('should render without crashing', () => {
    const { container } = render(<PluginIcon />);
    expect(container).toBeTruthy();
  });

  it('should render the Coffee icon', () => {
    const { getByTestId } = render(<PluginIcon />);
    const coffeeIcon = getByTestId('coffee-icon');
    expect(coffeeIcon).toBeInTheDocument();
    expect(coffeeIcon).toHaveTextContent('Coffee Icon');
  });

  it('should match snapshot', () => {
    const { container } = render(<PluginIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
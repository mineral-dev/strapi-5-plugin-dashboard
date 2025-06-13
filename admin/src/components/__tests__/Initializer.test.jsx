import React from 'react';
import { render } from '@testing-library/react';
import { Initializer } from '../Initializer';
import { PLUGIN_ID } from '../../pluginId';

describe('Initializer', () => {
  let mockSetPlugin;

  beforeEach(() => {
    mockSetPlugin = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<Initializer setPlugin={mockSetPlugin} />);
    expect(container).toBeTruthy();
  });

  it('should call setPlugin with PLUGIN_ID on mount', () => {
    render(<Initializer setPlugin={mockSetPlugin} />);
    expect(mockSetPlugin).toHaveBeenCalledTimes(1);
    expect(mockSetPlugin).toHaveBeenCalledWith(PLUGIN_ID);
  });

  it('should not call setPlugin again on re-render', () => {
    const { rerender } = render(<Initializer setPlugin={mockSetPlugin} />);
    expect(mockSetPlugin).toHaveBeenCalledTimes(1);
    
    // Re-render with same props
    rerender(<Initializer setPlugin={mockSetPlugin} />);
    expect(mockSetPlugin).toHaveBeenCalledTimes(1);
  });

  it('should return null (no visual output)', () => {
    const { container } = render(<Initializer setPlugin={mockSetPlugin} />);
    expect(container.firstChild).toBeNull();
  });

  it('should use the same setPlugin reference across renders', () => {
    const newMockSetPlugin = jest.fn();
    const { rerender } = render(<Initializer setPlugin={mockSetPlugin} />);
    
    // Change the setPlugin prop
    rerender(<Initializer setPlugin={newMockSetPlugin} />);
    
    // Should still have only called the original setPlugin
    expect(mockSetPlugin).toHaveBeenCalledTimes(1);
    expect(newMockSetPlugin).not.toHaveBeenCalled();
  });
});
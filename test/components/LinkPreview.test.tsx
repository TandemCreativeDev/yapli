import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkPreview from '@/components/LinkPreview';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  // @ts-expect-error for testing
  default: ({ src, alt, width, height, className, onError }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={onError}
      data-testid="next-image"
    />
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe('LinkPreview', () => {
  const mockUrl = 'https://example.com';
  const mockPreviewData = {
    url: mockUrl,
    title: 'Example Website',
    description: 'This is an example website',
    images: ['https://example.com/image.jpg'],
    siteName: 'Example',
    domain: 'example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Mock fetch to return a promise that never resolves
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<LinkPreview url={mockUrl} />);

    // Check for loading state
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders preview data when fetch succeeds', async () => {
    // Mock successful fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockPreviewData),
    });

    render(<LinkPreview url={mockUrl} />);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByText('Example Website')).toBeInTheDocument();
    });

    expect(screen.getByText('This is an example website')).toBeInTheDocument();
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.getByTestId('next-image')).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(screen.getByRole('link')).toHaveAttribute('href', mockUrl);
  });

  it('renders nothing when fetch fails', async () => {
    // Mock failed fetch
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    const { container } = render(<LinkPreview url={mockUrl} />);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders nothing when response is not ok', async () => {
    // Mock fetch with non-ok response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { container } = render(<LinkPreview url={mockUrl} />);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders with partial data when some fields are missing', async () => {
    // Mock successful fetch with partial data
    const partialData = {
      url: mockUrl,
      domain: 'example.com',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(partialData),
    });

    render(<LinkPreview url={mockUrl} />);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    // Title and description should not be present
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', async () => {
    // Mock successful fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockPreviewData),
    });

    render(<LinkPreview url={mockUrl} className="custom-class" />);

    // Wait for the fetch to complete
    await waitFor(() => {
      const linkElement = screen.getByRole('link');
      expect(linkElement).toHaveClass('custom-class');
    });
  });
});

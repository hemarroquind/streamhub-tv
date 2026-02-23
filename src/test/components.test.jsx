import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChannelCard from '../ChannelCard';
import RowSection from '../RowSection';

const mockChannel = {
  id: 'test-ch',
  name: 'Test Channel',
  country: 'US',
  categories: ['news'],
  languages: ['eng'],
  logo: 'https://example.com/logo.png',
  streamUrl: 'https://example.com/stream.m3u8',
};

const mockMeta = { icon: '📰', label: 'Noticias' };

describe('ChannelCard', () => {
  it('renders channel name', () => {
    render(<ChannelCard ch={mockChannel} meta={mockMeta} focused={false} onClick={() => {}} />);
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
  });

  it('renders country tag', () => {
    render(<ChannelCard ch={mockChannel} meta={mockMeta} focused={false} onClick={() => {}} />);
    expect(screen.getByText('US')).toBeInTheDocument();
  });

  it('shows LIVE badge when stream URL exists', () => {
    render(<ChannelCard ch={mockChannel} meta={mockMeta} focused={false} onClick={() => {}} />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('does not show LIVE badge when no stream URL', () => {
    const noStreamCh = { ...mockChannel, streamUrl: '' };
    render(<ChannelCard ch={noStreamCh} meta={mockMeta} focused={false} onClick={() => {}} />);
    expect(screen.queryByText('LIVE')).not.toBeInTheDocument();
  });

  it('applies focused class', () => {
    const { container } = render(<ChannelCard ch={mockChannel} meta={mockMeta} focused={true} onClick={() => {}} />);
    expect(container.querySelector('.ch-card.focused')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ChannelCard ch={mockChannel} meta={mockMeta} focused={false} onClick={onClick} />);
    fireEvent.click(screen.getByText('Test Channel'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders language tags', () => {
    render(<ChannelCard ch={mockChannel} meta={mockMeta} focused={false} onClick={() => {}} />);
    expect(screen.getByText('eng')).toBeInTheDocument();
  });

  it('renders logo image with lazy loading', () => {
    const { container } = render(<ChannelCard ch={mockChannel} meta={mockMeta} focused={false} onClick={() => {}} />);
    const img = container.querySelector('img.ch-logo');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});

describe('RowSection', () => {
  it('renders title and icon', () => {
    render(<RowSection icon="📰" title="Noticias"><div>content</div></RowSection>);
    expect(screen.getByText('Noticias')).toBeInTheDocument();
    expect(screen.getByText('📰')).toBeInTheDocument();
  });

  it('renders badge when provided', () => {
    render(<RowSection icon="🚀" title="Apps" badge="Deep Link"><div /></RowSection>);
    expect(screen.getByText('Deep Link')).toBeInTheDocument();
  });

  it('renders count when provided', () => {
    render(<RowSection icon="📰" title="Noticias" count={15}><div /></RowSection>);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<RowSection icon="📰" title="Test"><span>child content</span></RowSection>);
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});

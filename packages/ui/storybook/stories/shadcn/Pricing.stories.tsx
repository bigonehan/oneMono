import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pricing } from '@ui/shadcn/section/Pricing';
import type { LinkComponentprop } from '@ui/shadcn/section/Pricing';

const meta: Meta<typeof Pricing> = {
  title: 'Section/Pricing',
  component: Pricing,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Link: LinkComponentprop = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

const pricingDataExample = {
  title: 'Pricing',
  description: 'Choose the plan that\'s right for you.',
  plans: [
    {
      name: 'Basic',
      description: 'For individuals and small teams.',
      price: '$10',
      period: 'per month',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      ctaText: 'Get Started',
      ctaHref: '#',
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'For growing businesses.',
      price: '$25',
      period: 'per month',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
      ctaText: 'Get Started',
      ctaHref: '#',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations.',
      price: 'Contact us',
      period: '',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
      ctaText: 'Contact Us',
      ctaHref: '#',
      highlighted: false,
    },
  ],
};

export const Default: Story = {
  args: {
    data: pricingDataExample,
    Link: Link,
  },
};

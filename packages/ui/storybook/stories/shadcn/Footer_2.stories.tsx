import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer_2 } from '@ui/shadcn/footer/Footer_2';
import type { LinkComponent } from '@ui/shadcn/types/link';

const meta: Meta<typeof Footer_2> = {
  title: 'Footer/Footer_2',
  component: Footer_2,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Link: LinkComponent = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

const footerDataExample = {
  logoText: 'Logo',
  description: 'A brief description of the company.',
  socialLinks: [
    { name: 'Facebook', href: '#', icon: () => <span>FB</span> },
    { name: 'Twitter', href: '#', icon: () => <span>TW</span> },
  ],
  links: [
    {
      title: 'Section 1',
      items: [
        { label: 'Link 1', href: '#' },
        { label: 'Link 2', href: '#' },
      ],
    },
    {
      title: 'Section 2',
      items: [
        { label: 'Link 3', href: '#' },
        { label: 'Link 4', href: '#' },
      ],
    },
  ],
  copyright: '© 2024 My Company, Inc. All rights reserved.',
};

export const Default: Story = {
  args: {
    data: footerDataExample,
    Link: Link,
  },
};

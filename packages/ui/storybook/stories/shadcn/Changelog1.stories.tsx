import type { Meta, StoryObj } from '@storybook/react-vite';
import { Changelog_1 } from '@ui/shadcn/section/changelog/changelog';

const meta: Meta<typeof Changelog_1> = {
  title: 'Section/Changelog1',
  component: Changelog_1,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

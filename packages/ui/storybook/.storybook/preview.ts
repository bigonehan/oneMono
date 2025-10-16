import type { Preview } from '@storybook/react';
import '../../shadcn/styles/globals.css';

import type { Preview } from '@storybook/react';
import '../../shadcn/styles/globals.css';

const preview: Preview = {
  // 모든 스토리에 적용되는 전역 parameters
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // 기본 레이아웃
    layout: 'centered',
  },
  
  // 모든 스토리를 감싸는 전역 decorators
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background font-sans antialiased">
        <Story />
      </div>
    ),
  ],
  
  // 전역 args (모든 컴포넌트에 기본값)
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

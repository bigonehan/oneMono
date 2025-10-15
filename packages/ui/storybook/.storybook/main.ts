;import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from "path";
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
		"../stories/shadcn/**/*.mdx",
        "../stories/shadcn/**/*.stories.@(js|jsx|mjs|ts|tsx)"

    ],
    addons: [
        '@chromatic-com/storybook',
        '@storybook/addon-docs',
        '@storybook/addon-onboarding',
        '@storybook/addon-a11y',
        '@storybook/addon-vitest'
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {}
    },
    async viteFinal(config) {
        const shadcnPath = resolve(__dirname, '../../shadcn');
        
        return mergeConfig(config, {
			   esbuild: {
            jsxInject: `import React from 'react'`, // 자동으로 React import
        },
            resolve: {
                alias: {
                    '@ui/shadcn/hero': `${shadcnPath}/components/hero`,
                    '@ui/shadcn/menu': `${shadcnPath}/components/menu`,
                    '@ui/shadcn/body/testimonial': `${shadcnPath}/components/body/testimonial`,
                    '@ui/shadcn/block': `${shadcnPath}/components/block`,
                    '@ui/shadcn/section': `${shadcnPath}/components/section`,
                    '@ui/shadcn/ui': `${shadcnPath}/components/ui`,
                    '@ui/shadcn/lib': `${shadcnPath}/lib`,
                    '@ui/shadcn/types': `${shadcnPath}/types`,
                    '@ui/shadcn/utils': `${shadcnPath}/lib/utils.ts`,
                    '@ui/shadcn/Colors': `${shadcnPath}/styles/Colors.tsx`,
                    '@ui/shadcn': shadcnPath,
                },
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            },
            optimizeDeps: {
                exclude: ['@ui/shadcn'],
            },
            server: {
                fs: {
                    allow: [resolve(__dirname, '../../..')],
                },
            },
        });
    },
};

export default config;

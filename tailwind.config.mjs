/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f4f7f6',
					100: '#e3ebe8',
					200: '#c5d9d4',
					300: '#9dbfba',
					400: '#75a09c',
					500: '#568480',
					600: '#426865',
					700: '#365351',
					800: '#2f4443',
					900: '#293938',
					950: '#162121',
				},
				secondary: {
					50: '#f7f6f5',
					100: '#edece9',
					200: '#dcdad5',
					300: '#c3beb6',
					400: '#a7a095',
					500: '#8c8477',
					600: '#71695d',
					700: '#5c554b',
					800: '#4d4740',
					900: '#413c37',
					950: '#221f1c',
				},
			},
			fontFamily: {
				sans: [
					'"HarmonyOS Sans"',
					'"PingFang SC"',
					'"Microsoft YaHei"',
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'sans-serif',
				],
				serif: ['"Noto Serif SC"', '"Songti SC"', '"Merriweather"', 'serif'],
			},
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
		},
	},
	plugins: [
        require('@tailwindcss/typography'),
    ],
    darkMode: 'class',
};

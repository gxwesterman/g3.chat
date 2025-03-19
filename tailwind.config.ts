import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
			typography: () => ({
        pink: {
          css: {
            '--tw-prose-links': '#da006b',
						'--tw-prose-invert-links': '#f472b6',
						'--tw-prose-body': '#563271',
						'--tw-prose-headings': '#391a51',
						'--tw-prose-lead': '#7b44ab',
						'--tw-prose-bold': '#673c8b',
						'--tw-prose-counters': '#c4739d',
						'--tw-prose-bullets': '#c4739d',
						'--tw-prose-hr': '#d8c3ef',
						'--tw-prose-quotes': '#563271',
						'--tw-prose-quote-borders': '#c4739d',
						'--tw-prose-captions': '#7b44ab',
						'--tw-prose-code': '#563271',
						'--tw-prose-pre-code': '#f2ebfa',
						'--tw-prose-pre-bg': '#563271',
						'--tw-prose-th-borders': '#d8c3ef',
						'--tw-prose-td-borders': '#eadef7',
						'--tw-prose-invert-body': '#d3c7e1',
						'--tw-prose-invert-headings': '#faf7fd',
						'--tw-prose-invert-lead': '#d8c3ef',
						'--tw-prose-invert-bold': '#f2ebfa',
						'--tw-prose-invert-counters': '#dc749e',
						'--tw-prose-invert-bullets': '#dc749e',
						'--tw-prose-invert-hr': '#dc749e',
						'--tw-prose-invert-quotes': '#f2ebfa',
						'--tw-prose-invert-quote-borders': '#dc749e',
						'--tw-prose-invert-captions': '#bf9be4',
						'--tw-prose-invert-code': 'hsl(NaN,NaN%,NaN%)',
						'--tw-prose-invert-pre-code': '#d8c3ef',
						'--tw-prose-invert-pre-bg': 'rgba(0, 0, 0, .5)',
						'--tw-prose-invert-th-borders': '#6d5d7f',
						'--tw-prose-invert-td-borders': '#463854',
          },
        },
      }),
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

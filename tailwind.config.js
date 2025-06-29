/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
        border: 'hsl(var(--border))',
        input: {
          DEFAULT: 'hsl(var(--input))',
          border: 'hsl(var(--input-border-color))' 
        },
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))', 
        foreground: 'hsl(var(--foreground))', 
        primary: {
          DEFAULT: 'hsl(var(--primary))', 
          foreground: 'hsl(var(--primary-foreground))', 
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', 
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', 
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))', 
          foreground: 'hsl(var(--card-foreground))', 
        },
        'phantom-dark': 'hsl(var(--phantom-dark))', 
        'phantom-blue': 'hsl(var(--phantom-blue))', 
        'phantom-light': 'hsl(var(--phantom-light))', 
        'phantom-gray': 'hsl(var(--phantom-gray))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
        'pulse-glow-blue': {
          '0%, 100%': { boxShadow: '0 0 20px hsl(var(--phantom-blue), 0.4)' },
          '50%': { boxShadow: '0 0 40px hsl(var(--phantom-blue), 0.8)' },
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow-blue': 'pulse-glow-blue 2s infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
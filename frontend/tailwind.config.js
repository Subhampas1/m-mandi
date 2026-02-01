/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // India-inspired earthy palette
                saffron: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                mandi: {
                    green: '#138808',
                    cream: '#FFF9E6',
                    terracotta: '#D2691E',
                    clay: '#8B4513',
                    sand: '#F4E1C1',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

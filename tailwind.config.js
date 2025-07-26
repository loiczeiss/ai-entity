/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        // add other paths where you use Tailwind classes
    ],
    theme: {
        extend: {},
    },
    plugins: [

        // add other plugins if needed
    ],
    darkMode: 'class', // or 'media' or false depending on your setup
}

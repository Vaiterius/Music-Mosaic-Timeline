/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				barlow: ["Barlow", "sans-serif"],
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				lastfm: {
					primary: "#FFFFFF",
					"primary-content": "#8C0000",
					secondary: "#8C0000",
					"secondary-content": "#FFFFFF",
					accent: "#979797",
					"base-100": "#490808",
					"base-300": "#141414",
				},
			},
		],
	},
};

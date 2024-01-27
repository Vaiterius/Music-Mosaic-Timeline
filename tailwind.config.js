/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				lastfm: {
					primary: "#FFFFFF",
					"primary-content": "#8C0000",
					accent: "#979797",
					"base-100": "#490808",
				},
			},
		],
	},
};

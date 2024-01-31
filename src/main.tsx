import React from "react";
import ReactDOM from "react-dom/client";

import ReactGA from "react-ga4";

import App from "./components/App.tsx";
import "./index.css";

ReactGA.initialize("G-6ERW21J7W1");

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

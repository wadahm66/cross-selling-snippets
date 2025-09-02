import React from "react";
import { createRoot } from "react-dom/client";
import UniversalBundleWidget from "./components/UniversalBundleWidget";
// Your main component (the bundle widget we saw in the compiled code)
const BundleWidget = () => {
  // Your component code here
  return (
    <div>
      <UniversalBundleWidget />
      <h2>Bundle Widget</h2>
      <UniversalBundleWidget />
    </div>
  );
};

// Auto-initialize function
const initWidget = () => {
  const container = document.getElementById("widget-root");
  if (container && window.React && window.ReactDOM) {
    const root = window.ReactDOM.createRoot(container);
    root.render(React.createElement(BundleWidget));
  }
};

// Export for UMD
if (typeof window !== "undefined") {
  (window as any).BundleWidget = BundleWidget;
  (window as any).initBundleWidget = initWidget;

  // Auto-initialize when script loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
}

export default BundleWidget;

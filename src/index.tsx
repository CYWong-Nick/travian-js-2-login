import ReactDOM from 'react-dom/client';
import App from './App';

const rootContainer = document.createElement('div')
rootContainer.style.cssText = `
  z-index: 1000;
  position: sticky;
  bottom: 0px;
  background-color: white;
  height: 200px;
  color: black;
`
document.getElementById("content")?.appendChild(rootContainer);

const root = ReactDOM.createRoot(rootContainer);

root.render(
  <App />
);
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './design-system.css'
import App from './App'
import { installGlobalErrorCapture } from './ui/utils/captureErrors'
import { logger } from './engine/logger'

// Install global error capture and console intercept
installGlobalErrorCapture();
logger.installConsoleIntercept();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)

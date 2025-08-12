import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, theme as antdTheme } from 'antd'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { useAppSelector } from './store'

// Bridge component to apply AntD theme from Redux
function ThemedApp() {
  const mode = useAppSelector((s) => s.ui.theme)
  const isDark = mode === 'dark'
  return (
    <ConfigProvider theme={{ algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </StrictMode>
)

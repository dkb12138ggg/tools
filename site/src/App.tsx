import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import JsonFormatter from './pages/JsonFormatter'
import UrlEncoder from './pages/UrlEncoder'
import { lazy, Suspense } from 'react'

const QrGenerator = lazy(() => import('./pages/QrGenerator'))
const Base64Tool = lazy(() => import('./pages/Base64Tool'))
const HashGenerator = lazy(() => import('./pages/HashGenerator'))

export default function App() {
  return (
    <AppLayout>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json" element={<JsonFormatter />} />
          <Route path="/url" element={<UrlEncoder />} />
          <Route path="/qr" element={<QrGenerator />} />
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/hash" element={<HashGenerator />} />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}

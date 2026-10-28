import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

// Inner pages are code-split: each loads only when visited. The basename is the
// path the site is served from ('/corepoint' on GitHub Pages; see siteConfig.url).
const router = createBrowserRouter(
  [
  {
    element: <Layout />,
    HydrateFallback: () => null,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dental-chairs', lazy: () => import('./pages/ChairsPage').then((m) => ({ Component: m.ChairsPage })) },
      { path: 'dental-chairs/:slug', lazy: () => import('./pages/ChairPage').then((m) => ({ Component: m.ChairPage })) },
      { path: 'equipment', lazy: () => import('./pages/EquipmentPage').then((m) => ({ Component: m.EquipmentPage })) },
      { path: 'compare', lazy: () => import('./pages/ComparePage').then((m) => ({ Component: m.ComparePage })) },
      { path: 'services', lazy: () => import('./pages/ServicesPage').then((m) => ({ Component: m.ServicesPage })) },
      { path: 'gallery', lazy: () => import('./pages/GalleryPage').then((m) => ({ Component: m.GalleryPage })) },
      { path: 'about', lazy: () => import('./pages/AboutPage').then((m) => ({ Component: m.AboutPage })) },
      { path: 'contact', lazy: () => import('./pages/ContactPage').then((m) => ({ Component: m.ContactPage })) },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

export default function App() {
  return <RouterProvider router={router} />
}

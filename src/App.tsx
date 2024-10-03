import { BrowserRouter, Navigate, Route } from 'react-router-dom'
// import './App.css'

import { PrivateRoutes, PublicRoutes } from './models'
import { AuthGuard } from './guards'
import { RoutesWithNotFound } from './utils'
import { Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

const Login = lazy(() => import('./pages/Login/Login'))
const Private = lazy(() => import('./pages/Private/Private'))

function App() {

  return (
    <>
      <Suspense fallback={<>Cargando</>}>
        <Provider store ={store}>
        <BrowserRouter>
          <RoutesWithNotFound>
            <Route path="/" element={<Navigate to ={PrivateRoutes.PRIVATE} />} />
            <Route path="*" element={<>Not found</>}/>
            <Route path={PublicRoutes.LOGIN} element={<Login />} />
            <Route element={<AuthGuard />}>
              <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Private />} />
            </Route>
          </RoutesWithNotFound>
          {/* <Productt/> */}
        </BrowserRouter>
        
        </Provider>
      </Suspense>

    </>
  )
}

export default App

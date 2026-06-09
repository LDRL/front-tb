import { Suspense } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { RoutesWithNotFound } from '@/utils'
import { PrivateRoutes } from '@/models'
import { PermissionGuard } from '@/guards/permission.guard'
import { publicRoutes, protectedRoutes } from './routes.config'
import Loading from '@/components/Loading'

function Private() {
  return (
    <RoutesWithNotFound>
      <>
        <Route path="/" element={<Navigate to={PrivateRoutes.DASHBOARD} />} />

        {publicRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Loading loading />}>
                <Component />
              </Suspense>
            }
          />
        ))}

        {protectedRoutes.map(({ path, Component, permission }) => (
          <Route
            key={path}
            path={path}
            element={
              <PermissionGuard permission={permission!}>
                <Suspense fallback={<Loading loading />}>
                  <Component />
                </Suspense>
              </PermissionGuard>
            }
          />
        ))}
      </>
    </RoutesWithNotFound>
  )
}

export default Private

import { PrivateRoutes } from '@/models'
import React, { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { RoutesWithNotFound } from '@/utils'
import { ProductCreate } from '../product'
import { CategoryCreate } from '../Category'
// import CategoryCreate from '../Category/components/CategoryCreate/CategoryCreate'

const Dashboard = lazy(() => import('./Dashboard/Dashboard'))
const Home = lazy(() => import('./Home/Home'))
const Category = lazy(()=> import('../Category/Category'))
const Product = lazy(()=> import('../product/Product'))


function Private() {
  return (
    <RoutesWithNotFound>
        <Route path = "/" element={<Navigate to={PrivateRoutes.DASHBOARD} />} />
        <Route path ={PrivateRoutes.DASHBOARD} element={<Dashboard />} />
        <Route path ={PrivateRoutes.HOME} element={<Home />} />
        <Route path = {PrivateRoutes.PRODUCT} element={<Product />} />
        <Route path = {PrivateRoutes.PRODUCT_CREATE} element={<ProductCreate />} />
        <Route path = {PrivateRoutes.PRODUCT_EDIT} element={<ProductCreate />} />

        <Route path = {PrivateRoutes.CATEGORY} element={<Category />} />
        <Route path = {PrivateRoutes.CATEGORY_CREATE} element={<CategoryCreate />} />
        <Route path = {PrivateRoutes.CATEGORY_EDIT} element={<CategoryCreate />} />
    </RoutesWithNotFound>
    
  )
}

export default Private
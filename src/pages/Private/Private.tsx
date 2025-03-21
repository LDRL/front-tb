import { PrivateRoutes } from '@/models'
import React, { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { RoutesWithNotFound } from '@/utils'
import { ProductCreate } from '../product'
import { CategoryCreate } from '../Category'
// import CategoryCreate from '../Category/components/CategoryCreate/CategoryCreate'
import BrandCreate from '../Brand/components/BrandCreate/BrandCreate';
import { PresentationCreate } from '../Presentation'
import { BuyCreate, BuyShow } from '../Buy'
import { SaleCreate, SaleShow } from '../Sale'



const Dashboard = lazy(() => import('./Dashboard/Dashboard'))
const Home = lazy(() => import('./Home/Home'))
const Category = lazy(()=> import('../Category/Category'))
const Product = lazy(()=> import('../product/Product'))
const Brand = lazy(() => import('../Brand/Brand'))
const Presentation = lazy(() => import('../Presentation/Presentation'))
const Buy = lazy(() => import('../Buy/Buy'))
const Sale = lazy(() => import('../Sale/Sale'))





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

        <Route path = {PrivateRoutes.BRAND} element={<Brand />} />
        <Route path = {PrivateRoutes.BRAND_CREATE} element={<BrandCreate />} />
        <Route path = {PrivateRoutes.BRAND_EDIT} element={<BrandCreate />} />

        <Route path = {PrivateRoutes.PRESENTATION} element={<Presentation />} />
        <Route path = {PrivateRoutes.PRESENTATION_CREATE} element={<PresentationCreate />} />
        <Route path = {PrivateRoutes.PRESENTATION_EDIT} element={<PresentationCreate />} />

        <Route path = {PrivateRoutes.BUY} element={<Buy />} />
        <Route path = {PrivateRoutes.BUY_CREATE} element={<BuyCreate />} />
        <Route path = {PrivateRoutes.BUY_SHOW} element={<BuyShow />} />

        <Route path = {PrivateRoutes.SALE} element={<Sale />} />
        <Route path = {PrivateRoutes.SALE_CREATE} element={<SaleCreate />} />
        <Route path = {PrivateRoutes.SALE_SHOW} element={<SaleShow />} />


    </RoutesWithNotFound>
    
  )
}

export default Private
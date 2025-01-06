import React from 'react'

/*
 * This file is accessed by the components/AppContent to generate the routes
 */


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/user/Users'))
const AddUser = React.lazy(() => import('./views/user/AddUser'))
const EditUser = React.lazy(() => import('./views/user/EditUser'))
const Quotations = React.lazy(() => import('./views/quotations/Quotations'))
const Requests = React.lazy(() => import('./views/requests/Requests'))
const Products = React.lazy(() => import('./views/products/Products'))
const AddProduct = React.lazy(() => import('./views/products/AddProduct'))
const EditProducts = React.lazy(() => import('./views/products/EditProducts'))
//punch in details
const PunchDetailsPage = React.lazy(() => import('./views/PunchDetailsPage/PunchDetailsPage'));

//const RequestPage = React.lazy(() => import('./views/requests/Requests'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users},
  { path: '/users/add', name: 'Add User', element: AddUser },
  { path: "/users/edit/:userId", name: 'Edit User', element: EditUser },

  { path: '/products', name: 'Products', element: Products },
  { path: '/products/add', name: 'Add Products', element: AddProduct },
  { path: "/products/edit/:productId", name: 'Edit Products', element: EditProducts },
  { path: '/quotations', name: 'Quotations', element: Quotations },
  { path: '/requests', name: 'Requests', element: Requests },

  //{ path: '/requests', name: 'Request', element: RequestPage },



  //punch in details
  { path: '/punch-details', name: 'Punch Details', element: PunchDetailsPage },

]

export default routes

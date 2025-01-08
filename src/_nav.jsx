import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilClock,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilMagnifyingGlass,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilUserPlus,
  cilBasket,
  cilLibrary,
  cilPaperPlane,
  cilTask,
  cilChartLine,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Punch Details',
    to: '/punch-details',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Quotations',
    to: '/quotations',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Requests',
    to: '/requests',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Data Management',
  },
  {
    component: CNavItem,
    name: 'Manage Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Products',
    to: '/products',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Finance'
  },
  {
    component: CNavItem,
    name: 'Monthly Report',
    href: 'https://docs.google.com/spreadsheets/d/1LyN1r1So2KpN7Gcz3k6dd5S46mWfKmpF2TSP7XP5Qok/edit?usp=sharing', // Replace with your URL
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    target: '_blank', // Ensures the link opens in a new tab
  },
]

export default _nav

import type { ApexOptions } from 'apexcharts'
import { getColor } from '~/utils/helpers'
const product1 = '/images/products/1.png'
const product2 = '/images/products/2.png'
const product3 = '/images/products/3.png'
const product4 = '/images/products/4.png'
const product5 = '/images/products/5.png'
const product6 = '/images/products/6.png'
const product7 = '/images/products/7.png'
const product8 = '/images/products/8.png'
const product9 = '/images/products/9.png'
const product10 = '/images/products/10.png'

export type StatType = {
  title: string
  value: number
  prefix?: string
  suffix?: string
  change: number
  icon: string
}

export const statData: StatType[] = [
  {
    title: 'Orders',
    value: 9754,
    change: -1.89,
    icon: 'shopping-cart',
  },
  {
    title: 'Revenue',
    value: 75.21,
    prefix: '$',
    suffix: 'k',
    change: -5.23,
    icon: 'pig-money',
  },
  {
    title: 'Growth',
    value: 25.08,
    prefix: '+',
    suffix: '%',
    change: 4.87,
    icon: 'trending-up',
  },
]

export const salesChartOptions = (): ApexOptions => ({
  chart: {
    height: 210,
    type: 'donut',
  },
  legend: {
    show: false,
  },
  stroke: {
    width: 0,
  },

  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            showAlways: true,
            show: true,
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a: number, b: number) => {
                return a + b
              }, 0)
            },
          },
        },
      },
    },
  },
  series: [44, 55, 41],
  labels: ['Direct', 'Affiliate', 'Sponsored'],
  colors: [getColor('chart-primary'), getColor('chart-gamma'), getColor('chart-gray')],
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 180,
        },
      },
    },
  ],
})

export const getWeeklyPerformanceChartOptions = (): ApexOptions => ({
  series: [
    {
      data: [
        {
          x: 'Mon',
          y: [28, 45],
        },
        {
          x: 'Tue',
          y: [32, 41],
        },
        {
          x: 'Wed',
          y: [29, 78],
        },
        {
          x: 'Thu',
          y: [30, 46],
        },
        {
          x: 'Fri',
          y: [35, 41],
        },
        {
          x: 'Sat',
          y: [45, 65],
        },
        {
          x: 'Sun',
          y: [41, 56],
        },
      ],
    },
  ],
  chart: {
    height: 247,
    type: 'rangeBar',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      isDumbbell: true,
      dumbbellColors: [[getColor('chart-primary'), getColor('chart-primary')]],
    },
  },
  legend: {
    show: false,
  },
  fill: {
    type: 'gradient',
    gradient: {
      gradientToColors: [getColor('chart-primary'), getColor('chart-gamma'), getColor('chart-gray')],
      inverseColors: false,
      stops: [0, 100],
    },
  },
  colors: [getColor('chart-primary')],
  xaxis: {
    type: 'numeric',
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    labels: {
      offsetX: 10,
    },
  },
  grid: {
    borderColor: getColor('chart-order-color'),
    padding: {
      top: -20,
      right: 0,
      bottom: -10,
      left: 0,
    },
  },
})

export type SaleReportType = {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: string
}

export const saleReportData: SaleReportType[] = [
  {
    title: 'Revenue',
    value: 78224.68,
    prefix: '$',
    icon: 'wallet',
  },
  {
    title: 'Orders',
    value: 8541,
    icon: 'basket',
  },
  {
    title: 'Growth Rate',
    value: 25.3,
    suffix: '%',
    icon: 'trending-up',
  },
]

export const getSalesReportChartOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Total Revenue',
      type: 'area',
      data: [21, 21, 21, 35, 35, 35, 44, 44, 44, 54, 54, 54, 48, 48, 76, 76, 95, 95, 76, 76, 32, 32, 46, 48, 48],
    },
    {
      name: 'Orders',
      type: 'line',
      data: [40, 40, 40, 50, 50, 35, 27, 27, 27, 15, 15, 27, 27, 36, 36, 33, 33, 34, 35, 33, 50, 50, 55, 55, 55],
    },
  ],
  chart: {
    type: 'line',
    height: 342,
    toolbar: {
      show: false,
    },
    offsetX: 0,
  },
  stroke: {
    width: [3, 2],
    curve: 'smooth',
    dashArray: [0, 8],
  },
  colors: [getColor('chart-secondary'), getColor('chart-alpha')],
  grid: {
    strokeDashArray: 7,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    labels: {
      offsetY: 2,
    },
  },
  yaxis: {
    tickAmount: 4,
    min: 0,
    max: 100,
    labels: {
      show: true,
      formatter: function (value: number) {
        return value + 'k'
      },
      offsetX: -10,
    },
    axisBorder: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
    y: {
      formatter: function (val: number) {
        return '$' + val + 'k'
      },
    },
  },
  fill: {
    opacity: [1, 0.5],
    type: ['gradient', 'solid'],
    gradient: {
      type: 'vertical',
      //   shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 70],
    },
  },
  legend: {
    offsetY: 15,
  },
})

export type ProductType = {
  image: string
  name: string
  brand: string
  price: string
  quantity: number
  amount: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

export const productData: ProductType[] = [
  {
    image: product1,
    name: 'Modern Fabric Sofa Set',
    brand: 'Homeluxe',
    price: '$499.00',
    quantity: 34,
    amount: '$16,966.00',
    status: 'low-stock',
  },
  {
    image: product2,
    name: 'L-Shaped Sectional Sofa',
    brand: 'ComfortHub',
    price: '$899.00',
    quantity: 21,
    amount: '$18,879.00',
    status: 'in-stock',
  },
  {
    image: product3,
    name: 'Velvet Recliner Chair',
    brand: 'SoftEase',
    price: '$379.00',
    quantity: 47,
    amount: '$17,813.00',
    status: 'in-stock',
  },
  {
    image: product4,
    name: 'Classic Wooden Coffee Table',
    brand: 'OakCraft',
    price: '$259.00',
    quantity: 58,
    amount: '$15,022.00',
    status: 'out-of-stock',
  },
  {
    image: product5,
    name: 'Minimalist TV Stand',
    brand: 'FurniPro',
    price: '$315.00',
    quantity: 64,
    amount: '$20,160.00',
    status: 'in-stock',
  },
  {
    image: product6,
    name: 'Leather Lounge Chair',
    brand: 'UrbanStyle',
    price: '$425.00',
    quantity: 39,
    amount: '$16,575.00',
    status: 'low-stock',
  },
  {
    image: product7,
    name: 'Glass Center Table',
    brand: 'CrystalCasa',
    price: '$289.00',
    quantity: 52,
    amount: '$15,028.00',
    status: 'in-stock',
  },
  {
    image: product8,
    name: 'Wooden Bookshelf Unit',
    brand: 'TimberWorks',
    price: '$349.00',
    quantity: 28,
    amount: '$9,772.00',
    status: 'low-stock',
  },
  {
    image: product9,
    name: 'Luxury King Bed Frame',
    brand: 'DreamRest',
    price: '$1,099.00',
    quantity: 15,
    amount: '$16,485.00',
    status: 'out-of-stock',
  },
  {
    image: product10,
    name: 'Round Dining Table Set',
    brand: 'CasaDine',
    price: '$725.00',
    quantity: 25,
    amount: '$18,125.00',
    status: 'in-stock',
  },
  {
    image: product2,
    name: 'Ergonomic Office Chair',
    brand: 'WorkEase',
    price: '$269.00',
    quantity: 44,
    amount: '$11,836.00',
    status: 'in-stock',
  },
  {
    image: product3,
    name: 'Nightstand with Drawers',
    brand: 'CozyHome',
    price: '$189.00',
    quantity: 53,
    amount: '$10,017.00',
    status: 'low-stock',
  },
]

export type OrderType = {
  id: string
  customer: {
    name: string
    email: string
  }
  date: string
  amount: string
  payment: string
  status: 'completed' | 'pending' | 'cancelled' | 'failed'
}

export const orderData: OrderType[] = [
  {
    id: '#ORD-1023',
    customer: { name: 'John Carter', email: 'john@example.com' },
    date: '12 Nov 2025',
    amount: '$249.00',
    payment: 'Credit Card',
    status: 'completed',
  },
  {
    id: '#ORD-1022',
    customer: { name: 'Emma Wilson', email: 'emma@example.com' },
    date: '12 Nov 2025',
    amount: '$179.00',
    payment: 'UPI',
    status: 'pending',
  },
  {
    id: '#ORD-1021',
    customer: { name: 'Michael Harris', email: 'michael@example.com' },
    date: '11 Nov 2025',
    amount: '$329.00',
    payment: 'PayPal',
    status: 'completed',
  },
  {
    id: '#ORD-1020',
    customer: { name: 'Sophia Turner', email: 'sophia@example.com' },
    date: '11 Nov 2025',
    amount: '$125.00',
    payment: 'Debit Card',
    status: 'cancelled',
  },
  {
    id: '#ORD-1019',
    customer: { name: 'Chris Evans', email: 'chris@example.com' },
    date: '10 Nov 2025',
    amount: '$560.00',
    payment: 'Credit Card',
    status: 'completed',
  },
  {
    id: '#ORD-1018',
    customer: { name: 'Ava Mitchell', email: 'ava@example.com' },
    date: '10 Nov 2025',
    amount: '$98.00',
    payment: 'Cash',
    status: 'pending',
  },
  {
    id: '#ORD-1017',
    customer: { name: 'Liam Parker', email: 'liam@example.com' },
    date: '09 Nov 2025',
    amount: '$412.00',
    payment: 'Net Banking',
    status: 'completed',
  },
  {
    id: '#ORD-1016',
    customer: { name: 'Isabella Rose', email: 'isabella@example.com' },
    date: '09 Nov 2025',
    amount: '$255.00',
    payment: 'Credit Card',
    status: 'failed',
  },
  {
    id: '#ORD-1015',
    customer: { name: 'Oliver Brown', email: 'oliver@example.com' },
    date: '08 Nov 2025',
    amount: '$720.00',
    payment: 'UPI',
    status: 'completed',
  },
  {
    id: '#ORD-1014',
    customer: { name: 'Charlotte Green', email: 'charlotte@example.com' },
    date: '08 Nov 2025',
    amount: '$138.00',
    payment: 'PayPal',
    status: 'pending',
  },
]

export type CountryType = {
  name: string
  revenue: number
  prefix: string
  suffix: string
  className: string
}

export const countryData: CountryType[] = [
  {
    name: 'United States',
    revenue: 48.6,
    prefix: '$',
    suffix: 'k',
    className: 'text-info',
  },
  {
    name: 'United Kingdom',
    revenue: 26.4,
    prefix: '$',
    suffix: 'k',
    className: 'text-primary',
  },
  {
    name: 'Australia',
    revenue: 18.9,
    prefix: '$',
    suffix: 'k',
    className: 'text-secondary',
  },
]

export const revenueLocationMapOptions = () => ({
  map: 'world_merc',
  zoomOnScroll: false,
  zoomButtons: false,
  markers: [
    { name: 'Australia', coords: [-25.2744, 133.7751] },
    { name: 'India', coords: [20.5937, 78.9629] },
    { name: 'Japan', coords: [36.2048, 138.2529] },
    { name: 'South Africa', coords: [-30.5595, 22.9375] },
    { name: 'Germany', coords: [51.1657, 10.4515] },
    { name: 'United Kingdom', coords: [55.3781, -3.436] },
    { name: 'Mexico', coords: [23.6345, -102.5528] },
    { name: 'Argentina', coords: [-38.4161, -63.6167] },
    { name: 'Saudi Arabia', coords: [23.8859, 45.0792] },
    { name: 'Indonesia', coords: [-0.7893, 113.9213] },
  ],
  lines: [
    { from: 'India', to: 'Australia' },
    { from: 'Japan', to: 'Germany' },
    { from: 'Mexico', to: 'United Kingdom' },
    { from: 'Argentina', to: 'South Africa' },
    { from: 'Saudi Arabia', to: 'India' },
    { from: 'Indonesia', to: 'Japan' },
    { from: 'United Kingdom', to: 'Germany' },
    { from: 'Australia', to: 'Indonesia' },
  ],
  regionStyle: {
    initial: {
      stroke: '#aab9d14d',
      strokeWidth: 0.25,
      fill: '#aab9d14d',
      fillOpacity: 1,
    },
  },
  markerStyle: {
    initial: { fill: getColor('secondary') },
    selected: { fill: getColor('secondary') },
  },
  lineStyle: {
    animation: true,
    strokeDasharray: '1 2 3 4 5 6',
  },
})

export type ActivityType = {
  title: string
  description: string
  author: string
  icon: string
  iconClassName: string
}

export const activityData: ActivityType[] = [
  {
    title: 'New Orders Synced from Storefront',
    description: '1,250 new customer orders were successfully imported from the online store.',
    author: 'Olivia Green',
    icon: 'shopping-cart',
    iconClassName: 'text-bg-primary',
  },
  {
    title: 'Payment Gateway Integration Updated',
    description: 'Stripe API upgraded to support faster settlements and improved security tokens.',
    author: 'James Parker',
    icon: 'credit-card',
    iconClassName: 'text-bg-success',
  },
  {
    title: 'Inventory Levels Auto-Synced',
    description: 'All product quantities were updated based on the latest warehouse data.',
    author: 'Sophia Lee',
    icon: 'package',
    iconClassName: 'text-bg-warning',
  },
  {
    title: 'New Vendor Accounts Approved',
    description: 'Five new seller accounts were verified and added to the marketplace.',
    author: 'Liam Johnson',
    icon: 'user',
    iconClassName: 'text-bg-info',
  },
  {
    title: 'Refund Requests Reviewed',
    description: '27 refund claims were processed successfully with zero pending disputes.',
    author: 'Ethan Miller',
    icon: 'alert-circle',
    iconClassName: 'text-bg-danger',
  },
  {
    title: 'Summer Campaign Launched',
    description: 'The “Summer Deals 2025” campaign is now live across all marketing channels.',
    author: 'Ava Mitchell',
    icon: 'speakerphone',
    iconClassName: 'text-bg-secondary',
  },
]

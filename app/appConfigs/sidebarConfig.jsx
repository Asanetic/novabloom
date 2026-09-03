export const sidebarConfig = [

  // DASHBOARD
  {
    type: "link",
    label: "Dashboard",
    icon: "fa fa-home",
    href: (routes) => `${routes.billing}/dashboard/main`,
    roles: []
  },

  // CUSTOMERS/USERS
  {
    type: "submenu",
    label: "Customers",
    icon: "fa fa-users",
    roles: [],
    items: [
      { label: "All Customers", href: (routes) => `${routes.billing}/users/list`, roles: [] },
      { label: "New Customer", href: (routes) => `${routes.billing}/users/profile`, roles: [] },
      { label: "Active Customers", href: (routes) => `${routes.billing}/users/activelist`, roles: [] },
      { label: "Inactive Customers", href: (routes) => `${routes.billing}/users/dormarntusers`, roles: [] },
      { label: "SMS and Email", href: (routes) => `${routes.billing}/messages/list`, roles: [] },
    ],
  },

  // ASSETS (Products/Services)
  {
    type: "submenu",
    label: "Assets",
    icon: "fa fa-th-large",
    roles: [],
    items: [
      { label: "All Assets", href: (routes) => `${routes.billing}/assets/list`, roles: [] },
      { label: "Create Asset", href: (routes) => `${routes.billing}/assets/profile`, roles: [] },
      { label: "Asset Pricing", href: (routes) => `${routes.billing}/asset_pricing/list`, roles: [] },
      { label: "New Pricing", href: (routes) => `${routes.billing}/asset_pricing/profile`, roles: [] },
    ],
  },

  // // ORDERS
  // {
  //   type: "submenu",
  //   label: "Orders",
  //   icon: "fa fa-shopping-cart",
  //   roles: [],
  //   items: [
  //     { label: "All Orders", href: (routes) => `${routes.billing}/orders/list`, roles: [] },
  //     { label: "Create Order", href: (routes) => `${routes.billing}/orders/profile`, roles: [] },
  //     { label: "Order Items", href: (routes) => `${routes.billing}/orderitems/list`, roles: [] },
  //     { label: "Pending Orders", href: (routes) => `${routes.billing}/orders/pending`, roles: [] },
  //     { label: "Completed Orders", href: (routes) => `${routes.billing}/orders/completed`, roles: [] },
  //     { label: "Cancelled Orders", href: (routes) => `${routes.billing}/orders/cancelled`, roles: [] },
  //   ],
  // },

  // SUBSCRIPTIONS
  {
    type: "submenu",
    label: "Subscriptions",
    icon: "fa fa-repeat",
    roles: [],
    items: [
      { label: "All Subscriptions", href: (routes) => `${routes.billing}/subscriptions/list`, roles: [] },
      { label: "New Subscription", href: (routes) => `${routes.billing}/subscriptions/profile`, roles: [] },
    ],
  },

  //ENTITLEMENTS & ACCESS
  {
    type: "submenu",
    label: "Invoices",
    icon: "fa fa-copy",
    roles: [],
    items: [
      { label: "All Invoices", href: (routes) => `${routes.billing}/invoices/list`, roles: [] },
      { label: "Generate invoice", href: (routes) => `${routes.billing}/subscriptions/generateinvoice`, roles: [] },
    ],
  },
  // PAYMENTS
  {
    type: "submenu",
    label: "Payments",
    icon: "fa fa-credit-card",
    roles: [],
    items: [
      { label: "All Payments", href: (routes) => `${routes.billing}/payments/list`, roles: [] },
      { label: "Record Payment", href: (routes) => `${routes.billing}/payments/profile`, roles: [] },
    ],
  },

  // ENTITLEMENTS & ACCESS
  // {
  //   type: "submenu",
  //   label: "Entitlements",
  //   icon: "fa fa-key",
  //   roles: [],
  //   items: [
  //     { label: "All Entitlements", href: (routes) => `${routes.billing}/entitlements/list`, roles: [] },
  //     { label: "Grant Access", href: (routes) => `${routes.billing}/entitlements/profile`, roles: [] },
  //     { label: "Active Access", href: (routes) => `${routes.billing}/entitlements/active`, roles: [] },
  //     { label: "Expired Access", href: (routes) => `${routes.billing}/entitlements/expired`, roles: [] },
  //   ],
  // },

  // USAGE TRACKING
  // {
  //   type: "submenu",
  //   label: "Usage & Metering",
  //   icon: "fa fa-tachometer",
  //   roles: [],
  //   items: [
  //     { label: "Usage Events", href: (routes) => `${routes.billing}/usageevents/list`, roles: [] },
  //     { label: "Usage Meters", href: (routes) => `${routes.billing}/usagemeters/list`, roles: [] },
  //     { label: "Create Meter", href: (routes) => `${routes.billing}/usagemeters/profile`, roles: [] },
  //     { label: "Wallets", href: (routes) => `${routes.billing}/usagewallets/list`, roles: [] },
  //     { label: "Wallet Ledger", href: (routes) => `${routes.billing}/usagewalletledger/list`, roles: [] },
  //   ],
  // },

  // REPORTS & ANALYTICS
  // {
  //   type: "submenu",
  //   label: "Reports",
  //   icon: "fa fa-bar-chart",
  //   roles: [],
  //   items: [
  //     { label: "Revenue Report", href: (routes) => `${routes.billing}/reports/revenue`, roles: [] },
  //     { label: "Subscription Analytics", href: (routes) => `${routes.billing}/reports/subscriptions`, roles: [] },
  //     { label: "Payment Analytics", href: (routes) => `${routes.billing}/reports/payments`, roles: [] },
  //     { label: "Customer Growth", href: (routes) => `${routes.billing}/reports/customers`, roles: [] },
  //     { label: "Asset Performance", href: (routes) => `${routes.billing}/reports/assets`, roles: [] },
  //     { label: "Usage Analytics", href: (routes) => `${routes.billing}/reports/usage`, roles: [] },
  //     { label: "Churn & Retention", href: (routes) => `${routes.billing}/reports/churn`, roles: [] },
  //   ],
  // },

  // SETTINGS
  {
    type: "submenu",
    label: "Settings",
    icon: "fa fa-cog",
    roles: [],
    items: [
      { label: "View system users", href: (routes) => `${routes.billing}/sysusers/list`, roles: [] },
      { label: "Add system user", href: (routes) => `${routes.billing}/sysusers/profile`, roles: [] },
      { label: "View user roles", href: (routes) => `${routes.billing}/rolebundles/list`, roles: [] },
      { label: "Add user roles", href: (routes) => `${routes.billing}/rolebundles/profile`, roles: [] },
     ],
  },
];
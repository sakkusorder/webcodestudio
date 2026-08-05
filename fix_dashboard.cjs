const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/admin/DashboardOverview.tsx');
let content = fs.readFileSync(file, 'utf-8');

if (!content.includes('useEffect')) {
    content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
}

content = content.replace(/const RECENT_ORDERS: any\[\] = \[\];/, `
  // removed static RECENT_ORDERS
`);

content = content.replace(/export function DashboardOverview\(\) \{/, `
export function DashboardOverview() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentOrders = () => {
      const customOrdersRaw = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
      const customOrders = customOrdersRaw.map((o: any) => ({
        id: o.id,
        client: o.client,
        type: 'Custom',
        amount: o.budget,
        status: o.status,
        date: o.date
      }));

      const readyOrdersRaw = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
      const readyOrders = readyOrdersRaw.map((o: any) => ({
        id: o.id,
        client: o.customer.fullName,
        type: 'Website',
        amount: \`$\${o.product.price}\`,
        status: o.payment.option === 'installment' ? 'Installment' : o.payment.paidNow > 0 ? 'Paid' : 'Pending',
        date: new Date(o.createdAt).toLocaleDateString()
      }));

      setRecentOrders([...customOrders, ...readyOrders].slice(0, 10)); // Just 10 recent
    };
    
    fetchRecentOrders();
    window.addEventListener('storage', fetchRecentOrders);
    const interval = setInterval(fetchRecentOrders, 1000);
    return () => {
      window.removeEventListener('storage', fetchRecentOrders);
      clearInterval(interval);
    };
  }, []);
`);

content = content.replace(/\{RECENT_ORDERS\.map/g, '{recentOrders.map');

fs.writeFileSync(file, content, 'utf-8');

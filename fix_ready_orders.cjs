const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/admin/ReadyOrders.tsx');
let content = fs.readFileSync(file, 'utf-8');

if (!content.includes('useEffect')) {
    content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
}

content = content.replace(/const \[orders, setOrders\] = useState<ReadyOrder\[\]>\(\[\.\.\.localOrders, \.\.\.INITIAL_ORDERS\]\);/, `
  const [orders, setOrders] = useState<ReadyOrder[]>([...localOrders, ...INITIAL_ORDERS]);

  useEffect(() => {
    const fetchOrders = () => {
      const storedRaw = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
      const storedOrders = storedRaw.map((o: any) => ({
        id: o.id,
        website: o.product.name,
        client: o.customer.fullName,
        price: \`$\${o.product.price}\`,
        paymentStatus: o.payment.option === 'installment' ? 'Installment' : o.payment.paidNow > 0 ? 'Paid' : 'Pending',
        deliveryDate: new Date(o.createdAt).toLocaleDateString()
      }));
      setOrders([...storedOrders, ...INITIAL_ORDERS]);
    };
    
    window.addEventListener('storage', fetchOrders);
    const interval = setInterval(fetchOrders, 1000);
    return () => {
      window.removeEventListener('storage', fetchOrders);
      clearInterval(interval);
    };
  }, []);
`);
fs.writeFileSync(file, content, 'utf-8');

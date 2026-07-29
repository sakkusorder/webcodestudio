const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'admin');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const pages = [
  'DashboardOverview', 'Websites', 'Categories', 'CustomOrders', 'ReadyOrders',
  'Clients', 'Messages', 'Support', 'Reviews', 'Payments', 'Invoices',
  'Projects', 'Notifications', 'Sliders', 'Homepage', 'Media', 'Blog',
  'Faq', 'Reports', 'Settings', 'AdminProfile'
];

pages.forEach(page => {
  const content = `import React from 'react';
import { PlusCircle, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

export function ${page}() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">${page.replace(/([A-Z])/g, ' $1').trim()}</h2>
      </div>
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 text-center text-neutral-500">
        ${page} management interface will be displayed here.
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${page}.tsx`), content);
});
console.log('Created admin page components.');

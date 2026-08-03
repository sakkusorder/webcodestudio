import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'users_db.json');

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

const initDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  }
};

export const getUsers = (): User[] => {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data).users || [];
  } catch (error) {
    return [];
  }
};

export const saveUsers = (users: User[]) => {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users }, null, 2));
};

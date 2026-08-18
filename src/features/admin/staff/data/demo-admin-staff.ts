import type { AdminStaffMember, StaffPermissionKey, StaffRole } from "@/features/admin/staff/types/admin-staff";

export const rolePermissionDefaults: Record<StaffRole, StaffPermissionKey[]> = {
  OWNER: ["DASHBOARD","ORDERS","MENU","TABLES","ANALYTICS","SETTINGS","STAFF","KITCHEN"],
  MANAGER: ["DASHBOARD","ORDERS","MENU","TABLES","ANALYTICS","KITCHEN"],
  CASHIER: ["DASHBOARD","ORDERS","TABLES"],
  KITCHEN: ["KITCHEN"],
  WAITER: ["ORDERS","TABLES"]
};

const now = Date.now();

export const demoAdminStaff: AdminStaffMember[] = [
  { id:"staff-owner", name:"Stanley Chai", email:"owner@mellowkitchen.demo", role:"OWNER", status:"ACTIVE", lastLoginAt:new Date(now-18*60*1000).toISOString(), permissions:rolePermissionDefaults.OWNER },
  { id:"staff-manager", name:"Alicia Tan", email:"manager@mellowkitchen.demo", role:"MANAGER", status:"ACTIVE", lastLoginAt:new Date(now-2*60*60*1000).toISOString(), permissions:rolePermissionDefaults.MANAGER },
  { id:"staff-cashier", name:"Jordan Lee", email:"cashier@mellowkitchen.demo", role:"CASHIER", status:"ACTIVE", lastLoginAt:new Date(now-5*60*60*1000).toISOString(), permissions:rolePermissionDefaults.CASHIER },
  { id:"staff-kitchen", name:"Chef Amir", email:"kitchen@mellowkitchen.demo", role:"KITCHEN", status:"ACTIVE", lastLoginAt:new Date(now-33*60*1000).toISOString(), permissions:rolePermissionDefaults.KITCHEN },
  { id:"staff-waiter", name:"Mei Ling", email:"waiter@mellowkitchen.demo", role:"WAITER", status:"DISABLED", lastLoginAt:null, permissions:rolePermissionDefaults.WAITER }
];

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoAdminStaff, rolePermissionDefaults } from "@/features/admin/staff/data/demo-admin-staff";
import type { AdminStaffMember, StaffPermissionKey, StaffRole } from "@/features/admin/staff/types/admin-staff";
import styles from "./admin-staff-page.module.css";

const roleLabels: Record<StaffRole,string> = {
  OWNER:"Owner", MANAGER:"Manager", CASHIER:"Cashier", KITCHEN:"Kitchen Staff", WAITER:"Waiter"
};

const permissionLabels: Array<{key:StaffPermissionKey;label:string}> = [
  {key:"DASHBOARD",label:"Dashboard"},{key:"ORDERS",label:"Orders"},{key:"MENU",label:"Menu"},
  {key:"TABLES",label:"Tables"},{key:"ANALYTICS",label:"Analytics"},{key:"SETTINGS",label:"Settings"},
  {key:"STAFF",label:"Staff"},{key:"KITCHEN",label:"Kitchen"}
];

type EditorState = {
  mode:"create"|"edit"; id?:string; name:string; email:string; role:StaffRole;
  status:"ACTIVE"|"DISABLED"; permissions:StaffPermissionKey[];
};

function formatLastLogin(value:string|null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString([], { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}

export function AdminStaffPage() {
  const [staff,setStaff] = useState<AdminStaffMember[]>(demoAdminStaff);
  const [search,setSearch] = useState("");
  const [roleFilter,setRoleFilter] = useState<"ALL"|StaffRole>("ALL");
  const [editor,setEditor] = useState<EditorState|null>(null);
  const [resetTarget,setResetTarget] = useState<AdminStaffMember|null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter(m =>
      (roleFilter==="ALL" || m.role===roleFilter) &&
      (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    );
  },[staff,search,roleFilter]);

  const summary = useMemo(() => ({
    total:staff.length,
    active:staff.filter(x=>x.status==="ACTIVE").length,
    disabled:staff.filter(x=>x.status==="DISABLED").length,
    privileged:staff.filter(x=>x.role==="OWNER"||x.role==="MANAGER").length
  }),[staff]);

  function openCreate() {
    setEditor({mode:"create",name:"",email:"",role:"WAITER",status:"ACTIVE",permissions:[...rolePermissionDefaults.WAITER]});
  }

  function openEdit(m:AdminStaffMember) {
    setEditor({mode:"edit",id:m.id,name:m.name,email:m.email,role:m.role,status:m.status,permissions:[...m.permissions]});
  }

  function save() {
    if (!editor) return;
    const name=editor.name.trim(), email=editor.email.trim().toLowerCase();
    if (!name || !email) return;

    if (editor.mode==="create") {
      setStaff(cur=>[...cur,{id:`staff-${Date.now()}`,name,email,role:editor.role,status:editor.status,lastLoginAt:null,permissions:editor.permissions}]);
    } else {
      setStaff(cur=>cur.map(m=>m.id===editor.id?{...m,name,email,role:editor.role,status:editor.status,permissions:editor.permissions}:m));
    }
    setEditor(null);
  }

  function togglePermission(key:StaffPermissionKey) {
    setEditor(cur => !cur ? cur : ({
      ...cur,
      permissions:cur.permissions.includes(key) ? cur.permissions.filter(x=>x!==key) : [...cur.permissions,key]
    }));
  }

  return <main className={styles.page}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}><div className={styles.logo}>M</div><div><span>Restaurant OS</span><strong>Mellow Kitchen</strong></div></div>
      <nav className={styles.nav}>
        <Link className={styles.navItem} href="/admin">Dashboard</Link>
        <Link className={styles.navItem} href="/admin/orders">Orders</Link>
        <Link className={styles.navItem} href="/admin/menu">Menu</Link>
        <Link className={styles.navItem} href="/admin/tables">Tables</Link>
        <Link className={styles.navItem} href="/admin/analytics">Analytics</Link>
        <Link className={`${styles.navItem} ${styles.navItemActive}`} href="/admin/staff">Staff</Link>
        <Link className={styles.navItem} href="/admin/settings">Settings</Link>
        <Link className={styles.navItem} href="/kitchen">Kitchen</Link>
      </nav>
    </aside>

    <section className={styles.content}>
      <header className={styles.topbar}>
        <div><p className={styles.eyebrow}>Access control</p><h1>Staff & roles</h1><p>Manage restaurant team accounts, roles and page permissions.</p></div>
        <div className={styles.actions}><span className={styles.demoBadge}>Demo mode</span><button className={styles.primaryButton} onClick={openCreate}>+ Add staff</button></div>
      </header>

      <section className={styles.metrics}>
        <article><span>Total staff</span><strong>{summary.total}</strong></article>
        <article><span>Active</span><strong>{summary.active}</strong></article>
        <article><span>Disabled</span><strong>{summary.disabled}</strong></article>
        <article><span>Managers / owners</span><strong>{summary.privileged}</strong></article>
      </section>

      <section className={styles.toolbar}>
        <div className={styles.search}><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or email..." /></div>
        <div className={styles.filters}>
          <button data-active={roleFilter==="ALL"} onClick={()=>setRoleFilter("ALL")}>All</button>
          {(Object.keys(roleLabels) as StaffRole[]).map(role=><button key={role} data-active={roleFilter===role} onClick={()=>setRoleFilter(role)}>{roleLabels[role]}</button>)}
        </div>
      </section>

      <section className={styles.staffGrid}>
        {visible.map(member=><article className={styles.staffCard} key={member.id}>
          <div className={styles.staffHeader}>
            <div className={styles.avatar}>{member.name.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase()}</div>
            <div className={styles.identity}><strong>{member.name}</strong><span>{member.email}</span></div>
            <span className={styles.status} data-status={member.status}>{member.status==="ACTIVE"?"Active":"Disabled"}</span>
          </div>

          <div className={styles.roleRow}>
            <div><span>Role</span><strong>{roleLabels[member.role]}</strong></div>
            <div><span>Last login</span><strong>{formatLastLogin(member.lastLoginAt)}</strong></div>
          </div>

          <div className={styles.permissionPreview}>
            {permissionLabels.map(p=><span key={p.key} data-active={member.permissions.includes(p.key)}>{p.label}</span>)}
          </div>

          <div className={styles.cardActions}>
            <button onClick={()=>openEdit(member)}>Edit</button>
            <button onClick={()=>setResetTarget(member)}>Reset password</button>
            <button onClick={()=>setStaff(cur=>cur.map(x=>x.id===member.id?{...x,status:x.status==="ACTIVE"?"DISABLED":"ACTIVE"}:x))}>{member.status==="ACTIVE"?"Disable":"Enable"}</button>
            <button className={styles.dangerButton} disabled={member.role==="OWNER"} onClick={()=>setStaff(cur=>cur.filter(x=>x.id!==member.id))}>Delete</button>
          </div>
        </article>)}
      </section>
    </section>

    {editor && <div className={styles.backdrop}>
      <section className={styles.editor}>
        <header><div><span>{editor.mode==="create"?"New staff":"Edit staff"}</span><h2>{editor.name||"Untitled account"}</h2></div><button onClick={()=>setEditor(null)}>×</button></header>
        <div className={styles.editorBody}>
          <label><span>Name</span><input value={editor.name} onChange={e=>setEditor(cur=>cur?{...cur,name:e.target.value}:cur)} /></label>
          <label><span>Email</span><input type="email" value={editor.email} onChange={e=>setEditor(cur=>cur?{...cur,email:e.target.value}:cur)} /></label>
          <div className={styles.twoColumns}>
            <label><span>Role</span><select value={editor.role} onChange={e=>{const role=e.target.value as StaffRole;setEditor(cur=>cur?{...cur,role,permissions:[...rolePermissionDefaults[role]]}:cur)}}>{(Object.keys(roleLabels) as StaffRole[]).map(r=><option key={r} value={r}>{roleLabels[r]}</option>)}</select></label>
            <label><span>Status</span><select value={editor.status} onChange={e=>setEditor(cur=>cur?{...cur,status:e.target.value as "ACTIVE"|"DISABLED"}:cur)}><option value="ACTIVE">Active</option><option value="DISABLED">Disabled</option></select></label>
          </div>
          <section className={styles.permissionsPanel}>
            <div className={styles.permissionsHeader}><div><span>Permissions</span><strong>Allowed pages</strong></div><small>Changing role applies default permissions.</small></div>
            <div className={styles.permissionGrid}>{permissionLabels.map(p=><button key={p.key} data-active={editor.permissions.includes(p.key)} onClick={()=>togglePermission(p.key)}><span>{editor.permissions.includes(p.key)?"✓":"+"}</span><strong>{p.label}</strong></button>)}</div>
          </section>
        </div>
        <footer><button onClick={()=>setEditor(null)}>Cancel</button><button className={styles.primaryButton} onClick={save}>{editor.mode==="create"?"Create account":"Save changes"}</button></footer>
      </section>
    </div>}

    {resetTarget && <div className={styles.backdrop}><section className={styles.resetDialog}>
      <div className={styles.resetIcon}>↻</div><h2>Reset password</h2>
      <p>A real system would send a password reset link to <strong>{resetTarget.email}</strong>.</p>
      <div><button onClick={()=>setResetTarget(null)}>Cancel</button><button className={styles.primaryButton} onClick={()=>setResetTarget(null)}>Send reset link</button></div>
    </section></div>}
  </main>;
}

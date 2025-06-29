interface MenuItem {
  label: string;
  icon: string;
  iconHeader: string;
  to: string;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  to: string;
  icon?: string;
  iconHeader?: string;
}

const menus: MenuItem[] = [
  {
    "label": "Dashboard",
    "icon": "mage:dashboard",
    "iconHeader": "mage:dashboard-2-fill",
    "to": "/dashboard",
    "children": [
      {
        "label": "Analysis Overview",
        "to": "/dashboard/analytics"
      },
      {
        "label": "Revenue Overview",
        "to": "/dashboard/revenue"
      },
      {
        "label": "Cost",
        "to": "/dashboard/cost"
      },
      {
        "label": "Doctor Profile",
        "to": "/dashboard/doctor"
      }
    ]
  },
  {
    "label": "Chat",
    "icon": "fluent:chat-28-regular",
    "iconHeader": "fluent:chat-28-filled",
    "to": "/chat"
  },
  {
    "label": "Report",
    "icon": "mdi:report-box-outline",
    "iconHeader": "mdi:report-box",
    "to": "/report"
  },
  {
    "label": "Calendar",
    "icon": "octicon:calendar-24",
    "iconHeader": "mingcute:calendar-fill",
    "to": "/calendar"
  },
  {
    "label": "OPD",
    "icon": "carbon:document",
    "iconHeader": "ion:document-text-sharp",
    "to": "/opd"
  },
  {
    "label": "Manage",
    "icon": "material-symbols:folder-managed-outline",
    "iconHeader": "material-symbols:folder-managed",
    "to": "/manage"
  },
  {
    "label": "Settings",
    "icon": "ep:setting",
    "iconHeader": "material-symbols:settings-rounded",
    "to": "/setting"
  },
  {
    "label": "Log Out",
    "icon": "circum:logout",
    "iconHeader": "",
    "to": "/"
  }
];

export default menus;
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
    "label": "Calendar",
    "icon": "octicon:calendar-24",
    "iconHeader": "ant-design:calendar-filled",
    "to": "/calendar"
  },
  // {
  //   "label": "Chat",
  //   "icon": "fluent:chat-28-regular",
  //   "iconHeader": "fluent:chat-28-filled",
  //   "to": "/chat"
  // },
  {
    "label": "OPD",
    "icon": "carbon:document",
    "iconHeader": "ion:document-text-sharp",
    "to": "/opd"
  },
  {
    "label": "Settings",
    "icon": "ep:setting",
    "iconHeader": "material-symbols:settings-rounded",
    "to": "/manage"
  },
  {
    "label": "Log Out",
    "icon": "circum:logout",
    "iconHeader": "",
    "to": "/"
  }
];

export default menus;
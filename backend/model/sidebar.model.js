const sidebarTabsInMemory = [
  { id: "1", name: "Dashboard", icon: "LayoutGrid" },
  { id: "2", name: "Inventory", icon: "ClipboardList" },
  { id: "3", name: "Transactions", icon: "Clock" },
  { id: "4", name: "AI Intelligence", icon: "Sparkles", hasBadge: true },
  { id: "5", name: "System Settings", icon: "Settings" }
];

export default {
  async find() {
    return sidebarTabsInMemory;
  },

  async create(tabData) {
    const newTab = {
      id: `SB-${Math.floor(100000 + Math.random() * 900000)}`,
      name: tabData.name,
      icon: tabData.icon || "LayoutGrid",
      hasBadge: tabData.hasBadge || false,
      createdAt: new Date().toISOString()
    };

    sidebarTabsInMemory.push(newTab);
    console.log("Successfully saved sidebar tab! Total memory list:", sidebarTabsInMemory);
    return newTab;
  }
};
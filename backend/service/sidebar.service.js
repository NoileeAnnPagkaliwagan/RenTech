import sidebarModel from '../model/sidebar.model.js';

export default {
  
  async getSidebarTabs() {
    return await sidebarModel.find();
  },

  
  async createSidebarTab(tabData) {
    
    if (!tabData.name || tabData.name.trim() === "") {
      throw new Error('Invalid tab name or missing fields');
    }
    
    
    if (!tabData.icon || tabData.icon.trim() === "") {
      throw new Error('Invalid icon type');
    }

    return await sidebarModel.create(tabData);
  }
};
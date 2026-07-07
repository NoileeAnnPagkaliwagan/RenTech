import { describe, it, expect, vi } from 'vitest';
import sidebarService from '../../service/sidebar.service';
import sidebarModel from '../../model/sidebar.model';

vi.mock('../../model/sidebar.model', () => {
  return {
    default: {
      find: vi.fn(),
      create: vi.fn(),
    },
  };
});

describe('Sidebar Service', () => {

  describe('Get Sidebar Tabs', () => {
    it('should read a sidebar tab from the list', async () => {
      sidebarModel.find.mockResolvedValue([
        { name: 'Dashboard', icon: 'LayoutGrid' }
      ]);

      const result = await sidebarService.getSidebarTabs();
      
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Dashboard');
    });
  });

  describe('Create Sidebar Tab', () => {
    
    describe('Check input validation', () => {
      const validIcon = 'LayoutGrid';

      it('should throw an error if tab name is not provided', async () => {
        await expect(sidebarService.createSidebarTab({ icon: validIcon }))
          .rejects
          .toThrow(/Invalid tab name or missing fields/i);
      });

      it('should throw an error if tab name is empty spaces', async () => {
        await expect(sidebarService.createSidebarTab({ name: '   ', icon: validIcon }))
          .rejects
          .toThrow(/Invalid tab name or missing fields/i);
      });

      it('should throw an error if icon type is empty', async () => {
        await expect(sidebarService.createSidebarTab({ name: 'Inventory', icon: '' }))
          .rejects
          .toThrow(/Invalid icon type/i);
      });
    });

    describe('Successful creation', () => {
      it('should add a new sidebar tab successfully if all inputs are valid', async () => {
        const newTab = { 
          name: 'Inventory', 
          icon: 'ClipboardList',
          hasBadge: false
        };

        sidebarModel.create.mockResolvedValue(newTab);

        const result = await sidebarService.createSidebarTab(newTab);

        expect(result.name).toBe('Inventory');
        expect(result.icon).toBe('ClipboardList'); 
      });
    });

  });

});
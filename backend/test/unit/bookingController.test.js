import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockBookingService = vi.hoisted(() => ({
  getBookings: vi.fn(),
  createBooking: vi.fn(),
}));

vi.mock('../../service/booking.service.js', () => ({
  __esModule: true,
  ...mockBookingService,
  default: mockBookingService,
}));

import { getBookings, createBooking } from '../../controller/bookingController.js';

function mockRes() {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => {
    if (res.status.mock.calls.length === 0) {
      res.status(200);
    }
    return res;
  });
  return res;
}

describe('Booking controller (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBookings', () => {
    it('should return 200 and success status with bookings data list', async () => {
      const payload = {
        data: [{ id: 'BK-123456', item_name: 'Emerald Silk Evening Gown' }],
        error: null
      };
      mockBookingService.getBookings.mockResolvedValue(payload);
      const res = mockRes();

      await getBookings({}, res);

      expect(mockBookingService.getBookings.mock.calls.length).toBe(1);
      expect(res.status.mock.calls[0][0]).toBe(200);
      expect(res.json.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          status: 'success',
          message: 'Bookings retrieved successfully',
          count: 1,
          data: payload.data
        })
      );
    });

    it('should return 400 when service layer returns a query error', async () => {
      const payload = {
        data: null,
        error: new Error('Database query failed')
      };
      mockBookingService.getBookings.mockResolvedValue(payload);
      const res = mockRes();

      await getBookings({}, res);

      expect(mockBookingService.getBookings.mock.calls.length).toBe(1);
      expect(res.status.mock.calls[0][0]).toBe(400);
      expect(res.json.mock.calls[0][0]).toEqual({
        status: 'error',
        message: 'Database query failed'
      });
    });
  });

  describe('createBooking', () => {
    const validBody = {
      item_name: 'Emerald Silk Evening Gown',
      total_price: 4500,
      booking_type: 'Me',
      full_name: 'Bob',
      phone_number: '09998887777',
      rental_date: '2026-07-15',
      size_selected: 'Small (S)',
      payment_method: 'GCash'
    };

    it('should return successful creation payload structure', async () => {
      const payload = {
        data: [validBody],
        error: null
      };
      mockBookingService.createBooking.mockResolvedValue(payload);
      const res = mockRes();

      await createBooking({ body: validBody }, res);

      expect(mockBookingService.createBooking.mock.calls[0][0]).toBe(validBody);
      expect(res.status.mock.calls[0][0]).toBe(200);
      expect(res.json.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          status: 'success',
          message: 'Booking created successfully',
          data: validBody
        })
      );
    });

    it('should return 400 status if service layer returns a custom database/collision error', async () => {
      const payload = {
        data: null,
        error: new Error('The gown is already reserved for this date.')
      };
      mockBookingService.createBooking.mockResolvedValue(payload);
      const res = mockRes();

      await createBooking({ body: validBody }, res);

      expect(mockBookingService.createBooking.mock.calls[0][0]).toBe(validBody);
      expect(res.status.mock.calls[0][0]).toBe(400);
      expect(res.json.mock.calls[0][0]).toEqual({
        status: 'error',
        message: 'The gown is already reserved for this date.'
      });
    });

    it('should catch validation throws safely in the catch block', async () => {
      mockBookingService.createBooking.mockRejectedValue(new Error('Invalid phone number'));
      const res = mockRes();

      await createBooking({ body: validBody }, res);

      expect(mockBookingService.createBooking.mock.calls[0][0]).toBe(validBody);
      expect(res.status.mock.calls[0][0]).toBe(400);
      expect(res.json.mock.calls[0][0]).toEqual({
        status: 'error',
        message: 'Invalid phone number'
      });
    });
  });
});
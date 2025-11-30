import request from 'supertest';
import app from '../src/app';
import * as eventsService from '../src/services/eventsService';

describe('Admin Event Operations Service', () => {
  const testAdminId = 'admin-123';
  const eventDate = Date.now() + 86400000; // Tomorrow

  describe('POST /events - Create Event', () => {
    test('should create a new event', async () => {
      const res = await request(app).post('/events').send({
        name: 'Music Festival 2025',
        description: 'Annual music festival',
        eventDate,
        location: 'Central Park',
        totalCapacity: 5000,
        adminId: testAdminId,
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Music Festival 2025');
      expect(res.body.status).toBe('draft');
    });

    test('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/events').send({ name: 'Event' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /events/:eventId - Get Event', () => {
    test('should retrieve an event by ID', async () => {
      const event = eventsService.createEvent(
        'Test Event',
        'Description',
        eventDate,
        'Location',
        1000,
        testAdminId
      );
      const res = await request(app).get(`/events/${event.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(event.id);
      expect(res.body.name).toBe('Test Event');
    });

    test('should return 404 for non-existent event', async () => {
      const res = await request(app).get('/events/non-existent');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /events/admin/:adminId - Get Admin Events', () => {
    test('should retrieve all events for an admin', async () => {
      eventsService.createEvent('Event 1', 'Desc', eventDate, 'Loc1', 1000, testAdminId);
      eventsService.createEvent('Event 2', 'Desc', eventDate, 'Loc2', 2000, testAdminId);
      const res = await request(app).get(`/events/admin/${testAdminId}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    test('should return empty array for admin with no events', async () => {
      const res = await request(app).get('/events/admin/non-existent-admin');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('PUT /events/:eventId - Update Event', () => {
    test('should update event details', async () => {
      const event = eventsService.createEvent(
        'Test Event',
        'Description',
        eventDate,
        'Location',
        1000,
        testAdminId
      );
      const res = await request(app).put(`/events/${event.id}`).send({
        name: 'Updated Event Name',
        description: 'Updated description',
      });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Event Name');
      expect(res.body.description).toBe('Updated description');
    });

    test('should return 404 for non-existent event', async () => {
      const res = await request(app).put('/events/non-existent').send({ name: 'New' });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /events/:eventId/status - Update Event Status', () => {
    test('should update event status', async () => {
      const event = eventsService.createEvent(
        'Test',
        'Desc',
        eventDate,
        'Loc',
        1000,
        testAdminId
      );
      const res = await request(app).patch(`/events/${event.id}/status`).send({ status: 'active' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('active');
    });

    test('should return 400 if status is missing', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      const res = await request(app).patch(`/events/${event.id}/status`).send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /events/:eventId/ticket-sale - Record Ticket Sale', () => {
    test('should record a ticket sale', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      const res = await request(app)
        .post(`/events/${event.id}/ticket-sale`)
        .send({ amount: '50' });
      expect(res.status).toBe(200);
      expect(res.body.ticketsSold).toBe(1);
      expect(res.body.revenue).toBe('50');
    });

    test('should return 400 if amount is missing', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      const res = await request(app).post(`/events/${event.id}/ticket-sale`).send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /events/:eventId/stats - Get Event Statistics', () => {
    test('should retrieve event statistics', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      eventsService.recordTicketSale(event.id, '50');
      const res = await request(app).get(`/events/${event.id}/stats`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalTickets');
      expect(res.body).toHaveProperty('ticketsSold');
      expect(res.body.ticketsSold).toBe(1);
    });

    test('should return 404 for non-existent event stats', async () => {
      const res = await request(app).get('/events/non-existent/stats');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /events/:eventId/analytics - Get Event Analytics', () => {
    test('should retrieve event analytics', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      const res = await request(app).get(`/events/${event.id}/analytics`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('conversionFunnel');
      expect(res.body.conversionFunnel.pageViews).toBe(1000);
    });
  });

  describe('POST /events/:eventId/reports - Generate Report', () => {
    test('should generate an event report', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      const res = await request(app)
        .post(`/events/${event.id}/reports`)
        .send({
          reportType: 'sales',
          createdBy: testAdminId,
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.reportType).toBe('sales');
    });

    test('should return 400 if required fields are missing', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      const res = await request(app).post(`/events/${event.id}/reports`).send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /events/reports/:reportId - Get Report', () => {
    test('should retrieve a report by ID', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      const report = eventsService.generateReport(event.id, 'sales', testAdminId);
      const res = await request(app).get(`/events/reports/${report.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(report.id);
      expect(res.body.reportType).toBe('sales');
    });

    test('should return 404 for non-existent report', async () => {
      const res = await request(app).get('/events/reports/non-existent');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /events/:eventId/reports - Get Event Reports', () => {
    test('should retrieve all reports for an event', async () => {
      const event = eventsService.createEvent('Test', 'Desc', eventDate, 'Loc', 1000, testAdminId);
      eventsService.generateReport(event.id, 'sales', testAdminId);
      eventsService.generateReport(event.id, 'attendance', testAdminId);
      const res = await request(app).get(`/events/${event.id}/reports`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /health - Health Check', () => {
    test('should return service health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('admin-event-ops-service');
    });
  });
});

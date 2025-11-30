import { Router } from 'express';
import * as eventsController from '../controllers/eventsController';

const router = Router();

// Event CRUD
router.post('/', eventsController.createEvent);
router.get('/:eventId', eventsController.getEventHandler);
router.get('/admin/:adminId', eventsController.getAdminEvents);
router.put('/:eventId', eventsController.updateEventHandler);
router.patch('/:eventId/status', eventsController.updateEventStatus);

// Ticket and revenue tracking
router.post('/:eventId/ticket-sale', eventsController.recordTicketSale);

// Statistics and analytics
router.get('/:eventId/stats', eventsController.getEventStatsHandler);
router.get('/:eventId/analytics', eventsController.getEventAnalytics);

// Reporting
router.post('/:eventId/reports', eventsController.generateReportHandler);
router.get('/reports/:reportId', eventsController.getReportHandler);
router.get('/:eventId/reports', eventsController.getEventReports);

export default router;

import { Request, Response } from 'express';
import * as eventsService from '../services/eventsService';

export const createEvent = (req: Request, res: Response) => {
  try {
    const { name, description, eventDate, location, totalCapacity, adminId } = req.body;
    if (!name || !description || !eventDate || !location || !totalCapacity || !adminId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const event = eventsService.createEvent(name, description, eventDate, location, totalCapacity, adminId);
    res.status(201).json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventHandler = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = eventsService.getEvent(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminEvents = (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const adminEvents = eventsService.getAdminEvents(adminId);
    res.json(adminEvents);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEventHandler = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;
    const event = eventsService.updateEvent(eventId, updates);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEventStatus = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });
    const event = eventsService.updateEventStatus(eventId, status);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const recordTicketSale = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount is required' });
    const event = eventsService.recordTicketSale(eventId, amount);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventStatsHandler = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const stats = eventsService.getStats(eventId);
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventAnalytics = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const analytics = eventsService.getAnalytics(eventId);
    if (!analytics) return res.status(404).json({ error: 'Analytics not found' });
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const generateReportHandler = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { reportType, createdBy } = req.body;
    if (!reportType || !createdBy) return res.status(400).json({ error: 'reportType and createdBy are required' });
    const report = eventsService.generateReport(eventId, reportType, createdBy);
    res.status(201).json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportHandler = (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const report = eventsService.getReport(reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventReports = (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const eventReports = eventsService.getEventReports(eventId);
    res.json(eventReports);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

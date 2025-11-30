import { v4 as uuidv4 } from 'uuid';
import { Event, EventStats, Analytics, Report } from '../models/types';

const events: Event[] = [];
const eventStats: EventStats[] = [];
const analytics: Map<string, Analytics> = new Map();
const reports: Report[] = [];

export const createEvent = (
  name: string,
  description: string,
  eventDate: number,
  location: string,
  totalCapacity: number,
  adminId: string
): Event => {
  const event: Event = {
    id: uuidv4(),
    name,
    description,
    eventDate,
    location,
    totalCapacity,
    ticketsIssued: 0,
    ticketsSold: 0,
    revenue: '0',
    status: 'draft',
    adminId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  events.push(event);
  initializeStats(event.id);
  return event;
};

export const getEvent = (eventId: string): Event | undefined => {
  return events.find((e) => e.id === eventId);
};

export const getAdminEvents = (adminId: string): Event[] => {
  return events.filter((e) => e.adminId === adminId);
};

export const updateEvent = (eventId: string, updates: Partial<Event>): Event | undefined => {
  const event = getEvent(eventId);
  if (event) {
    Object.assign(event, updates);
    event.updatedAt = Date.now();
  }
  return event;
};

export const updateEventStatus = (eventId: string, status: Event['status']): Event | undefined => {
  return updateEvent(eventId, { status });
};

export const recordTicketSale = (eventId: string, amount: string): Event | undefined => {
  const event = getEvent(eventId);
  if (event) {
    event.ticketsSold += 1;
    const currentRevenue = parseFloat(event.revenue);
    event.revenue = (currentRevenue + parseFloat(amount)).toString();
    event.updatedAt = Date.now();
    updateStats(eventId);
  }
  return event;
};

export const initializeStats = (eventId: string): EventStats => {
  const stats: EventStats = {
    eventId,
    totalTickets: 0,
    ticketsSold: 0,
    ticketsUsed: 0,
    totalRevenue: '0',
    averageTicketPrice: '0',
    attendanceRate: 0,
    selloutRate: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  eventStats.push(stats);
  return stats;
};

export const getStats = (eventId: string): EventStats | undefined => {
  return eventStats.find((s) => s.eventId === eventId);
};

export const updateStats = (eventId: string): EventStats | undefined => {
  const event = getEvent(eventId);
  const stats = getStats(eventId);
  if (event && stats) {
    stats.totalTickets = event.totalCapacity;
    stats.ticketsSold = event.ticketsSold;
    stats.ticketsUsed = Math.floor(event.ticketsSold * 0.8); // Simulated 80% attendance
    stats.totalRevenue = event.revenue;
    stats.averageTicketPrice =
      event.ticketsSold > 0 ? (parseFloat(event.revenue) / event.ticketsSold).toFixed(2) : '0';
    stats.attendanceRate =
      event.ticketsSold > 0 ? (stats.ticketsUsed / event.ticketsSold) * 100 : 0;
    stats.selloutRate = (event.ticketsSold / event.totalCapacity) * 100;
    stats.updatedAt = Date.now();
  }
  return stats;
};

export const initializeAnalytics = (eventId: string): Analytics => {
  const analyticsData: Analytics = {
    eventId,
    hourlyRevenue: new Map(),
    userAcquisitionRate: 0,
    repeatCustomerRate: 0,
    topTicketTypes: [],
    conversionFunnel: {
      pageViews: 1000,
      addToCart: 300,
      checkoutInitiated: 150,
      completed: 100,
    },
  };
  analytics.set(eventId, analyticsData);
  return analyticsData;
};

export const getAnalytics = (eventId: string): Analytics | undefined => {
  if (!analytics.has(eventId)) {
    return initializeAnalytics(eventId);
  }
  return analytics.get(eventId);
};

export const generateReport = (
  eventId: string,
  reportType: Report['reportType'],
  createdBy: string
): Report => {
  const event = getEvent(eventId);
  const stats = getStats(eventId);
  const eventAnalytics = getAnalytics(eventId);

  const report: Report = {
    id: uuidv4(),
    eventId,
    reportType,
    generatedAt: Date.now(),
    period: {
      startDate: event?.createdAt || 0,
      endDate: Date.now(),
    },
    data: {
      event,
      stats,
      analytics: {
        userAcquisitionRate: eventAnalytics?.userAcquisitionRate,
        repeatCustomerRate: eventAnalytics?.repeatCustomerRate,
        conversionFunnel: eventAnalytics?.conversionFunnel,
      },
    },
    createdBy,
  };

  reports.push(report);
  return report;
};

export const getReport = (reportId: string): Report | undefined => {
  return reports.find((r) => r.id === reportId);
};

export const getEventReports = (eventId: string): Report[] => {
  return reports.filter((r) => r.eventId === eventId);
};

export const getAllEvents = (): Event[] => {
  return events;
};

export const getAllReports = (): Report[] => {
  return reports;
};

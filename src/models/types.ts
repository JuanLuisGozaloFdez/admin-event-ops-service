export interface Event {
  id: string;
  name: string;
  description: string;
  eventDate: number;
  location: string;
  totalCapacity: number;
  ticketsIssued: number;
  ticketsSold: number;
  revenue: string;
  status: 'draft' | 'active' | 'live' | 'ended' | 'cancelled';
  adminId: string;
  createdAt: number;
  updatedAt: number;
}

export interface EventStats {
  eventId: string;
  totalTickets: number;
  ticketsSold: number;
  ticketsUsed: number;
  totalRevenue: string;
  averageTicketPrice: string;
  attendanceRate: number;
  selloutRate: number;
  createdAt: number;
  updatedAt: number;
}

export interface Analytics {
  eventId: string;
  hourlyRevenue: Map<number, string>;
  userAcquisitionRate: number;
  repeatCustomerRate: number;
  topTicketTypes: Array<{ type: string; count: number }>;
  geographicDistribution?: Map<string, number>;
  deviceTypes?: Map<string, number>;
  conversionFunnel: {
    pageViews: number;
    addToCart: number;
    checkoutInitiated: number;
    completed: number;
  };
}

export interface Report {
  id: string;
  eventId: string;
  reportType: 'sales' | 'attendance' | 'revenue' | 'demographic' | 'performance';
  generatedAt: number;
  period: {
    startDate: number;
    endDate: number;
  };
  data: Record<string, any>;
  createdBy: string;
}

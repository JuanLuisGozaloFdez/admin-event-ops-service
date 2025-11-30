# Admin Event Operations Service

Microservice for event management, analytics, and comprehensive reporting in the NFT ticketing marketplace.

## Features

- **Event Management**: Create, update, and manage NFT ticketing events
- **Status Tracking**: Draft → Active → Live → Ended/Cancelled event lifecycle
- **Revenue Tracking**: Record ticket sales and calculate real-time revenue
- **Real-time Statistics**: Capacity management, sell-out rate, attendance tracking
- **Advanced Analytics**: Conversion funnel, user acquisition, repeat customer analysis
- **Comprehensive Reporting**: Sales, attendance, demographic, revenue, and performance reports
- **Admin Dashboard**: Multi-event administration with detailed insights

## Tech Stack

- **Node.js** 20 LTS
- **TypeScript** 5.2 (strict mode)
- **Express** 4.18
- **Jest** 29.6 (testing)
- **Supertest** 7.1 (HTTP testing)

## Setup

```bash
npm install
npm run dev   # Start development server
npm test      # Run test suite (16 tests passing)
npm run build # Compile TypeScript
```

## API Endpoints

### Event Management
- `POST /events` - Create a new event
- `GET /events/:eventId` - Retrieve event details
- `GET /events/admin/:adminId` - Get all events for an admin
- `PUT /events/:eventId` - Update event details
- `PATCH /events/:eventId/status` - Update event status

### Revenue and Ticket Tracking
- `POST /events/:eventId/ticket-sale` - Record a ticket sale

### Statistics and Analytics
- `GET /events/:eventId/stats` - Get event statistics (capacity, sales, attendance)
- `GET /events/:eventId/analytics` - Get advanced analytics (conversion funnel, user metrics)

### Reporting
- `POST /events/:eventId/reports` - Generate a report (sales, attendance, revenue, demographic, performance)
- `GET /events/reports/:reportId` - Retrieve a specific report
- `GET /events/:eventId/reports` - Get all reports for an event

### Health Check
- `GET /health` - Service health status

## Example Requests

### Create Event
```bash
curl -X POST http://localhost:3007/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Music Festival 2025",
    "description": "Annual music festival",
    "eventDate": 1704067200000,
    "location": "Central Park",
    "totalCapacity": 5000,
    "adminId": "admin-123"
  }'
```

### Update Event Status
```bash
curl -X PATCH http://localhost:3007/events/{eventId}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'
```

### Record Ticket Sale
```bash
curl -X POST http://localhost:3007/events/{eventId}/ticket-sale \
  -H "Content-Type: application/json" \
  -d '{"amount": "75"}'
```

### Generate Report
```bash
curl -X POST http://localhost:3007/events/{eventId}/reports \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "sales",
    "createdBy": "admin-123"
  }'
```

### Get Event Statistics
```bash
curl -X GET http://localhost:3007/events/{eventId}/stats
```

### Get Event Analytics
```bash
curl -X GET http://localhost:3007/events/{eventId}/analytics
```

## Data Models

### Event
```typescript
interface Event {
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
```

### EventStats
```typescript
interface EventStats {
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
```

### Analytics
```typescript
interface Analytics {
  eventId: string;
  hourlyRevenue: Map<number, string>;
  userAcquisitionRate: number;
  repeatCustomerRate: number;
  topTicketTypes: Array<{ type: string; count: number }>;
  conversionFunnel: {
    pageViews: number;
    addToCart: number;
    checkoutInitiated: number;
    completed: number;
  };
}
```

### Report
```typescript
interface Report {
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
```

## Testing

The service includes **16 comprehensive tests** covering:

✅ Event creation and retrieval
✅ Multi-event admin management
✅ Event updates and status transitions
✅ Ticket sale recording
✅ Revenue calculation
✅ Event statistics tracking
✅ Analytics and conversion funnel
✅ Report generation (multiple types)
✅ Report retrieval
✅ Error handling and validation
✅ Health check endpoint

Run tests with:
```bash
npm test
```

## Port

Service runs on **port 3007** by default.

## Environment Variables

None required for local development. Configure the following in production:
- `PORT` - Service port (default: 3007)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string for persistent storage
- `CACHE_URL` - Redis connection for analytics caching

## Integration

This service integrates with:
- **Ticketing Core Service** (port 3001) - For event and ticket information
- **Payments Orders Service** (port 3003) - For revenue and sales data
- **Check-in Validation Service** (port 3006) - For attendance tracking
- **API Gateway BFF** (port 3000) - For external admin portal access

## Event Lifecycle

1. **Draft**: Event created but not yet published
2. **Active**: Event available for ticket sales
3. **Live**: Event is currently happening (check-ins enabled)
4. **Ended**: Event has concluded
5. **Cancelled**: Event has been cancelled (refunds may apply)

## Analytics Metrics

- **Conversion Funnel**: Tracks user journey from page view to purchase completion
- **User Acquisition Rate**: New customers per time period
- **Repeat Customer Rate**: Percentage of returning customers
- **Attendance Rate**: Actual attendees vs. ticket holders
- **Sell-out Rate**: Percentage of capacity reached
- **Hourly Revenue**: Revenue distribution across event duration

## Reports

### Sales Report
- Total revenue
- Tickets sold by type
- Average ticket price
- Peak sales times
- Payment method breakdown

### Attendance Report
- Check-in count
- Attendance rate
- Peak entry times
- Geographic distribution (if available)
- Device types used

### Revenue Report
- Revenue by ticket type
- Revenue by time period
- Refunds and chargebacks
- Net revenue

### Demographic Report
- User location distribution
- Age groups
- First-time vs. repeat customers
- Customer segmentation

### Performance Report
- Marketing effectiveness
- Conversion metrics
- Customer satisfaction (if survey data available)
- Staff efficiency metrics

## Future Enhancements

- Real-time dashboard with live metrics
- Predictive analytics for demand forecasting
- Customizable report templates
- Scheduled automated reports via email
- Export to PDF, CSV, Excel
- Multi-currency support
- Dynamic pricing optimization
- Capacity alerts and notifications
- Staff management and scheduling
- Sponsor tracking and ROI analysis
- Merchandise sales integration
- VIP experience management

## License

MIT

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, TrendingUp, DollarSign, Building, Search, Bell } from 'lucide-react';

interface MarketEvent {
  id: string;
  type: 'earnings' | 'dividend' | 'economic' | 'ipo' | 'results' | 'meeting';
  title: string;
  description: string;
  date: string;
  time?: string;
  symbol?: string;
  company?: string;
  impact: 'high' | 'medium' | 'low';
  sector?: string;
  expectedValue?: string;
  previousValue?: string;
}

export const MarketCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events] = useState<MarketEvent[]>([
    {
      id: '1',
      type: 'earnings',
      title: 'TCS Q3 Results',
      description: 'Quarterly earnings announcement',
      date: '2024-01-22',
      time: '16:00',
      symbol: 'TCS',
      company: 'Tata Consultancy Services',
      impact: 'high',
      sector: 'IT'
    },
    {
      id: '2',
      type: 'dividend',
      title: 'HDFC Bank Dividend',
      description: 'Ex-dividend date for HDFC Bank',
      date: '2024-01-23',
      symbol: 'HDFCBANK',
      company: 'HDFC Bank',
      impact: 'medium',
      sector: 'Banking',
      expectedValue: '₹17 per share'
    },
    {
      id: '3',
      type: 'economic',
      title: 'RBI Policy Meeting',
      description: 'Reserve Bank of India monetary policy announcement',
      date: '2024-01-24',
      time: '10:00',
      impact: 'high',
      expectedValue: '6.5%',
      previousValue: '6.5%'
    },
    {
      id: '4',
      type: 'earnings',
      title: 'Infosys Q3 Results',
      description: 'Quarterly earnings and guidance update',
      date: '2024-01-25',
      time: '15:30',
      symbol: 'INFY',
      company: 'Infosys',
      impact: 'high',
      sector: 'IT'
    },
    {
      id: '5',
      type: 'ipo',
      title: 'ABC Corp IPO Opening',
      description: 'New IPO listing on stock exchange',
      date: '2024-01-26',
      time: '09:15',
      company: 'ABC Corporation',
      impact: 'medium',
      sector: 'Manufacturing'
    },
    {
      id: '6',
      type: 'economic',
      title: 'GDP Data Release',
      description: 'Q3 GDP growth data announcement',
      date: '2024-01-27',
      time: '12:00',
      impact: 'high',
      expectedValue: '6.8%',
      previousValue: '7.1%'
    }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [filterImpact, setFilterImpact] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getEventTypeIcon = (type: MarketEvent['type']) => {
    switch (type) {
      case 'earnings': return <TrendingUp className="h-4 w-4" />;
      case 'dividend': return <DollarSign className="h-4 w-4" />;
      case 'economic': return <Building className="h-4 w-4" />;
      case 'ipo': return <CalendarIcon className="h-4 w-4" />;
      case 'results': return <TrendingUp className="h-4 w-4" />;
      case 'meeting': return <Building className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: MarketEvent['type']) => {
    switch (type) {
      case 'earnings': return 'bg-blue-500';
      case 'dividend': return 'bg-green-500';
      case 'economic': return 'bg-purple-500';
      case 'ipo': return 'bg-orange-500';
      case 'results': return 'bg-cyan-500';
      case 'meeting': return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: MarketEvent['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesImpact = filterImpact === 'all' || event.impact === filterImpact;
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.symbol?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesImpact && matchesSearch;
  });

  const todayEvents = events.filter(event => 
    event.date === new Date().toISOString().split('T')[0]
  );

  const upcomingEvents = events.filter(event => 
    new Date(event.date) > new Date()
  ).slice(0, 5);

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Market Calendar
          </h1>
          <p className="text-muted-foreground">
            Track earnings, dividends, economic events, and important market dates
          </p>
        </div>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Set Alerts
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Earnings reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">5</div>
            <p className="text-xs text-muted-foreground">
              Major events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dividends</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">8</div>
            <p className="text-xs text-muted-foreground">
              Ex-dividend dates
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasEvents: events.map(event => new Date(event.date))
                    }}
                    modifiersStyles={{
                      hasEvents: { backgroundColor: 'hsl(var(--primary))', color: 'white' }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Events for {selectedDate?.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                      getEventsForDate(selectedDate).map((event) => (
                        <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            {getEventTypeIcon(event.type)}
                            <Badge className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            {event.company && (
                              <p className="text-sm text-muted-foreground">
                                {event.company} {event.symbol && `(${event.symbol})`}
                              </p>
                            )}
                            {event.time && (
                              <p className="text-sm font-medium">Time: {event.time}</p>
                            )}
                          </div>
                          <Badge className={getImpactColor(event.impact)}>
                            {event.impact}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No events scheduled for this date
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="earnings">Earnings</SelectItem>
                <SelectItem value="dividend">Dividend</SelectItem>
                <SelectItem value="economic">Economic</SelectItem>
                <SelectItem value="ipo">IPO</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterImpact} onValueChange={setFilterImpact}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center space-y-1">
                        <div className="text-lg font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getEventTypeIcon(event.type)}
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                          <Badge className={getImpactColor(event.impact)}>
                            {event.impact} impact
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-muted-foreground">{event.description}</p>
                        {event.company && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.company} {event.symbol && `(${event.symbol})`}
                          </p>
                        )}
                        {event.time && (
                          <p className="text-sm font-medium mt-1">
                            {event.time} IST
                          </p>
                        )}
                        {(event.expectedValue || event.previousValue) && (
                          <div className="mt-2 text-sm">
                            {event.expectedValue && (
                              <span className="text-blue-500">Expected: {event.expectedValue}</span>
                            )}
                            {event.expectedValue && event.previousValue && ' | '}
                            {event.previousValue && (
                              <span className="text-muted-foreground">Previous: {event.previousValue}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Set Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Market Events</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getEventTypeIcon(event.type)}
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          {event.time && (
                            <p className="text-sm font-medium">{event.time} IST</p>
                          )}
                        </div>
                      </div>
                      <Badge className={getImpactColor(event.impact)}>
                        {event.impact}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No events scheduled for today
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Next 5 important market events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getEventTypeIcon(event.type)}
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        {event.company && (
                          <p className="text-sm text-muted-foreground">
                            {event.company} {event.symbol && `(${event.symbol})`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getImpactColor(event.impact)}>
                        {event.impact}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
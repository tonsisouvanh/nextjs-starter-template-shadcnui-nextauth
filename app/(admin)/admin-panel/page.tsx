'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDown, ArrowRight, ArrowUp, Box, Clock, DollarSign, MapPin, Package, Truck, Users } from 'lucide-react';
import { useState } from 'react';
// import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from 'recharts';

// Placeholder data
const deliveryData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 350 },
  { name: 'Fri', value: 450 },
  { name: 'Sat', value: 200 },
  { name: 'Sun', value: 100 },
];

const orderStatusData = [
  { name: 'Pending', value: 30 },
  { name: 'In Transit', value: 45 },
  { name: 'Delivered', value: 20 },
  { name: 'Returned', value: 5 },
];

const recentActivity = [
  { id: 1, description: 'Order #1234 is out for delivery', timestamp: '2 minutes ago', icon: Truck },
  { id: 2, description: 'New customer registered', timestamp: '15 minutes ago', icon: Users },
  { id: 3, description: 'Order #5678 has been delivered', timestamp: '1 hour ago', icon: Package },
  { id: 4, description: 'Shipment delayed for Order #9012', timestamp: '3 hours ago', icon: Clock },
];

export default function DashboardPage() {
  const [mapView, setMapView] = useState('all');

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">+10.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">345</div>
                <p className="text-xs text-muted-foreground">+2.5% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">129</div>
                <p className="text-xs text-muted-foreground">+18.7% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Delivery Tracking Map</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                  {/* Placeholder for the map component */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-lg font-semibold text-gray-500">Interactive Map Placeholder</p>
                  </div>
                  {/* Map controls */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <Button
                      variant={mapView === 'all' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setMapView('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={mapView === 'active' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setMapView('active')}
                    >
                      Active
                    </Button>
                    <Button
                      variant={mapView === 'completed' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setMapView('completed')}
                    >
                      Completed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Order Status Summary</CardTitle>
                <CardDescription>Distribution of orders by current status</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    value: {
                      label: 'Orders',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderStatusData}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card> */}
          </div>
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on deliveries and orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          <activity.icon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <div className="ml-auto font-medium">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline">View All Activity</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Delivery times and customer satisfaction</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    value: {
                      label: 'Deliveries',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliveryData}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    <span>4% increase in efficiency</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                    <span>2% decrease in returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

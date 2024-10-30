'use client';

import React from 'react';
import OrderCard from '@/components/admin/order-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useOrder } from '@/hooks/useOrder';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

const OrderSearchApproval = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const { useGetOrder } = useOrder();
  const { data: orderData, isLoading } = useGetOrder(debouncedSearchTerm);
  const order = orderData?.data;

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Orders</CardTitle>
          <CardDescription>Enter an order ID to search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-md py-0 pl-10"
              />
            </div>
            {/* {isLoading ? (
              <ButtonLoading className="w-full sm:w-auto" />
            ) : (
              <Button onClick={handleSearch} className="w-full sm:w-auto">
                Search
              </Button>
            )} */}
          </div>
        </CardContent>
      </Card>
      <OrderCard order={order} loading={isLoading} setSearchTerm={setSearchTerm} />
    </>
  );
};

export default OrderSearchApproval;

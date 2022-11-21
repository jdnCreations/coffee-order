import { createContext, useCallback, useState } from 'react';

const OrdersProvider = ({ children }) => {
  const OrdersContext = createContext();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = useCallback(async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    setOrders(data);
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, fetchOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

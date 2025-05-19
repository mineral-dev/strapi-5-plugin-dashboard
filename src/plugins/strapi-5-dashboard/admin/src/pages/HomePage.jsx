import { Box, Button, Card, CardBody, CardContent, CardHeader, CardTitle, DatePicker, Field, Flex, Grid, Main, Typography } from '@strapi/design-system';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { useIntl } from 'react-intl';
import OrderItem from '../components/Order';
import money from '../utils/money';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);


const HomePage = () => {
  const { formatMessage } = useIntl();
  const [ startDate, setStartDate ] = useState(dayjs().subtract(7, 'day'))
  const [ endDate, setEndDate ] = useState(dayjs())
  const [ chart, setChart ] = useState(null)
  const [ sales, setSales ] = useState(0)
  const [ countOrder, setCountOrder ] = useState(0)
  const [ countPaidOrder, setCountPaidOrder ] = useState(0)
  const [ countPendingOrder, setCountPendingOrder ] = useState(0)
  const [ countExpiredOrder, setCountExpiredOrder ] = useState(0)
  const [ loading, setLoading ] = useState(false)
  const [ loadingOrders, setLoadingOrders ] = useState(false)
  const [ lastOrders, setLastOrders ] = useState([])

  const fetchApi = async (start, end) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/strapi-5-dashboard/chart?start=${start}&end=${end}`)
      const responseJson = await response.json()
      if(responseJson){
        setChart(responseJson.chart)
        setCountOrder(responseJson.orders)
        setCountPaidOrder(responseJson.orders_paid)
        setCountPendingOrder(responseJson.orders_pending)
        setCountExpiredOrder(responseJson.orders_expired)
        setSales(responseJson.sales)
        setLoading(false)
      }
    } catch (error) {
      console.log(error.message, " | err fetch api chart")
      setLoading(false)
    }
  }

  const fetchOrder = async () => {
    setLoadingOrders(true)
    try {
      const response = await fetch("/api/strapi-5-dashboard/orders")
      const result = await response.json()

      if(result){
        setLastOrders(result)
        setLoadingOrders(false)
      }
    } catch (error) {
      console.log(error.message, " | error get last order")
      setLoadingOrders(false)
    }
  }
  
  const handleStart = (value) => {
    setStartDate(dayjs(value))
  }

  const handleEnd = (value) => {
    setEndDate(dayjs(value))
  }

  const handleApply = useCallback(() => {
    fetchApi(startDate.toISOString(), endDate.toISOString())
  },[ startDate, endDate])

  const handleExport = useCallback(async () => {
    try {
      const response = await fetch("/api/strapi-5-dashboard/export-orders", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: startDate.toISOString(),
          end: endDate.toISOString()
        })
      })
      
      const result = await response.blob()
      if(result){
        const url = window.URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders.xlsx';
        a.click();
      }
    } catch (error) {
      console.log(error)
    }
  },[ startDate, endDate])

  useEffect(()=> {
    fetchApi(startDate.toISOString(), endDate.toISOString())
    fetchOrder()
  }, [])

  return (
    <Main>
      <Box direction="column" marginTop={7} marginLeft={5} marginRight={5} marginBottom={7}>
        <Typography variant="alpha">Dashboard</Typography>
        <Grid.Root marginTop={3} marginBottom gap={3}>
          <Grid.Item col={3}>
            <Card style={{ width: "100%"}}>
              <CardHeader>
                <CardTitle padding={2}>
                <Typography variant="delta">Sales</Typography>
                </CardTitle>
              </CardHeader>
              <CardBody style={{ alignItems: "center", justifyContent: "center"}}>
                <CardContent>
                  <Typography variant="delta">{money(sales)}</Typography>
                </CardContent>
              </CardBody>
            </Card>
          </Grid.Item>
          <Grid.Item col={3}>
            <Card style={{ width: "100%"}}>
              <CardHeader>
                <CardTitle padding={2}>
                <Typography variant="delta">Orders</Typography>
                </CardTitle>
              </CardHeader>
              <CardBody style={{ alignItems: "center", justifyContent: "center"}}>
                <CardContent>
                <Typography variant="delta">{countOrder}</Typography>
                </CardContent>
              </CardBody>
            </Card>
          </Grid.Item>
          <Grid.Item col={3} />
          <Grid.Item col={3}>
            <Box>
              <Flex gap={3} marginTop={2}>
                <Field.Root
                  id="start_date"
                >
                  <Field.Label>Date Start</Field.Label>
                  <DatePicker value={startDate} onChange={handleStart} id="start_date" />
                  <Field.Error />
                  <Field.Hint />
                </Field.Root>
                <Field.Root
                  id="end_date"
                >
                  <Field.Label>Date End</Field.Label>
                  <DatePicker value={endDate} onChange={handleEnd} id="end_date" />
                  <Field.Error />
                  <Field.Hint />
                </Field.Root>
              </Flex>
              <Flex gap={3} marginTop={2}>
                <Button onClick={handleExport} variant="secondary" fullWidth>Export Orders</Button>
                <Button onClick={handleApply}  fullWidth>Apply</Button>
              </Flex>
            </Box>
          </Grid.Item>
        </Grid.Root>
        <Grid.Root marginTop={5} marginBottom gap={3}>
          <Grid.Item alignItems={loading ? "center" : "start"} justifyContent={loading ? "center" : "flexStart"} direction="column" gap={5} col={9} background="neutral100">
            <Grid.Root gap={3} style={{ width: "100%"}}>
              <Grid.Item col={4}>
                <Card style={{ width: "100%"}}>
                  <CardHeader>
                    <CardTitle padding={2}>
                    <Typography variant="delta">Order Pending</Typography>
                    </CardTitle>
                  </CardHeader>
                  <CardBody style={{ alignItems: "center", justifyContent: "center"}}>
                    <CardContent>
                    <Typography variant="delta">{countPendingOrder}</Typography>
                    </CardContent>
                  </CardBody>
                </Card>
              </Grid.Item>
              <Grid.Item col={4}>
                <Card style={{ width: "100%"}}>
                  <CardHeader>
                    <CardTitle padding={2}>
                    <Typography variant="delta">Order Paid</Typography>
                    </CardTitle>
                  </CardHeader>
                  <CardBody style={{ alignItems: "center", justifyContent: "center"}}>
                    <CardContent>
                    <Typography variant="delta">{countPaidOrder}</Typography>
                    </CardContent>
                  </CardBody>
                </Card>
              </Grid.Item>
              <Grid.Item col={4}>
                <Card style={{ width: "100%"}}>
                  <CardHeader>
                    <CardTitle padding={2}>
                    <Typography variant="delta">Order Expired</Typography>
                    </CardTitle>
                  </CardHeader>
                  <CardBody style={{ alignItems: "center", justifyContent: "center"}}>
                    <CardContent>
                    <Typography variant="delta">{countExpiredOrder}</Typography>
                    </CardContent>
                  </CardBody>
                </Card>
              </Grid.Item>
            </Grid.Root>
            {
              loading &&
              <Button loading={loading} />
            }
            {
              (!loading && chart) &&
              <Chart type='bar' data={chart} />
            }
            {
              (!loading && !chart) &&
              <Typography>Error !</Typography>
            }
          </Grid.Item>
          <Grid.Item col={3} alignItems="start">
            <Card style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%"}}>
              <CardHeader>
                <CardTitle padding={2}>
                <Typography variant="delta">Last Orders</Typography>
                </CardTitle>
              </CardHeader>
              <CardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: loadingOrders ? 'center' : 'flex-start', gap: 5, overflowY: 'scroll'}}>
                <Flex direction="column" style={{ width: '100%', paddingLeft: 8, paddingRight: 8}}>
                  {
                    loadingOrders &&
                    <Button loading={loadingOrders} />
                  }
                  {
                    (lastOrders && lastOrders.length > 0 )&&
                    lastOrders.map((item, i)=> (
                      <OrderItem key={i} orderId={item.order_id} status={item.status} createdAt={item.createdAt} />
                    ))
                  }
                  {
                    (!lastOrders || lastOrders.length === 0) &&
                    <Typography variant="delta">Empty</Typography>
                  }
                </Flex>
              </CardContent>
            </Card>
          </Grid.Item>
        </Grid.Root>
      </Box>
    </Main>
  );
};

export { HomePage };

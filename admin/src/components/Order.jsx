import { Button, Card, CardBody, CardContent, Flex, Typography } from '@strapi/design-system';
import dayjs from 'dayjs';

export default function OrderItem({ orderId, createdAt, status }) {
   const getStatus = (data = 0) => {
      const data_status = {
         0: 'Pending',
         1: 'Paid',
         2: 'Shipped',
         3: 'Canceled',
         4: 'Expired',
         5: 'Canceled Admin',
         999: 'Need Verification'
      }
      return data_status[data]
   }

   return (
      <Flex margin={2} style={{ width: "100%"}}>
         <Card style={{ width: "100%"}}>
            <CardBody>
               <CardContent style={{ width: '100%'}}>
                  <Flex justifyContent="space-between">
                     <Typography variant="omega">{orderId}</Typography>
                     <Button variant="secondary">{getStatus(status)}</Button>
                  </Flex>
                  <Typography variant="pi">{dayjs(createdAt).format("DD MMM YYYY")}</Typography>
               </CardContent>
            </CardBody>
         </Card>
      </Flex>
   )
}
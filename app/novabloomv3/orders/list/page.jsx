import { Suspense } from 'react';

import OrdersList from '../uiControl/OrdersList';

import { InteprateOrdersEvent } from '../dataControl/OrdersRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Orders "//searchParams?.mosyTitle || "Orders";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Orders`,
    description: 'novabloomv3 Orders',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function OrdersMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <OrdersList  
                    
                     dataIn={{ parentUseEffectKey: "loadOrdersList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateOrdersEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
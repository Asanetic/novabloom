import { Suspense } from 'react';

import SubscriptionsList from '../uiControl/SubscriptionsList';

import { InteprateSubscriptionsEvent } from '../dataControl/SubscriptionsRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Subscriptions "//searchParams?.mosyTitle || "Subscriptions";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Subscriptions`,
    description: 'novabloomv3 Subscriptions',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function SubscriptionsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SubscriptionsList  
                    
                     dataIn={{ parentUseEffectKey: "loadSubscriptionsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateSubscriptionsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
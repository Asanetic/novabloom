import { Suspense } from 'react';

import PaymentsProfile from '../uiControl/PaymentsProfile';

import { IntepratePaymentsEvent } from '../dataControl/PaymentsRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Payments "//searchParams?.mosyTitle || "Payments";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Payments`,
    description: 'novabloomv3 Payments',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function PaymentsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <PaymentsProfile 
                    dataIn={{ parentUseEffectKey: "initPaymentsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: IntepratePaymentsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}
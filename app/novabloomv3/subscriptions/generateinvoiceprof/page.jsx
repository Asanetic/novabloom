import { Suspense } from 'react';

import SelectsubscriptiontoinvoiceProfile from '../uiControl/SelectsubscriptiontoinvoiceProfile';

import { InteprateSelectsubscriptiontoinvoiceEvent } from '../dataControl/SelectsubscriptiontoinvoiceRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Select subscription to invoice "//searchParams?.mosyTitle || "Select subscription to invoice";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Select subscription to invoice`,
    description: 'novabloomv3 Select subscription to invoice',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function SelectsubscriptiontoinvoiceMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <SelectsubscriptiontoinvoiceProfile 
                    dataIn={{ parentUseEffectKey: "initSelectsubscriptiontoinvoiceProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateSelectsubscriptiontoinvoiceEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}
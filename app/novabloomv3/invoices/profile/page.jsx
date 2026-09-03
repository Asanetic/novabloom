import { Suspense } from 'react';

import InvoicesProfile from '../uiControl/InvoicesProfile';

import { InteprateInvoicesEvent } from '../dataControl/InvoicesRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Invoices "//searchParams?.mosyTitle || "Invoices";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Invoices`,
    description: 'novabloomv3 Invoices',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function InvoicesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <InvoicesProfile 
                    dataIn={{ parentUseEffectKey: "initInvoicesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateInvoicesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}
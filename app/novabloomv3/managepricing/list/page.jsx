import { Suspense } from 'react';

import ManageassetpricingList from '../uiControl/ManageassetpricingList';

import { InteprateManageassetpricingEvent } from '../dataControl/ManageassetpricingRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Manage Asset Pricing "//searchParams?.mosyTitle || "Manage Asset Pricing";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Manage Asset Pricing`,
    description: 'novabloomv3 Manage Asset Pricing',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function ManageassetpricingMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <ManageassetpricingList  
                    
                     dataIn={{ parentUseEffectKey: "loadManageassetpricingList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateManageassetpricingEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
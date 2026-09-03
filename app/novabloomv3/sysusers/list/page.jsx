import { Suspense } from 'react';

import SystemusersList from '../uiControl/SystemusersList';

import { InteprateSystemusersEvent } from '../dataControl/SystemusersRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "System Users "//searchParams?.mosyTitle || "System Users";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `System Users`,
    description: 'novabloomv3 System Users',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function SystemusersMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SystemusersList  
                    
                     dataIn={{ parentUseEffectKey: "loadSystemusersList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateSystemusersEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
import { Suspense } from 'react';

import InactiveusersList from '../uiControl/InactiveusersList';

import { InteprateInactiveusersEvent } from '../dataControl/InactiveusersRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Inactive users "//searchParams?.mosyTitle || "Inactive users";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Inactive users`,
    description: 'novabloomv3 Inactive users',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function InactiveusersMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <InactiveusersList  
                    
                     dataIn={{ parentUseEffectKey: "loadInactiveusersList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateInactiveusersEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
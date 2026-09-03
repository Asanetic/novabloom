import { Suspense } from 'react';

import ActiveappusersList from '../uiControl/ActiveappusersList';

import { InteprateActiveappusersEvent } from '../dataControl/ActiveappusersRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Active app users "//searchParams?.mosyTitle || "Active app users";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Active app users`,
    description: 'novabloomv3 Active app users',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function ActiveappusersMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <ActiveappusersList  
                    
                     dataIn={{ parentUseEffectKey: "loadActiveappusersList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateActiveappusersEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
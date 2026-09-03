import { Suspense } from 'react';

import PlatformuserlistList from '../uiControl/PlatformuserlistList';

import { IntepratePlatformuserlistEvent } from '../dataControl/PlatformuserlistRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Platform user list "//searchParams?.mosyTitle || "Platform user list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Platform user list`,
    description: 'novabloomv3 Platform user list',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function PlatformuserlistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <PlatformuserlistList  
                    
                     dataIn={{ parentUseEffectKey: "loadPlatformuserlistList" }}
                       
                     dataOut={{
                       setChildDataOut: IntepratePlatformuserlistEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
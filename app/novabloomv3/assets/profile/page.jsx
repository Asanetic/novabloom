import { Suspense } from 'react';

import DigitalassetlistProfile from '../uiControl/DigitalassetlistProfile';

import { InteprateDigitalassetlistEvent } from '../dataControl/DigitalassetlistRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Digital Asset List "//searchParams?.mosyTitle || "Digital Asset List";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Digital Asset List`,
    description: 'novabloomv3 Digital Asset List',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function DigitalassetlistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <DigitalassetlistProfile 
                    dataIn={{ parentUseEffectKey: "initDigitalassetlistProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateDigitalassetlistEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}
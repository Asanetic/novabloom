import { Suspense } from 'react';

import SystemrolesProfile from '../uiControl/SystemrolesProfile';

import { InteprateSystemrolesEvent } from '../dataControl/SystemrolesRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "System Roles "//searchParams?.mosyTitle || "System Roles";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `System Roles`,
    description: 'novabloomv3 System Roles',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function SystemrolesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <SystemrolesProfile 
                    dataIn={{ parentUseEffectKey: "initSystemrolesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateSystemrolesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}
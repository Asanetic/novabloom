import { Suspense } from 'react';

import UserrolefunctionsList from '../uiControl/UserrolefunctionsList';

import { InteprateUserrolefunctionsEvent } from '../dataControl/UserrolefunctionsRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "User Role Functions "//searchParams?.mosyTitle || "User Role Functions";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `User Role Functions`,
    description: 'novabloomv3 User Role Functions',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function UserrolefunctionsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <UserrolefunctionsList  
                    
                     dataIn={{ parentUseEffectKey: "loadUserrolefunctionsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateUserrolefunctionsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
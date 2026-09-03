import { Suspense } from 'react';

import SentmessagesList from '../uiControl/SentmessagesList';

import { InteprateSentmessagesEvent } from '../dataControl/SentmessagesRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Sent Messages "//searchParams?.mosyTitle || "Sent Messages";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Sent Messages`,
    description: 'novabloomv3 Sent Messages',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function SentmessagesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SentmessagesList  
                    
                     dataIn={{ parentUseEffectKey: "loadSentmessagesList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateSentmessagesEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
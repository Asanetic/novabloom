import { Suspense } from 'react';

import AssetpricingList from '../uiControl/AssetpricingList';

import { InteprateAssetpricingEvent } from '../dataControl/AssetpricingRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Asset pricing "//searchParams?.mosyTitle || "Asset pricing";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Asset pricing`,
    description: 'novabloomv3 Asset pricing',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function AssetpricingMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <AssetpricingList  
                    
                     dataIn={{ parentUseEffectKey: "loadAssetpricingList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateAssetpricingEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }
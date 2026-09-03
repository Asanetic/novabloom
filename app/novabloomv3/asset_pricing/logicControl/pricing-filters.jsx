/**
 * ════════════════════════════════════════════════════════════════
 * FILE: pricing-filters.jsx
 * PURPOSE: Frontend logic functions for pricing-filters
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyLiveSearch } from "../../UiControl/customUI";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";

const apiRoutes = getApiRoutes();

// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByPricingType
/* 
Function flow notes
 
how filterByPricingType works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByPricingType() {
    // Implement filterByPricingType logic here
    alert("filterByPricingType");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByAsset
/* 
Function flow notes
 
how filterByAsset works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByAsset({router, stateSetters,path=`../asset_pricing/list`}){
    // Implement filterByAsset logic here
    //alert("filterByAsset");

        MosyLiveSearch({
            api:apiRoutes.digitalassetlist.base,
            searchColumn:"asset_name",
            tableName:"assets",
            label:"Search platforms",
            displayField:"asset_name",
            valueField:"record_id",
            actionName:"mosyfilter",
            actionData:{inputSignature:"AssetPricingAssetSearch", parentTable:"asset_pricing",router: router, qstr:`assetId={{record_id}}`, stateSetters:stateSetters, path}
            
        })
}


/**
 * ════════════════════════════════════════════════════════════════
 * FILE: subscription-filters.jsx
 * PURPOSE: Frontend logic functions for subscription-filters
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { filterDataByDate } from "../../UiControl/componentControl";
import { MosyLiveSearch } from "../../UiControl/customUI";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import { useRouter } from "next/navigation";

const apiRoutes = getApiRoutes();

// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByBillingDate
/* 
Function flow notes
 
how filterByBillingDate works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByBillingDate(filterfile, title, table, column) {
    // Implement filterByBillingDate logic here

      filterDataByDate({
       label: title,
       inputType:"date",
       callBack: ({startDate, endDate}) => {
        window.location=`${filterfile}?${table}_mosyfilter=${btoa(`${column}_start=${btoa(startDate)}&${column}_end=${btoa(endDate)}`)}`   
       },
   }); 
   
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByStats
/* 
Function flow notes
 
how filterByStats works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByStats({router, stateSetters,path=`../subscriptions/list`}) {
    // Implement filterByStats logic here
    //alert("filterByStats");
    MosyLiveSearch({
        api:apiRoutes.subscriptions.base,
        searchColumn:"status",
        tableName:"subscriptions",
        label:"Search Subscriptions",
        displayField:"status",
        valueField:"status",
        actionName:"mosyfilter",
        actionData:{router: router, qstr:`status={{status}}`, stateSetters:stateSetters, path,mosyFilterOptions:{groupBy:btoa("status")}}
    })
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByUser
/* 
Function flow notes
 
how filterByUser works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByUser({router, stateSetters,path=`../subscriptions/list`}) {
    // Implement filterByUser logic here
    //alert("filterByUser");
    MosyLiveSearch({
        api:apiRoutes.platformuserlist.base,
        searchColumn:"full_name",
        tableName:"app_users",
        label:"Search users",
        displayField:"full_name",
        valueField:"record_id",
        actionName:"mosyfilter",
        actionData:{inputSignature:"SubscriptionuserSearch", parentTable:"subscriptions",router: router, qstr:`accountId={{record_id}}`, stateSetters:stateSetters, path}
    })
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByAsset
/* 
Function flow notes
 
how filterByAsset works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByAsset({router, stateSetters,path=`../subscriptions/list`}) {
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
        actionData:{inputSignature:"SubscriptionAssetSearch", parentTable:"subscriptions",router: router, qstr:`assetId={{record_id}}`, stateSetters:stateSetters, path}
        
    })

}


import { filterDataByDate } from "../../UiControl/componentControl";
import { MosyLiveSearch } from "../../UiControl/customUI";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import { useRouter } from "next/navigation";

const apiRoutes = getApiRoutes();


/**
 * ════════════════════════════════════════════════════════════════
 * FILE: invoices-filters.jsx
 * PURPOSE: Frontend logic functions for invoices-filters
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByPaymentDate
/* 
Function flow notes
 
how filterByPaymentDate works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByPaymentDate(filterfile, title, table, column){
    // Implement filterByPaymentDate logic here
    filterDataByDate({
        label: title,
        inputType:"date",
        callBack: ({startDate, endDate}) => {

           window.location=`${filterfile}?${table}_mosyfilter=${btoa(`${column}_start=${btoa(startDate)}&${column}_end=${btoa(endDate)}`)}`   

        },
    });
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterPaymentSubs
/* 
Function flow notes
 
how filterPaymentSubs works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterPaymentSubs({router, stateSetters}) {
    // Implement filterbyAsset logic here
     //alert("filterbyAsset");

    MosyLiveSearch({
        api:apiRoutes.subscriptions.base,
        searchColumn:"subscription_name",
        tableName:"subscriptions",
        label:"Search subscriptions",
        displayField:"subscription_name",
        valueField:"record_id",
        actionName:"mosyfilter",
        actionData:{inputSignature:"searchinvoiceSubs", mosyFilterOptions:{groupBy:btoa("subscription_id")}, parentTable:"invoices",router: router, qstr:` subscriptionId={{record_id}}`, stateSetters:stateSetters, path:`../invoices/list`}
        
    })
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterbyAsset
/* 
Function flow notes
 
how filterbyAsset works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterbyAsset({router, stateSetters}) {
    // Implement filterbyAsset logic here
     //alert("filterbyAsset");

    MosyLiveSearch({
        api:apiRoutes.digitalassetlist.base,
        searchColumn:"asset_name",
        tableName:"assets",
        label:"Search platforms",
        displayField:"asset_name",
        valueField:"record_id",
        actionName:"mosyfilter",
        actionData:{inputSignature:"assetinvoicesSearch", parentTable:"invoices",router: router, qstr:`assetId={{record_id}}`, stateSetters:stateSetters, path:`../invoices/list`}
        
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
export function filterByUser({router, stateSetters}) {
    // Implement filterByUser logic here
    MosyLiveSearch({
        api:getApiRoutes().platformuserlist.base,
        searchColumn:"full_name",
        tableName:"app_users",
        label:"Search users",
        displayField:"full_name",
        valueField:"record_id",
        actionName:"mosyfilter",
        actionData:{inputSignature:"invoicesuserSearch", parentTable:"invoices",router: router, qstr:`clientId={{record_id}}`, stateSetters:stateSetters, path:`../invoices/list`}
    })

}


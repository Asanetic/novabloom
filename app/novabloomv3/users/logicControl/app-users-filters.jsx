/**
 * ════════════════════════════════════════════════════════════════
 * FILE: app-users-filters.jsx
 * PURPOSE: Frontend logic functions for app-users-filters
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { filterDataByDate } from "../../UiControl/componentControl";
import { MosyLiveSearch } from "../../UiControl/customUI";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";

const apiRoutes = getApiRoutes();

// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByRegDate
/* 
Function flow notes
 
how filterByRegDate works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByRegDate(filterfile, title, table, column) {
    // Implement filterByRegDate logic here
   // alert("filterByRegDate");

   filterDataByDate({
    label: title,
    inputType:"datetime-local",
    callBack: ({startDate, endDate}) => {
        window.location=`${filterfile}?${table}_mosyfilter=${btoa(`${column}_start=${btoa(startDate)}&${column}_end=${btoa(endDate)}`)}`   
    },
}); 
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: filterByAccStatus
/* 
Function flow notes
 
how filterByAccStatus works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function filterByAccStatus({router, stateSetters,path=`../users/apilist`}) {
    // Implement filterByAccStatus logic here
    //alert("filterByAccStatus");
    MosyLiveSearch({
        api:apiRoutes.apiuserlist.base,
        searchColumn:"account_status",
        tableName:"app_users",
        label:"Search Status",
        displayField:"account_status",
        valueField:"account_status",
        actionName:"mosyfilter",
        actionData:{router: router, mosyFilterOptions:{groupBy:btoa(`accountStatus`)}, qstr:`accountStatus={{account_status}}`, stateSetters:stateSetters, path}
    })

}


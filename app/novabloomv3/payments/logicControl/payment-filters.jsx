/**
 * ════════════════════════════════════════════════════════════════
 * FILE: payment-filters.jsx
 * PURPOSE: Frontend logic functions for payment-filters
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

 import { MosyCard } from "../../../components/MosyCard";
 import { MosyNotify } from "../../../MosyUtils/ActionModals";
 import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
 import { InteprateInvoicesEvent } from "../../invoices/dataControl/InvoicesRequestHandler";
 import InvoicesList from "../../invoices/uiControl/InvoicesList";
 import { filterDataByDate } from "../../UiControl/componentControl";
 import { MosyLiveSearch } from "../../UiControl/customUI";
 
 const apiRoutes = getApiRoutes();
 
 // ════════════════════════════════════════════════════════════════
 // FUNCTION: filterByPaymentDate
 /* 
 Function flow notes
  
 how filterByPaymentDate works 
 Steps
 */
 // ════════════════════════════════════════════════════════════════
 export function filterByPaymentDate(filterfile, title, table, column) {
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
         actionData:{inputSignature:"paymentsuserSearch", parentTable:"payments",router: router, qstr:`accountId={{record_id}}`, stateSetters:stateSetters, path:`../payments/list`}
     })
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
         actionData:{inputSignature:"searchpaymentSubs", parentTable:"payments",router: router, qstr:`contextId={{record_id}}`, stateSetters:stateSetters, path:`../payments/list`}
         
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
         actionData:{inputSignature:"assetpaymentSearch", parentTable:"payments",router: router, qstr:`appId={{record_id}}`, stateSetters:stateSetters, path:`../payments/list`}
         
     })
      
 }
 
 
 // ════════════════════════════════════════════════════════════════
 // FUNCTION: viewInvoice
 /* 
 Function flow notes
  
 how viewInvoice works 
 Steps
 */
 // ════════════════════════════════════════════════════════════════
 export function viewInvoice(invoice_id) {
     // Implement viewInvoice logic here
      if(invoice_id=="")
      {
         MosyNotify({ id: "topmost", message: "No invoice attached to this payment", iconColor:"text-warning", icon: "info-circle", addTimer: false });
          return
      }
             MosyCard(`Invoice profile`,   
                 <InvoicesList 
                     dataOut={{setChildDataOut: InteprateInvoicesEvent}} 
                     dataIn={{customProfilePath: "../invoices/profile",
                         showDataControlSections: false,
                         customQueryStr:{NodeId: btoa(invoice_id),NodeId_not: btoa("")}
                     }}/>, 
                 true, "modal4","mosycard_medium")  
 }
 
 
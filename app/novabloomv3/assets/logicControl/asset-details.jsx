/**
 * ════════════════════════════════════════════════════════════════
 * FILE: asset-details.jsx
 * PURPOSE: Frontend logic functions for asset-details
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import { InteprateManageassetpricingEvent } from "../../managepricing/dataControl/ManageassetpricingRequestHandler";
import ManageassetpricingList from "../../managepricing/uiControl/ManageassetpricingList";
import { IntepratePaymentsEvent } from "../../payments/dataControl/PaymentsRequestHandler";
import PaymentsList from "../../payments/uiControl/PaymentsList";
import { InteprateSubscriptionsEvent } from "../../subscriptions/dataControl/SubscriptionsRequestHandler";
import SubscriptionsList from "../../subscriptions/uiControl/SubscriptionsList";


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewAssetDetails
/* 
Function flow notes
 
how viewAssetDetails works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewAssetDetails() {
    // Implement viewAssetDetails logic here
    alert("viewAssetDetails");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewPricingModels
/* 
Function flow notes
 
how viewPricingModels works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewPricingModels(assetid) {
    // Implement viewPricingModels logic here
    //alert("viewPricingModels");
        MosyCard(`Asset Pricing models`,   
        <ManageassetpricingList 
            dataOut={{setChildDataOut: InteprateManageassetpricingEvent}} 
            dataIn={{customProfilePath: "../asset_pricing/profile",
                showDataControlSections: false,
                customQueryStr: {assetId:btoa(assetid)}
            }}/>, 
        true, "modal4","mosycard_medium")  
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewAssetSubscriptions
/* 
Function flow notes
 
how viewAssetSubscriptions works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewAssetSubscriptions(assetid) {
    // Implement viewAssetSubscriptions logic here
    MosyCard(`Subscriptions`,   
        <SubscriptionsList 
            dataOut={{setChildDataOut: InteprateSubscriptionsEvent}} 
            dataIn={{customProfilePath: "../subscriptions/profile",
                showDataControlSections: false,
                customQueryStr: {assetId:btoa(assetid)}            
            }}/>, 
        true, "modal4","mosycard_medium")  
    
    }


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewAssetOrders
/* 
Function flow notes
 
how viewAssetOrders works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewAssetOrders() {
    // Implement viewAssetOrders logic here
    alert("viewAssetOrders");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewAssetPayments
/* 
Function flow notes
 
how viewAssetPayments works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewAssetPayments(assetId) {
    // Implement viewAssetPayments logic here
    //alert("viewAssetPayments");

    MosyCard(`Payments history`,   
        <PaymentsList 
            dataOut={{setChildDataOut: IntepratePaymentsEvent}} 
            dataIn={{customProfilePath: "../payments/profile",
                showDataControlSections: false,
                customQueryStr: {appId:btoa(assetId)}}}
                />, 
        true, "modal4","mosycard_medium")      
}


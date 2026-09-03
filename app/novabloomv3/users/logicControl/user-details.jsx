/**
 * ════════════════════════════════════════════════════════════════
 * FILE: user-details.jsx
 * PURPOSE: Frontend logic functions for user-details
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import SubscriptionsList from "../../subscriptions/uiControl/SubscriptionsList";
import { InteprateSubscriptionsEvent } from "../../subscriptions/dataControl/SubscriptionsRequestHandler";
import PaymentsList from "../../payments/uiControl/PaymentsList";
import { IntepratePaymentsEvent } from "../../payments/dataControl/PaymentsRequestHandler";


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewUserSubscriptions
/* 
Function flow notes
 
how viewUserSubscriptions works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewUserSubscriptions(userID) {
    // Implement viewUserSubscriptions logic here
    //alert("viewUserSubscriptions");
    // const {
    //     customQueryStr = "",
    //     customProfilePath="../subscriptions/profile",
    //     showDataControlSections = true,
    //     parentUseEffectKey = "",
    //     parentStateSetters=null,
    //   } = dataIn;

      //outgoing data to parent
    //   const {
    //     setChildDataOut = () => {},
    //     setChildDataOutSignature = () => {},
    //   } = dataOut;

    
        MosyCard(`Subscription history`,  
             <SubscriptionsList 
             dataOut={{setChildDataOut: InteprateSubscriptionsEvent}} 
             dataIn={{customProfilePath: "../subscriptions/profile",
                showDataControlSections: 
                false,
                customQueryStr: {accountId:btoa(userID)}}}/>, 
                true, "modal4","mosycard_medium")  
    
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewUserOrders
/* 
Function flow notes
 
how viewUserOrders works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewUserOrders() {
    // Implement viewUserOrders logic here
    alert("viewUserOrders");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewUserPayments
/* 
Function flow notes
 
how viewUserPayments works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewUserPayments(userID) {
    // Implement viewUserPayments logic here
    MosyCard(`Payments history`,   
    <PaymentsList 
        dataOut={{setChildDataOut: IntepratePaymentsEvent}} 
        dataIn={{customProfilePath: "../payments/profile",
            showDataControlSections: false,
            customQueryStr: {accountId:btoa(userID)}}}
            />, 
    true, "modal4","mosycard_medium")  
}


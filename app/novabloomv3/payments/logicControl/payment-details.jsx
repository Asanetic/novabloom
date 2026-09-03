/**
 * ════════════════════════════════════════════════════════════════
 * FILE: payment-details.jsx
 * PURPOSE: Frontend logic functions for payment-details
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import { InteprateSubscriptionsEvent } from "../../subscriptions/dataControl/SubscriptionsRequestHandler";
import SubscriptionsList from "../../subscriptions/uiControl/SubscriptionsList";


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewPaymentDetails
/* 
Function flow notes
 
how viewPaymentDetails works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewPaymentDetails() {
    // Implement viewPaymentDetails logic here
    alert("viewPaymentDetails");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewCustomer
/* 
Function flow notes
 
how viewCustomer works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewCustomer() {
    // Implement viewCustomer logic here
    alert("viewCustomer");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewPaymentContext
/* 
Function flow notes
 
how viewPaymentContext works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewPaymentContext() {
    // Implement viewPaymentContext logic here
    alert("viewPaymentContext");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewSubscription
/* 
Function flow notes
 
how viewSubscription works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewSubscription(subscriptionid) {
    // Implement viewSubscription logic here
        const subid = subscriptionid;    
    MosyCard(`Subscriptions detail`,   
        <SubscriptionsList
            dataOut={{setChildDataOut: InteprateSubscriptionsEvent}} 
            dataIn={{customProfilePath: "../subscriptions/profile",
                showDataControlSections: false,
                customQueryStr: {NodeId: btoa(subid)}
            }}/>, 
        true, "modal4","mosycard_medium")  
}


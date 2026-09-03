/**
 * ════════════════════════════════════════════════════════════════
 * FILE: subscription-details.jsx
 * PURPOSE: Frontend logic functions for subscription-details
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import { InteprateInvoicesEvent } from "../../invoices/dataControl/InvoicesRequestHandler";
import InvoicesList from "../../invoices/uiControl/InvoicesList";
import { IntepratePaymentsEvent } from "../../payments/dataControl/PaymentsRequestHandler";
import PaymentsList from "../../payments/uiControl/PaymentsList";
import SubscriptionsList from "../uiControl/SubscriptionsList";


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewSubscriptionDetails
/* 
Function flow notes
 
how viewSubscriptionDetails works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewSubscriptionDetails() {
    // Implement viewSubscriptionDetails logic here
    //alert("viewSubscriptionDetails");


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
// FUNCTION: viewSubscriptionPayments
/* 
Function flow notes
 
how viewSubscriptionPayments works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewSubscription(subscriptionid) {

    const subid = subscriptionid;
    if (!subid) return;

    MosyCard(
        `Subscription`,
        <div className="col-md-12 p-0">
            <div className="col-md-12 p-0 mb-3">
                <SubscriptionsList
                    dataIn={{
                        customProfilePath: "../subscriptions/profile",
                        showDataControlSections: false,
                        customQueryStr: {NodeId: btoa(subid)},
                        parentUseEffectKey: `loadSubscriptionsList_${subid}`,
                    }}
                />
            </div>

            <div className="col-md-12 p-0">
                <PaymentsList
                    dataOut={{ setChildDataOut: IntepratePaymentsEvent }}
                    dataIn={{
                        customProfilePath: "../payments/profile",
                        showDataControlSections: false,
                        customQueryStr: btoa(`where context_id='${subid}'`),
                    }}
                />
            </div>
        </div>,
        true,
        "modal5",
        "mosycard_wide"
    );
}

export function viewSubscriptionPayments(subid) {
    // Implement viewSubscriptionPayments logic here
    //alert("viewSubscriptionPayments");

    MosyCard(`Subscriptions payments`,   
        <PaymentsList 
            dataOut={{setChildDataOut: IntepratePaymentsEvent}} 
            dataIn={{customProfilePath: "../payments/profile",
                showDataControlSections: false,
                customQueryStr: {contextId:btoa(subid)}}}
                />, 
        true, "modal4","mosycard_medium")  
}

// ════════════════════════════════════════════════════════════════
// FUNCTION: viewSubscriptionInvoices
/* 
Function flow notes
 
how viewSubscriptionInvoices works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewSubscriptionInvoices(subid) {
    // Implement viewSubscriptionInvoices logic here
    //alert("viewSubscriptionInvoices");
    MosyCard(`Subscriptions invoices`,   
        <InvoicesList 
            dataOut={{setChildDataOut: InteprateInvoicesEvent}} 
            dataIn={{customProfilePath: "../invoices/profile",
                showDataControlSections: false,
                customQueryStr: {subscriptionId:btoa(subid)}
            }}/>, 
        true, "modal4","mosycard_medium") 
}


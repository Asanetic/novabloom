/**
 * ════════════════════════════════════════════════════════════════
 * FILE: invoice-details.jsx
 * PURPOSE: Frontend logic functions for invoice-details
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import { InteprateInvoicesEvent } from "../../invoices/dataControl/InvoicesRequestHandler";
import InvoicesList from "../../invoices/uiControl/InvoicesList";


// ════════════════════════════════════════════════════════════════
// FUNCTION: subInvoiceHistory
/* 
Function flow notes
 
how subInvoiceHistory works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function subInvoiceHistory(subid) {
    // Implement subInvoiceHistory logic here
    //alert("subInvoiceHistory");
    MosyCard(`Invoice history`,   
        <InvoicesList
            dataOut={{setChildDataOut: InteprateInvoicesEvent}} 
            dataIn={{customProfilePath: "../invoices/profile",
                showDataControlSections: false,
                customQueryStr: {subscriptionId:btoa(subid)}
            }}/>, 
        true, "modal4","mosycard_wide")  

}


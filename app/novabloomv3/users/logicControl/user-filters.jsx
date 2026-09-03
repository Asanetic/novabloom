/**
 * ════════════════════════════════════════════════════════════════
 * FILE: user-filters.jsx
 * PURPOSE: Frontend logic functions for user-filters
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import SubscriptionsList from "../../subscriptions/uiControl/SubscriptionsList";


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewUserSubscription
/* 
Function flow notes
 
how viewUserSubscription works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewUserSubscription() {
    // Implement viewUserSubscription logic here
    //alert("viewUserSubscription");
    MosyCard("",   <SubscriptionsList/>)
}


/**
 * ════════════════════════════════════════════════════════════════
 * FILE: user-addsubscription.jsx
 * PURPOSE: Frontend logic functions for user-addsubscription
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import SubscriptionsProfile from "../../subscriptions/uiControl/SubscriptionsProfile";


// ════════════════════════════════════════════════════════════════
// FUNCTION: addUserSubscription
/* 
Function flow notes
 
how addUserSubscription works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function addUserSubscription(userData) {
    // Implement addUserSubscription logic here
    //alert("addUserSubscription herew");

    MosyCard("", <SubscriptionsProfile 
        dataIn={{
            showNavigationIsle:false,
            customProfileData: {
            account_id:userData?.record_id,
         _app_users_full_name_account_id:userData?.full_name}}}/>, false, "modal4", "mosycard_wide");
}


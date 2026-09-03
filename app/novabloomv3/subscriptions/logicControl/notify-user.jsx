/**
 * ════════════════════════════════════════════════════════════════
 * FILE: notify-user.jsx
 * PURPOSE: Frontend logic functions for notify-user
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { senduserMessage } from "../../users/logicControl/user-notify";


// ════════════════════════════════════════════════════════════════
// FUNCTION: notifyUser
/* 
Function flow notes
 
how notifyUser works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function notifyUser(user_id, username) {
    // Implement notifyUser logic here
    //alert("notifyUser");

    senduserMessage({userRecordId:user_id, username : username})
}


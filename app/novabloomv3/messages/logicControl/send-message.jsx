/**
 * ════════════════════════════════════════════════════════════════
 * FILE: send-message.jsx
 * PURPOSE: Frontend logic functions for send-message
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { senduserMessage } from "../../users/logicControl/user-notify";


// ════════════════════════════════════════════════════════════════
// FUNCTION: sendMessage
/* 
Function flow notes
 
how sendMessage works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function sendMessage(user_id) {
    // Implement sendMessage logic here
    //alert("sendMessage");

    const subject = document.getElementById("txt_email_subject")?.value?.trim();
    const message = document.getElementById("txt_message_body")?.value?.trim();

    senduserMessage({userRecordId:user_id, subject : subject, message: message});

}


/**
 * FILE: user-notify.jsx
 */

/**
 * ════════════════════════════════════════════════════════════════
 * FILE: user-notify.jsx
 * PURPOSE: Frontend logic functions for user-notify
 *
 * FUNCTION FLOW NOTES
 * senduserMessage
 *
 * 1️⃣ Triggered with userRecordId only
 * 2️⃣ Opens MosyCard (modal3) with:
 *     - Toggle (SMS / Email)
 *     - Subject (Email only)
 *     - Message textarea
 * 3️⃣ User clicks Send
 * 4️⃣ Confirmation alert opens in modal2
 * 5️⃣ On Yes:
 *    - Close modal2
 *    - Show processing MosyNotify
 *    - Call backend senduserMessage
 * 6️⃣ Show success / failure MosyNotify
 * ════════════════════════════════════════════════════════════════
 */

import { mosyPostData } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import { MosyNotify, MosyAlertCard } from "../../../MosyUtils/ActionModals";
import { closeMosyCard, MosyCard } from "../../../components/MosyCard";

const apiRoutes = getApiRoutes();

// ════════════════════════════════════════════════════════════════
// FUNCTION: senduserMessage
// ════════════════════════════════════════════════════════════════
export function senduserMessage({ userRecordId, username, subject = "", message = "" }) {

    // auto-detect email mode if subject exists
    const isEmailPreset = Boolean(subject);
  
    MosyCard(
      <div className="col-md-12 text-left h3">{`Send ${username || "User"} Message `}</div>,
      <div className="col-md-12 text-left">
  
        {/* CHANNEL TOGGLE */}
        <div className="form-group my-3">
          <label className="label_text d-block mb-2">Send Via</label>
  
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="send_channel"
              id="send_sms"
              defaultChecked={!isEmailPreset}
              onChange={() => toggleEmailFields(false)}
            />
            <label className="form-check-label" htmlFor="send_sms">
              SMS
            </label>
          </div>
  
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="send_channel"
              id="send_email"
              defaultChecked={isEmailPreset}
              onChange={() => toggleEmailFields(true)}
            />
            <label className="form-check-label" htmlFor="send_email">
              Email
            </label>
          </div>
        </div>
  
        {/* EMAIL SUBJECT */}
        <div
          className={`form-group mb-3 ${isEmailPreset ? "" : "d-none"}`}
          id="email_subject_wrapper"
        >
          <label className="label_text">Email Subject</label>
          <input
            type="text"
            id="txt_email_subject"
            className="form-control"
            placeholder="Enter email subject"
            defaultValue={subject}
          />
        </div>
  
        {/* MESSAGE BODY */}
        <div className="form-group mb-4">
          <label className="label_text">Message</label>
          <textarea
            id="txt_user_message"
            className="form-control"
            style={{ minHeight: "250px" }}
            placeholder="Type your message here…"
            defaultValue={message}
          />
        </div>
  
        <div className="text-right">
          <button
            className="btn btn-primary"
            onClick={() => confirmSendUserMessage(userRecordId)}
          >
            <i className="fa fa-paper-plane"></i> Send
          </button>
        </div>
  
      </div>,
      false,
      "modal3",
      "mosycard_wide"
    );
  }
  

// ════════════════════════════════════════════════════════════════
// TOGGLE EMAIL SUBJECT VISIBILITY
// ════════════════════════════════════════════════════════════════
function toggleEmailFields(show) {
  const wrapper = document.getElementById("email_subject_wrapper");
  if (!wrapper) return;

  if (show) {
    wrapper.classList.remove("d-none");
  } else {
    wrapper.classList.add("d-none");
  }
}

// ════════════════════════════════════════════════════════════════
// CONFIRMATION STEP
// ════════════════════════════════════════════════════════════════
function confirmSendUserMessage(userRecordId) {
  const message = document.getElementById("txt_user_message")?.value?.trim();
  const isEmail = document.getElementById("send_email")?.checked;
  const subject = document.getElementById("txt_email_subject")?.value?.trim();

  if (!message) {
    MosyNotify({
      message: "Please enter a message",
      icon: "exclamation-triangle",
      addTimer: true
    });
    return;
  }

  if (isEmail && !subject) {
    MosyNotify({
      message: "Email subject is required",
      icon: "exclamation-triangle",
      addTimer: true
    });
    return;
  }

  MosyAlertCard({
    id: "modal2",
    title: "Confirm Send",
    message: "Are you sure you want to send this message?",
    yesLabel: "Yes, Send",
    noLabel: "Cancel",
    onYes: () => {
      closeMosyCard("modal2");
      closeMosyCard("modal3");
      executeSendUserMessage(userRecordId, {
        message,
        channel: isEmail ? "email" : "sms",
        subject
      });
    }
  });
}

// ════════════════════════════════════════════════════════════════
// BACKEND EXECUTION
// ════════════════════════════════════════════════════════════════
async function executeSendUserMessage(userRecordId, payloadExtras) {

  MosyNotify({
    message: "Sending message to user…",
    icon: "refresh",
    addTimer: false,
    id: "topmost"
  });

  try {
    const res = await mosyPostData({
      url: apiRoutes.smartapi.base,
      data: {
        action: "senduserMessage",
        payload: {
          userRecordId,
          ...payloadExtras
        }
      }
    });

    MosyNotify({
      message: res?.message || "Message sent successfully",
      icon: "check-circle",
      addTimer: true,
      id: "topmost"
    });

    return res;

  } catch (err) {
    MosyNotify({
      message: "Failed to send message — try again",
      icon: "exclamation-triangle",
      addTimer: false,
      id: "topmost"
    });

    return {
      status: "error",
      message: "Failed to send message"
    };
  }
}

// ════════════════════════════════════════════════════════════════
// FUNCTION: sendClientMessage
/* 
Function flow notes
 
how sendClientMessage works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function sendClientMessage() {
    // Implement sendClientMessage logic here
    alert("sendClientMessage");
}


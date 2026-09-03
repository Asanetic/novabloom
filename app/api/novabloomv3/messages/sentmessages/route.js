
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { SentmessagesBatchMutations } from './SentmessagesBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddSentmessages, UpdateSentmessages } from './SentmessagesDbGateway';

export async function GET(request) {

  try {
    const { searchParams } = new URL(request.url);

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canSelect = validateRoleAccess({
      table: 'sent_messages',
      source: 'Sentmessages',
      action : 'select',
      role: 'view_sent_messages',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // sent_messages column DictionaryMap
  const SentmessagesColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    userRecordId : "user_record_id", 
    sendChannel : "send_channel", 
    receiverPhone : "receiver_phone", 
    receiverEmail : "receiver_email", 
    emailSubject : "email_subject", 
    sendStatus : "send_status", 
    sentAt : "sent_at", 
    messageBody : "message_body", 
    sendResponse : "send_response", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `sent_messages`,
      dictionary: SentmessagesColumnDictionary,
      searchParams,
      authData,
      batchMutations: SentmessagesBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Sentmessages data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Sentmessages failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SentmessagesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SentmessagesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SentmessagesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SentmessagesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SentmessagesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canPost = validateRoleAccess({
      table: 'sent_messages',
      source: 'Sentmessages',
      action : 'create',
      role: 'manage_sent_messages',
      authData
    });

    if (!canPost.valid) {
      return Response.json({
        status: 'error',
        message: canPost.message,
        data: []
      });
    }
    
    //generate Record id 
    const newId = magicRandomStr(7);

		
  
  //--- Begin  sent_messages inputs array ---// 
  const SentmessagesInputsArr = {

    "user_record_id" : "?", 
    "send_channel" : "?", 
    "receiver_phone" : "?", 
    "receiver_email" : "?", 
    "email_subject" : "?", 
    "send_status" : "?", 
    "sent_at" : "?", 
    "message_body" : "?", 
    "send_response" : "?", 

  };

  //--- End sent_messages inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('sent_messages',SentmessagesInputsArr, SentmessagesRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Sentmessages
      const result = await AddSentmessages(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        sent_messages_dataNode: result.record_id
      });
      
    
 
  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(SentmessagesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SentmessagesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SentmessagesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SentmessagesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SentmessagesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canUpdate = validateRoleAccess({
      table: 'sent_messages',
      source: 'Sentmessages',
      action : 'update',
      role: 'manage_sent_messages',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const SentmessagesFormAction = body.sent_messages_mosy_action;
    const sent_messages_dataNode_value = base64Decode(body.sent_messages_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  sent_messages inputs array ---// 
  const SentmessagesInputsArr = {

    "user_record_id" : "?", 
    "send_channel" : "?", 
    "receiver_phone" : "?", 
    "receiver_email" : "?", 
    "email_subject" : "?", 
    "send_status" : "?", 
    "sent_at" : "?", 
    "message_body" : "?", 
    "send_response" : "?", 

  };

  //--- End sent_messages inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('sent_messages',SentmessagesInputsArr, SentmessagesRequest, newId, authData)
       
      // update table Sentmessages
      const result = await UpdateSentmessages(newId, mutatedDataArray, body, authData, `primkey='${sent_messages_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        sent_messages_dataNode: sent_messages_dataNode_value
      });
 

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}



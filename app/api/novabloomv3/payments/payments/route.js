
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { PaymentsBatchMutations } from './PaymentsBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddPayments, UpdatePayments } from './PaymentsDbGateway';

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
      table: 'payments',
      source: 'Payments',
      action : 'select',
      role: 'view_payments',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // payments column DictionaryMap
  const PaymentsColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    accountId : "account_id", 
    contextId : "context_id", 
    amount : "amount", 
    currency : "currency", 
    paymentMethod : "payment_method", 
    paymentStatus : "payment_status", 
    externalReference : "external_reference", 
    paymentContext : "payment_context", 
    paidAt : "paid_at", 
    createdAt : "created_at", 
    appId : "app_id", 
    invoiceId : "invoice_id", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `payments`,
      recordIdColumn: `record_id`,
      dictionary: PaymentsColumnDictionary,
      searchParams,
      authData,
      batchMutations: PaymentsBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Payments data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Payments failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(PaymentsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PaymentsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PaymentsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PaymentsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PaymentsRequest);
     
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
      table: 'payments',
      source: 'Payments',
      action : 'create',
      role: 'manage_payments',
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

		
  
  //--- Begin  payments inputs array ---// 
  const PaymentsInputsArr = {

    "account_id" : "?", 
    "context_id" : "?", 
    "amount" : "?", 
    "currency" : "?", 
    "payment_method" : "?", 
    "payment_status" : "?", 
    "external_reference" : "?", 
    "payment_context" : "?", 
    "paid_at" : "?", 
    "created_at" : "?", 
    "app_id" : "?", 
    "invoice_id" : "?", 

  };

  //--- End payments inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('payments',PaymentsInputsArr, PaymentsRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Payments
      const result = await AddPayments(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        payments_dataNode: result.record_id
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

export async function PUT(PaymentsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PaymentsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PaymentsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PaymentsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PaymentsRequest);
     
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
      table: 'payments',
      source: 'Payments',
      action : 'update',
      role: 'manage_payments',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const PaymentsFormAction = body.payments_mosy_action;
    const payments_dataNode_value = base64Decode(body.payments_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  payments inputs array ---// 
  const PaymentsInputsArr = {

    "account_id" : "?", 
    "context_id" : "?", 
    "amount" : "?", 
    "currency" : "?", 
    "payment_method" : "?", 
    "payment_status" : "?", 
    "external_reference" : "?", 
    "payment_context" : "?", 
    "paid_at" : "?", 
    "created_at" : "?", 
    "app_id" : "?", 
    "invoice_id" : "?", 

  };

  //--- End payments inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('payments',PaymentsInputsArr, PaymentsRequest, newId, authData)
       
      // update table Payments
      const result = await UpdatePayments(newId, mutatedDataArray, body, authData, `primkey='${payments_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        payments_dataNode: payments_dataNode_value
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



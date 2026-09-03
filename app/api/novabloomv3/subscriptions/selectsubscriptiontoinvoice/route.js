
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { SelectsubscriptiontoinvoiceBatchMutations } from './SelectsubscriptiontoinvoiceBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddSelectsubscriptiontoinvoice, UpdateSelectsubscriptiontoinvoice } from './SelectsubscriptiontoinvoiceDbGateway';

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
      table: 'subscriptions',
      source: 'Selectsubscriptiontoinvoice',
      action : 'select',
      role: 'view_subscriptions',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // subscriptions column DictionaryMap
  const SelectsubscriptiontoinvoiceColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    accountId : "account_id", 
    subscriptionName : "subscription_name", 
    assetId : "asset_id", 
    pricingId : "pricing_id", 
    startDate : "start_date", 
    nextBillingDate : "next_billing_date", 
    endDate : "end_date", 
    status : "status", 
    billingCycle : "billing_cycle", 
    amount : "amount", 
    currency : "currency", 
    createdAt : "created_at", 
    updatedAt : "updated_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `subscriptions`,
      dictionary: SelectsubscriptiontoinvoiceColumnDictionary,
      searchParams,
      authData,
      batchMutations: SelectsubscriptiontoinvoiceBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Selectsubscriptiontoinvoice data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Selectsubscriptiontoinvoice failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SelectsubscriptiontoinvoiceRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SelectsubscriptiontoinvoiceRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SelectsubscriptiontoinvoiceRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SelectsubscriptiontoinvoiceRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SelectsubscriptiontoinvoiceRequest);
     
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
      table: 'subscriptions',
      source: 'Selectsubscriptiontoinvoice',
      action : 'create',
      role: 'manage_subscriptions',
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

		
  
  //--- Begin  subscriptions inputs array ---// 
  const SelectsubscriptiontoinvoiceInputsArr = {

    "account_id" : "?", 
    "subscription_name" : "?", 
    "asset_id" : "?", 
    "pricing_id" : "?", 
    "start_date" : "?", 
    "next_billing_date" : "?", 
    "end_date" : "?", 
    "status" : "?", 
    "billing_cycle" : "?", 
    "amount" : "?", 
    "currency" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End subscriptions inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('subscriptions',SelectsubscriptiontoinvoiceInputsArr, SelectsubscriptiontoinvoiceRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Selectsubscriptiontoinvoice
      const result = await AddSelectsubscriptiontoinvoice(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        subscriptions_dataNode: result.record_id
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

export async function PUT(SelectsubscriptiontoinvoiceRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SelectsubscriptiontoinvoiceRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SelectsubscriptiontoinvoiceRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SelectsubscriptiontoinvoiceRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SelectsubscriptiontoinvoiceRequest);
     
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
      table: 'subscriptions',
      source: 'Selectsubscriptiontoinvoice',
      action : 'update',
      role: 'manage_subscriptions',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const SelectsubscriptiontoinvoiceFormAction = body.subscriptions_mosy_action;
    const subscriptions_dataNode_value = base64Decode(body.subscriptions_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  subscriptions inputs array ---// 
  const SelectsubscriptiontoinvoiceInputsArr = {

    "account_id" : "?", 
    "subscription_name" : "?", 
    "asset_id" : "?", 
    "pricing_id" : "?", 
    "start_date" : "?", 
    "next_billing_date" : "?", 
    "end_date" : "?", 
    "status" : "?", 
    "billing_cycle" : "?", 
    "amount" : "?", 
    "currency" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End subscriptions inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('subscriptions',SelectsubscriptiontoinvoiceInputsArr, SelectsubscriptiontoinvoiceRequest, newId, authData)
       
      // update table Selectsubscriptiontoinvoice
      const result = await UpdateSelectsubscriptiontoinvoice(newId, mutatedDataArray, body, authData, `primkey='${subscriptions_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        subscriptions_dataNode: subscriptions_dataNode_value
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



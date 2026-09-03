
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { SubscriptionsBatchMutations } from './SubscriptionsBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddSubscriptions, UpdateSubscriptions } from './SubscriptionsDbGateway';

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
      source: 'Subscriptions',
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
  const SubscriptionsColumnDictionary={

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
      dictionary: SubscriptionsColumnDictionary,
      searchParams,
      authData,
      batchMutations: SubscriptionsBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Subscriptions data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Subscriptions failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SubscriptionsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SubscriptionsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SubscriptionsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SubscriptionsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SubscriptionsRequest);
     
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
      source: 'Subscriptions',
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
  const SubscriptionsInputsArr = {

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
    const mutatedDataArray =mutateInputArray('subscriptions',SubscriptionsInputsArr, SubscriptionsRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Subscriptions
      const result = await AddSubscriptions(newId, mutatedDataArray, body, authData);     

       

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

export async function PUT(SubscriptionsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SubscriptionsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SubscriptionsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SubscriptionsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SubscriptionsRequest);
     
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
      source: 'Subscriptions',
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
    
    const SubscriptionsFormAction = body.subscriptions_mosy_action;
    const subscriptions_dataNode_value = base64Decode(body.subscriptions_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  subscriptions inputs array ---// 
  const SubscriptionsInputsArr = {

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
    const mutatedDataArray =mutateInputArray('subscriptions',SubscriptionsInputsArr, SubscriptionsRequest, newId, authData)
       
      // update table Subscriptions
      const result = await UpdateSubscriptions(newId, mutatedDataArray, body, authData, `primkey='${subscriptions_dataNode_value}'`)

      

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



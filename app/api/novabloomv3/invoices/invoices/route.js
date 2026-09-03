
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { InvoicesBatchMutations } from './InvoicesBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddInvoices, UpdateInvoices } from './InvoicesDbGateway';

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
      table: 'invoices',
      source: 'Invoices',
      action : 'select',
      role: 'view_invoices',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // invoices column DictionaryMap
  const InvoicesColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    invoiceNumber : "invoice_number", 
    accountId : "account_id", 
    invoiceRemark : "invoice_remark", 
    totalAmount : "total_amount", 
    issueDate : "issue_date", 
    dueDate : "due_date", 
    clientId : "client_id", 
    orderId : "order_id", 
    assetId : "asset_id", 
    subscriptionId : "subscription_id", 
    invoiceType : "invoice_type", 
    status : "status", 
    subtotalAmount : "subtotal_amount", 
    taxAmount : "tax_amount", 
    discountAmount : "discount_amount", 
    currency : "currency", 
    paidAmount : "paid_amount", 
    balanceDue : "balance_due", 
    notes : "notes", 
    createdAt : "created_at", 
    updatedAt : "updated_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `invoices`,
      dictionary: InvoicesColumnDictionary,
      searchParams,
      authData,
      batchMutations: InvoicesBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Invoices data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Invoices failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(InvoicesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = InvoicesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await InvoicesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await InvoicesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(InvoicesRequest);
     
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
      table: 'invoices',
      source: 'Invoices',
      action : 'create',
      role: 'manage_invoices',
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

		
  
  //--- Begin  invoices inputs array ---// 
  const InvoicesInputsArr = {

    "invoice_number" : "?", 
    "account_id" : "?", 
    "invoice_remark" : "?", 
    "total_amount" : "?", 
    "issue_date" : "?", 
    "due_date" : "?", 
    "client_id" : "?", 
    "order_id" : "?", 
    "asset_id" : "?", 
    "subscription_id" : "?", 
    "invoice_type" : "?", 
    "status" : "?", 
    "subtotal_amount" : "?", 
    "tax_amount" : "?", 
    "discount_amount" : "?", 
    "currency" : "?", 
    "paid_amount" : "?", 
    "balance_due" : "?", 
    "notes" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End invoices inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('invoices',InvoicesInputsArr, InvoicesRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Invoices
      const result = await AddInvoices(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        invoices_dataNode: result.record_id
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

export async function PUT(InvoicesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = InvoicesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await InvoicesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await InvoicesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(InvoicesRequest);
     
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
      table: 'invoices',
      source: 'Invoices',
      action : 'update',
      role: 'manage_invoices',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const InvoicesFormAction = body.invoices_mosy_action;
    const invoices_dataNode_value = base64Decode(body.invoices_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  invoices inputs array ---// 
  const InvoicesInputsArr = {

    "invoice_number" : "?", 
    "account_id" : "?", 
    "invoice_remark" : "?", 
    "total_amount" : "?", 
    "issue_date" : "?", 
    "due_date" : "?", 
    "client_id" : "?", 
    "order_id" : "?", 
    "asset_id" : "?", 
    "subscription_id" : "?", 
    "invoice_type" : "?", 
    "status" : "?", 
    "subtotal_amount" : "?", 
    "tax_amount" : "?", 
    "discount_amount" : "?", 
    "currency" : "?", 
    "paid_amount" : "?", 
    "balance_due" : "?", 
    "notes" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End invoices inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('invoices',InvoicesInputsArr, InvoicesRequest, newId, authData)
       
      // update table Invoices
      const result = await UpdateInvoices(newId, mutatedDataArray, body, authData, `primkey='${invoices_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        invoices_dataNode: invoices_dataNode_value
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



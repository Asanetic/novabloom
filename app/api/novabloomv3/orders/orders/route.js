
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { OrdersBatchMutations } from './OrdersBatchMutations';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddOrders, UpdateOrders } from './OrdersDbGateway';

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
    
    
    // orders column DictionaryMap
  const OrdersColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    accountId : "account_id", 
    orderStatus : "order_status", 
    totalAmount : "total_amount", 
    currency : "currency", 
    createdAt : "created_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `orders`,
      dictionary: OrdersColumnDictionary,
      searchParams,
      authData,
      batchMutations: OrdersBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Orders data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Orders failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(OrdersRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = OrdersRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await OrdersRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await OrdersRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(OrdersRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    //generate Record id 
    const newId = magicRandomStr(7);

		
  
  //--- Begin  orders inputs array ---// 
  const OrdersInputsArr = {

    "account_id" : "?", 
    "order_status" : "?", 
    "total_amount" : "?", 
    "currency" : "?", 
    "created_at" : "?", 

  };

  //--- End orders inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('orders',OrdersInputsArr, OrdersRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Orders
      const result = await AddOrders(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        orders_dataNode: result.record_id
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

export async function PUT(OrdersRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = OrdersRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await OrdersRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await OrdersRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(OrdersRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const OrdersFormAction = body.orders_mosy_action;
    const orders_dataNode_value = base64Decode(body.orders_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  orders inputs array ---// 
  const OrdersInputsArr = {

    "account_id" : "?", 
    "order_status" : "?", 
    "total_amount" : "?", 
    "currency" : "?", 
    "created_at" : "?", 

  };

  //--- End orders inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('orders',OrdersInputsArr, OrdersRequest, newId, authData)
       
      // update table Orders
      const result = await UpdateOrders(newId, mutatedDataArray, body, authData, `primkey='${orders_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        orders_dataNode: orders_dataNode_value
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



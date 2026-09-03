
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert orders 
export async function AddOrders(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("orders", mutatedDataArray, body);
   
  return result;
}


//update orders 
export async function UpdateOrders(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("orders", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete orders 
export async function DeleteOrders(tokenId, whereStr)
{  
  const result = await mosySqlDelete("orders", whereStr);

  return result;
}


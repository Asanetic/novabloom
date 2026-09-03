
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert subscriptions 
export async function AddSubscriptions(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("subscriptions", mutatedDataArray, body);
   
  return result;
}


//update subscriptions 
export async function UpdateSubscriptions(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("subscriptions", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete subscriptions 
export async function DeleteSubscriptions(tokenId, whereStr)
{  
  const result = await mosySqlDelete("subscriptions", whereStr);

  return result;
}


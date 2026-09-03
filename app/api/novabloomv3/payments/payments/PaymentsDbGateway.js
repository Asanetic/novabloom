
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert payments 
export async function AddPayments(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("payments", mutatedDataArray, body);
   
  return result;
}


//update payments 
export async function UpdatePayments(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("payments", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete payments 
export async function DeletePayments(tokenId, whereStr)
{  
  const result = await mosySqlDelete("payments", whereStr);

  return result;
}


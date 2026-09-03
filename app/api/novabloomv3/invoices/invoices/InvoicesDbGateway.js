
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert invoices 
export async function AddInvoices(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("invoices", mutatedDataArray, body);
   
  return result;
}


//update invoices 
export async function UpdateInvoices(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("invoices", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete invoices 
export async function DeleteInvoices(tokenId, whereStr)
{  
  const result = await mosySqlDelete("invoices", whereStr);

  return result;
}


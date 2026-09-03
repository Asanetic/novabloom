import { mosyGetElemVal } from "../../../MosyUtils/hiveUtils";


export function loadPricing (dataRes, handler)
{
    
//Table name : asset_pricing

// columns : "primkey" , "record_id" , "asset_id" , "pricing_type" , "price_model" , "amount" , "unit_price" , "currency" , "billing_cycle" , "effective_from" , "effective_to" , "status" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "model_name" , "model_features" , 
//Table name : subscriptions

// columns : "primkey" , "record_id" , "account_id" , "asset_id" , "pricing_id" , "start_date" , "next_billing_date" , "end_date" , "status" , "billing_cycle" , "amount" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , 

    // Implement loadPricing logic here
    ///const getno
    const username = mosyGetElemVal("_app_users_full_name_account_id")
    const subscription_name = `${username} - ${dataRes?.model_name}`
    handler("amount", dataRes?.amount);
    handler("currency", dataRes?.currency);
    handler("billing_cycle", dataRes?.billing_cycle);
    handler("subscription_name", subscription_name)
    
}   


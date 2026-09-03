$curlopt_url="http://localhost:3000/api/novabloomv3/loadaccount";
$curlopt_post_fields='{
 "assetid": "MTG76SN",
 "accountid":"GRACEWWANJK",
 "email":"jereasanya@gmail.com",
 "tel" :"0710766390",
 "name" : "Grace wanjiku"
}';

echo magic_post_curl_min($curlopt_url,$curlopt_post_fields);


//Table name : assets

// columns : "primkey" , "record_id" , "asset_code" , "asset_name" , "asset_type" , "pricing_type" , "status" , "description" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "logo" , 



//Table name : asset_pricing

// columns : "primkey" , "record_id" , "asset_id" , "pricing_type" , "price_model" , "amount" , "unit_price" , "currency" , "billing_cycle" , "effective_from" , "effective_to" , "status" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "model_name" , "model_features" , 


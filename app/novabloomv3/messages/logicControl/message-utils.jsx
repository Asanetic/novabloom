export function loadUserDetails(dataRes, handler)
{
// columns : "primkey" , "record_id" , "user_record_id" , "send_channel" , "receiver_phone" , "receiver_email" , "email_subject" , "message_body" , "send_status" , "send_response" , "sent_at" , "hive_site_id" , "hive_site_name" , 

// columns : "primkey" , "record_id" , "first_name" , "last_name" , "full_name" , "email" , "phone_number" , "password_hash" , "account_status" , "email_verified" , "phone_verified" , "country" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "profile_photo" , 
handler("receiver_phone", dataRes?.phone_number);
handler("receiver_email", dataRes?.email);

}
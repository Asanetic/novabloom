<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : primkey, record_id, send_channel, receiver_phone, receiver_email, send_status, sent_at
//important columns on profile : primkey, record_id, user_record_id, send_channel, receiver_phone, receiver_email, email_subject, message_body, send_status, send_response, sent_at

/*================= How the module related to the whole app / app flow ==================== 

This module manages all outgoing communications sent through the system including SMS and email messages.
It tracks message delivery status, recipient information, and provides audit trail for all communications.

Key features:
- Message history tracking across multiple channels (SMS, Email)
- Delivery status monitoring
- User activity tracking via user_record_id
- Message content storage for audit purposes
- Response tracking for delivery confirmations

Related modules:
- app_users: Links to sender via user_record_id
- System notifications and alerts

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="sent_messages";
  $__page_title ="Sent Messages";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"messages",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"messages",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
          // "sent_messages" => ["user_full_name","message_count"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"send_status" => "checkblank(getarr_val_(\$sent_messages_node,'send_status'),'pending')"
        ],

              
      "dataRowMutations"=>[

         /* "loans_issued" => [
              "type" => "sum",
              "table" => "loans",
              "link"  => "account_id:record_id",
              "column" => "amount",
              "where" => [
                  "status" => "disbursed"
              ]
          ],
          "total_payments" => [
              "type" => "sum",
              "table" => "payments",
              "link"  => "account_id:record_id",
              "column" => "amount"
          ],
          "latest_payments" => [
              "type" => "mini",
              "table" => "payments",
              "link"  => "account_id:record_id",
              "columns" => "date,amount,refno,clientid",
              "where" => [
                  "status" => "paid",
                  "amount<" => 100
              ],
              "limit" => 10,
              "order" => "primkey:desc"
          ],

          "loan_balance" => [
              "type" => "compute",
              "expr" => "loans_issued-total_payments"
          ],*/ 
                 
          
        ],
        // Custom query hooks for Next.js
        "custom_next_js_query_line_cols" => [
            "user_full_name" => [
                "function" => "await mosyQddata('app_users', 'record_id', `\${row?.user_record_id}`)?.full_name || 'System';",
                "args" => [],
                "return" => "data_res"
            ],
            "message_count" => [
                "function" => "await mosyCountRows('sent_messages', `where user_record_id ='\${row?.user_record_id}'`)",
                "args" => [],
                "return" => "data_res?.total"
            ],
            "delivery_rate_" => [
                "function" => " await mosyCountRows('sent_messages', `where user_record_id ='\${row?.user_record_id}'`); const delivered = await mosyCountRows('sent_messages', `where user_record_id ='\${row?.user_record_id}' AND send_status='delivered'`); return total?.total > 0 ? ((delivered?.total / total?.total) * 100).toFixed(1) + '%' : '0%';",
                "args" => [],
                "return" => "data_res"
            ]
        ]
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "sent_messages" => ["primkey","record_id","user_record_id","send_channel","receiver_phone","receiver_email","email_subject","send_status","sent_at","message_body","send_response"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "sent_messages" => [
                "Recipient Details" => ["user_record_id","receiver_phone","receiver_email","send_channel"],
                "Message Content" => ["email_subject","message_body"],
                "Status & Tracking" => ["send_status","send_response","sent_at"]
            ]
        ],

        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => [], 
        "print_tables" => ["sent_messages"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","message_body","send_response"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => ["message_body"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "send_channel" => "sms,email",
            "send_status" => "pending,sent,delivered,failed,bounced"
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => ["email_subject"], 
        "date_columns" => [],
        "datetime_columns" => ["sent_at"],

        "rename_cols_array" => [ 
            "user_record_id" => "Sent to",
            "send_channel" => "Channel",
            "receiver_phone" => "Phone Number",
            "receiver_email" => "Email Address",
            "email_subject" => "Subject",
            "message_body" => "Message Content",
            "send_status" => "Delivery Status",
            "send_response" => "Provider Response",
            "sent_at" => "Sent Date & Time",
            "user_full_name" => "Sender Name",
            "message_count" => "Total Messages Sent",
            "delivery_rate" => "Delivery Rate"
        ],

        "rename_tables_array" => [
            "sent_messages" => "Sent Messages"
        ],

        "new_label_buttons_arr" => [ 
            "sent_messages" => "edit: Compose Message:{`Message / \${sent_messagesNode?.send_channel || 'No subject'} / \${sent_messagesNode?._app_users_full_name_user_record_id}`}"
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "sent_messages"=>["csv"=>"user_record_id,send_channel,receiver_phone,receiver_email,email_subject,message_body,send_status,sent_at","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[
          "sent_messages"=>"loadMessages()"
        ],
      
        "custom_query_line_cols" => [], 
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          /*"user_messages"=>[
         "table"=>"sent_messages",
         "link"=>"messages_list",
         "query"=>"user_record_id='{{user_record_id}}'",
         "title"=>"User Message History",
         "columns"=>["sent_at","send_channel","receiver_phone","receiver_email","send_status"],
          ]*/
          
        ], 
      //Table name : sent_messages

// columns : "primkey" , "record_id" , "user_record_id" , "send_channel" , "receiver_phone" , "receiver_email" , "email_subject" , "message_body" , "send_status" , "send_response" , "sent_at" , "hive_site_id" , "hive_site_name" , 


        "custom_profile_col_data" => ["send_status"=>"?","send_response"=>"?","sent_at"=>"?"], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           "user_record_id" => "app_users:record_id:full_name:apiRoutes.platformuserlist.base:loadUserDetails(dataRes, handleInputChange)"
        ]
    ]
  
  ];

  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         /*"calendar: Filter by Date Range" => [
             "fe" => "filterMessageDate()",
             "be" => "filterMessageDate()",
             "file" => "messages-report"
         ],
         "filter: Filter by Channel" => [
             "fe" => "filterByChannel()",
             "file" => "messages-utils"
         ],
         "refresh: Refresh Status" => [
             "fe" => "refreshDeliveryStatus()",
             "be" => "refreshDeliveryStatus()",
             "file" => "messages-sync"
         ]*/
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         "send: Send" => [
             "fe" => "sendMessage(sent_messagesNode?.user_record_id)",
             "file" => "send-message"
         ],
         /*"copy: Duplicate Message" => [
             "fe" => "duplicateMessage()",
             "be" => "duplicateMessage()",
             "file" => "manage-messages"
         ],
         "eye: View Delivery Report" => [
             "fe" => "viewDeliveryReport()",
             "file" => "messages-reports"
         ]*/
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"rotate-cw: Retry Send" => [
             "fe" => "retryMessage()",
             "be" => "retryMessage()",
             "file" => "manage-messages"
         ],
         "eye: View Details" => [
             "fe" => "viewMessageDetails()",
             "file" => "messages-utils"
         ],
         "copy: Duplicate" => [
             "fe" => "duplicateMessage()",
             "be" => "duplicateMessage()",
             "file" => "manage-messages"
         ]*/
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
   /*"relatedUserMessages"=>[ 
     "filter_str"=>"user_record_id='\${sent_messagesNode?.user_record_id}'",
     "module_name"=>"Messages",
     "list_title"=>"User Message History",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'messages', 
     "list_url"=>"",
     "profile_url"=>"",
   ]*/
   
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedUser"=>[ 
     "filter_str"=>"record_id='\${sent_messagesNode?.user_record_id}'",
     "module_name"=>"AppUsers",
     "profile_title"=>"Sender Profile",
     "custom"=>false,
     "external"=>true,
     "alias"=>'appusers',      
     "list_table_name"=>"app_users",
   ]*/
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-4 hive_data_cell ";
  $override_segmentation_section_class="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="rounded_avatar";
  ///=================================== basic template setup 

?>
<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, full_name, email, phone_number, account_status, country, created_at    
//important columns on profile : record_id, first_name, last_name, full_name, email, phone_number, account_status, email_verified, phone_verified, country, currency, created_at, updated_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages the core user accounts for the application. It handles user registration,
authentication, profile management, and account verification. Users created here are linked to
billing accounts, subscriptions, orders, and payment records throughout the system.

Key relationships:
- Linked to billing accounts via account_id
- Referenced in orders, payments, and subscriptions
- Controls access to assets through entitlements

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="app_users";
  $__page_title ="Active app users";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"users",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"active",
    "multigrid_col_span"=>"9"      

  ];
    $modules_and_links_=[
    "profile_module_name"=>"viewactive",
    "profile_module_link"=>"profile",
    "addnew_page_link"=>"../users/profile",
    "list_module_name"=>"activelist",
    "list_page_link"=>"./list",
    "write_profile"=>true,
    "write_list"=>false
  ];

  $profile_file_name   = $modules_and_links_["profile_module_name"];
  $list_file_name      = $modules_and_links_["list_module_name"];
  $back_to_list_       = $modules_and_links_["list_page_link"];
  $add_new_page_link   = $modules_and_links_["addnew_page_link"];
//Table name : app_users

// columns : "primkey" , "record_id" , "first_name" , "last_name" , "full_name" , "email" , "phone_number" , "password_hash" , "account_status" , "email_verified" , "phone_verified" , "country" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "profile_photo" , 


  $enforced_be_filter="accountStatus:'Active'";

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           "app_users" => ["total_subscriptions", "total_orders", "total_payments"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"account_status" => "checkblank(getarr_val_(\$app_users_node,'account_status'),'pending')"
        ],
              
      "dataRowMutations"=>[
          "total_subscriptions" => [
              "type" => "count",
              "table" => "subscriptions",
              "link"  => "account_id:record_id"
          ],
          "total_payments" => [
              "type" => "sum",
              "table" => "payments",
              "link"  => "account_id:record_id",
              "column"=>"amount"
          ],
          "latest_payments" => [
              "type" => "mini",
              "table" => "payments",
              "link"  => "account_id:record_id",
              "columns" => "paid_at,amount,external_reference,payment_context",
              "where" => [],
              "limit" => 10,
              "order" => "primkey:desc"
          ],        
 
         /* "loans_issued" => [
              "type" => "sum",
              "table" => "loans",
              "link"  => "account_id:record_id",
              "column" => "amount",
              "where" => [
                  "status" => "disbursed"
              ]
          ],
          "total_subscriptions" => [
              "type" => "count",
              "table" => "subscriptions",
              "link"  => "account_id:record_id"
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
        ]
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "app_users" => ["primkey","record_id","first_name","last_name","full_name","email","phone_number","account_status","email_verified","phone_verified","country","currency","created_at","updated_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "app_users" => [
                "Personal Information" => ["full_name","email","phone_number","country","currency"],
                "Account Settings" => ["password_hash","account_status","email_verified","phone_verified"],
                "System Information" => ["created_at","total_payments","total_orders","total_subscriptions"]
            ]
        ],
//Table name : app_users

// columns : "primkey" , "record_id" , "first_name" , "last_name" , "full_name" , "email" , "phone_number" , "password_hash" , "account_status" , "email_verified" , "phone_verified" , "country" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "profile_photo" , 


        "image_columns" => ["profile_photo"],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => ["updated_at"], 
        "print_tables" => ["app_users"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name","first_name","last_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","password_hash","first_name","last_name","email_verified","phone_verified","currency","updated_at"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => ["total_payments","total_orders"], 
        "textarea_array" => [], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "account_status" => "active,suspended,pending,closed",
            "email_verified" => "yes,no",
            "phone_verified" => "yes,no"
        ],

        "dynamic_drop_down_array" => ["country","currency"], // if its here dont add it to connection_cols and vice versa 
        "password_columns" => ["password_hash"], 
        "title_columns" => [], 
        "date_columns" => [],
        "datetime_columns" => ["created_at","updated_at"],

        "rename_cols_array" => [ 
            "first_name" => "First Name",
            "last_name" => "Last Name",
            "full_name" => "Full Name",
            "email" => "Email Address",
            "phone_number" => "Phone Number",
            "password_hash" => "Password :col-md-3",
            "account_status" => "Account Status:col-md-3",
            "email_verified" => "Email Verified:col-md-3",
            "phone_verified" => "Phone Verified:col-md-3",
            "country" => "Country",
            "currency" => "Currency",
            "created_at" => "Registration date:col-md-3",
            "updated_at" => "Last Updated",
            "total_subscriptions" => "Total Subscriptions:col-md-3",
            "total_orders" => "Total Orders:col-md-3",
            "total_payments" => "Total Payments:col-md-3"
        ],

        "rename_tables_array" => [
            "app_users" => "App Users"
        ],

        "new_label_buttons_arr" => [ 
            "app_users" => "user-plus:New User:{`User Profile / \${app_usersNode?.full_name}`}" // node formart tablenameNode eg acc_renewalsNode
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "app_users"=>["csv"=>"first_name,last_name,full_name,email,phone_number,account_status,country,currency","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[
          "app_users_list"=>"loadUsers()"
        ],
      
        "custom_query_line_cols" => [], 
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          "user_subscriptions"=>[
            "table"=>"subscriptions",
            "link"=>"subscriptions_list",
            "query"=>"account_id='{{record_id}}'",
            "title"=>"Active Subscriptions",
            "columns"=>["record_id","asset_id","status","start_date","next_billing_date","amount","currency"]
          ],
          "user_orders"=>[
            "table"=>"orders",
            "link"=>"orders_list",
            "query"=>"account_id='{{record_id}}'",
            "title"=>"Order History",
            "columns"=>["record_id","order_status","total_amount","currency","created_at"]
          ],
          "user_payments"=>[
            "table"=>"payments",
            "link"=>"payments_list",
            "query"=>"account_id='{{record_id}}'",
            "title"=>"Payment History",
            "columns"=>["record_id","amount","currency","payment_method","payment_status","paid_at"]
          ]
        ], 
        "custom_profile_col_data" => ["total_amount"=>"?","total_orders"=>"?","total_subscriptions"=>"?","total_payments"=>"?"], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           //"account_id" => "billing_accounts:record_id:account_name:apiRoutes.billingaccounts.base"
        ]
    ]
  
  ];
//filterfile, title, table, column
  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         "calendar: Filter by Registration Date" => [
             "fe" => "filterByRegDate(`../users/activelist`,`Filter registration date`, `app_users`,`createdAt`)",
             "be" => "filterByRegDate()",
             "file" => "app-users-filters",
             "baspath"=>"../../users/logicControl/"
           
         ]
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         "envelope: Send message" => [
             "fe" => "senduserMessage({userRecordId:app_usersNode?.record_id, username:app_usersNode?.full_name})",
             "be" => "senduserMessage()",
             "file" => "user-notify",
             "baspath"=>"../../users/logicControl/"
         ],
         "copy: Add user subscription" => [
             "fe" => "addUserSubscription(app_usersNode)",
             "be" => "addUserSubscription()",
             "file" => "user-addsubscription",
             "baspath"=>"../../users/logicControl/"

         ]          
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         "eye: View Subscriptions" => [
             "fe" => "viewUserSubscriptions(listapp_users_result.record_id)",
             "file" => "user-details",
             "baspath"=>"../../users/logicControl/"
           
         ],
         "credit-card: View Payments" => [
             "fe" => "viewUserPayments(listapp_users_result.record_id)",
             "file" => "user-details",
             "baspath"=>"../../users/logicControl/"
           
         ]
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
   "userPayments"=>[ 
     "filter_str"=>"  {accountId:btoa(app_usersNode?.record_id)}",
     "module_name"=>"Payments",
     "list_title"=>"Payment History",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'payments', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ],    
   "userSubscriptions"=>[ 
     "filter_str"=>"  {accountId:btoa(app_usersNode?.record_id)} ",
     "module_name"=>"Subscriptions",
     "list_title"=>"User Subscriptions",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'subscriptions', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ]
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedBillingAccount"=>[ 
     "filter_str"=>"account_id='{appusersNode?.record_id}'",
     "module_name"=>"BillingAccounts",
     "profile_title"=>"Billing Account",
     "custom"=>false,
     "external"=>true,
     "alias"=>'billing_accounts',      
     "event_name"=>"",
     "event_path"=>"",
     "list_table_name"=>"billing_accounts",
   ]*/
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-4 hive_data_cell ";
  $override_segmentation_section_class="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="product_image";
  ///=================================== basic template setup 

?>
  
  
  
  
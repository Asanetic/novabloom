<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, account_id, asset_id, status, start_date, next_billing_date, amount    
//important columns on profile : record_id, account_id, asset_id, pricing_id, start_date, next_billing_date, end_date, status, billing_cycle, amount, currency, created_at, updated_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages recurring subscription billing for assets. It handles subscription lifecycle
from creation through renewal, including status tracking, billing cycle management, and payment
scheduling. Subscriptions link users to assets with automatic recurring billing.

Key relationships:
- Links to app_users via account_id
- Links to assets via asset_id
- Links to asset_pricing via pricing_id
- Generates payments at billing intervals
- Creates entitlements for asset access
- Tracks usage through usage_events

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="subscriptions";
  $__page_title ="Select subscription to invoice";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"subscriptions",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"subscriptions",
    "multigrid_col_span"=>"9"      

  ];
  
  $modules_and_links_=[
    "profile_module_name"=>"generateinvoiceprof",
    "profile_module_link"=>"./profile",
    "addnew_page_link"=>"./profile",
    "list_module_name"=>"generateinvoice",
    "list_page_link"=>"./generateinvoice",
    "write_profile"=>true,
    "write_list"=>false
  ];
  $profile_file_name   = $modules_and_links_["profile_module_name"];
  $list_file_name      = $modules_and_links_["list_module_name"];
  $back_to_list_       = $modules_and_links_["list_page_link"];
  $add_new_page_link   = $modules_and_links_["addnew_page_link"];


//$list_template= file_get_contents('../novatemplates/uigrid1.tdna');
//$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');

$csgrid_dictionary = [
  "data9" => "asset_code",          // image src
  "data1" => "logo",       // alt text
  "data2" => "logo",       // alt text
  "data3" => "asset_name",      // display name
  "data4" => "nodata",          // subtitle
  "data5" => "description",     // progress %
  "data7" => "nodata",           // badge text
  "data6" => "role"            // badge text
];

$profile_dictionary = [
  "data9" => "asset_code",          // image src
  "data1" => "logo",       // alt text
  "data2" => "logo",       // alt text
  "data14" => "asset_name",      // display name
  "data4" => "nodata",          // subtitle
  "data5" => "description",     // progress %
  "data7" => "nodata",           // badge text
  "data6" => "role"            // badge text
];

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           "subscriptions" => ["total_payments", "days_to_next_billing"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"status" => "checkblank(getarr_val_(\$subscriptions_node,'status'),'active')"
        ],

               
      "dataRowMutations"=>[
          "total_payments" => [
              "type" => "sum",
              "table" => "payments",
              "link"  => "context_id:record_id",
              "column" => "amount"
          ],
          "days_to_next_billing" => [
              "type" => "compute",
              "expr" => "Math.ceil((new Date(next_billing_date) - new Date()) / (1000 * 60 * 60 * 24))"
          ]        
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
            "total_payments" => [
                "function" => "await mosySumRows('payments', 'amount', `where context_id ='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res"
            ],
            "days_to_next_billing" => [
                "function" => "Math.ceil((new Date(row?.next_billing_date) - new Date()) / (1000 * 60 * 60 * 24))",
                "args" => [],
                "return" => "data_res"
            ]
        ]
    ],

//Table name : subscriptions

// columns : "primkey" , "record_id" , "account_id" , "asset_id" , "pricing_id" , "start_date" , "next_billing_date" , "end_date" , "status" , "billing_cycle" , "amount" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , 

    //Table name : subscriptions

// columns : "primkey" , "record_id" , "account_id" , "asset_id" , "pricing_id" , "start_date" , "next_billing_date" , "end_date" , "status" , "billing_cycle" , "amount" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "subscription_name" , 



    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "subscriptions" => ["primkey","record_id","account_id","subscription_name","asset_id","pricing_id","start_date","next_billing_date","end_date","status","billing_cycle","amount","currency","created_at","updated_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "subscriptions" => [
                "Subscription Details" => ["account_id","asset_id","pricing_id","pricing_type","amount","status","total_payments","subscription_name"],
                "Billing Schedule" => ["currency","next_billing_date","billing_cycle","days_to_next_billing"]
            ]
        ],
//Table name : subscriptions

// columns : "primkey" , "record_id" , "account_id" , "asset_id" , "pricing_id" , "start_date" , "next_billing_date" , "end_date" , "status" , "billing_cycle" , "amount" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , 


        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => [], 
        "print_tables" => ["subscriptions"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name","created_at","updated_at","start_date","end_date"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","pricing_id","end_date","billing_cycle","currency","created_at","updated_at"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => ["amount","total_payments"], 
        "textarea_array" => [], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "status" => "active,paused,cancelled,expired,pending",
        ],

        "dynamic_drop_down_array" => ["currency","billing_cycle"], // if its here dont add it to connection_cols and vice versa 
        "password_columns" => [], 
        "title_columns" => ["subscription_name"], 
        "date_columns" => ["start_date","next_billing_date","end_date"],
        "datetime_columns" => ["created_at","updated_at"],

        "rename_cols_array" => [ 
            "account_id" => "Account name",
            "asset_id" => "Asset",
            "pricing_id" => "Pricing Plan",
            "start_date" => "Start Date",
            "next_billing_date" => "Next Billing Date:col-md-3",
            "end_date" => "End Date",
            "status" => "Status",
            "billing_cycle" => "Billing Cycle:col-md-3",
            "amount" => "Amount",
            "currency" => "Currency:col-md-3",
            "created_at" => "Created Date",
            "updated_at" => "Last Updated",
            "account_name" => "Customer Name",
            "asset_name" => "Asset Name",
            "pricing_type" => "Pricing Type",
            "total_payments" => "Total Payments Made",
            "days_to_next_billing" => "Days Until Billing:col-md-3"
        ],

        "rename_tables_array" => [
            "subscriptions" => "Subscriptions"
        ],

        "new_label_buttons_arr" => [ 
            "subscriptions" => "plus-circle:New Subscription:{`Subscription / \${subscriptionsNode?._app_users_full_name_account_id} / \${subscriptionsNode?._assets_asset_name_asset_id} - \${subscriptionsNode?._asset_pricing_model_name_pricing_id}  `}" // node formart tablenameNode eg acc_renewalsNode
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "subscriptions"=>["csv"=>"account_id,asset_id,pricing_id,start_date,next_billing_date,status,billing_cycle,amount,currency","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[
          "subscriptions_list"=>"loadSubscriptions()"
        ],
      
        "custom_query_line_cols" => [], 
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          "subscription_payments"=>[
            "table"=>"payments",
            "link"=>"payments_list",
            "query"=>"context_id='{{record_id}}' and payment_context='subscription'",
            "title"=>"Payment History",
            "columns"=>["record_id","amount","currency","payment_method","payment_status","paid_at"]
          ],
          "subscription_entitlements"=>[
            "table"=>"entitlements",
            "link"=>"entitlements_list",
            "query"=>"account_id='{{account_id}}' and asset_id='{{asset_id}}'",
            "title"=>"Access Entitlements",
            "columns"=>["record_id","access_status","granted_at","expires_at"]
          ],
          
          "usage_tracking"=>[
            "table"=>"usage_events",
            "link"=>"usage_events_list",
            "query"=>"account_id='{{account_id}}' and asset_id='{{asset_id}}'",
            "title"=>"Usage Events",
            "columns"=>["record_id","units_used","total_cost","billing_status","occurred_at"]
          ]
        ], 
      
        "custom_profile_col_data" => ["total_payments"=>"?", "days_to_next_billing"=>"?"],
      
        "custom_profile_default_data" => [],
      
//Table name : asset_pricing

// columns : "primkey" , "record_id" , "asset_id" , "pricing_type" , "price_model" , "amount" , "unit_price" , "currency" , "billing_cycle" , "effective_from" , "effective_to" , "status" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "model_name" , "model_features" , 


        "connection_cols" => [ 
           "account_id" => "app_users:record_id:full_name:apiRoutes.platformuserlist.base",
           "asset_id" => "assets:record_id:asset_name:apiRoutes.digitalassetlist.base",
           "pricing_id" => "asset_pricing:record_id:model_name:apiRoutes.assetpricing.base:loadPricing(dataRes,handleInputChange)"
        ]
    ]
  
  ];


  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         "calendar: Filter by expiry Date" => [
             "fe" => "filterByBillingDate('../subscriptions/generateinvoice','Expiry date','subscriptions','next_billing_date')",
             "file" => "subscription-filters"
         ],
         "filter: Filter by status" => [
             "fe" => "filterByStats({router:router, stateSetters:stateItemSetters,path:'../subscriptions/generateinvoice'})",
             "file" => "subscription-filters"
         ],        
         "users: Filter by user" => [
             "fe" => "filterByUser({router:router, stateSetters:stateItemSetters,path:'../subscriptions/generateinvoice'})",
             "file" => "subscription-filters"
         ],  
        
         "bolt: Filter by platform" => [
             "fe" => "filterByAsset({router:router, stateSetters:stateItemSetters,path:'../subscriptions/generateinvoice'})",
             "file" => "subscription-filters"
         ],          
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         "send: Send Message" => [
             "fe" => "notifyUser(subscriptionsNode?.account_id , subscriptionsNode?._app_users_full_name_account_id)",
             "file" => "notify-user"
         ],
         "file-text: Generate invoice" => [
             "fe" => "generateSubInvoice(subscriptionsNode)",
             "be" => "generateSubInvoice()",
             "file" => "generate-sub-invoice"
         ],        
         "refresh: Renew Subscription" => [
             "fe" => "renewSubscription(subscriptionsNode?.record_id)",
             "be" => "renewSubscription()",
             "file" => "subscription-renewal"
         ]
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[

         "file-text: Generate invoice" => [
             "fe" => "generateSubInvoice(listsubscriptions_result)",
             "be" => "generateSubInvoice()",
             "file" => "generate-sub-invoice"
         ],
         "search: View invoice history" => [
             "fe" => "subInvoiceHistory(listsubscriptions_result.record_id)",
             "file" => "invoice-details"
         ]          
 
          
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
   "subscriptionPayments"=>[ 
     "filter_str"=>"context_id='\${subscriptionsNode?.record_id}'",
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
   "usageEvents"=>[ 
     "filter_str"=>"record_id='\${subscriptionsNode?.account_id}'",
     "module_name"=>"Platformuserlist",
     "list_title"=>"User profile",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'users', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ]
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedCustomer"=>[ 
     "filter_str"=>"record_id='{subscriptionsNode?.account_id}'",
     "module_name"=>"AppUsers",
     "profile_title"=>"Customer Profile",
     "custom"=>false,
     "external"=>true,
     "alias"=>'app_users',      
     "event_name"=>"",
     "event_path"=>"",
     "list_table_name"=>"app_users",
   ],
   "linkedAsset"=>[ 
     "filter_str"=>"record_id='{subscriptionsNode?.asset_id}'",
     "module_name"=>"Assets",
     "profile_title"=>"Asset Details",
     "custom"=>false,
     "external"=>true,
     "alias"=>'assets',      
     "event_name"=>"",
     "event_path"=>"",
     "list_table_name"=>"assets",
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
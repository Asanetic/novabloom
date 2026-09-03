<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, asset_code, asset_name, asset_type, pricing_type, status, created_at    
//important columns on profile : record_id, asset_code, asset_name, asset_type, pricing_type, status, description, created_at, updated_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages the catalog of assets (products/services) available in the system. Assets represent
billable items that customers can purchase or subscribe to. Each asset can have multiple pricing models
(one-time, recurring, usage-based) and can be sold via orders or subscriptions.

Key relationships:
- Has multiple pricing configurations via asset_pricing table
- Sold through order_items when purchased
- Powers subscriptions for recurring billing
- Grants entitlements for access control
- Tracked through usage_events for metered billing
- Monitored by usage_meters for consumption tracking

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="assets";
  $__page_title ="Digital Asset List";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"assets",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"assets",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           "assets" => ["total_pricing_models", "active_subscriptions", "total_orders", "total_revenue", "active_entitlements"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"status" => "checkblank(getarr_val_(\$assets_node,'status'),'active')"
        ],
      
       "dataRowMutations"=>[
 
         "total_pricing_models" => [
              "type" => "count",
              "table" => "asset_pricing",
              "link"  => "asset_id:record_id"
           ],
         "active_subscriptions" => [
              "type" => "count",
              "table" => "subscriptions",
              "link"  => "asset_id:record_id",
              "where"=>[
                "status"=>"Active"
              ]
           ],         
         "total_revenue" => [
              "type" => "sum",
              "table" => "payments",
              "link"  => "app_id:record_id",
              "column"=>"amount"
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
            "total_pricing_models" => [
                "function" => "await mosyCountRows('asset_pricing', `where asset_id ='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res"
            ],
            "active_subscriptions" => [
                "function" => "await mosyCountRows('subscriptions', `where asset_id ='\${row?.record_id}' and status='active'`)",
                "args" => [],
                "return" => "data_res"
            ],
          //Table name : subscriptions

// columns : "primkey" , "record_id" , "account_id" , "asset_id" , "pricing_id" , "start_date" , "next_billing_date" , "end_date" , "status" , "billing_cycle" , "amount" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , 


            "total_orders" => [
                "function" => "await mosySumRows('subscriptions', `amount`, `where asset_id ='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res"
            ],
            "total_revenue" => [
                "function" => "await mosySumRows('payments', 'amount', `where app_id ='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res"
            ],
            "active_entitlements" => [
                "function" => "await mosyCountRows('entitlements', `where asset_id ='\${row?.record_id}' and access_status='active'`)",
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
            "assets" => ["primkey","record_id","asset_code","asset_name","asset_type","pricing_type","active_subscriptions","total_orders","total_revenue","active_entitlements","status","description","created_at","updated_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "assets" => [
                "Asset Information" => ["asset_code","asset_name","asset_type","status"],
                "Pricing & Billing" => ["pricing_type","total_pricing_models","total_revenue","total_orders","active_entitlements","active_subscriptions"],
                "Description" => ["description"]
            ]
        ],
//Table name : assets

// columns : "primkey" , "record_id" , "asset_code" , "asset_name" , "asset_type" , "pricing_type" , "status" , "description" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "logo" , 


        "image_columns" => ["logo"],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => ["created_at","updated_at"], 
        "print_tables" => ["assets"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","description","updated_at"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => ["total_revenue","total_orders","active_entitlements","active_subscriptions"], 
        "textarea_array" => ["description"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "pricing_type" => "one_time,recurring,usage_based",
            "status" => "active,inactive,archived,draft"
        ],

        "dynamic_drop_down_array" => ["asset_type"], // if its here dont add it to connection_cols and vice versa 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => ["created_at","updated_at"],
        "datetime_columns" => [],

        "rename_cols_array" => [ 
            "asset_code" => "Asset Code",
            "asset_name" => "Asset Name",
            "asset_type" => "Asset Type",
            "pricing_type" => "Pricing Type",
            "status" => "Status",
            "description" => "Description",
            "created_at" => "Created Date",
            "updated_at" => "Last Updated",
            "total_pricing_models" => "Pricing Models",
            "active_subscriptions" => "Active Subscriptions",
            "total_orders" => "Total Orders",
            "total_revenue" => "Total payments",
            "active_entitlements" => "Active Entitlements"
        ],

        "rename_tables_array" => [
            "assets" => "Assets"
        ],

        "new_label_buttons_arr" => [ 
            "assets" => "plus-circle:New Asset:{`Asset / \${assetsNode?.asset_name} / Asset ID -  \${assetsNode?.record_id}`} " // node formart tablenameNode eg acc_renewalsNode
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "assets"=>["csv"=>"asset_code,asset_name,asset_type,pricing_type,status,description","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[
          "assets_list"=>"loadAssets()"
        ],
      
        "custom_query_line_cols" => [], 
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          "asset_pricing_models"=>[
            "table"=>"asset_pricing",
            "link"=>"asset_pricing_list",
            "query"=>"asset_id='{{record_id}}'",
            "title"=>"Pricing Models",
            "columns"=>["record_id","pricing_type","price_model","amount","unit_price","currency","billing_cycle","status"]
          ],
          "asset_subscriptions"=>[
            "table"=>"subscriptions",
            "link"=>"subscriptions_list",
            "query"=>"asset_id='{{record_id}}'",
            "title"=>"Subscriptions",
            "columns"=>["record_id","account_id","status","start_date","next_billing_date","amount","currency"]
          ],
          "asset_orders"=>[
            "table"=>"order_items",
            "link"=>"order_items_list",
            "query"=>"asset_id='{{record_id}}'",
            "title"=>"Order History",
            "columns"=>["record_id","order_id","quantity","unit_price","total_price"]
          ],
          "asset_entitlements"=>[
            "table"=>"entitlements",
            "link"=>"entitlements_list",
            "query"=>"asset_id='{{record_id}}'",
            "title"=>"Access Entitlements",
            "columns"=>["record_id","account_id","access_status","granted_at","expires_at"]
          ],
          "usage_meters"=>[
            "table"=>"usage_meters",
            "link"=>"usage_meters_list",
            "query"=>"asset_id='{{record_id}}'",
            "title"=>"Usage Meters",
            "columns"=>["record_id","meter_code","unit_name","status"]
          ]
        ], 
        "custom_profile_col_data" => ["total_revenue"=>"?","active_entitlements"=>"?","active_subscriptions"=>"?","total_pricing_models"=>"?","total_orders"=>"?"], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           //"category_id" => "asset_categories:record_id:category_name:apiRoutes.assetcategories.base"
        ]
    ]
  
  ];

  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         /*"filter: Filter by Type" => [
             "fe" => "filterByAssetType()",
             "be" => "filterByAssetType()",
             "file" => "asset-filters"
         ]*/
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[

         "tag: Manage Pricing" => [
             "fe" => "addPricingModel()",
             "file" => "asset-pricing"
         ]
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         "tag: View Pricing" => [
             "fe" => "viewPricingModels(listassets_result.record_id)",
             "file" => "asset-details"
         ],
         "users: View Subscriptions" => [
             "fe" => "viewAssetSubscriptions(listassets_result.record_id)",
             "file" => "asset-details"
         ],
         "credit-card: View payments" => [
             "fe" => "viewAssetPayments(listassets_result.record_id)",
             "file" => "asset-details"
         ]          
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
   "assetPricing"=>[ 
     "filter_str"=>" {assetId:btoa(assetsNode?.record_id)}  ",
     "module_name"=>"Manageassetpricing",
     "list_title"=>"Asset Pricing Models",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'managepricing', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ],    
   "payments"=>[ 
     "filter_str"=>" {appId:btoa(assetsNode?.record_id)}  ",
     "module_name"=>"Payments",
     "list_title"=>"Asset payments",
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
    //Table name : subscriptions

// columns : "primkey" , "record_id" , "account_id" , "asset_id" , "pricing_id" , "start_date" , "next_billing_date" , "end_date" , "status" , "billing_cycle" , "amount" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "subscription_name" , 


   "assetSubscriptions"=>[ 
     "filter_str"=>"   {assetId:btoa(assetsNode?.record_id)} ",
     "module_name"=>"Subscriptions",
     "list_title"=>"Active Subscriptions",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'subscriptions', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ],
   /*"assetOrders"=>[ 
     "filter_str"=>" asset_id='\${assetsNode?.record_id}'  ",
     "module_name"=>"OrderItems",
     "list_title"=>"Order History",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'order_items', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ],
   "assetEntitlements"=>[ 
     "filter_str"=>"   asset_id='\${assetsNode?.record_id}'",
     "module_name"=>"Entitlements",
     "list_title"=>"Access Entitlements",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'entitlements', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ]*/
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   "addpricing"=>[ 
     "filter_str"=>" {NodeId:btoa(assetsNode?.asset_id)}",
     "module_name"=>"Manageassetpricing",
     "profile_title"=>"Manage Pricing",
     "custom"=>false,
     "external"=>true,
     "alias"=>'managepricing',      
     "event_name"=>"",
     "event_path"=>"",
     "list_table_name"=>"asset_pricing",
   ]
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{
    _assets_asset_name_asset_id : assetsNode?.asset_name,
    asset_id : assetsNode?.record_id,
    asset_name:assetsNode?.asset_name
  }";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-6 hive_data_cell ";
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
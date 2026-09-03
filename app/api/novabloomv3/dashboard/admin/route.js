import { mosyFlexSelect, mosySecureSelect, toNum } from '../../../apiUtils/dataControl/dataUtils';
import { processAuthToken } from '../../../auth/authManager';

export async function GET(request) {
  const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);

  console.log('🔑 Authorization header:', isTokenValid, authData, tokenError)

  if (!isTokenValid) {
    return Response.json(
      { status: 'unauthorized', message: tokenError },
      { status: 403 }
    );
  }

  const safeHiveSiteId = String(authData.hive_site_id).replace(/'/g, "\\'");

  const totalsAssetsQ = {
    tbl: 'assets',
    colstr: btoa('COUNT(*) as total_assets'),
    q: btoa(`WHERE assets.hive_site_id='${safeHiveSiteId}'`),
  };

  const totalsUsersQ = {
    tbl: 'app_users',
    colstr: btoa('COUNT(*) as total_users'),
    q: btoa(`WHERE app_users.hive_site_id='${safeHiveSiteId}'`),
  };

  const totalsPaymentsQ = {
    tbl: 'payments',
    colstr: btoa('COALESCE(SUM(amount), 0) as total_payments'),
    q: btoa(`WHERE payments.hive_site_id='${safeHiveSiteId}'`),
  };

  const totalsSubscriptionsQ = {
    tbl: 'subscriptions',
    colstr: btoa('COUNT(*) as total_subscriptions'),
    q: btoa(`WHERE subscriptions.hive_site_id='${safeHiveSiteId}'`),
  };

  const subscriptionsPerAssetQ = {
    tbl: 'subscriptions',
    colstr: btoa("COALESCE(a.asset_name, subscriptions.asset_id, 'Unknown') as asset, COUNT(*) as value"),
    q: btoa(`LEFT JOIN assets a ON a.record_id = subscriptions.asset_id WHERE subscriptions.hive_site_id='${safeHiveSiteId}' GROUP BY asset ORDER BY value DESC`),
  };

  const paymentsPerAssetQ = {
    tbl: 'payments',
    colstr: btoa("COALESCE(a.asset_name, payments.app_id, payments.app_id, 'Unknown') as asset, COALESCE(SUM(payments.amount), 0) as value"),
    q: btoa(`LEFT JOIN assets a ON a.record_id = payments.app_id WHERE payments.hive_site_id='${safeHiveSiteId}' GROUP BY asset ORDER BY value DESC`),
  };

  const registrationsPerMonthQ = {
    tbl: 'app_users',
    colstr: btoa("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as value"),
    q: btoa(`WHERE app_users.hive_site_id='${safeHiveSiteId}' GROUP BY month ORDER BY month ASC`),
  };

  const [
    assetsCountRes,
    usersCountRes,
    paymentsTotalRes,
    subscriptionsCountRes,
    subscriptionsPerAssetRes,
    paymentsPerAssetRes,
    registrationsPerMonthRes,
  ] = await Promise.all([
    mosyFlexSelect(totalsAssetsQ),
    mosyFlexSelect(totalsUsersQ),
    mosyFlexSelect(totalsPaymentsQ),
    mosyFlexSelect(totalsSubscriptionsQ),
    mosyFlexSelect(subscriptionsPerAssetQ),
    mosyFlexSelect(paymentsPerAssetQ,{}),
    mosyFlexSelect(registrationsPerMonthQ),
  ]);

  const cardsData = [
    {
      title: 'Total assets',
      value: `${toNum(assetsCountRes?.data?.[0]?.total_assets || 0)}`,
      percentage: '',
      icon: 'FaLayerGroup',
    },
    {
      title: 'Total users',
      value: `${toNum(usersCountRes?.data?.[0]?.total_users || 0)}`,
      percentage: '',
      icon: 'FaUsers',
    },
    {
      title: 'Total payments',
      value: `${toNum(paymentsTotalRes?.data?.[0]?.total_payments || 0, 2)}`,
      percentage: '',
      icon: 'FaCreditCard',
    },
    {
      title: 'Total subscriptions',
      value: `${toNum(subscriptionsCountRes?.data?.[0]?.total_subscriptions || 0)}`,
      percentage: '',
      icon: 'FaCopy',
    },
  ];

  const chartData = [
    {
      title: 'Subscriptions per asset',
      chartType: 'bar',
      dataKey: 'asset',
      data: subscriptionsPerAssetRes?.data ?? [],
      series: [{ key: 'value', color: '#1D951B', name: 'Subscriptions' }],
      height: 350,
      containerClass: 'col-md-12',
    },
    {
      title: 'Payments per asset',
      chartType: 'bar',
      dataKey: 'asset',
      data: paymentsPerAssetRes?.data ?? [],
      series: [{ key: 'value', color: '#2663A6', name: 'Payments' }],
      height: 350,
      containerClass: 'col-md-12',
    },
    {
      title: 'User registrations per month',
      chartType: 'line',
      dataKey: 'month',
      data: registrationsPerMonthRes?.data ?? [],
      series: [{ key: 'value', color: '#000000', name: 'Users' }],
      height: 350,
      containerClass: 'col-md-12',
    },
  ];

  return Response.json({
    status: 'success',
    message: 'Admin dashboard data ready!',
    chart_data: chartData,
    cards_data: cardsData,
  });
}

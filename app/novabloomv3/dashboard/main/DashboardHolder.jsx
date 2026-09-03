'use client';

import { useEffect, useState } from 'react';

import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';
import { MosySpace, MosyTitleTag } from '../../UiControl/componentControl';

import { mosyGetData,  } from '../../../MosyUtils/hiveUtils';

import { MosyNotify , closeMosyModal } from '../../../MosyUtils/ActionModals';

import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';
import SubscriptionsList from '../../subscriptions/uiControl/SubscriptionsList';
import { InteprateSubscriptionsEvent } from '../../subscriptions/dataControl/SubscriptionsRequestHandler';
import PaymentsList from '../../payments/uiControl/PaymentsList';
import { IntepratePaymentsEvent } from '../../payments/dataControl/PaymentsRequestHandler';

const apiRoutes = getApiRoutes(); // Use the imported JSON directly

export default function DashboardHolder() {
  const [chartData, setChartData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
     MosyNotify({message : "Loading chart data" , icon:"line-chart", addTimer:false})
      const response = await mosyGetData({
        endpoint: apiRoutes.dashboard.admin,
        params: {}
      });

      if (response) {

        setChartData(response?.chart_data);
        setCardData(response?.cards_data);
        closeMosyModal()
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
	<>
    <DashboardCards cards={cardData} />
    <div className="col-md-12 p-0 m-0  rounded-xl ">
      <div className="row justify-content-center m-0 p-0  col-md-12">
        <DashboardCharts chartData={chartData} />

      </div>

      <MosySpace spaceClass="p-2" />
      <MosyTitleTag title="Recent payments" />
        <PaymentsList
            dataOut={{setChildDataOut: IntepratePaymentsEvent}} 
            dataIn={{customProfilePath: "../payments/profile",
                showDataControlSections: false,
                customQueryStr: ``}}/>      
      <MosySpace spaceClass="p-2" />
      <MosyTitleTag title="Recent subscriptions" />
        <SubscriptionsList
            dataOut={{setChildDataOut: InteprateSubscriptionsEvent}} 
            dataIn={{customProfilePath: "../subscriptions/profile",
                showDataControlSections: false,
                customQueryStr: ``}}/>
    </div>
    </>

  );
}
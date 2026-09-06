import { getBillingSnapshot } from '../../../api/novabloomv3/billing/billingData';
import { BillingStyles } from '../../../billing/BillingShell';
import PausedView from './PausedView';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Subscription Paused',
    robots: { index: false, follow: false }
  };
}

export default async function PausedPage({ params }) {
  const { assetId, accountId } = await params;
  const snapshot = await getBillingSnapshot(assetId, accountId);

  return (
    <>
      <BillingStyles />
      <PausedView assetId={assetId} accountId={accountId} snapshot={snapshot} />
    </>
  );
}

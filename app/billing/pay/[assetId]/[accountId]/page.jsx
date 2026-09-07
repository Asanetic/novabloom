import { getBillingSnapshot } from '../../../../api/novabloomv3/billing/billingData';
import { BillingStyles } from '../../../BillingShell';
import PayClient from './PayClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Renew Subscription',
    robots: { index: false, follow: false }
  };
}

export default async function BillingPayPage({ params, searchParams }) {
  const { assetId, accountId } = await params;
  const { embedded } = (await searchParams) || {};
  const snapshot = await getBillingSnapshot(assetId, accountId);

  return (
    <>
      <BillingStyles />
      <PayClient assetId={assetId} accountId={accountId} snapshot={snapshot} embedded={embedded === '1'} />
    </>
  );
}

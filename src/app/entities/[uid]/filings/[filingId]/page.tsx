import React from 'react';
import FilingDetailView from './FilingDetailView';

export default async function FilingPage({
  params,
}: {
  params: Promise<{ uid: string; filingId: string }>;
}) {
  const { uid, filingId } = await params;

  return <FilingDetailView uid={uid} filingId={filingId} />;
}

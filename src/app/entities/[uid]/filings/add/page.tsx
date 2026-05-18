import React from 'react';
import AddFilingView from './AddFilingView';

export default async function AddFilingPage({ params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;

    return <AddFilingView uid={uid} />;
}

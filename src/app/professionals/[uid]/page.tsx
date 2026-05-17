import React from 'react';
import ProfessionalViewContent from './ProfessionalViewContent';

export default async function ProfessionalViewPage({ params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;

    return <ProfessionalViewContent uid={uid} />;
}

import React from 'react';
import PersonViewContent from './PersonViewContent';

export default async function PersonViewPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  
  return <PersonViewContent uid={uid} />;
}


import React from 'react';
import EntityViewContent from './EntityViewContent';

export default async function EntityViewPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  return <EntityViewContent uid={uid} />;
}

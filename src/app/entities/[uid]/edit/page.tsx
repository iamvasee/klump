import React from 'react';
import EditEntityContent from './EditEntityContent';

export default async function EditEntityPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  return <EditEntityContent uid={uid} />;
}

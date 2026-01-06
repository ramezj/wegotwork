"use client";
import { useQuery } from "@tanstack/react-query";
import { getCurrentOrganizationAction } from "@/actions/organization/get-current-organization";

export default function DisplayCurrentOrganization() {
  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: () => getCurrentOrganizationAction(),
  });

  return (
    <>
      <p>Current Organization: {organization?.name}</p>
      <p>Current Organization slug: {organization?.slug}</p>
    </>
  );
}

import { Curiosity, User } from "@prisma/client";
import { passThroughSymbol } from "next/dist/server/web/spec-compliant/fetch-event";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface UserWithCuriosities extends User {
  curiosities: Curiosity[];
}
interface UserResponse {
  ok: boolean;
  profile: UserWithCuriosities;
}

interface UseUserProps {
  publicRoute?: string[];
}

export default function useUser({ publicRoute }: UseUserProps) {
  const { data, error } = useSWR<UserResponse>("/api/users/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok && !publicRoute?.includes(router.pathname)) {
      router.replace("/enter");
    }
  }, [data, router, publicRoute]);

  return { user: data?.profile, isLoading: !data && !error };
}

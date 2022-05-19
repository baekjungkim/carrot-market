import { Curiosity, User } from "@prisma/client";
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

export default function useUser() {
  const { data, error } = useSWR<UserResponse>("/api/users/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}

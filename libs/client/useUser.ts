import { User } from "@prisma/client";
import useSWR from "swr";

interface UserWithCuriosityAndAnswers extends User {
  curiosities: {
    postId: number;
  }[];
  answers: {
    postId: number;
  }[];
}

interface ProfileResponse {
  ok: boolean;
  profile: UserWithCuriosityAndAnswers;
}

export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>(
    typeof window === "undefined" ? null : "/api/users/me"
  );
  // const router = useRouter();
  // useEffect(() => {
  //   if (data && !data.ok) {
  //     router.replace("/enter");
  //   }
  // }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
}

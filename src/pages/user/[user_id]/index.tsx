import { MyProfile } from "@/components/pages/MyProfile";
import { AuthNextPage } from "@/types/auth-next-page";

const MyPage: AuthNextPage = () => {
  return <MyProfile />;
};

export default MyPage;
MyPage.requireAuth = true;

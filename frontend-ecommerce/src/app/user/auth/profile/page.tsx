import { LogoutComponent } from "@/app/user/components/auth_components/logoutComponent";
import { ProfileComponent } from "@/app/user/components/auth_components/profileComponent";
import OrderComponent from "@/app/user/components/order_component/OrderComponent";

export default function Profile() {
  return (
    <div>
      <ProfileComponent></ProfileComponent>
      <OrderComponent></OrderComponent>
      {/* <LogoutComponent></LogoutComponent> */}
    </div>
  );
}

import { Tabs } from "antd";
import { useSelector } from "react-redux";
import Inventory from "./inventory";
import Item from "antd/es/list/Item";
import Donars from "./donars";
import Hospitals from "./hospitals";
import Organizations from "./organizations";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.users);

  return (
    <div>
      <Tabs>
        {currentUser.userType === "organization" && (
          <>
            {""}
            <Item tab="Inventory" key="1">
              <Inventory />
            </Item>
            <Item tab="Donars" key="2">
              <Donars />
            </Item>
            <Item tab="Hospitals" key="3">
              <Hospitals />
            </Item>
          </>
        )}

        {currentUser.userType == "donar" && (
          <>
            <Item tab="Donations" key="1"></Item>
            <Item tab="Organizations" key="2">
              <Organizations />
            </Item>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;

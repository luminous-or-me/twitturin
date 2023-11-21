import storageService from "../../services/storageService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/store";
import { removeCredentials } from "../../reducers/authReducer";
import { showModal } from "../../reducers/modalReducer";
import { icons } from "../../assets";
import HeaderButton from "./HeaderButton";
import Menu from "../core/Menu";
import VisibleItems from "../core/Menu/VisibleItems";
import HiddenItems from "../core/Menu/HiddenItems";
import FlatButton from "../core/buttons/FlatButton";

const ProfileMenu = ({ username }: { username: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    storageService.removeAuthUser();

    dispatch(removeCredentials());
  };

  return (
    <Menu>
      <VisibleItems>
        <HeaderButton
          $size="small"
          $bg="transparent"
          $fg="#eeeeee"
          $width="100%"
          onClick={() => navigate("/me")}
        >
          @{username}
        </HeaderButton>
      </VisibleItems>

      <HiddenItems>
        <FlatButton
          icon={<icons.CreateIcon />}
          label="New Tweet"
          onClick={() => dispatch(showModal())}
        />
        <FlatButton
          icon={<icons.EditIcon />}
          label="Edit profile"
          onClick={() => navigate("/me/edit")}
        />
        <FlatButton
          icon={<icons.LogOutIcon />}
          onClick={handleSignOut}
          label="Log out"
        />
      </HiddenItems>
    </Menu>
  );
};

export default ProfileMenu;

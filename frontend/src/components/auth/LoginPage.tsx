import useField from "../../hooks/useField";
import Button from "../core/buttons/Button";
import Input from "../core/inputs/Input";
import { useAppDispatch } from "../../hooks/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLoginMutation } from "../../services/authService";
import { TokenData } from "../../types";
import { setCredentials } from "../../reducers/authReducer";
import { show, hide } from "../../reducers/loadingStripeReducer";
import Heading from "../core/text/Heading";
import Box from "../containers/Box";
import Form from "../core/Form";
import Label from "../core/text/Label";
import RouterLink from "../core/RouterLink";
import styled from "styled-components";

const LoginHeading = () => {
  return (
    <Box $bg="white" $pad="l">
      <Heading $level={2}>Log in to Twittur</Heading>
    </Box>
  );
};

const LoginForm = styled(Form)`
  padding: 1em;
`;

const LoginPage = () => {
  const [, username] = useField("text", "Username");
  const [, password] = useField("password", "Password");

  const [login, { data: tokenData, isLoading, isError, isSuccess }] =
    useLoginMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) dispatch(show());
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(hide());
      navigate(-1);
    }
  }, [navigate, dispatch, isSuccess, tokenData]);

  useEffect(() => {
    if(isError) {
      dispatch(hide());
    }
  }, [isError, dispatch]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tokenData: TokenData = await login({
      username: username.value,
      password: password.value,
    }).unwrap();

    dispatch(setCredentials(tokenData));
  };

  return (
    <Box $gap="0.1em" $width="500px">
      <LoginHeading />

      <Box $bg="white" $pad="l">
        <Label>
          Not a member yet? <RouterLink to="/sign-up">Join now!</RouterLink>
        </Label>
      </Box>

      <LoginForm onSubmit={handleLogin}>
        <Input {...username} required />

        <Input {...password} required />

        <Button $width="100%">Log in</Button>
      </LoginForm>
    </Box>
  );
};

export default LoginPage;

import { useState } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  Spinner
} from "reactstrap";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/slices/auth";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      if (!email || !password) {
        setEmailError(!email ? "Email is required" : null);
        setPasswordError(!password ? "Password is required" : null);
        return;
      }

      if (email && password) {
        setEmailError(null);
        setPasswordError(null);
      }

      setIsLoading(true);
      const res = await axios.post("/auth/login", { email, password });
      dispatch(login(res.data));
      setLoginError(null);
    } catch (error) {
      setLoginError(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (auth.isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  return (
    <Container>
      <div className="h-100vh">
        <Container className="h-100" fluid>
          <Row className="justify-content-center align-items-center h-100">
            <Col lg={12} className="loginContainer">
              <div className="p-4 d-flex justify-content-center gap-2">
                <h1 className="fw-bolder text-primary">Calorie Tracker</h1>
              </div>
              <Card>
                <CardBody className="p-4 m-1">
                  <h4 className="mb-0 fw-bold">Login</h4>
                  <small className="pb-4 d-block text-danger">
                    {loginError}
                  </small>
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        invalid={emailError ? true : false}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onBlur={() =>
                          !email
                            ? setEmailError("Email is required")
                            : setEmailError(null)
                        }
                      />
                      <FormFeedback>{emailError}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input
                        name="password"
                        type="password"
                        invalid={passwordError ? true : false}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onBlur={() =>
                          !password
                            ? setPasswordError("Password is required")
                            : setPasswordError(null)
                        }
                      />
                      <FormFeedback>{passwordError}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Spinner size="sm" className="me-2">
                              Loading...
                            </Spinner>
                            <span>Login</span>
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
}

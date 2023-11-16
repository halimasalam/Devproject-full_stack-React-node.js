import { useState, useEffect } from "react";
import {
  Navbar,
  Collapse,
  Nav,
  NavbarBrand,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Spinner,
  UncontrolledTooltip
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth";

const Header = ({ showMobmenu }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formFieldError, setFormFieldError] = useState({});

  useEffect(() => {
    if (!modal) {
      setName("");
      setEmail("");
      setFormFieldError({});
    }
  }, [modal]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      if (!name || !email) {
        setFormFieldError({
          name: !name ? "Name is required" : "",
          email: !email ? "Email is required" : ""
        });
        return;
      }
      setIsLoading(true);
      const data = { name, email };
      const res = await axios.post("/invite", data);
      toast.success(res.data.message);
      toggleModal();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar color="primary" dark expand="md">
        <div className="d-flex align-items-center">
          <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
            <i className="bi bi-list"></i>
          </Button>
          <NavbarBrand href="/" className="d-lg-none">
            <h5 className="mb-0 ms-2">Calorie Tracker</h5>
          </NavbarBrand>
        </div>
        <div className="hstack gap-2">
          <Button
            color="primary"
            size="sm"
            className="d-sm-block d-md-none"
            onClick={Handletoggle}>
            {isOpen ? (
              <i className="bi bi-x"></i>
            ) : (
              <i className="bi bi-three-dots-vertical"></i>
            )}
          </Button>
        </div>
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto text-white" navbar>
            {auth.email}
          </Nav>
          {!auth.isAdmin && (
            <Button
              outline
              color="primary"
              className="bg-white text-primary"
              onClick={toggleModal}>
              <i className="bi bi-people me-2"></i>
              <span>Invite a friend</span>
            </Button>
          )}
          <Button
            outline
            color="primary"
            id="logoutBtn"
            className="bg-white text-primary ms-4"
            onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </Button>
          <UncontrolledTooltip placement="bottom" target="logoutBtn">
            Logout
          </UncontrolledTooltip>
        </Collapse>
      </Navbar>
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Invite a friend</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={e => {
                  if (e.target.value) {
                    setFormFieldError({
                      ...formFieldError,
                      name: ""
                    });
                  }
                  setName(e.target.value);
                }}
                invalid={formFieldError?.name ? true : false}
                onBlur={() =>
                  !name &&
                  setFormFieldError({
                    ...formFieldError,
                    name: "Name is required"
                  })
                }
              />
              <FormFeedback>{formFieldError?.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => {
                  if (e.target.value) {
                    setFormFieldError({
                      ...formFieldError,
                      email: ""
                    });
                  }
                  setEmail(e.target.value);
                }}
                invalid={formFieldError?.email ? true : false}
                onBlur={() =>
                  !email &&
                  setFormFieldError({
                    ...formFieldError,
                    email: "Email is required"
                  })
                }
              />
              <FormFeedback>{formFieldError?.email}</FormFeedback>
            </FormGroup>
            <Button color="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="me-2">
                    Loading...
                  </Spinner>
                  <span>Send Invite</span>
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  <span>Send Invite</span>
                </>
              )}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Header;

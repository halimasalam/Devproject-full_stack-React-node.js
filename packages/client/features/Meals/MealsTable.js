import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
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
  Alert
} from "reactstrap";
import useMealsLogic from "./useMealsLogic";

const MealsTable = () => {
  const mealProps = useMealsLogic();

  if (!mealProps) return <></>;

  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-space-between align-items-center">
            <div className="d-flex flex-column">
              <CardTitle tag="h5">Meals</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                List of existing meals
              </CardSubtitle>
            </div>
            <Button
              color="primary"
              className="ms-auto"
              onClick={mealProps.toggleModal}>
              <i className="bi bi-plus-lg me-2"></i>
              <span>Add Meal</span>
            </Button>
          </div>
          {mealProps.meals.length > 0 ? (
            <div className="table-responsive">
              <Table
                className="text-nowrap mt-3 align-middle"
                borderless
                striped>
                <thead>
                  <tr>
                    <th>Meal Name</th>
                    <th>Food Per Meal</th>
                    {mealProps.auth.isAdmin && <th>User</th>}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mealProps.meals.map(meal => (
                    <tr key={meal._id} className="border-top">
                      <td>
                        <h6 className="mb-0">{meal.name}</h6>
                      </td>
                      <td>{meal.maxFoodEntries}</td>
                      {mealProps.auth.isAdmin && <td>{meal.user.name}</td>}
                      <td>
                        <Button
                          color="link"
                          className="p-0 me-3"
                          onClick={() => mealProps.handleEditClick(meal._id)}>
                          <i className="bi bi-pencil-square text-warning"></i>
                        </Button>
                        <Button
                          color="link"
                          className="p-0"
                          onClick={() => mealProps.handleDeleteClick(meal._id)}>
                          {mealProps.deletingId === meal._id ? (
                            <Spinner size="sm" className="text-danger">
                              Loading...
                            </Spinner>
                          ) : (
                            <i className="bi bi-trash text-danger"></i>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert color="primary" className="mt-3">
              There are no existing meal. Click the button to add a new meal
            </Alert>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={mealProps.modal} toggle={mealProps.toggleModal} centered>
        <ModalHeader toggle={mealProps.toggleModal}>Meal</ModalHeader>
        <ModalBody>
          <Form onSubmit={mealProps.handleSubmit}>
            {mealProps.auth.isAdmin && (
              <FormGroup>
                <Label for="user">User</Label>
                <Input
                  id="user"
                  name="user"
                  type="select"
                  value={mealProps.user}
                  onChange={e => {
                    if (e.target.value) {
                      mealProps.setFormFieldError({
                        ...mealProps.formFieldError,
                        user: ""
                      });
                    }
                    mealProps.setUser(e.target.value);
                  }}
                  disabled={mealProps.isEditing}
                  invalid={mealProps.formFieldError?.user ? true : false}
                  onBlur={() =>
                    !mealProps.user &&
                    mealProps.setFormFieldError({
                      ...mealProps.formFieldError,
                      user: "User is required"
                    })
                  }>
                  <option value=""></option>
                  {mealProps.users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{mealProps.formFieldError?.user}</FormFeedback>
              </FormGroup>
            )}
            <FormGroup>
              <Label for="name">Meal Name</Label>
              <Input
                id="name"
                name="name"
                value={mealProps.name}
                onChange={e => {
                  if (e.target.value) {
                    mealProps.setFormFieldError({
                      ...mealProps.formFieldError,
                      name: ""
                    });
                  }
                  mealProps.setName(e.target.value);
                }}
                invalid={mealProps.formFieldError?.name ? true : false}
                onBlur={() =>
                  !mealProps.name &&
                  mealProps.setFormFieldError({
                    ...mealProps.formFieldError,
                    name: "Meal Name is required"
                  })
                }
              />
              <FormFeedback>{mealProps.formFieldError?.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="maxFoodEntries">Maximum Food Entries</Label>
              <Input
                id="maxFoodEntries"
                name="maxFoodEntries"
                type="number"
                value={mealProps.maxFoodEntries}
                onChange={mealProps.handleMaxFoodEntriesChange}
                invalid={
                  mealProps.formFieldError?.maxFoodEntries ? true : false
                }
                onBlur={() =>
                  !mealProps.maxFoodEntries &&
                  mealProps.setFormFieldError({
                    ...mealProps.formFieldError,
                    maxFoodEntries: "Maximum Food Entries is required"
                  })
                }
              />
              <FormFeedback>
                {mealProps.formFieldError?.maxFoodEntries}
              </FormFeedback>
            </FormGroup>
            <Button color="primary" disabled={mealProps.isLoading}>
              {mealProps.isLoading ? (
                <>
                  <Spinner size="sm" className="me-2">
                    Loading...
                  </Spinner>
                  <span>Save</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default MealsTable;

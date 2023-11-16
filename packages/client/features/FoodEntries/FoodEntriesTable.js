import Link from "next/link";
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
import useFoodEntriesLogic from "./useFoodEntriesLogic";

const FoodEntriesTable = () => {
  const foodEntriesProps = useFoodEntriesLogic();

  if (!foodEntriesProps) return <></>;

  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-space-between align-items-center">
            <div className="d-flex flex-column">
              <CardTitle tag="h5">Food Entries</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                List of existing food entries
              </CardSubtitle>
            </div>
            <Button
              color="primary"
              className="ms-auto"
              onClick={foodEntriesProps.toggleModal}>
              <i className="bi bi-plus-lg me-2"></i>
              <span>Add Food Entry</span>
            </Button>
          </div>
          {foodEntriesProps.foodEntries.length > 0 ? (
            <div className="table-responsive">
              <Table
                className="text-nowrap mt-3 align-middle"
                borderless
                striped>
                <thead>
                  <tr>
                    <th>Food Name</th>
                    <th>Calorie</th>
                    <th>Date</th>
                    <th>Meal</th>
                    {foodEntriesProps.auth.isAdmin && <th>User</th>}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {foodEntriesProps.foodEntries
                    .slice()
                    .map(foodEntry => ({
                      ...foodEntry,
                      newDate: new Date(foodEntry.date)
                    }))
                    .sort((a, b) => Number(b.newDate) - Number(a.newDate))
                    .map(foodEntry => (
                      <tr key={foodEntry._id} className="border-top">
                        <td>
                          <h6 className="mb-0">{foodEntry.foodName}</h6>
                        </td>
                        <td>{foodEntry.calorie}</td>
                        <td>{foodEntry.date.split("T")[0]}</td>
                        <td
                          className={`${!foodEntry.meal ? "text-muted" : ""}`}>
                          {foodEntry.meal?.name ?? "No meal"}
                        </td>
                        {foodEntriesProps.auth.isAdmin && (
                          <td
                            className={`${
                              !foodEntry.user ? "text-muted" : ""
                            }`}>
                            {foodEntry.user?.name ?? "N/A"}
                          </td>
                        )}
                        <td>
                          <Button
                            color="link"
                            className="p-0 me-3"
                            onClick={() =>
                              foodEntriesProps.handleEditClick(foodEntry._id)
                            }>
                            <i className="bi bi-pencil-square text-warning"></i>
                          </Button>
                          <Button
                            color="link"
                            className="p-0"
                            onClick={() =>
                              foodEntriesProps.handleDeleteClick(foodEntry._id)
                            }>
                            {foodEntriesProps.deletingId === foodEntry._id ? (
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
              There are no existing food entry. Click the button to add a new
              food entry
            </Alert>
          )}
        </CardBody>
      </Card>
      <Modal
        isOpen={foodEntriesProps.modal}
        toggle={foodEntriesProps.toggleModal}
        centered>
        <ModalHeader toggle={foodEntriesProps.toggleModal}>
          Food Entry
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={foodEntriesProps.handleSubmit}>
            {foodEntriesProps.auth.isAdmin && (
              <FormGroup>
                <Label for="user">User</Label>
                <Input
                  id="user"
                  name="user"
                  type="select"
                  value={foodEntriesProps.user}
                  onChange={e => {
                    if (e.target.value) {
                      foodEntriesProps.setFormFieldError({
                        ...foodEntriesProps.formFieldError,
                        user: ""
                      });
                    }
                    foodEntriesProps.setUser(e.target.value);
                  }}
                  disabled={foodEntriesProps.isEditing}
                  invalid={foodEntriesProps.formFieldError?.user ? true : false}
                  onBlur={() =>
                    !foodEntriesProps.user &&
                    foodEntriesProps.setFormFieldError({
                      ...foodEntriesProps.formFieldError,
                      user: "User is required"
                    })
                  }>
                  <option value=""></option>
                  {foodEntriesProps.users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </Input>
                <FormFeedback>
                  {foodEntriesProps.formFieldError?.user}
                </FormFeedback>
              </FormGroup>
            )}
            {!foodEntriesProps.auth.isAdmin ||
            (foodEntriesProps.auth.isAdmin && foodEntriesProps.user) ? (
              <>
                <FormGroup>
                  <Label for="foodName">Food Name</Label>
                  <Input
                    id="foodName"
                    name="foodName"
                    value={foodEntriesProps.foodName}
                    onChange={e => {
                      if (e.target.value) {
                        foodEntriesProps.setFormFieldError({
                          ...foodEntriesProps.formFieldError,
                          foodName: ""
                        });
                      }
                      foodEntriesProps.setFoodName(e.target.value);
                    }}
                    invalid={
                      foodEntriesProps.formFieldError?.foodName ? true : false
                    }
                    onBlur={() =>
                      !foodEntriesProps.foodName &&
                      foodEntriesProps.setFormFieldError({
                        ...foodEntriesProps.formFieldError,
                        foodName: "Food Name is required"
                      })
                    }
                  />
                  <FormFeedback>
                    {foodEntriesProps.formFieldError?.foodName}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="calorie">Calorie</Label>
                  <Input
                    id="calorie"
                    name="calorie"
                    type="number"
                    value={foodEntriesProps.calorie}
                    onChange={foodEntriesProps.handleCalorieChange}
                    invalid={
                      foodEntriesProps.formFieldError?.calorie ? true : false
                    }
                    onBlur={() =>
                      !foodEntriesProps.calorie &&
                      foodEntriesProps.setFormFieldError({
                        ...foodEntriesProps.formFieldError,
                        calorie: "Calorie is required"
                      })
                    }
                  />
                  <FormFeedback>
                    {foodEntriesProps.formFieldError?.calorie}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    max={foodEntriesProps.todayRef.current}
                    pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                    value={foodEntriesProps.date}
                    onChange={e => {
                      if (
                        new Date(e.target.value) >
                        new Date(foodEntriesProps.todayRef.current)
                      ) {
                        foodEntriesProps.setFormFieldError({
                          ...foodEntriesProps.formFieldError,
                          date: "Date is too high"
                        });
                      } else if (e.target.value) {
                        foodEntriesProps.setFormFieldError({
                          ...foodEntriesProps.formFieldError,
                          date: ""
                        });
                      }
                      foodEntriesProps.setDate(e.target.value);
                    }}
                    invalid={
                      foodEntriesProps.formFieldError?.date ? true : false
                    }
                    onBlur={() =>
                      !foodEntriesProps.date &&
                      foodEntriesProps.setFormFieldError({
                        ...foodEntriesProps.formFieldError,
                        date: "Date is required"
                      })
                    }
                  />
                  <FormFeedback>
                    {foodEntriesProps.formFieldError?.date}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="meal">Meal</Label>
                  <Input
                    id="meal"
                    name="meal"
                    type="select"
                    value={foodEntriesProps.meal}
                    onChange={e => {
                      if (e.target.value) {
                        foodEntriesProps.setFormFieldError({
                          ...foodEntriesProps.formFieldError,
                          meal: ""
                        });
                      }
                      foodEntriesProps.setMeal(e.target.value);
                    }}
                    invalid={
                      foodEntriesProps.formFieldError?.meal ? true : false
                    }
                    onBlur={() =>
                      !foodEntriesProps.meal &&
                      foodEntriesProps.setFormFieldError({
                        ...foodEntriesProps.formFieldError,
                        meal: "Meal is required"
                      })
                    }>
                    <option value=""></option>
                    {foodEntriesProps.meals
                      .filter(meal =>
                        foodEntriesProps.auth.isAdmin && foodEntriesProps.user
                          ? meal.user._id === foodEntriesProps.user
                          : true
                      )
                      .map(meal => (
                        <option key={meal._id} value={meal._id}>
                          {meal.name}
                        </option>
                      ))}
                  </Input>
                  <FormFeedback>
                    {foodEntriesProps.formFieldError?.meal}
                  </FormFeedback>
                </FormGroup>
                {foodEntriesProps.meals.length < 1 && (
                  <Alert color="primary" className="d-flex mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    <span className="me-1 fs-6">No meal add yet,</span>
                    <Link href="/meals?add">
                      <a className="no-underline fs-6">Add Meal</a>
                    </Link>
                  </Alert>
                )}
              </>
            ) : null}
            <Button color="primary" disabled={foodEntriesProps.isLoading}>
              {foodEntriesProps.isLoading ? (
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

export default FoodEntriesTable;

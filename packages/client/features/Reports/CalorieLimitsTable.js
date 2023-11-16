import { useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Alert
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCalorieLimits } from "../../store/slices/calorieLimits";
import axios from "axios";
import { toast } from "react-toastify";

const CalorieLimitsTable = () => {
  const dispatch = useDispatch();
  const { calorieLimits } = useSelector(state => state.calorieLimits);

  useEffect(() => {
    fetchCalorieLimits();
  }, []);

  const fetchCalorieLimits = async () => {
    try {
      const res = await axios.get("/reports/getCaloriesLimitPerDay");
      dispatch(setCalorieLimits(res.data));
    } catch (error) {
      if (error?.response?.status === 404) return;
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-space-between align-items-center">
          <div className="d-flex flex-column">
            <CardTitle tag="h5">Calorie Limit</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              List of calorie limit reached per day
            </CardSubtitle>
          </div>
        </div>
        {calorieLimits.length > 0 ? (
          <div className="table-responsive">
            <Table className="text-nowrap mt-3 align-middle" borderless striped>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Calorie</th>
                </tr>
              </thead>
              <tbody>
                {calorieLimits
                  .slice()
                  .map(calorieLimit => ({
                    ...calorieLimit,
                    newDate: new Date(calorieLimit.date)
                  }))
                  .sort((a, b) => Number(b.newDate) - Number(a.newDate))
                  .map(calorieLimit => (
                    <tr key={calorieLimit.date} className="border-top">
                      <td>
                        <h6 className="mb-0">{calorieLimit.date}</h6>
                      </td>
                      <td>{calorieLimit.calorie}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Alert color="primary" className="mt-3">
            There are no calorie limit reached for any day
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default CalorieLimitsTable;

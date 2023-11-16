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
import { setAverageCalories } from "../../store/slices/averageCalories";
import axios from "axios";
import { toast } from "react-toastify";

const AverageCaloriesTable = () => {
  const dispatch = useDispatch();
  const { averageCalories } = useSelector(state => state.averageCalories);

  useEffect(() => {
    fetchAverageCalories();
  }, []);

  const fetchAverageCalories = async () => {
    try {
      const res = await axios.get("/reports/getAverageCaloriesPerUser");
      dispatch(setAverageCalories(res.data));
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
            <CardTitle tag="h5">Average Calories</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              List of average calories per user in the last 7 days
            </CardSubtitle>
          </div>
        </div>
        {averageCalories.length > 0 ? (
          <div className="table-responsive">
            <Table className="text-nowrap mt-3 align-middle" borderless striped>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Average Calories</th>
                </tr>
              </thead>
              <tbody>
                {averageCalories.map(data => (
                  <tr key={data._id} className="border-top">
                    <td>
                      <h6 className="mb-0">{data.name}</h6>
                    </td>
                    <td>{data.averageCalories}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Alert color="primary" className="mt-3">
            There are no average calories per user
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default AverageCaloriesTable;

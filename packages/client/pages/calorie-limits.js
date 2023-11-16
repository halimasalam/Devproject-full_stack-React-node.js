import Head from "next/head";
import { Col, Row } from "reactstrap";
import CalorieLimitsTable from "../features/Reports/CalorieLimitsTable";
import TopCards from "../features/Reports/TopCards";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function CalorieLimits({ recentFoodCount }) {
  const router = useRouter();
  const { caloriesLimitPerDay, isAdmin } = useSelector(state => state.auth);
  const { foodEntries } = useSelector(state => state.foodEntries);
  const { meals } = useSelector(state => state.meals);
  const { calorieLimits } = useSelector(state => state.calorieLimits);

  if (isAdmin) {
    router.push("/dashboard");
    return <></>;
  }

  return (
    <div>
      <Head>
        <title>Calorie Tracker | Calorie Limits</title>
        <meta name="description" content="Calorie app - calorie limit page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/***Top Cards***/}
        <Row>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-success text-success"
              subtitle={
                foodEntries.length <= 1
                  ? `${isAdmin ? "Total " : ""}Food Entry`
                  : `${isAdmin ? "Total " : ""}Food Entries`
              }
              value={foodEntries.length}
              icon="bi bi-basket"
            />
          </Col>
          {isAdmin && (
            <>
              <Col sm="6" lg="3">
                <TopCards
                  bg="bg-light-info text-info"
                  subtitle="Entries (This Week)"
                  value={recentFoodCount?.currentWeekFoodEntries || 0}
                  icon="bi bi-calendar-week"
                />
              </Col>
              <Col sm="6" lg="3">
                <TopCards
                  bg="bg-light-danger text-danger"
                  subtitle="Entries (Last Week)"
                  value={recentFoodCount?.lastWeekFoodEntries || 0}
                  icon="bi bi-calendar4-week"
                />
              </Col>
            </>
          )}
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-warning text-warning"
              subtitle={
                meals.length <= 1
                  ? `${isAdmin ? "Total " : ""}Meal`
                  : `${isAdmin ? "Total " : ""}Meals`
              }
              value={meals.length}
              icon="bi bi-egg-fried"
            />
          </Col>
          {!isAdmin && (
            <>
              <Col sm="6" lg="3">
                <TopCards
                  bg="bg-light-info text-info"
                  subtitle="Calorie limit reached"
                  value={calorieLimits.length}
                  icon="bi bi-activity"
                />
              </Col>
              <Col sm="6" lg="3">
                <TopCards
                  bg="bg-light-danger text-danger"
                  subtitle="Calorie Limit Per Day"
                  value={caloriesLimitPerDay}
                  icon="bi bi-bar-chart"
                />
              </Col>
            </>
          )}
        </Row>
        {/***Table***/}
        <Row>
          <Col lg="12" sm="12">
            <CalorieLimitsTable />
          </Col>
        </Row>
      </div>
    </div>
  );
}

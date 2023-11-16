import { Card, CardBody } from "reactstrap";
import PropTypes from "prop-types";

const TopCards = ({ bg, icon, value, subtitle }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <div className={`circle-box lg-box d-inline-block ${bg}`}>
            <i className={icon} />
          </div>
          <div className="ms-3">
            <h3 className="mb-0 font-weight-bold">{value}</h3>
            <small className="text-muted">{subtitle}</small>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

TopCards.propTypes = {
  bg: PropTypes.string,
  icon: PropTypes.string,
  value: PropTypes.number,
  subtitle: PropTypes.string
};

export default TopCards;

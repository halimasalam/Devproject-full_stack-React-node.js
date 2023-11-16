import { Button, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const navigations = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "bi bi-speedometer2"
  },
  {
    title: "Meals",
    href: "/meals",
    icon: "bi bi-egg-fried"
  }
];

const adminNavigations = [
  ...navigations,
  {
    title: "Reports",
    href: "/reports",
    icon: "bi bi-clipboard-data"
  }
];

const userNavigations = [
  ...navigations,
  {
    title: "Calorie Limits",
    href: "/calorie-limits",
    icon: "bi bi-activity"
  }
];

const Sidebar = ({ showMobilemenu }) => {
  const router = useRouter();
  const location = router.pathname;
  const auth = useSelector(state => state.auth);

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <h4 className="mb-0 ms-2 text-primary flex-grow-1">Calorie Tracker</h4>
        <Button
          size="sm"
          className="d-lg-none btn-close"
          onClick={showMobilemenu}></Button>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {(auth.isAdmin ? adminNavigations : userNavigations).map(
            (navi, index) => (
              <NavItem key={index} className="sidenav-bg">
                <Link href={navi.href}>
                  <a
                    className={
                      location === navi.href
                        ? "text-primary nav-link py-3"
                        : "nav-link text-secondary py-3"
                    }>
                    <i className={navi.icon}></i>
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  </a>
                </Link>
              </NavItem>
            )
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;

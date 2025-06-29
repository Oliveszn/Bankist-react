import Balance from "../components/Balance";
import Movements from "../components/Movements";
import Summary from "../components/Summary";
import Transaction from "../components/Transaction";

const Dashboard = () => {
  return (
    <div className="">
      <Balance />
      <Movements />
      <Transaction />
      <Summary />
      {/* <LogoutTimer /> */}
    </div>
  );
};

export default Dashboard;

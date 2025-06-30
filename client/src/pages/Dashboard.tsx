import Balance from "../components/Balance";
import Movements from "../components/Movements";
import Summary from "../components/Summary";
import Transaction from "../components/Transaction";

const Dashboard = () => {
  return (
    // <div className="">
    //   <Balance />
    //   <Movements />
    //   <Transaction />
    //   <Summary />
    // </div>
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <Balance />
            <Movements />
            <Summary />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Transaction />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

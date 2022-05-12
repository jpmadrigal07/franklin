import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const topButtonStyle =
    "bg-white rounded-lg shadow-lg py-[15px] px-[8px] text-center text-primary font-bold hover:cursor-pointer hover:shadow-xl active:bg-light";
  return (
    <>
      <div className="grid grid-cols-5 gap-4 mt-3 px-[200px] py-[20px] mb-10">
        <span
          className={topButtonStyle}
          onClick={() => navigate("/customers/add")}
        >
          Add Customer
        </span>
        <span
          className={topButtonStyle}
          onClick={() => navigate("/orders/diy/add")}
        >
          Add DIY
        </span>
        <span
          className={topButtonStyle}
          onClick={() => navigate("/orders/dropoff/add")}
        >
          Add Drop-off
        </span>
        <span
          className={topButtonStyle}
          onClick={() => navigate("/orders/dropoff/add/extra")}
        >
          Add Extra Drop-off
        </span>
        <span
          className={topButtonStyle}
          onClick={() => navigate("/inventory/add")}
        >
          Add Inventory
        </span>
      </div>
    </>
  );
};

export default Header;

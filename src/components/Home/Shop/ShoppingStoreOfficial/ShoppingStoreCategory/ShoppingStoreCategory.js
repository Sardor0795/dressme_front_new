import React, { useContext } from "react";
import ShopOfficialCard from "./ShopOfficialCards/ShopOfficialCard";
import { dressMainData } from "../../../../../ContextHook/ContextMenu";
import { ShopOfficialBrand } from "./ShopOfficialBrand/ShopOfficialBrand";

const ShoppingStoreCategory = () => {
  const [dressInfo, setDressInfo] = useContext(dressMainData);

  return (
    <div className="max-w-[1280px] w-[100%]  flex justify-center items-center m-auto">
      <div className="w-[100%] h-fit">
        <div className="w-full flex flex-gap-6 justify-between md:my-10 my-3">
          <div className="hidden md:block md:w-[22%] h-full ss:px-4 md:px-0">
            <ShopOfficialBrand />
          </div>
          <div className={`w-full h-fit md:hidden absolute  top-0 ${
              dressInfo?.openShopIdFilter ? "ml-[1px]" : "ml-[-1000px]"
            }   bg-white z-[105] duration-500`}
          >
            <ShopOfficialBrand />
          </div>
          <div className="md:w-[77%] w-full h-[full] ss:px-4 md:px-0">
            <ShopOfficialCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingStoreCategory;

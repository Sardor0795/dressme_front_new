import React, { useContext, useEffect, useState } from "react";
import ShoppingStoreOfficialBreadCrumb from "./ShoppingStoreOfficialBreadcrumb/ShoppingStoreOfficialBreadcrumb";
import ShoppingStoreOfficialTop from "./ShoppingStoreOfficialTop/ShoppingStoreOfficialTop";
import ShowPageComment from "./ShowPageComment/ShowPageComment";
import { GoBackIcon } from "../../../../assets/icons";
import { useNavigate, useParams } from "react-router-dom";
import { dressMainData } from "../../../../ContextHook/ContextMenu";
import { HomeMainDataContext } from "../../../../ContextHook/HomeMainData";
import ShopOfficialCard from "./ShoppingStoreCategory/ShopOfficialCards/ShopOfficialCard";
import FilterList from "./ShoppingStoreCategory/FilterList/FilterList";
import axios from "axios";
import LoadingNetwork from "../../../Loading/LoadingNetwork";
import YandexLocationShop from "./ShoppingStoreCategory/YandexLocationShop/YandexLocationShop";
// filteredData?.shop?.approved_shop_locations[dressInfo?.locationIdParams - 1]
const ShoppingStoreOfficialByLocation = () => {
  const [dressInfo, setDressInfo] = useContext(dressMainData);
  const [data, setData] = useContext(HomeMainDataContext);

  // const [error, setError] = useState(false);
  const [openTabComment, setOpenTabComment] = useState(false);
  const [openTabLocation, setOpenTabLocation] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const [pageId, setPageId] = useState(1);

  const [getGenderId, setGetGenderId] = useState(null);
  const [getCategory, setGetCategory] = useState(null);
  const [getRating, setGetRating] = useState(null);
  const [getRange, setGetRange] = useState(null);
  const [dataColor, setDataColor] = useState([]);
  const [discount, setDiscount] = useState(false);
  const [getOutWearList, setGetOutWearList] = useState(null);
  const [getUnderWearList, setGetUnderWearList] = useState(null);
  const [getFootWearList, setGetFootWearList] = useState(null);
  const [filterToggle, setFilterToggle] = useState(false);
  const [openMobileFilter, setOpenMobileFilter] = useState(false);

  const toggleFilterOpen = React.useCallback(() => setFilterToggle(true), []);
  const toggleFilterClose = React.useCallback(() => setFilterToggle(false), []);

  useEffect(() => {
    if (dressInfo?.openShopIdFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [dressInfo?.openShopIdFilter]);

  const genderId = (childData) => {
    setGetGenderId(childData);
    setPageId(1);
  };
  function discountId(childData) {
    setDiscount(childData);
    setPageId(1);
  }
  const categoryId = (childData) => {
    setGetCategory(childData);
    setPageId(1);
  };
  const getBadgePrice = (childData) => {
    setGetRange(childData);
    setPageId(1);
  };
  const getRatingList = (childData) => {
    setGetRating(childData);
    setPageId(1);
  };
  const outWearList = (childData) => {
    setGetOutWearList(childData);
    setPageId(1);
  };
  const underWearList = (childData) => {
    setGetUnderWearList(childData);
    setPageId(1);
  };
  const footWearList = (childData) => {
    setGetFootWearList(childData);
    setPageId(1);
  };

  const clickButtons = {
    openTabComment,
    setOpenTabComment, 
    openTabLocation,
    setOpenTabLocation,
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  const navigate = useNavigate();
  const { id } = useParams();
  const newId = id.replace(":", "");

  const refreshLocationId = () => {
    if (data?.selectedLoc === "changed") {
      data?.getMainProductCard?.shops?.map((item) => {
        if (item?.id === Number(newId)) {
          if (dressInfo?.mainSubRegionId) {
            let foundElement = item?.approved_shop_locations.find(function (
              element
            ) {
              return (
                Number(element.sub_region_id) === dressInfo?.mainSubRegionId
              );
            });
            setDressInfo({
              ...dressInfo,
              locationIdParams: foundElement?.id,
            });
            let index = item?.approved_shop_locations.findIndex(function (
              element
            ) {
              return (
                Number(element.sub_region_id) === dressInfo?.mainSubRegionId
              );
            });
            if (index === -1) {
              navigate("/");
            }
          }
          if (!dressInfo?.mainSubRegionId) {
            setDressInfo({
              ...dressInfo,
              locationIdParams: item?.approved_shop_locations[0]?.id,
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    refreshLocationId();

    setData({ ...data, selectedLoc: "changed" });
  }, [newId, dressInfo?.mainSubRegionId]);

  const url = `https://api.dressme.uz/api`;

  const fetchGetAllData = () => {
    // setLoading(true)
    let params = new URLSearchParams();
    params.append("location_id", dressInfo?.locationIdParams);
    dressInfo?.mainSearchNameCatalog &&
      params.append("keywords", dressInfo?.mainSearchNameCatalog);
    getGenderId && params.append("gender", getGenderId);
    discount && params.append("discount", discount);
    getCategory && params.append("category", getCategory);
    getRating && params.append("rating", getRating);
    getFootWearList?.wear_size &&
      params.append("footwear_size", getFootWearList?.wear_size);
    // OUTWEAR SIZES
    getOutWearList?.letter_size &&
      params.append("outwear_size[letter_size]", getOutWearList?.letter_size);
    !getOutWearList?.letter_size &&
      getOutWearList?.min_wear_size &&
      params.append(
        "outwear_size[min_wear_size]",
        getOutWearList?.min_wear_size
      );
    !getOutWearList?.letter_size &&
      getOutWearList?.max_wear_size &&
      params.append(
        "outwear_size[max_wear_size]",
        getOutWearList?.max_wear_size
      );
    // UNDERWEAR SIZES
    getUnderWearList?.letter_size &&
      params.append(
        "underwear_size[letter_size]",
        getUnderWearList?.letter_size
      );
    !getUnderWearList?.letter_size &&
      getUnderWearList?.min_wear_size &&
      params.append(
        "underwear_size[min_wear_size]",
        getUnderWearList?.min_wear_size
      );
    !getUnderWearList?.letter_size &&
      getUnderWearList?.max_wear_size &&
      params.append(
        "underwear_size[max_wear_size]",
        getUnderWearList?.max_wear_size
      );
    pageId && params.append("page", pageId);
    getRange?.min && params.append("budget[from]", getRange?.min);
    getRange?.max && params.append("budget[to]", getRange?.max);
    dataColor?.length > 0 &&
      dataColor?.forEach((e, index) => {
        params.append("colors[]", dataColor[index]);
      });

    axios
      .get(`${url}/main/shops/${newId}?`, {
        params: params,
      })
      .then((res) => {
        if (res?.status >= 200 && res?.status < 300) {
          // setLoading(false)
          setFilteredData(res?.data);
        }
      })
      .catch((res) => {
        if (res?.response?.status === 422) {
          refreshLocationId();
          // setLoading(false)
        }
        throw new Error(res || "something wrong");

        // setError(
        //   res.response?.data?.message || "An unexpected error occurred."
        // );
      });
  };

  useEffect(() => {
    fetchGetAllData();
  }, [
    pageId,
    discount,
    dataColor,
    getGenderId,
    discount,
    getCategory,
    getUnderWearList,
    getOutWearList,
    getFootWearList,
    getRating,
    getRange,
    // dressInfo?.locationIdParams,
    dressInfo?.mainSearchNameCatalog 
  ]);

  useEffect(() => {
    if (openMobileFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openMobileFilter]);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
    };
  }
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);
  return (
    <main className="max-w-[1280px] w-[100%] flex flex-col items-center justify-between m-auto">
      {!filteredData ? (
        <LoadingNetwork />
      ) : (
        <div className="w-full">
          <section className="w-full border-b border-searchBgColor ">
            <ShoppingStoreOfficialBreadCrumb
              name={filteredData?.shop?.name}
              paramsId={newId}
            />
          </section>
          <section className="w-full border-searchBgColor ">
            <ShoppingStoreOfficialTop
              clickButtons={clickButtons}
              filteredData={filteredData}
              toggleFilterLeftOpen={toggleFilterOpen}
              toggleFilterLeftClose={toggleFilterClose}
              filterLeftAction={filterToggle}
              setOpenMobileFilter={setOpenMobileFilter}
            />
          </section>
          {/* FOR MOBILE VERSION */}
          <section
            onClick={() => {
              setOpenMobileFilter(false)
            }}
            className={`fixed inset-0 z-[112] duration-200 w-full h-[100vh] bg-black opacity-50 ${openMobileFilter ? "" : "hidden"
              }`}
          ></section>
        {screenSize.width < 768 &&   <section
            className={`max-w-[440px] w-[100%]  mx-auto fixed h-[70vh] z-[113] left-0 right-0 md:hidden duration-300 overflow-hidden ${openMobileFilter ? "bottom-0" : "bottom-[-800px] z-0"
              }`}
          >
            <div className="h-[70vh] z-[114] w-full  overflow-y-auto mx-auto bg-white shadow-navMenuShadov  overflow-hidden rounded-t-[12px]">
              <FilterList
                paramsId={newId}
                genderId={genderId}
                discountId={discountId}
                categoryId={categoryId}
                getBadgePrice={getBadgePrice}
                setDataColor={setDataColor}
                dataColor={dataColor}
                getRatingList={getRatingList}
                outWearList={outWearList}
                underWearList={underWearList}
                footWearList={footWearList}
                filterToggle={filterToggle}
                setFilterToggle={setFilterToggle}
                setPageId={setPageId}
                openMobileFilter={openMobileFilter}
                setOpenMobileFilter={setOpenMobileFilter}

              />
            </div>
          </section>}
          <section className="w-full flex items-center justify-center ">
            <div className="w-full flex flex-col items-center justify-center">
              {/* Products Section */}
              <article
                className={`${openTabComment || openTabLocation ? "hidden" : "block"
                  } w-full `}
              >
                {/* <ShoppingStoreCategory filteredData={filteredData} /> */}
                <section className="w-[100%] h-fit">
                  <section className="w-full flex flex-gap-6 justify-between md:my-10 my-3">
                  {screenSize.width >= 768 &&    <div
                      className={`${filterToggle ? "md:block" : "md:hidden"
                        } hidden  md:w-[22%] h-full ss:px-4 md:px-0 `}
                    >
                      <FilterList
                        paramsId={newId}
                        genderId={genderId}
                        discountId={discountId}
                        categoryId={categoryId}
                        getBadgePrice={getBadgePrice}
                        setDataColor={setDataColor}
                        dataColor={dataColor}
                        getRatingList={getRatingList}
                        outWearList={outWearList}
                        underWearList={underWearList}
                        footWearList={footWearList}
                        filterToggle={filterToggle}
                        setFilterToggle={setFilterToggle}
                        setPageId={setPageId}
                      />
                    </div>}

                    <div
                      className={` ${filterToggle ? "md:w-[77%]" : "md:w-[100%]"
                        } w-full h-full px-[10px] md:px-0`}
                    >
                      {filteredData ? (
                        <ShopOfficialCard
                          filteredData={filteredData}
                          setPageId={setPageId}
                        />
                      ) : (
                        <div className="w-full flex items-center justify-center font-AeonikProMedium text-2xl h-[100vh] ">
                          Ничего не найдено
                        </div>
                      )}
                    </div>
                  </section>
                </section>
              </article>

              {/* Comment Section For Shopping Page */}
              <div className={`${openTabComment ? "block" : "hidden"} w-full `}>
                <ShowPageComment
                  filteredData={filteredData}
                  setOpenTabComment={setOpenTabComment}
                />
              </div>

              {/* Map Section */}
              <div
                className={`${openTabLocation ? "block" : "hidden"
                  } w-full text-3xl px-4 pb-10`}
              >
                <button
                  onClick={() => {
                    setOpenTabLocation(false);
                  }}
                  className={`flex items-center cursor-pointer justify-start md:justify-center md:border border-borderColor2 rounded-lg mr-20 md:mt-4 md:mr-5`}
                >
                  <GoBackIcon />
                </button>
                <YandexLocationShop filteredData={filteredData} />
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default React.memo(ShoppingStoreOfficialByLocation);

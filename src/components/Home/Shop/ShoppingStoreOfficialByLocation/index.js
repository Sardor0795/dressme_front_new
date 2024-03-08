import React, { useContext, useEffect, useState } from "react";
import ShoppingStoreOfficialTop from "./ShoppingStoreOfficialTop/ShoppingStoreOfficialTop";
import ShowPageComment from "./ShowPageComment/ShowPageComment";
import { GoBackIcon } from "../../../../assets/icons";
import { useParams } from "react-router-dom";
import { dressMainData } from "../../../../ContextHook/ContextMenu";
import { HomeMainDataContext } from "../../../../ContextHook/HomeMainData";
import ShopOfficialCard from "./ShoppingStoreCategory/ShopOfficialCards/ShopOfficialCard";
import FilterList from "./ShoppingStoreCategory/FilterList/FilterList";
import axios from "axios";
import LoadingNetwork from "../../../Loading/LoadingNetwork";
import YandexLocationShop from "./ShoppingStoreCategory/YandexLocationShop/YandexLocationShop";
import NewBreadCrump from "../../../Breadcrumbs/NewBreadCrump";
import { useTranslation } from "react-i18next";
import { LanguageDetectorDress } from "../../../../language/LanguageItems";

const ShoppingStoreOfficialByLocation = () => {
  const [dressInfo, setDressInfo] = useContext(dressMainData);
  const [data, setData] = useContext(HomeMainDataContext);

  const { t } = useTranslation("shops")
  const [languageDetector, setLanguageDetector] = useContext(LanguageDetectorDress)

  // const [error, setError] = useState(false);
  const [openTabComment, setOpenTabComment] = useState(false);
  const [openTabLocation, setOpenTabLocation] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const [pageId, setPageId] = useState(1);

  const [getGenderId, setGetGenderId] = useState(null);
  const [getCategory, setGetCategory] = useState(null);
  const [getRating, setGetRating] = useState(null);
  const [getRange, setGetRange] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [discount, setDiscount] = useState(false);
  const [getOutWearList, setGetOutWearList] = useState(null);
  const [getUnderWearList, setGetUnderWearList] = useState(null);
  const [getFootWearList, setGetFootWearList] = useState(null);
  const [filterToggle, setFilterToggle] = useState(false);
  const [openMobileFilter, setOpenMobileFilter] = useState(false);
  const [initalParamsId, setInitalParamsId] = useState(null);
  const [newFilterParamasId, setNewFilterParamasId] = useState();

  const [newFilterParamasIdCopy, setNewFilterParamasIdCopy] = useState();
  const toggleFilterOpen = React.useCallback(() => setFilterToggle(true), []);
  const toggleFilterClose = React.useCallback(() => setFilterToggle(false), []);
  useEffect(() => {
    setFilterToggle(false)
  }, [dressInfo?.mainSubRegionId, dressInfo?.mainRegionId,])
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
  const paramsIDS = useParams();
  const newId = paramsIDS?.id.replace(":", "");
  const [data1, setdata1] = useState(null)
  const refreshLocationId = () => {
    data?.getMainProductCard?.shops?.map((item) => {
      if (item?.id === Number(newFilterParamasId)) {
        if (dressInfo?.mainSubRegionId) {
          console.log('category---run1');
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
          setdata1(foundElement?.id)
          console.log('category---run1-', foundElement);
          console.log('category---run1-', dressInfo?.locationIdParams);
          console.log('category---run1---data1', data1);
          // let index = item?.approved_shop_locations.findIndex(function (
          //   element
          // ) {
          //   return (
          //     Number(element.sub_region_id) === dressInfo?.mainSubRegionId
          //   );
          // });
          // if (index === -1) {
          //   navigate("/");
          // }
        }
        if (!dressInfo?.mainSubRegionId) {
          console.log('category---run2');

          setDressInfo({
            ...dressInfo,
            locationIdParams: item?.approved_shop_locations[0]?.id,
          });
        }
      }
    });
    // }
  };

  useEffect(() => {
    refreshLocationId();

  }, [dressInfo?.mainSubRegionId, dressInfo?.mainRegionId, data?.getMainProductCard?.shops]);

  useEffect(() => {
    refreshLocationId();
  }, [dressInfo?.yandexGetMarketId]);

  useEffect(() => {
    if (!dressInfo?.yandexGetMarketId) {
      data?.getMainProductCard?.shops?.map((item) => {
        if (newId?.split("-")?.join(" ")?.includes(item?.name?.toLowerCase())) {
          setDressInfo({
            ...dressInfo,
            yandexGetMarketId: item?.id,
          });
          setNewFilterParamasId(item?.id);
          if (!newFilterParamasIdCopy) {
            setNewFilterParamasIdCopy(item?.id);
          }
        }
      });
    }
  }, [data?.getMainProductCard?.shops]);


  const url = `https://api.dressme.uz/api`;
  const [loading, setLoading] = useState(false);

  const fetchGetAllData = () => {
    let params = new URLSearchParams();
    params.append("location_id", dressInfo?.locationIdParams);
    dressInfo?.mainSearchNameshopLocation &&
      params.append("keywords", dressInfo?.mainSearchNameshopLocation);
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
      .get(`${url}/main/shops/${dressInfo?.yandexGetMarketId}?`, {
        headers: {
          'Accept-Language': languageDetector?.typeLang
        },
        params: params
      })
      .then((res) => {
        if (res?.status >= 200 && res?.status < 300) {
          setLoading(false);
          setFilteredData(res?.data);
          setDressInfo({ ...dressInfo, filterDataProductList: res?.data });
          console.log(res?.data, 'category---res?.data');
        }
      })
      .catch((res) => {
        if (res?.response?.status === 422) {
          refreshLocationId();
          setLoading(false);
          setFilteredData(null)
        }
        console.log(res, 'category---error');
        throw new Error(res || "something wrong");
        // setError(
        //   res.response?.data?.message || "An unexpected error occurred."
        // );
      });
  };

  useEffect(() => {
    if (
      initalParamsId &&
      initalParamsId !== dressInfo?.locationIdParams &&
      !getGenderId &&
      !getCategory &&
      !getRating &&
      !getRange?.length &&
      !dataColor?.length &&
      !discount &&
      !getOutWearList &&
      !getUnderWearList &&
      !getFootWearList
    ) {
      fetchGetAllData();
      // console.log(1,"CAUHPVGIUERPJVASEPR");
      setLoading(true);
    }
    setInitalParamsId(dressInfo?.locationIdParams);
  }, [dressInfo?.locationIdParams]);

  useEffect(() => {
    if (dressInfo?.locationIdParams) {
      if (!filteredData) {
        fetchGetAllData();
      }
    }
  }, [dressInfo?.locationIdParams]);

  useEffect(() => {
    if (data?.getMainProductCard?.shops && dressInfo?.locationIdParams) {
      fetchGetAllData();
      if (!filteredData) {
        setLoading(true);
      }
    }
  }, [
    pageId,
    discount,
    dataColor?.length,
    getGenderId,
    discount,
    getCategory,
    getUnderWearList,
    getOutWearList,
    getFootWearList,
    getRating,
    getRange?.min,
    getRange?.max,
    // dressInfo?.locationIdParams,
    dressInfo?.mainSearchNameshopLocation,
    // data?.getMainProductCard?.shops
  ]);

  // console.log(dressInfo?.yandexGetMarketId, 'category---dressInfo?.yandexGetMarketId');
  // console.log(dressInfo?.locationIdParams, "category--- dressInfo?.locationIdParams");
  // console.log(filteredData, 'category---filteredData');
  // console.log(data?.selectedLoc, 'category---data?.selectedLoc ');

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

  const breadcrumbItems = [
    { label_uz: "Asosiy", label_ru: "Главная", url: "/" },
    { label_uz: "Xarita", label_ru: "Карта", url: "/locations" },
    {
      label_uz: paramsIDS?.id,
      label_ru: paramsIDS?.id,
      url: "/shops_location/:id",
    },
  ];
  return (
    <main className="max-w-[1280px] w-[100%] flex flex-col items-center justify-between m-auto">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full ">
          <LoadingNetwork />
        </div>
      ) : (
        <div className="w-full">
          <section className="w-full border-b border-searchBgColor py-3 md:pt-8 md:pb-5">
            <NewBreadCrump items={breadcrumbItems} />
          </section>

          {filteredData ? (
            <div className="w-full">
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
                  setOpenMobileFilter(false);
                }}
                className={`fixed inset-0 z-[112] duration-200 w-full h-[100vh] bg-black opacity-50 ${openMobileFilter ? "" : "hidden"
                  }`}
              ></section>
              {screenSize.width < 768 && (
                <section
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
                </section>
              )}
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
                        {screenSize.width >= 768 && (
                          <div
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
                          </div>
                        )}

                        <div
                          className={` ${filterToggle ? "md:w-[77%]" : "md:w-[100%]"
                            } w-full h-full px-[10px] md:px-0`}
                        >
                          {filteredData ? (
                            <ShopOfficialCard
                              paramsId={newId}
                              filteredData={filteredData}
                              setPageId={setPageId}
                            />
                          ) : (
                            <div className="w-full flex items-center justify-center font-AeonikProMedium text-2xl h-[100vh] ">
                              {t("nothing_found")}
                            </div>
                          )}
                        </div>
                      </section>
                    </section>
                  </article>

                  {/* Comment Section For Shopping Page */}
                  <div
                    className={`${openTabComment ? "block" : "hidden"
                      } w-full pb-[88px] md:pb-0 md:pt-8`}
                  >
                    <ShowPageComment
                      filteredData={filteredData}
                      setOpenTabComment={setOpenTabComment}
                    />
                  </div>

                  {/* Map Section */}
                  <div
                    className={`${openTabLocation && !openTabComment ? "block" : "hidden"
                      } w-full text-3xl px-4 pb-[88px] pt-[12px] md:pb-0 md:pt-12`}
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
          ) : (
            <div className="w-full flex items-center justify-center font-AeonikProMedium text-2xl h-[50vh] ">
              {t("nothing_found")}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default React.memo(ShoppingStoreOfficialByLocation);

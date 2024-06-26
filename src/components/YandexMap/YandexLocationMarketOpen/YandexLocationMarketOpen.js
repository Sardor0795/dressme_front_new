/* eslint-disable array-callback-return */
import React, { useContext, useState, useEffect } from "react";
import {
  ClockIcons,
  LocationIcons,
  MenuCloseIcons,
  PersonIcons,
  PhoneIcons,
  SircleNext,
  StarIcons,
} from "../../../assets/icons";
import { dressMainData } from "../../../ContextHook/ContextMenu";
import Slider from "react-slick";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import AddCopyCheckedIcon from "../../Home/Products/SignleMainProducts/SingleProduct/Product_Detail/AddCopyCheckedIcon/AddCopyCheckedIcon";
import { HomeMainDataContext } from "../../../ContextHook/HomeMainData";
import { useTranslation } from "react-i18next";
import { SaesonDetectorDress } from "../../../ContextHook/SeasonContext";
import { LocationIdDetector } from "../../../ContextHook/LocationId";

function YandexLocationMarketOpen({
  getImgGallery,
  onClick,
  modalInfo,
  carouselIndex,
  setCarouselIndex,
}) {
  const [dressInfo, setDressInfo] = useContext(dressMainData);
  const [data, setData] = useContext(HomeMainDataContext);
  const { i18n, t } = useTranslation("yandexmap");
  const [locationIdDetector, setLocationIdDetector] =
    useContext(LocationIdDetector);

  const navigate = useNavigate();
  const openShoppingChild = () => {
    modalInfo?.locations?.map((item) => {
      if (item?.shop_id == dressInfo?.yandexGetMarketId) {
        navigate(
          `/shops_location/${item?.shop?.name
            ?.split(" ")
            ?.join("-")
            ?.toLowerCase()}`
        );
      }
    });
    setData({ ...data, selectedLoc: "" });
  };

  const [copyAddress, setCopyAddress] = useState(null);

  const [phoneNum, setPhoneNum] = useState(null);
  const [imgGallery, setImgGallery] = useState([]);
  const [newImgList, setNewImgList] = useState([]);

  useEffect(() => {
    modalInfo?.locations
      ?.filter((e) => e?.id === locationIdDetector?.locationIdForTest)
      ?.map((data) => {
        setCopyAddress(data?.address);
        setPhoneNum(data?.assistant_phone);
        setImgGallery([
          { id: 1, img: data?.url_image_path_one },
          { id: 2, img: data?.url_image_path_two },
          { id: 3, img: data?.url_image_path_three },
        ]);
      });
  }, [modalInfo, locationIdDetector?.locationIdForTest]);

  useEffect(() => {
    setNewImgList([]);
    imgGallery?.forEach((item) => {
      if (item?.img) {
        setNewImgList((newImgList) => [...newImgList, item]);
      }
    });
  }, [imgGallery]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(copyAddress);
  };
  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNum);
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className={`absolute text-center cursor-pointer no-underline opacity-50 w-10 h-10 flex items-center justify-center top-[45%] z-10	right-[5px] rounded-full bg-bgColor duration-200 border border-solid border-borderColorCard		`}
        onClick={onClick}
      >
        <button className="next">
          <GrFormNext size={20} />
        </button>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className={`absolute text-center cursor-pointer no-underline opacity-50 w-10 h-10 flex items-center justify-center top-[45%] z-10	left-[5px] rounded-full bg-bgColor duration-200 border border-solid border-borderColorCard`}
        onClick={onClick}
      >
        <button className="prev">
          <GrFormPrevious size={20} />
        </button>
      </div>
    );
  };

  const settings = {
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const settingsForMobile = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const sendImgGallery = () => {
    getImgGallery({ newImgList: newImgList, index: carouselIndex });
    onClick();
  };

  const handlePhoneNumberClick = (id) => {
    // window.location.href = `tel:${id}`;
    // window.open(`tel:${id}`, '_blank');
  };
  return (
    <div className="w-full h-full ">
      {modalInfo?.locations
        ?.filter((e) => e?.id === locationIdDetector?.locationIdForTest)
        ?.map((data) => {
          return (
            <div
              key={data?.id}
              className="w-full  h-fit flex flex-col gap-y-2 border border-searchBgColor overflow-hidden bg-white rounded-t-[12px] md:rounded-[12px]	 px-4 pb-4 pt-2"
            >
              {/* title */}
              <div className="relative w-full flex items-center justify-between">
                <div className="w-fit flex items-center gap-x-3">
                  {" "}
                  <span className="break-all py-1 not-italic font-AeonikProMedium ml-[10px] text-xl leading-5 text-fullBlue ">
                    {data?.shop?.name}
                  </span>
                  {data?.shop?.overall_rating && (
                    <div className="w-fit flex items-center gap-x-[2px] mr-2 md:mr-4">
                      <span className="font-AeonikProMedium">
                        <StarIcons />
                      </span>
                      <span className="not-italic font-AeonikProMedium text-[16px] ml-[2px] text-black">
                        {data?.shop?.overall_rating}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    setDressInfo({
                      ...dressInfo,
                      yandexOpenMarketLocation: false,
                    })
                  }
                  className="md:w-10 md:h-10 rounded-lg md:border border-searchBgColor flex items-center justify-center active:scale-95  active:opacity-70"
                >
                  <MenuCloseIcons colors={"#000"} />
                </button>
              </div>
              {/* Second Section */}
              <div className="flex flex-col md:flex-row justify-center md:justify-between md:gap-y-0 gap-y-4">
                {/* Carosuel */}
                <div className="w-full cursor-pointer h-[220px] md:w-[48%] md:h-[250px] mx-auto overflow-hidden  rounded-xl">
                  {newImgList?.length <= 1 ? (
                    <div className="w-full h-full  rounded-xl overflow-hidden">
                      <img
                        onClick={() => sendImgGallery(0)}
                        src={newImgList[0]?.img}
                        alt={"imgGallery"}
                        className="w-full h-full object-cover "
                      />
                    </div>
                  ) : (
                    <>
                      <Slider
                        {...settings}
                        afterChange={(c) => {
                          setCarouselIndex(c);
                        }}
                        className="hidden w-full h-full rounded-xl overflow-hidden md:flex flex-col justify-center"
                      >
                        {newImgList?.map((data, i) => {
                          return (
                            <div key={data?.id}>
                              {data?.img && (
                                <div
                                  onClick={() => {
                                    sendImgGallery();
                                  }}
                                  className="w-full h-full cursor-pointer flex items-center justify-center"
                                >
                                  <img
                                    className={"h-full w-full object-cover	"}
                                    src={data?.img}
                                    alt="img"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </Slider>
                      <Slider
                        {...settingsForMobile}
                        afterChange={(c) => {
                          setCarouselIndex(c);
                        }}
                        className="md:hidden w-full h-full rounded-xl overflow-hidden flex flex-col justify-center"
                      >
                        {newImgList?.map((data, i) => {
                          return (
                            <div key={data?.id}>
                              {data?.img && (
                                <div
                                  onClick={() => {
                                    sendImgGallery();
                                  }}
                                  className="w-full h-full cursor-pointer flex items-center justify-center"
                                >
                                  <img
                                    className={
                                      "mx-auto h-[220px] w-full md:h-[250px] sm:w-auto flex items-center object-cover	"
                                    }
                                    src={data?.img}
                                    alt="img"
                                  />
                                  <div className="flex w-full opacity-80 absolute items-center justify-between px-5 text-sm font-AeonikProMedium left-0 right-0 bottom-3 md:bottom-6">
                                    <span
                                      className={`${newImgList?.length > 1
                                          ? "flex"
                                          : "hidden"
                                        } bg-bgCard gap-x-[3px] rounded-[8px] px-3 py-1 items-center justify-center text-center`}
                                    >
                                      <p className="h-full w-full text-center pt-[4px]">
                                        {" "}
                                        {i + 1}
                                      </p>
                                      <span className="text-center pt-[2px]">
                                        /
                                      </span>
                                      <p className="h-full w-full text-center pt-[4px]">
                                        {newImgList?.length}
                                      </p>
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </Slider>
                    </>
                  )}
                </div>
                {/* Details */}
                <div className="md:w-[48%]  md:h-[250px] flex flex-wrap md:gap-y-0 gap-y-4 content-between   ">
                  {/* Detail */}
                  <div className="w-full  flex flex-col gap-y-3">
                    <div className="flex items-center ">
                      <span className=" font-AeonikProRegular">
                        <ClockIcons colors={"#000"} />
                      </span>
                      <span className="not-italic ml-4 font-AeonikProRegular text-base leading-4 text-black tracking-[1%]">
                        {data?.work_time_from || "00:00"} -{" "}
                        {data?.work_time_to || "00:00"}
                      </span>
                    </div>{" "}
                    <div className="flex items-center ">
                      <span className="font-AeonikProRegular ml-[-3px]">
                        {/* <ClockIcons colors={"#000"} /> */}
                        <PersonIcons colors={"#000"} />
                      </span>
                      <span className="not-italic ml-4 font-AeonikProRegular text-base leading-4 text-black tracking-[1%]">
                        {data?.assistant_name}
                      </span>
                    </div>{" "}
                    <div
                      onClick={handlePhoneNumberClick(data?.assistant_phone)}
                      className="flex items-center cursor-pointer   "
                    >
                      <p className="w-[80%] flex ">
                        <span className="font-AeonikProRegular cursor-pointer  ">
                          <PhoneIcons colors={"#000"} />
                        </span>
                        <a
                          href={`tel:${phoneNum}`}
                          className="not-italic hover:text-fullBlue flex items-center ml-4 font-AeonikProRegular text-base leading-4 text-black tracking-[1%]"
                        >
                          {phoneNum}
                        </a>
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="cursor-pointer flex  ml-[8px] "
                      >
                        <AddCopyCheckedIcon />
                      </button>
                    </div>{" "}
                    <div className="w-full flex  h-full max-h-[100px] overflow-hidden">
                      <p className="w-[80%] flex ">
                        <span>
                          <LocationIcons />
                        </span>
                        <span className=" flex  not-italic ml-4 font-AeonikProRegular text-base leading-5 text-setTexOpacity">
                          {copyAddress}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="cursor-pointer flex  ml-[8px] "
                      >
                        <AddCopyCheckedIcon />
                      </button>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 flex items-center ">
                    <button
                      onClick={() => {
                        openShoppingChild();
                        setDressInfo({
                          ...dressInfo,
                          linkedFrom: "shopsFromLocation",
 
                        });

                      }}
                      className={` w-full h-[48px] bg-fullBlue active:scale-95 mt-4 mb-2 md:mb-0 md:mt-0  active:opacity-70 rounded-[12px] flex gap-x-3 items-center justify-center`}
                    >
                      <span className="not-italic font-AeonikProRegular tracking-[2%]  text-base leading-5 text-center   capitalize text-white">
                        {t("YLOedit")}
                      </span>
                      <span>
                        <SircleNext colors={"#fff"} />
                      </span>
                    </button>
                  </div>
                </div>{" "}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default React.memo(YandexLocationMarketOpen);

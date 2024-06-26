import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { dressMainData } from "../../../ContextHook/ContextMenu";
import { Popover } from "antd";

import {
  HouseStatisticIcons,
  LocationIcons,
  MarketIcons,
} from "../../../assets/icons";
import { RussianFlag, UzbekFlag } from "../../../assets";
import { HomeMainDataContext } from "../../../ContextHook/HomeMainData";
import { useQuery } from "@tanstack/react-query";
import { useHttp } from "../../../hook/useHttp";
import { LanguageDetectorDress } from "../../../language/LanguageItems";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { SaesonDetectorDress } from "../../../ContextHook/SeasonContext";

const YandexTop = ({ onClick }) => {
  const [dressInfo, setDressInfo] = useContext(dressMainData);
  const [data, setData] = useContext(HomeMainDataContext);
  const [languageDetector, setLanguageDetector] = useContext(
    LanguageDetectorDress
  );
  const [seasonDetector, setSeasonDetector] = useContext(SaesonDetectorDress);

  const { request } = useHttp();
  const [state, setState] = useState({
    openLang: false,
    openRegion: false,
  });
  const { i18n, t } = useTranslation("yandexmap");
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem("i18nextLng")
  );
  useEffect(() => {
    if (localStorage.getItem("i18nextLng")?.length > 2) {
      i18next.changeLanguage(currentLang);
    }
    setLanguageDetector({ typeLang: currentLang });
  }, [currentLang]);

  const LanguageList = [
    { id: 1, value: "uz", type: "O'zbekcha", icons: UzbekFlag },
    { id: 2, value: "ru", type: "Русский", icons: RussianFlag },
  ];

  const handleOpenChangeWear = (newOpen) => {
    setState({ ...state, openLang: newOpen });
  };

  // const handleLangValue = (value) => {
  //   setselectLang(value);
  //   setState({ ...state, openLang: false });
  // };
  const handleLangValue = (value) => {
    i18n.changeLanguage(value);
    setCurrentLang(value);
    setState({ ...state, openLang: false });
  };
  const contentLang = (
    <div className="w-fit h-fit m-0 p-0">
      {LanguageList.map((data) => {
        return (
          <div
            key={data?.id}
            className={`p-2 text-sm cursor-pointer hover:bg-bgColor flex items-center justify-start  ${seasonDetector?.TextHoverSeason}`}
            onClick={() => {
              handleLangValue(data?.value);
            }}
          >
            <p className="mr-[6px]  w-5 h-5">
              <img className="w-full h-full" src={data?.icons} alt="" />
            </p>
            <p
              className={`not-italic flex items-center font-AeonikProMedium text-sm leading-4 text-black  ${seasonDetector?.TextHoverSeason}`}
            >
              {data?.type}
            </p>
          </div>
        );
      })}
    </div>
  );

  // -------City Change -------------
  useQuery(
    ["region-data"],
    () => {
      return request({ url: "/main/regions", token: true });
    },
    {
      onSuccess: (res) => {
        if (res?.regions) {
          localStorage.setItem("regions", JSON.stringify(res?.regions))
        }
      },
      onError: (err) => {
        throw new Error(err || "something wrong");
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="flex justify-between items-center m-auto py-[2px]">
      <div className="left h-full flex items-center  ">
        <div
          onClick={onClick}
          className="flex w-fit items-center cursor-pointer"
        >
          <span className="mr-2">
            <LocationIcons />
          </span>
          <span className="text-textColor flex items-center text-[13px] mr-[6px] font-AeonikProMedium">
            {t("YTregion")}
            <span>:</span>
          </span>
          <div className="w-full min-w-[90px] font-AeonikProMedium flex items-center text-[13px]">
            {data?.mainRegionsList
              ?.filter((e) => e?.id === dressInfo?.mainRegionId)
              ?.map((item) => {
                return (
                  <React.Fragment key={item?.id}>
                    <span className="">
                      {languageDetector?.typeLang === "ru" && item?.name_ru}
                      {languageDetector?.typeLang === "uz" && item?.name_uz}
                    </span>
                    {item?.sub_regions
                      ?.filter((e) => e?.id === dressInfo?.mainSubRegionId)
                      ?.map((data) => {
                        return (
                          <span key={data?.id} className="  ">
                            ,{" "}
                            <span className=" ml-[1px]">
                              {languageDetector?.typeLang === "ru" &&
                                data?.name_ru}
                              {languageDetector?.typeLang === "uz" &&
                                data?.name_uz}
                            </span>
                          </span>
                        );
                      })}
                  </React.Fragment>
                );
              })}
          </div>
        </div>

        <div className="w-fit h-full rounded bg-white ml-2 font-AeonikProMedium select-none overflow-hidden cursor-pointer">
          {LanguageList.filter((data) => data.value === currentLang).map(
            (data) => {
              return (
                <Popover
                  key={data?.id}
                  open={state?.openLang}
                  onOpenChange={handleOpenChangeWear}
                  className="w-full flex text-[13px] items-center border-searchBgColor border h-[32px] px-3 rounded-lg"
                  trigger="click"
                  options={["Hide"]}
                  placement="bottom"
                  content={contentLang}
                >
                  <span className="mr-[6px] ">
                    <img src={data?.icons} alt="" />
                  </span>
                  <p className="not-italic flex items-center font-AeonikProMedium text-sm text-black ">
                    {data?.type}
                  </p>
                </Popover>
              );
            }
          )}
        </div>
      </div>
      <div className="right h-full flex items-center ">
        <button
          type="button"
          onClick={() =>
            window.open(" https://seller.dressme.uz", "_blank")
            
          }
          className="flex items-center h-full "
        >
          <span className="mr-2">
            <HouseStatisticIcons colors={"#707070"} />
          </span>
          <span className="text-textColor text-[13px]   font-AeonikProMedium  ">
            {t("YTbusiness")}
          </span>
        </button>

        <NavLink
          to="/shops"
          className="flex items-center bg-white rounded cursor-pointer h-full  ml-6 px-3 py-[2px]"
        >
          <span className="mr-2">
            <MarketIcons colors={"#000"} />
          </span>{" "}
          <span className="font-AeonikProMedium  text-[13px]    ">
            {t("YTmarket")}
          </span>
        </NavLink>
      </div>
    </div>
  );
};
export default YandexTop;

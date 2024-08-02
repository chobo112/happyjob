import { Children, createContext, FC, useState } from "react";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ComnCodMgrMain } from "../component/page/ComnCodMgr/ComnCodMgrMain/ComnCodMgrMain";
import { ComnCodSearch } from "../component/page/ComnCodMgr/ComnCodSearch/ComnCodSearch";
import { ComnCodProvider } from "../api/provider/ComnCodMgrProvider";

export const ComnCodMgr = () => {
  return (
    <>
      <ComnCodProvider>
        <ContentBox>공통코드관리</ContentBox>
        <ComnCodMgrMain />
        <ComnCodSearch />
      </ComnCodProvider>
    </>
  );
};

/* eslint-disable jsx-a11y/anchor-is-valid */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Button } from "../../../common/Button/Button";
import {
  StyledTable,
  StyledTd,
  StyledTh,
} from "../../../common/styled/StyledTable";
import { ComnCodMgrMainStyled } from "./styled";
import { useContext, useEffect, useState } from "react";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { ComnCodContext } from "../../../../api/provider/ComnCodMgrProvider";
import { ComnCodMgrModal } from "../ComnCodMgrModal/ComnCodMgrModal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

export interface IComnCodList {
  row_num: number;
  grp_cod: string;
  grp_cod_nm: string;
  grp_cod_eplti: string;
  use_poa: string;
  fst_enlm_dtt: number;
  reg_date: string | null;
  detailcnt: number;
}

export interface ISearchComnCod {
  totalCount: number;
  listComnGrpCod: IComnCodList[];
}

export const ComnCodMgrMain = () => {
  const [comnCodList, setComnCodList] = useState<IComnCodList[]>([]);
  const [totalCnt, setTotalCnt] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>();
  const { searchKeyword } = useContext(ComnCodContext);
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [grpCod, setGrpCod] = useState<string>("");

  useEffect(() => {
    searchComnCod();
  }, [searchKeyword]);

  const searchComnCod = (cpage?: number) => {
    cpage = cpage || 1;
    // axios.post('/system/listComnGrpCodJson.do', {currentPage: cpage, pageSize: 5});

    const postAction: AxiosRequestConfig = {
      method: "POST",
      url: "/system/listComnGrpCodJson.do",
      data: {
        currentPage: cpage,
        pageSize: 5,
        ...searchKeyword,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(postAction).then((res: AxiosResponse<ISearchComnCod>) => {
      setComnCodList(res.data.listComnGrpCod);
      setTotalCnt(res.data.totalCount);
      setCurrentPage(cpage);
    });
  };

  const fomatData = (timeStamp: number) => {
    const date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = String(date.getMonth()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const onPostSuccess = () => {
    setModal(!modal);
    searchComnCod(currentPage);
  };

  const handlerModal = (grpCod: string) => {
    setGrpCod(grpCod);
    setModal(!modal);
  };

  return (
    <ComnCodMgrMainStyled>
      <Button
        onClick={() => {
          setModal(!modal);
        }}
      >
        신규등록
      </Button>
      <StyledTable>
        <colgroup>
          <col width="20%" />
          <col width="10%" />
          <col width="20%" />
          <col width="7%" />
          <col width="10%" />
          <col width="5%" />
        </colgroup>
        <thead>
          <tr>
            <StyledTh size={10}>그룹코드</StyledTh>
            <StyledTh size={5}>그룹코드명</StyledTh>
            <StyledTh size={10}>그룹코드 설명</StyledTh>
            <StyledTh size={5}>사용여부</StyledTh>
            <StyledTh size={7}>등록일</StyledTh>
            <StyledTh size={3}>비고</StyledTh>
          </tr>
        </thead>
        <tbody>
          {comnCodList && comnCodList?.length > 0 ? (
            comnCodList.map((a, i) => {
              return (
                <tr key={i}>
                  <StyledTd>{a.grp_cod}</StyledTd>
                  <StyledTd>{a.grp_cod_nm}</StyledTd>
                  <StyledTd>{a.grp_cod_eplti}</StyledTd>
                  <StyledTd>{a.use_poa}</StyledTd>
                  <StyledTd>{fomatData(a.fst_enlm_dtt)}</StyledTd>
                  <StyledTd>
                    <a
                      onClick={() => {
                        handlerModal(a.grp_cod);
                      }}
                    >
                      수정
                    </a>
                  </StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={6}> 데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigate
        totalItemsCount={totalCnt}
        onChange={searchComnCod}
        itemsCountPerPage={5}
        activePage={currentPage as number}
      ></PageNavigate>
      {modal ? (
        <ComnCodMgrModal
          onPostSuccess={onPostSuccess}
          grpCod={grpCod}
          setGrpCod={setGrpCod}
        ></ComnCodMgrModal>
      ) : null}
    </ComnCodMgrMainStyled>
  );
};

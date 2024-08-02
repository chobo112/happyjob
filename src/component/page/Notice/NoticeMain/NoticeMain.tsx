import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  StyledTable,
  StyledTd,
  StyledTh,
} from "../../../common/styled/StyledTable";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Protal } from "../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";

//axios에서 받아온 값들을 모델처럼 타입맞춰서 넣어줄 그릇임
//즉 여기서 파람으로 보냄 => axios(ajax처럼)를 통해 서버로 보냄 => 받아온 데이터를 set해줄건데 재활용을 위해서 interface만듦
export interface INoticeList {
  file_ext: string;
  file_name: string;
  file_size: number;
  logical_path: string;
  noti_content: string;
  noti_date: string;
  noti_seq: number;
  noti_title: string;
  phsycal_path: String;
}

//위에 인터페이스를 또 넣어준거임 =>res에 넣어줄 타입정해주는중
export interface INoticeListJsonResponse {
  noticeList: INoticeList[];
  listCount: number;
}

export const NoticeMain = () => {
  //검색관련 1번
  const { search } = useLocation(); //여기가 쿼리 파라미터를 받아옴
  //예를 들어, 현재 URL이 http://example.com/page?cpage=1&pageSize=5 라면, search는 ?cpage=1&pageSize=5가 됩니다.

  //axios에서 받아온 데이터를 타입 정해준거임 => responsebody로 받아온 데이터(서버에서)
  //noticeList는 배열임 INoticeList=> 배열로 넣어주자 ()안에 []을 넣어줌 => 초기값 만들어줘야
  //맨 밑에 return할때 에러가 안나옴
  const [noticeList, setNoticeList] = useState<INoticeList[]>();

  //초기값 false로 안나타나게 한거임
  //const [modalState, setModalState] = useState<boolean>(false);
  //stor에 저장한 modalState불러오자
  //0번 제목, 내용 모달로 가져오자 하기 전에 모달 열가
  const [modal, setModal] = useRecoilState<boolean>(modalState);

  //1번 제목, 타이틀 모달로 가져오기
  const [notiSeq, setNotiSeq] = useState<number>();

  //페이징 관련
  const [listCount, setListCount] = useState<number>(0);
  const [currentParam, setCurrentparam] = useState<number | undefined>();

  //검색관련 3번
  //useEffect훅: search가 변경될때마다 searchNoticeList함수를 호출하여 새로운 데이터 가져옴
  useEffect(() => {
    console.log("###############################");
    console.log(search);
    //console.log(search.typeOf());
    console.log("###############################");

    searchNoticeList();
  }, [search]);
  //search검색조건에 맞는 값들이 여러개 나올수 있으니까 배열로 담아줌

  const searchNoticeList = (cpage?: number) => {
    cpage = cpage || 1;
    //검색관련 2번
    const searchParam = new URLSearchParams(search);
    ////?searchTitle=test&startDate=2024-07-08&endtDate=2024-07-31이렇게 오는걸 배열로 넣어줌
    /*
    변환 후 객체 상태:
    searchParam은 URLSearchParams 객체가 되어 각 파라미터를 쉽게 접근, 추가, 수정, 삭제할 수 있습니다.
    객체 내부 상태:
    searchParam.get('searchTitle')은 "test"를 반환합니다.
    searchParam.get('startDate')는 "2024-07-08"을 반환합니다.
    searchParam.get('endDate')는 "2024-07-31"을 반환합니다.
    */

    //서버에서 int cpage = Integer.valueOf((String) paramMap.get("currentPage"));
    searchParam.append("cpage", cpage.toString());
    searchParam.append("pageSize", "5");

    //axios는 라이브러리
    //url로 보낼건데 searchParam으로 데이터를 보내주고 값이 제대로 오면 then
    //
    axios
      .post("/board/noticeListJson.do", searchParam)
      .then((res: AxiosResponse<INoticeListJsonResponse>) => {
        setNoticeList(res.data.noticeList); //여기 값을 밑에 tbody안에 넣어줄거임
        setListCount(res.data.listCount);
        setCurrentparam(cpage);
        //setCurrentparam(res.data.)
        //그전에 res에 관한 타입을 이제 정해줄거임
        console.log(
          "###########################################################"
        );
        console.log(res.data);
      });
  };

  //모달부분 모달안에 모달이 없는 프로젝트라서 최상단에 올려줄거임(recoil)
  //seq : number타입 지정해주자
  //3번 제목, 타이틀 모달로 가져오기
  const handlerModal = (seq?: number) => {
    setNotiSeq(seq);
    setModal(!modal);
  };

  //모달 닫을때 실행될 함수
  const postSuccess = () => {
    setModal(!modal);
    searchNoticeList();
  };

  return (
    <>
      총 갯수 : {listCount} 현재 페이지 : {currentParam}
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
          </tr>
        </thead>
        <tbody>
          {noticeList && noticeList?.length > 0 ? (
            noticeList?.map((a) => {
              return (
                //2번 제목, 타이틀 모달로 가져오기
                <tr key={a.noti_seq} onClick={() => handlerModal(a.noti_seq)}>
                  <StyledTd>{a.noti_seq}</StyledTd>
                  <StyledTd>{a.noti_title}</StyledTd>
                  <StyledTd>{a.noti_date}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigate
        totalItemsCount={listCount}
        onChange={searchNoticeList}
        activePage={currentParam as number}
        itemsCountPerPage={5}
      ></PageNavigate>
      {modal ? (
        <Protal>
          <NoticeModal
            noticeSeq={notiSeq}
            setNoticeSeq={setNotiSeq}
            onSuccess={postSuccess}
            // handlerModal={handlerModal}
          ></NoticeModal>
        </Protal>
      ) : null}
    </>
  );
};

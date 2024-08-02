import { useRef, useState } from "react";
import { Button } from "../../../common/Button/Button";
import { NoticeSearchStyled } from "./style";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

export const NoticeSarch = () => {
  //시작일, 내가 설정한 시작일 지정해주고, useState도 타입지정 필요
  //밑에 input데이터들 저장할 그릇 만들어 준거임 set을
  //      <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
  // 사용자가 달력에서 날짜를 가져오면 setStartDate에 넣어주고 그 값을 startDate에 넣어서 사용할거야
  const [startDate, setStartDate] = useState<String>();
  const [endtDate, setEndDate] = useState<String>();
  const [modal, setModal] = useRecoilState<boolean>(modalState);

  //2번째 userRef를 사용(useState대신에) => 밑에 input에러나온부분 타입 복붙한거임 타입은
  //ref는 이렇게 연동해줌       <input ref={title}></input>
  //useState는 제목을 검색할때 test를 검색한다고 하면 t, e, s, t 4번 렌더링하지만
  //useref는 딱 1번만 해서 저장공간을 효율적으로 이용
  const title = useRef<HTMLInputElement>(null);

  //훅 => url로 내가 원하는곳으로 갈수 있게 됨
  const navigate = useNavigate();

  const handlerSearch = () => {
    //검색 버튼 누르면, 조회가 된다.
    const query: String[] = []; //String만 담기는 배열을 만들어줌

    !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
    !startDate || query.push(`startDate=${startDate}`);
    !endtDate || query.push(`endtDate=${endtDate}`);

    const queryString = query.length > 0 ? `${query.join("&")}` : "";

    //http://localhost:3000/react/board/notice.dosearchTitle=test&startDate=2024-07-01&endtDate=2024-07-30
    navigate(`/react/board/notice.do?${queryString}`);

    console.log("#########################################");
    console.log(startDate, endtDate);
    // ?를 붙여야지 위에서 null인데 벨유 없잖아 라는 에러가 고쳐짐
    //즉, title에 current값이 있을수도 있고, 없을수도 있다 라는 말
    console.log(title.current?.value);
  };

  //등록버튼 모달 열어줘라
  const handlerModal = () => {
    setModal(!modal); //모달이없으면(!modal) => 모달열어라
  };

  return (
    <NoticeSearchStyled>
      <input ref={title}></input>

      <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
      <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
      <Button onClick={handlerSearch}>검색</Button>
      <Button onClick={handlerModal}>등록</Button>
    </NoticeSearchStyled>
  );
};

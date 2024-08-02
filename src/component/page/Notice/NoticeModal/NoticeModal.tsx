import { useRecoilState } from "recoil";
import { NoticeModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { loginInfoState } from "../../../../stores/userInfo";
import Noimage from "../../../../assets/noImage.jpg";

export interface INoticeModalProps {
  noticeSeq?: number;
  onSuccess: () => void;
  //handlerModal: () => void;
  setNoticeSeq: (notiSeq: undefined) => void; //cleanup용으로 undefiend할거니까
  //  const [notiSeq, setNotiSeq] = useState<number>(); noticeMain에서 setNotiseq가 여기서 notiSeq임
}
//noticeDetail => set에 넣어주기 위한거.. useState();
export interface INoticeDetail {
  file_ext: string | null;
  file_name: string | null;
  file_size: number | null;
  logical_path: string | null;
  noti_content: string;
  noti_date: string;
  noti_seq: number;
  noti_title: string;
  phsycal_path: String | null;
}

export interface INoticeDetailResponse {
  detailValue: INoticeDetail;
}

//noticeDelete, noticeUpdate, noticeSave => 서버꺼에 받아오는게 같음
export interface IPostResponse {
  result: "success";
  //결과값이 success로 했으니까 success, 성공!이라고 할거였으면 String으로 하면 됨
}

//FC => props에 대한 타입을 지정해줄수 있게 해줌 noticeSeq가 있으면 상세모달 없으면 등록모달
export const NoticeModal: FC<INoticeModalProps> = ({
  noticeSeq,
  onSuccess,
  setNoticeSeq,
}) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();

  //save해주려고
  const [userInfo] = useRecoilState(loginInfoState);

  //양이 얼마 없으니 useRef?? 등록할때
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLInputElement>(null);

  //파일용
  const [imageURL, setImageURL] = useState<string>("notImage");
  //아래는 실제 경로 DB에 넣어주기 위함
  const [fileData, setFileData] = useState<File>();

  //현재 계속 등록버튼 나올때도 seq가 나오는중임
  //const [noticeNum, setNoticeNum] = useState<number | undefined>(noticeSeq);

  //이렇게 바꿔주면 노티 시퀀스 있을때만 리스트를 보여줘라
  useEffect(() => {
    //console.log("useEffect : seq로 상세보기 불러올 때 : " + noticeDetail);
    //위에 noticeDetail console.log에선 undefined지만 네트워크 fetch에선 잘 받아옴
    if (noticeSeq) {
      searchDetail();
    }

    return () => {
      //alert("test");//모달이 나가기전에 alert가 뜨는지 확인하고
      //console.log(typeof setNoticeSeq); //function찍힘
      setNoticeSeq(undefined);
    };
    //등록버튼 클릭하면 undefined 작성 된 글들 누르면 번호뜸

    //return setNoticeDetail();
  }, []);

  const searchDetail = () => {
    //console.log("searchDetail함수 : 상세보기를 위해 seq잘 불러오니 ? " + noticeSeq);
    //axios.post("/board/noticeDetail.do", { noticeSeq : noticeSeq });
    axios
      .post("/board/noticeDetail.do", { noticeSeq })
      .then((res: AxiosResponse<INoticeDetailResponse>) => {
        if (res.data.detailValue) {
          setNoticeDetail(res.data.detailValue);
          const fileExt = res.data.detailValue.file_ext;
          if (fileExt === "jpg" || fileExt === "png" || fileExt === "gif") {
            setImageURL(res.data.detailValue.logical_path || Noimage); //null이면 Noimage라는 대체제를 사용하자(위에 임포트함)
          } else {
            setImageURL("notImage");
          }
        }
      });
    //네트워크에서는 뜨는데 콘솔에서는 안뜸 네트워크에서만 띄면 됨
    //console.log(noticeDetail);
  };

  //노란 중괄호 => 파라미터임 => 메퍼파일 보면 됨 seq, id, content, title이 필요함
  //seq는 DB에서 만들어주는중  즉 seq는 만들어줄 필요 없음
  //userid 는 store에 있음 => userInfo
  /*  const handlerSave = () => {
    axios
      .post("/board/noticeSave.do", {
        title: title.current?.value,
        content: content.current?.value,
        loginId: userInfo.loginId,
      })
      .then((res) => {
        //서버(자바)에서 성공하면 success, 실패하면 false를 반환해줌
        //성공하면 props로 넘겨줘서 한다? 여기서 하면 닫기버튼 눌러도 실행이됨
        if (res.data.result === "success") {
          //setModal(!modal);
          onSuccess();
        }
      });
  };
*/
  //서버에서도 RequestBody로 바꿔주자 seq, title, content
  /*  const handlerUpdate = () => {
    axios
      .post("/board/noticeUpdate.do", {
        title: title.current?.value,
        content: content.current?.value,
        noticeSeq: noticeSeq, //모달 seq
      })
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === "success") {
          onSuccess();
        }
      });
  };
*/
  const handlerDelete = () => {
    axios
      .post("/board/noticeDelete.do", {
        noticeSeq: noticeSeq, //모달 seq
      })
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === "success") {
          onSuccess();
        }
      });
  };

  //파일 미리보기 이벤트가 인풋에 나타나니까 <>에 넣고, changevent할때 발생하니까..
  //여기는 뷰단에서만 서로 보내는 file애들
  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    const fileInfo = e.target.files;
    if (fileInfo?.length) {
      const fileInfoSplit = fileInfo[0].name.split(".");
      const fileExtension = fileInfoSplit[1].toLowerCase(); //png
      //console.log(fileExtension);

      // 확장자가 jpg 기타 3개인 경우 가상경로 url만들어주기
      if (
        fileExtension === "jpg" ||
        fileExtension === "gif" ||
        fileExtension === "png"
      ) {
        console.log(URL.createObjectURL(fileInfo[0]));
        //blob:http://localhost:3000/8bdb8c86-4dd5-4455-884e-5b27531fa783 이게 나오고
        //=> 타면 가상의 경로에 이미지 생성되어있음
        setImageURL(URL.createObjectURL(fileInfo[0])); //가상의 경로임
      } else {
        setImageURL("notImage");
      }
      //미리보기 뜰때 넣어주자 파일에 정보 넣어주자(DB에 넣어주기 위함)
      setFileData(fileInfo[0]);
    }
  };

  //파일저장용 notice.jsp에서 모달파일 팝업에서 form으로 데이터 넘겨줬음(+파일다운로드에서도)
  //axios에 넣어줄 데이터를 2개로 나눈거임 (text, file)구분해서 formData안에 넣었음
  //여기가 서버로 보내는 (save)하려고 보내는 file부분
  const handlerSave = () => {
    const fileForm = new FormData(); //jsp 에서 폼처럼 쓰려고 만든거임
    //text데이터 1개, 파일데이터 1개 총 2개가 넘어갈거임 => 그걸 FormData에 넣어서 넘겨줄거임
    const textData = {
      title: title.current?.value,
      content: content.current?.value,
      loginId: userInfo.loginId,
    };
    if (fileData) fileForm.append("file", fileData); //file이라는 이름으로 fileData넣을거임
    fileForm.append(
      "text",
      new Blob([JSON.stringify(textData)], { type: "application/json" })
    ); //Blob형식
    axios
      .post("/board/noticeFileSaveJson.do", fileForm)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === "success") {
          onSuccess();
        }
      });
  };

  //파일 업데이트용 handlerUpdate
  const handlerUpdate = () => {
    const fileForm = new FormData(); //jsp 에서 폼처럼 쓰려고 만든거임
    const textData = {
      title: title.current?.value,
      content: content.current?.value,
      loginId: userInfo.loginId,
      noticeSeq,
    };
    if (fileData) fileForm.append("file", fileData); //file이라는 이름으로 fileData넣을거임
    console.log(
      "11111111111111111111111$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
    );
    console.log(fileData);
    fileForm.append(
      "text",
      new Blob([JSON.stringify(textData)], { type: "application/json" })
    );
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log("fileForm : " + fileForm);
    axios
      .post("/board/noticeFileUpdateJson.do", fileForm)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === "success") {
          onSuccess();
        }
      });
  };

  const downloadfile = async () => {
    let param = new URLSearchParams();
    param.append("noticeSeq", noticeSeq?.toString() as string);

    //우리가 사용하던 ajax같은 느낌
    const postAction: AxiosRequestConfig = {
      url: "/board/noticeDownload.do",
      method: "POST",
      data: param, //new URLSearchParams를 말함
      responseType: "blob", //응답받는 데이터 타입, blob => 2진수로 된 대용량 데이터(0과 1로 구성되어있음)
    };

    await axios(postAction).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", noticeDetail?.file_name as string);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <NoticeModalStyled>
      <div className="container">
        <label>
          제목 :
          <input
            type="text"
            defaultValue={noticeDetail?.noti_title}
            ref={title}
          ></input>
        </label>
        <label>
          내용 :{" "}
          <input
            type="text"
            defaultValue={noticeDetail?.noti_content}
            ref={content}
          ></input>
        </label>
        {/* 파일첨부 시작 */}
        파일 :
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handlerFile}
        ></input>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div onClick={downloadfile}>
          {imageURL === "notImage" ? (
            <div>
              <label>파일명</label>
              {fileData?.name || noticeDetail?.file_name}
            </div>
          ) : (
            <div>
              <label>미리보기</label>
              <img src={imageURL} />
            </div>
          )}
        </div>
        <div className={"button-container"}>
          <button onClick={noticeSeq ? handlerUpdate : handlerSave}>
            {noticeSeq ? "수정" : "등록"}
          </button>
          {noticeSeq ? <button onClick={handlerDelete}>삭제</button> : null}

          <button onClick={() => setModal(!modal)}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};

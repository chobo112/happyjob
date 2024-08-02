import { useContext, useState } from "react";
import { Button } from "../../../common/Button/Button";
import { ComnCodSearchStyle } from "./styled";
import { ComnCodContext } from "../../../../api/provider/ComnCodMgrProvider";

export const ComnCodSearch = () => {
  const { setSearchKeyword } = useContext(ComnCodContext);
  const [input, setInput] = useState<{ oname: String; sname: string }>({
    oname: "grp_cod",
    sname: "",
  }); //그룹목록조회 메퍼 보면 oname, sname

  const handlerSearch = () => {
    setSearchKeyword(input);
  };

  //...input => 배열 복사하는거임 => 값자체를 저장하는게 아니라 주소값을 가지니까
  //...으로 해당 배열을 복제해서 => 새로운 배열(주소값도 새롭게 등장) => 아 배열이 바뀌었네 => 랜더링 ㅇㅋ
  //...input으로 만든 새로운 값을 사용하기 위함임 => 값 변경을 useState가 변경을 감지할수있음
  return (
    <ComnCodSearchStyle>
      <select
        onChange={(e) => setInput({ ...input, oname: e.currentTarget.value })}
      >
        <option value={"grp_cod"}>그룹코드</option>
        <option value={"grp_cod_nm"}>그룹코드명</option>
      </select>
      <input
        onChange={(e) => setInput({ ...input, sname: e.currentTarget.value })}
      ></input>
      <Button paddingtop={5} paddingbottom={5} onClick={handlerSearch}>
        검색
      </Button>
    </ComnCodSearchStyle>
  );
};

import { createContext, FC, useState } from "react";

//Context만듬 => Context API를 만드는거
interface Context {
  //defaultValue의 초기값 만들어주기
  searchKeyword: object;
  setSearchKeyword: (keyword: object) => void;
}

/*ComnCodSearch.tsx부분 넣어주기 위함
        <select>
          <option value={"grp_cod"}>그룹코드</option>
          <option value={"grp_cod_nm"}>그룹코드명</option>
        </select>
        <input></input>*/
//ComnCodContext에 초기값을 넣어줘야 해서 만든거
const defaultValue: Context = {
  searchKeyword: {},
  setSearchKeyword: () => {},
};

export const ComnCodContext = createContext(defaultValue);

//React.ReactNode란? vs React.ReactElement의 차이는?
export const ComnCodProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState({});
  return (
    <ComnCodContext.Provider value={{ searchKeyword, setSearchKeyword }}>
      {children}
    </ComnCodContext.Provider>
  );
};

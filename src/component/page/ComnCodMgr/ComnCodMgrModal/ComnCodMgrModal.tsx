import { useRecoilState } from "recoil";
import { ComnCodMgrModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { Button } from "../../../common/Button/Button";
import { FC, useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ComnCodMgrTableStyled } from "../../../common/styled/StyledTable";

export interface IComnCod {
  grp_cod?: string;
  grp_cod_nm?: string;
  use_poa?: string;
  grp_cod_eplti?: string;
}

export interface IPostResponse {
  result: "SUCCESS";
}

export interface IComnCodMgrModalProps {
  onPostSuccess: () => void;
  grpCod: string;
  setGrpCod: (grpCod: string) => void;
}

export interface IComnGrpCodModal {
  grp_cod: string;
  grp_cod_nm: string;
  grp_cod_eplti: string;
  use_poa: string;
}

export interface IDetailResponse extends IPostResponse {
  comnGrpCodModel: IComnGrpCodModal;
  resultMsg: string;
}

export const ComnCodMgrModal: FC<IComnCodMgrModalProps> = ({
  onPostSuccess,
  grpCod,
  setGrpCod,
}) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [comnCod, setComnCod] = useState<IComnCod>({});
  const [detailComnCod, SetDetailComnCod] = useState<IComnGrpCodModal>();

  useEffect(() => {
    if (modal) searchDetail(grpCod);
  }, [modal]);

  const searchDetail = (grpCod: string) => {
    const postAction: AxiosRequestConfig = {
      method: "POST",
      url: "/system/selectComnGrpCod.do",
      data: { grp_cod: grpCod },
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios(postAction).then((res: AxiosResponse<IDetailResponse>) => {
      SetDetailComnCod(res.data.comnGrpCodModel);
    });
  };

  const cleanUp = () => {
    SetDetailComnCod(undefined);
    //set
  };

  const handlerSave = () => {
    const postAction: AxiosRequestConfig = {
      method: "POST",
      url: "/system/saveComnGrpCodJson.do",
      data: comnCod,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios(postAction)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === "SUCCESS") {
          onPostSuccess();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <ComnCodMgrModalStyled isOpen={modal} ariaHideApp={false}>
      <div className="wrap">
        <div className="header">그룹 코드 관리</div>
        <ComnCodMgrTableStyled>
          <tbody>
            <tr>
              <th>그룹 코드 id </th>
              <td>
                <input
                  type="text"
                  name="grp_cod"
                  required
                  onChange={(e) => {
                    setComnCod({ ...comnCod, grp_cod: e.target.value });
                  }}
                  defaultValue={detailComnCod?.grp_cod}
                ></input>
              </td>
              <th>그룹 코드 명</th>
              <td>
                <input
                  type="text"
                  name="grp_cod_nm"
                  onChange={(e) => {
                    setComnCod({ ...comnCod, grp_cod_nm: e.target.value });
                  }}
                  defaultValue={detailComnCod?.grp_cod_nm}
                ></input>
              </td>
            </tr>
            <tr>
              <th>코드 설명</th>
              <td colSpan={3}>
                <input
                  type="text"
                  onChange={(e) => {
                    setComnCod({ ...comnCod, grp_cod_eplti: e.target.value });
                  }}
                  defaultValue={detailComnCod?.grp_cod_eplti}
                ></input>
              </td>
            </tr>
            <tr>
              <th>사용 유무 *</th>
              <td colSpan={3}>
                <input
                  type="radio"
                  name="useYn"
                  value={"Y"}
                  onChange={(e) => {
                    setComnCod({ ...comnCod, use_poa: e.target.value });
                  }}
                  checked={detailComnCod?.use_poa === "Y"}
                ></input>
                사용
                <input
                  type="radio"
                  name="useYn"
                  value={"N"}
                  onChange={(e) => {
                    setComnCod({ ...comnCod, use_poa: e.target.value });
                  }}
                  checked={detailComnCod?.use_poa === "N"}
                ></input>
                미사용
              </td>
            </tr>
          </tbody>
        </ComnCodMgrTableStyled>
        <div className="btn-group">
          <Button onClick={handlerSave}>저장</Button>
          <Button
            onClick={() => {
              setModal(!modal);
            }}
          >
            닫기
          </Button>
        </div>
      </div>
    </ComnCodMgrModalStyled>
  );
};

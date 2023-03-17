import * as React from 'react';
import { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";

import { client } from '../../../routes/routes';
import "./Notice.css";

function Modf() {
    const paramObj = useParams();
    const movePage = useNavigate();
    const notiId = paramObj['notiId'];

    const [notiTpSe, setNotiTpSe] = useState('');
    const [notiTl, setNotiTl] = useState('');
    const [notiCt, setNotiCt] = useState('');
    const [message, setMessage] = useState('');

    // detail API Gateway
    useEffect(()=> {
      const getNoticeUrl = 'https://ji40ssrbe6.execute-api.ap-northeast-2.amazonaws.com/v1/getNoticeList/{notiId}';
      client.get('getNoticeList/' + paramObj['notiId'])
      .then(response => {
        setNotiTpSe(response.data.Item.NOTI_TP_SE.S);
        setNotiTl(response.data.Item.NOTI_TL.S);
        setNotiCt(response.data.Item.NOTI_CT.S);
      })
    }, []);

    function sendPostRequest() {

      if (notiTpSe === '') {
        alert('공지 구분을 선택해주세요.');
        return false;
      }
      if (notiTl === '') {
        alert('제목을 입력해주세요.');
        return false;
      }
      if (notiCt === '') {
        alert('내용을 입력해주세요.');
        return false;
      }

      const requestBody = {
        notiId:notiId,
        notiTpSe:notiTpSe,
        notiTl:notiTl,
        notiCt:notiCt,
      };
 
      client.post("UpdNoti", requestBody)
        .then(response => {
          setMessage('수정되었습니다.');
          alert('수정되었습니다.');

          movePage('/notice')
        })
        .catch(error => {
          setMessage('수정중 오류가 발생되었습니다.');
        });
    }


    return (
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 2 }}>
        <br />
        <Toolbar />
        
        <div>
          <Typography variant="h7" noWrap component="div" sx={{fontWeight: 550}}>
            공지사항 수정
          </Typography>
          
          <Toolbar />
          <form className="notice-form">
            <input type="hidden" id="regId" name="regId"/>
            <div className="form-group">
              <label htmlFor="notiTpSe">공지 구분</label>
              <select id="notiTpSe" name="notiTpSe" value={notiTpSe} onChange={(event) => setNotiTpSe(event.target.value)}>
                <option value="" >선택</option>
                <option value="N">일반</option>
                <option value="E">긴급</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input type="text" id="notiTl" name="notiTl" required value={notiTl} onChange={(event) => setNotiTl(event.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea id="notiCt" name="notiCt" rows="10" required value={notiCt} onChange={(event) => setNotiCt(event.target.value)}/>
            </div>
          </form>         
          <Button variant="contained" 
            sx={{width: "100px",  marginRight: "1%" }}
            onClick={()=> {sendPostRequest()}}
          >
            저장
          </Button>
          <br/>
          <div className="message">{message}</div>
        </div>
      </Box>
    )
}

export default Modf;